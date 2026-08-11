/* ===================================================================
   1:1 FRIEND CHAT — a tiny shared store + a private-chat overlay.

   • Tapping any friend avatar (Home carousels or the Community
     "see all" grid) opens a private conversation.
   • Messages persist to localStorage and the conversation shows up
     (most-recent first) in the Community "Recent Chats" list.
   • Friends send a light simulated reply so the thread feels alive.
   =================================================================== */
const CF_CHAT_KEY = 'cf_chats_v1';

/* seed conversations — these populate the initial Recent Chats list */
const CF_CHAT_SEED = [
{ seed: 'cf-doctor', name: 'Dr. Martinez', doctor: true, text: 'Let me know how the new dose settles in.', minsAgo: 60, unread: 2 },
{ seed: 'cf-emma', name: 'Emma', text: 'That smoothie recipe was a lifesaver 🙏', minsAgo: 120, unread: 1 },
{ seed: 'cf-liam', name: 'Liam', text: 'Same here — flare weeks are the worst.', minsAgo: 180, unread: 0 },
{ seed: 'cf-lucia', name: 'Lucía', text: 'Thanks for the support, everyone!', minsAgo: 360, unread: 0 },
{ seed: 'cf-marco', name: 'Marco', text: 'Are you joining the group call tonight?', minsAgo: 1440, unread: 0 },
{ seed: 'cf-nadia', name: 'Nadia', text: 'Added you to the gut-friendly recipes board.', minsAgo: 2880, unread: 0 }];

/* friend profile metadata shown in chat header */
const CF_FRIEND_META = {
  'cf-doctor': { flag: '🇺🇸', country: 'United States', crohnYears: null, spec: 'Gastroenterologist' },
  'cf-emma':   { flag: '🇬🇧', country: 'United Kingdom', crohnYears: 6 },
  'cf-liam':   { flag: '🇦🇺', country: 'Australia',      crohnYears: 9 },
  'cf-lucia':  { flag: '🇪🇸', country: 'Spain',          crohnYears: 4 },
  'cf-marco':  { flag: '🇮🇹', country: 'Italy',          crohnYears: 11 },
  'cf-nadia':  { flag: '🇩🇪', country: 'Germany',        crohnYears: 7 },
};


const CF_REPLIES = [
"Thanks for reaching out — how are you feeling today?",
"I totally get that. Flare weeks are exhausting.",
"That makes sense. Have you mentioned it to your GI team?",
"Sending you good vibes 🌿 you've got this.",
"Same here last month — happy to share what helped me.",
"Let's keep each other posted this week 💪",
"Glad you said hi! How's the new routine going?"];


function cfMakeSeed() {
  const now = Date.now();
  const data = {};
  CF_CHAT_SEED.forEach((s) => {
    const ts = now - s.minsAgo * 60000;
    data[s.seed] = { seed: s.seed, name: s.name, doctor: !!s.doctor, unread: s.unread || 0, messages: [{ from: 'them', text: s.text, ts }], lastTs: ts };
  });
  return data;
}
function cfLoadChats() {
  try {const r = JSON.parse(localStorage.getItem(CF_CHAT_KEY));if (r && typeof r === 'object' && Object.keys(r).length) return r;} catch (e) {}
  return cfMakeSeed();
}

/* the store */
const CFChat = {
  data: cfLoadChats(),
  active: null, // seed of the currently-open conversation
  draft: null,  // optional pre-filled message text for the next opened conversation
  listeners: new Set(),
  subscribe(fn) {this.listeners.add(fn);return () => this.listeners.delete(fn);},
  persist() {try {localStorage.setItem(CF_CHAT_KEY, JSON.stringify(this.data));} catch (e) {}},
  emit() {this.persist();this.listeners.forEach((fn) => fn());},
  list() {return Object.values(this.data).sort((a, b) => b.lastTs - a.lastTs);},
  conv(seed) {return this.data[seed];},
  unreadTotal() {return this.list().reduce((s, c) => s + (c.unread || 0), 0);},
  ensure(friend) {
    if (!this.data[friend.seed]) {
      this.data[friend.seed] = { seed: friend.seed, name: friend.name, doctor: !!friend.doctor, unread: 0, messages: [], lastTs: Date.now() };
    }
    return this.data[friend.seed];
  },
  open(friend) {this.ensure(friend);this.data[friend.seed].unread = 0;this.active = friend.seed;this.emit();},
  openWithDraft(friend, draft) {this.ensure(friend);this.data[friend.seed].unread = 0;this.active = friend.seed;this.draft = draft || null;this.emit();},
  close() {this.active = null;this.emit();},
  send(seed, text) {
    const c = this.data[seed];if (!c) return;
    const ts = Date.now();
    c.messages.push({ from: 'me', text, ts });c.lastTs = ts;
    this.emit();
    const reply = CF_REPLIES[Math.floor(Math.random() * CF_REPLIES.length)];
    setTimeout(() => {
      const cc = this.data[seed];if (!cc) return;
      const t2 = Date.now();
      cc.messages.push({ from: 'them', text: reply, ts: t2 });cc.lastTs = t2;
      if (this.active !== seed) cc.unread = (cc.unread || 0) + 1;
      this.emit();
    }, 1100 + Math.random() * 900);
  }
};

