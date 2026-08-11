/* ===================================================================
   COMMUNITY POSTS — a persistent store for the post feed + comments.
   Posts the user writes are saved to localStorage forever, shown at the
   top of "Recent community posts", and every post (incl. those from
   other people / doctors) can be commented on. Comments persist too.
   =================================================================== */
const CF_POSTS_KEY = 'cf_posts_v1';
const CF_PCOMMENTS_KEY = 'cf_post_comments_v1';

/* category → med-chip colour, shared with the Community screen */
const COMM_CAT_COLOR = { 'Nutrition': 'c-green', 'Medications': 'c-teal', 'Medical Advice': 'c-amber', 'Holistic': 'c-violet', 'General': 'c-green' };
const COMM_CATEGORIES = ['Nutrition', 'Medications', 'Medical Advice', 'Holistic', 'General'];

/* seed posts — these always appear (read-only) below any user posts */
const CF_POSTS_SEED = [
  { id: 'p_sarah_smoothie', initials: 'SM', name: 'Sarah M.', role: 'Patient', time: '2h ago', category: 'Nutrition',
    title: 'Anti-inflammatory smoothie that saved my flare',
    body: "I've been experimenting with gut-friendly smoothies and found this combination works amazingly well during mild flares. The ginger really helps with nausea too!",
    likes: 24, comments: 8 },
  { id: 'p_mike_humira', initials: 'MS', name: 'Mike S.', role: 'Patient', time: '4h ago', category: 'Medications',
    title: '6 months on Humira - side effects question',
    body: "Has anyone experienced more frequent infections? I'm getting sick more often than usual.",
    likes: 15, comments: 12 },
  { id: 'p_drm_humira', initials: 'DM', name: 'Dr. Martinez', role: 'Doctor', time: '1h ago', category: 'Medical Advice',
    title: 'Response: Managing Humira side effects',
    body: 'Increased infection risk is a known side effect. Monitor symptoms closely and contact your healthcare team if you develop fever or persistent symptoms.',
    likes: 42, comments: 6 },
  { id: 'p_drk_calpro', initials: 'DK', name: 'Dr. Khan', role: 'Doctor', time: '3h ago', category: 'Medical Advice',
    title: 'When to ask for a calprotectin test',
    body: 'If symptoms shift or you are tapering steroids, a faecal calprotectin test is a simple way to check for active inflammation. Ask your GI team.',
    likes: 38, comments: 11 },
];

/* sample comments shown on the seed posts so threads feel alive (these are
   not persisted; the user's own comments are appended after them) */
const CF_SAMPLE_COMMENTERS = [
  { name: 'Emma', seed: 'cf-emma' }, { name: 'Liam', seed: 'cf-liam' },
  { name: 'Lucía', seed: 'cf-lucia' }, { name: 'Marco', seed: 'cf-marco' },
];
const CF_SAMPLE_COMMENT_TEXTS = [
  'Thanks for sharing — this really helped me! 🙏',
  'I experienced exactly the same thing.',
  'Really useful, saving this post!',
  'Appreciate you speaking up about this 💚',
];

function cfHash(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

function cfLoadUserPosts() {
  try { const r = JSON.parse(localStorage.getItem(CF_POSTS_KEY)); if (Array.isArray(r)) return r; } catch (e) {}
  return [];
}
function cfLoadComments() {
  try { const r = JSON.parse(localStorage.getItem(CF_PCOMMENTS_KEY)); if (r && typeof r === 'object') return r; } catch (e) {}
  return {};
}

const CFPosts = {
  userPosts: cfLoadUserPosts(),   // newest first
  comments: cfLoadComments(),     // { postId: [ {name, text, ts, mine} ] }
  liked: (() => { try { return new Set(JSON.parse(localStorage.getItem('cf_posts_liked_v1')) || []); } catch (e) { return new Set(); } })(),
  listeners: new Set(),
  subscribe(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn); },
  persist() {
    try {
      localStorage.setItem(CF_POSTS_KEY, JSON.stringify(this.userPosts));
      localStorage.setItem(CF_PCOMMENTS_KEY, JSON.stringify(this.comments));
      localStorage.setItem('cf_posts_liked_v1', JSON.stringify([...this.liked]));
    } catch (e) {}
  },
  emit() { this.persist(); this.listeners.forEach((fn) => fn()); },
  /* full feed: user's saved posts first, then the seed posts */
  list() { return [...this.userPosts, ...CF_POSTS_SEED]; },
  addPost({ title, body, category }) {
    const p = {
      id: 'u' + Date.now(),
      initials: (window.CFProfile ? CFProfile.initials() : 'GR'),
      name: (window.CFProfile ? CFProfile.get().name : 'Gerard'),
      role: 'Patient', time: 'now', category, title, body, likes: 0, comments: 0, mine: true, ts: Date.now(),
    };
    this.userPosts = [p, ...this.userPosts];
    this.emit();
    return p;
  },
  isLiked(id) { return this.liked.has(id); },
  toggleLike(id) {
    if (this.liked.has(id)) this.liked.delete(id); else this.liked.add(id);
    this.emit();
  },
  likesFor(post) { return (post.likes || 0) + (this.liked.has(post.id) ? 1 : 0); },
  /* sample (non-persisted) comments for a seed post, deterministic by id */
  sampleComments(post) {
    if (!post || post.mine) return [];
    const people = CF_SAMPLE_COMMENTERS, texts = CF_SAMPLE_COMMENT_TEXTS;
    const n = Math.min(post.comments || 0, 4);
    if (!people.length || !texts.length || n <= 0) return [];
    /* deterministic offset from the post id, always in range */
    let base = 0; const id = String(post.id || '');
    for (let k = 0; k < id.length; k++) base = (base + id.charCodeAt(k)) % people.length;
    const out = [];
    for (let i = 0; i < n; i++) {
      const c = people[(base + i) % people.length];
      out.push({ name: c.name, seed: c.seed, enText: texts[i % texts.length], time: (i + 1) + 'h' });
    }
    return out;
  },
  userComments(id) { return this.comments[id] || []; },
  commentCount(post) { return this.sampleComments(post).length + this.userComments(post.id).length; },
  addComment(id, text) {
    const c = { name: (window.CFProfile ? CFProfile.get().name : 'Gerard'), text, ts: Date.now(), mine: true };
    this.comments = { ...this.comments, [id]: [...(this.comments[id] || []), c] };
    this.emit();
    return c;
  },
};

function usePosts() {
  const [, force] = React.useState(0);
  React.useEffect(() => CFPosts.subscribe(() => force((x) => x + 1)), []);
  return CFPosts;
}

Object.assign(window, { CFPosts, usePosts, COMM_CAT_COLOR, COMM_CATEGORIES, CF_POSTS_SEED });