/* subscribe a component to store changes */
function useChats() {
  const [, force] = React.useState(0);
  React.useEffect(() => CFChat.subscribe(() => force((x) => x + 1)), []);
  return CFChat;
}

/* global helper used by FriendAvatar onClick */
window.openChat = (friend) => CFChat.open(friend);

function cfRelTime(ts) {
  const m = Math.max(0, Math.round((Date.now() - ts) / 60000));
  if (m < 1) return 'now';
  if (m < 60) return m + 'm';
  const h = Math.round(m / 60);if (h < 24) return h + 'h';
  const d = Math.round(h / 24);return d + 'd';
}

/* ---------- the private chat overlay ---------- */
function FriendChatScreen({ seed, onClose }) {
  const chats = useChats();
  const conv = chats.conv(seed);
  const [input, setInput] = React.useState(() => { const d = CFChat.draft; CFChat.draft = null; return d || ''; });
  const [typing, setTyping] = React.useState(false);
  const bodyRef = React.useRef(null);
  const count = conv ? conv.messages.length : 0;
  const lastFrom = conv && count ? conv.messages[count - 1].from : null;

  React.useEffect(() => {if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;}, [count, typing]);
  React.useEffect(() => {
    if (lastFrom === 'me') {setTyping(true);const id = setTimeout(() => setTyping(false), 2000);return () => clearTimeout(id);}
    setTyping(false);
  }, [count, lastFrom]);

  if (!conv) return null;
  const photo = `https://i.pravatar.cc/96?u=crohnfriends-${seed}`;
  const meta = CF_FRIEND_META[seed] || {};
  const send = () => {const v = input.trim();if (!v) return;setInput('');CFChat.send(seed, v);};

  return (
    <div className="drcf-overlay" style={{ animation: 'drcfSlideIn .32s cubic-bezier(.22,1,.36,1)', zIndex: 140 }}>
      {/* Header */}
      <div className="drcf-header">
        {/* Back button */}
        <button className="drcf-back" onClick={onClose} aria-label="Back">{Ic.back({ width: 20, height: 20 })}</button>

        {/* Avatar */}
        <div className="drcf-avatar-wrap">
          <div className="drcf-avatar" style={{ background: `#c8a882 url(${photo}) center top / cover` }} />
          <span className="drcf-online-dot" />
        </div>

        {/* Name + meta */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span className="drcf-name">{conv.name}</span>
            {conv.doctor &&
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '2px 7px', borderRadius: 8, fontSize: 10, fontWeight: 800, background: 'rgba(255,255,255,.2)', color: '#eafde3', letterSpacing: '.03em' }}>
                <svg width="8" height="8" viewBox="0 0 16 16" fill="currentColor"><path d="M6.5 12.5l-4-4 1.4-1.4L6.5 9.7l5.6-5.6 1.4 1.4z" /></svg>
                {meta.spec || 'Doctor'}
              </span>}
          </div>

          {/* Country + Crohn years */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 3, flexWrap: 'wrap' }}>
            {meta.flag && (
              <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(234,253,227,.9)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 14 }}>{meta.flag}</span>{meta.country}
              </span>
            )}
            {meta.flag && meta.crohnYears && (
              <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(255,255,255,.4)', display: 'inline-block', flexShrink: 0 }}></span>
            )}
            {meta.crohnYears && (
              <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(234,253,227,.75)', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
                {meta.crohnYears} yrs with Crohn's
              </span>
            )}
          </div>

          {/* Online status */}
          <div className="drcf-status" style={{ marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#74d64c', display: 'inline-block', flexShrink: 0 }}></span>
            {typing ? 'typing…' : 'Online now'}
          </div>
        </div>

        {/* Logo */}
        <div style={{ width: 72, height: 72, borderRadius: 16, overflow: 'hidden', flex: 'none', border: '2px solid rgba(255,255,255,.3)', boxShadow: '0 4px 16px rgba(0,0,0,.22)', flexShrink: 0 }}>
          <img src="uploads/CF logo-af21aac8.jpg" alt="Crohn Friends" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
      </div>

      {/* Body */}
      <div className="drcf-body" ref={bodyRef}>
        <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 11.5, fontWeight: 600, margin: '6px 12px 4px', lineHeight: 1.5 }}>
          {count === 0 ? `Say hi to ${conv.name} 👋 — this is the start of your private chat.` : 'Private chat · be kind and supportive'}
        </div>
        {conv.messages.map((m, i) =>
        <div key={i} style={{ display: 'flex', justifyContent: m.from === 'me' ? 'flex-end' : 'flex-start' }}>
            <div className={'bubble ' + (m.from === 'me' ? 'me' : 'them')}>{m.text}</div>
          </div>
        )}
        {typing &&
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div className="bubble them drcf-typing" style={{ display: 'inline-flex', gap: 5 }}>
              <span className="drcf-dot" /><span className="drcf-dot" /><span className="drcf-dot" />
            </div>
          </div>}
      </div>

      {/* Input bar */}
      <div className="drcf-input-bar">
        <input className="drcf-input" value={input} onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && send()} placeholder={`Message ${conv.name.split(' ')[0]}…`} />
        <button className="drcf-send-btn" onClick={send} disabled={!input.trim()}>{Ic.send({ width: 18, height: 18 })}</button>
      </div>
    </div>);

}

Object.assign(window, { CFChat, useChats, FriendChatScreen, cfRelTime });