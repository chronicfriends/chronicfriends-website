/* ===== The five screens ===== */
const { useState: useS } = React;

/* curved white panel that overlaps the forest scene */
function ForestTop({ children, sceneH = 320 }) {
  return (
    <div style={{ position: 'relative' }}>
      <ForestScene height={sceneH} />
      <div style={{ position: 'relative', marginTop: -46, background: 'var(--card)',
        borderTopLeftRadius: 36, borderTopRightRadius: 36, paddingTop: 8, minHeight: 200 }}>
        <div style={{ width: 46, height: 5, borderRadius: 3, background: '#d2ddc9', margin: '10px auto 4px' }} />
        {children}
      </div>
    </div>);

}

/* same, but backed by a real photo/render — with a wavy, glowing fluorescent seam */
function ForestImageTop({ children, sceneH = 360, img, pos = 'center 32%', header, imgH = 600, panelPad = 46 }) {
  const uid = React.useId().replace(/:/g, '');
  const fid = 'glow-' + uid;
  // wave path: gentle hump, higher on the left, dipping toward the right
  const wave = 'M0,52 C 70,18 150,16 220,40 C 290,62 340,58 393,38';
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ ...{ width: '370px', height: imgH, backgroundImage: `url(${img})`,
          backgroundPosition: 'center center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }, height: "600px" }} />

      {/* top scrim so status bar + header icons stay legible over the forest */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 170,
        background: 'linear-gradient(180deg, rgba(20,48,26,.55) 0%, rgba(20,48,26,.12) 55%, transparent 100%)', pointerEvents: 'none' }} />

      {/* status bar + brand header, overlaid on the forest */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 5 }}>{header}</div>

      {/* white content panel — raised above the glow SVG so its contents stay visible.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                  imgH is tuned per screen so the panel top meets the SVG white-fill bottom
                                                                                                                                                                                                                                                                                                                                                                                                                                                                  (sceneH-54+100), so no forest strip shows through. */}
      <div style={{ position: 'relative', zIndex: 4, marginTop: -2, background: 'var(--card)',
        paddingTop: panelPad, minHeight: 200 }}>
        {children}
      </div>

      {/* fluorescent wavy seam, drawn over the image→panel junction */}
      <svg viewBox="0 0 393 100" preserveAspectRatio="none"
      style={{ position: 'absolute', left: 0, top: imgH - 96, pointerEvents: 'none', width: "387px", height: "100px" }}>
        <defs>
          <filter id={fid} x="-10%" y="-60%" width="120%" height="240%">
            <feGaussianBlur stdDeviation="4.5" />
          </filter>
          <linearGradient id={fid + 'g'} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#7dff52" />
            <stop offset="0.5" stopColor="#b6ff7e" />
            <stop offset="1" stopColor="#6fe84a" />
          </linearGradient>
        </defs>
        {/* white fill below the curve = the panel's wavy top edge */}
        <path d={wave + ' L393,100 L0,100 Z'} fill="var(--card)" style={{ strokeWidth: "1px", opacity: "1" }} />
        {/* wide soft halo */}
        <path d={wave} fill="none" stroke="#5dff2e" strokeWidth="16" strokeLinecap="round" opacity="0.4" filter={`url(#${fid})`} />
        {/* tighter bright glow */}
        <path d={wave} fill="none" stroke="#86ff52" strokeWidth="7" strokeLinecap="round" opacity="0.85" filter={`url(#${fid})`} />
        {/* bright core line */}
        <path d={wave} fill="none" stroke={`url(#${fid}g)`} strokeWidth="3.4" strokeLinecap="round" />
        {/* white hot center */}
        <path d={wave} fill="none" stroke="#f2ffe6" strokeWidth="1.3" strokeLinecap="round" opacity="0.95" />
      </svg>
    </div>);

}

/* Reusable: 200px forest image + title + fluorescent wavy seam */
function ForestSectionTop({ title, children, filterId }) {
  const wave = 'M0,52 C 70,18 150,16 220,40 C 290,62 340,58 393,38';
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'relative', backgroundImage: 'url(assets/forest-bg.png)', paddingTop: 45, height: "200px", backgroundSize: "cover", backgroundPosition: "left center" }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(20,48,26,.68) 0%,rgba(28,55,30,.55) 100%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}><TitleTopBar title={title} /></div>
      </div>
      <svg viewBox="0 0 393 100" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, top: 104, pointerEvents: 'none', width: '387px', height: '100px', zIndex: 5 }}>
        <defs>
          <filter id={filterId} x="-10%" y="-60%" width="120%" height="240%"><feGaussianBlur stdDeviation="4.5" /></filter>
          <linearGradient id={filterId + 'g'} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#7dff52" /><stop offset="0.5" stopColor="#b6ff7e" /><stop offset="1" stopColor="#6fe84a" />
          </linearGradient>
        </defs>
        <path d={wave + ' L393,100 L0,100 Z'} fill="var(--card)" />
        <path d={wave} fill="none" stroke="#5dff2e" strokeWidth="16" strokeLinecap="round" opacity="0.4" filter={`url(#${filterId})`} />
        <path d={wave} fill="none" stroke="#86ff52" strokeWidth="7" strokeLinecap="round" opacity="0.85" filter={`url(#${filterId})`} />
        <path d={wave} fill="none" stroke={`url(#${filterId}g)`} strokeWidth="3.4" strokeLinecap="round" />
        <path d={wave} fill="none" stroke="#f2ffe6" strokeWidth="1.3" strokeLinecap="round" opacity="0.95" />
      </svg>
      <div style={{ position: 'relative', zIndex: 4, marginTop: -2, background: 'var(--card)', minHeight: 200 }}>{children}</div>
    </div>);
}

/* ---------- 1. HOME / GROWTH DASHBOARD ---------- */
function HomeScreen({ go, goCommunity, onAvatar, onDrCF }) {
  const t = useT();
  const prof = useProfile();
  const today = window.CF_TODAY || new Date().toISOString().slice(0, 10);
  const [checkedIn, setCheckedIn] = React.useState(() => {
    try {
      const s = JSON.parse(localStorage.getItem('cf-checkins') || 'null');
      return !!(s && s[today] && s[today]._checkedIn === true);
    } catch (e) { return false; }
  });
  React.useEffect(() => {
    const check = () => {
      try {
        const s = JSON.parse(localStorage.getItem('cf-checkins') || 'null');
        setCheckedIn(!!(s && s[today] && s[today]._checkedIn === true));
      } catch (e) {}
    };
    window.addEventListener('storage', check);
    const id = setInterval(check, 2000);
    return () => { window.removeEventListener('storage', check); clearInterval(id); };
  }, [today]);
  return (
    <div className="fade-in">
      <ForestImageTop sceneH={360} img="assets/forest-bg.png" pos="center 20%" imgH={600} panelPad={8}
      header={<WelcomeBar name={CFProfile.firstName()} onAvatar={onAvatar} onDrCF={onDrCF} />}>
        <div style={{ padding: "8px 24px 25px" }}>
          <h1 className="h-screen" style={{ textAlign: "center", fontWeight: 800, margin: "0px", fontSize: "23px", letterSpacing: "0px", color: "rgb(10, 65, 0)", lineHeight: "2" }}>{t('hero')}</h1>
          <p className="muted" style={{ fontSize: "14px", height: "35px", fontWeight: "400", textAlign: "center", letterSpacing: "0px", lineHeight: "0", margin: "0px 0px 25px", padding: "0px 0px 40px" }}>{t('hero_sub')}</p>
          <BestConnectedNow onSeeAll={() => goCommunity('bestcf')} />
          <ConnectedNow onSeeAll={() => goCommunity('cfonline')} />

          {/* Daily Journal button — full-width, prominent */}
          <div style={{ margin: '18px 0 0' }}>
            <button className="btn3d dark" onClick={() => go('schedule')} style={{ width: '100%', flexDirection: 'row', alignItems: 'center', gap: 16, justifyContent: 'center', background: checkedIn ? '#1a6e3a' : '#02843c', color: '#fff', borderRadius: 24, padding: "16px", height: "115px", transition: 'background .4s', position: 'relative', overflow: 'hidden' }}>
              {checkedIn && (
                <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(135deg, rgba(255,255,255,.03) 0px, rgba(255,255,255,.03) 1px, transparent 1px, transparent 12px)', pointerEvents: 'none' }} />
              )}
              <div style={{ height: 96, width: 96, borderRadius: 20, overflow: 'hidden', flex: 'none', display: 'flex', position: 'relative' }}>
                <img src="assets/cf-logo-hd.jpg" alt="Crohn Friends" style={{ display: 'block', objectFit: 'cover', height: "96px", width: "96px", margin: "0px", padding: "0px" }} />
                {checkedIn && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(10,60,20,.55)', borderRadius: 20 }}>
                    <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#74d64c" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                  </div>
                )}
              </div>
              <div style={{ textAlign: 'left', lineHeight: 1.3 }}>
                <div style={{ fontWeight: 800, letterSpacing: '-.01em', fontSize: "20px" }}>
                  {checkedIn ? tr('You checked in today ✓') : tr('How was your day?')}
                </div>
                <div style={{ fontWeight: 500, opacity: .78, marginTop: 4, fontSize: "14px", textAlign: "left" }}>
                  {checkedIn ? tr('Great job! · View your entry') : tr('10 seconds · tonight at 21:00')}
                </div>
              </div>
            </button>
          </div>



        </div>
      </ForestImageTop>
    </div>);
}

/* ---------- 2. DAILY SCHEDULE ---------- */
function ScheduleScreen({ go }) {
  const [items, setItems] = useS([
  { t: '8:00 AM', l: 'Medication', s: 'Morning dose · 500mg', ic: 'pill', done: true },
  { t: '1:00 PM', l: 'Log Meal', s: 'Lunch · oatmeal & banana', ic: 'meal', done: true },
  { t: '5:00 PM', l: 'Water Intake', s: 'Goal · 2.0 L', ic: 'drop', done: false },
  { t: '8:00 PM', l: 'Symptom Log', s: 'Evening check-in', ic: 'pulse', done: true }]
  );
  const [light, setLight] = useS(true);
  const [cam, setCam] = useS(true);
  const toggle = (i) => setItems(items.map((it, j) => j === i ? { ...it, done: !it.done } : it));
  const days = [['Su', 18], ['Mo', 19], ['Tu', 20], ['We', 22], ['Th', 23], ['Fr', 24], ['Sa', 25]];
  return (
    <div className="fade-in">
      <div style={{ position: 'relative' }}>
        {/* forest image header */}
        <div style={{
          position: 'relative',
          backgroundImage: 'url(assets/forest-bg.png)',

          backgroundSize: 'cover',

          paddingTop: 45, backgroundPosition: "center bottom", height: "200px"
        }}>
          {/* dark overlay for legibility */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,48,26,.68) 0%, rgba(28,55,30,.55) 100%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <TitleTopBar title={tr('Journal')} onBack={() => go('home')} />
          </div>
        </div>

        {/* fluorescent wavy seam — exact same as Home screen */}
        <svg viewBox="0 0 393 100" preserveAspectRatio="none"
        style={{ position: 'absolute', left: 0, top: 104, pointerEvents: 'none', width: '387px', height: '100px', zIndex: 5 }}>
          <defs>
            <filter id="sched-glow" x="-10%" y="-60%" width="120%" height="240%">
              <feGaussianBlur stdDeviation="4.5" />
            </filter>
            <linearGradient id="sched-glowg" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#7dff52" />
              <stop offset="0.5" stopColor="#b6ff7e" />
              <stop offset="1" stopColor="#6fe84a" />
            </linearGradient>
          </defs>
          <path d="M0,52 C 70,18 150,16 220,40 C 290,62 340,58 393,38 L393,100 L0,100 Z" fill="var(--card)" />
          <path d="M0,52 C 70,18 150,16 220,40 C 290,62 340,58 393,38" fill="none" stroke="#5dff2e" strokeWidth="16" strokeLinecap="round" opacity="0.4" filter="url(#sched-glow)" />
          <path d="M0,52 C 70,18 150,16 220,40 C 290,62 340,58 393,38" fill="none" stroke="#86ff52" strokeWidth="7" strokeLinecap="round" opacity="0.85" filter="url(#sched-glow)" />
          <path d="M0,52 C 70,18 150,16 220,40 C 290,62 340,58 393,38" fill="none" stroke="url(#sched-glowg)" strokeWidth="3.4" strokeLinecap="round" />
          <path d="M0,52 C 70,18 150,16 220,40 C 290,62 340,58 393,38" fill="none" stroke="#f2ffe6" strokeWidth="1.3" strokeLinecap="round" opacity="0.95" />
        </svg>

        <div style={{ position: 'relative', zIndex: 4, marginTop: -2, background: 'var(--card)', padding: '18px 20px 24px' }}>
        <DailyCheckin />
        </div>
      </div>
    </div>);

}

/* ---------- 3. MEDICATIONS — see meds.jsx ---------- */

/* ---------- 4. COMMUNITY — post feed + chats ---------- */
const COMM_CHATS = [
  { name: 'Dr. Martinez', seed: 'cf-doctor', last: 'Let me know how the new dose settles in.', time: '1h', unread: 2, doctor: true },
  { name: 'Emma', seed: 'cf-emma', last: 'That smoothie recipe was a lifesaver 🙏', time: '2h', unread: 1 },
  { name: 'Liam', seed: 'cf-liam', last: 'Same here — flare weeks are the worst.', time: '3h', unread: 0 },
  { name: 'Lucía', seed: 'cf-lucia', last: 'Thanks for the support, everyone!', time: '6h', unread: 0 },
  { name: 'Marco', seed: 'cf-marco', last: 'Are you joining the group call tonight?', time: '1d', unread: 0 },
  { name: 'Nadia', seed: 'cf-nadia', last: 'Added you to the gut-friendly recipes board.', time: '2d', unread: 0 },
];

/* category → med-chip colour, for visual consistency with the rest of the app */
const COMM_CAT_COLOR = { 'Nutrition': 'c-green', 'Medications': 'c-teal', 'Medical Advice': 'c-amber', 'Holistic': 'c-violet', 'General': 'c-green' };
const COMM_CATEGORIES = ['Nutrition', 'Medications', 'Medical Advice', 'Holistic', 'General'];

const COMM_POSTS = [
  {
    initials: 'SM', name: 'Sarah M.', role: 'Patient', time: '2h ago',
    category: 'Nutrition',
    title: 'Anti-inflammatory smoothie that saved my flare',
    body: "I've been experimenting with gut-friendly smoothies and found this combination works amazingly well during mild flares. The ginger really helps with nausea too!",
    likes: 24, comments: 8,
  },
  {
    initials: 'MS', name: 'Mike S.', role: 'Patient', time: '4h ago',
    category: 'Medications',
    title: '6 months on Humira - side effects question',
    body: "Has anyone experienced more frequent infections? I'm getting sick more often than usual.",
    likes: 15, comments: 12,
  },
  {
    initials: 'DM', name: 'Dr. Martinez', role: 'Doctor', time: '1h ago',
    category: 'Medical Advice',
    title: 'Response: Managing Humira side effects',
    body: 'Increased infection risk is a known side effect. Monitor symptoms closely and contact your healthcare team if you develop fever or persistent symptoms.',
    likes: 42, comments: 6,
  },
  {
    initials: 'DK', name: 'Dr. Khan', role: 'Doctor', time: '3h ago',
    category: 'Medical Advice',
    title: 'When to ask for a calprotectin test',
    body: 'If symptoms shift or you are tapering steroids, a faecal calprotectin test is a simple way to check for active inflammation. Ask your GI team.',
    likes: 38, comments: 11,
  },
];

/* ---------- Doctors directory — full list of in-app specialists ---------- */
const CF_DOCTORS = [
  { seed: 'cf-doc-martinez', cat: 'gastro', email: 's.martinez@crohnfriends.health', initials: 'SM', name: 'Dr. Sarah Martinez', spec: 'Gastroenterologist', years: 15, rating: '4.9', reviews: 127, city: 'Phoenix, AZ', color: 'c-green', days: [1, 2, 3, 4, 5], slots: ['09:00', '09:30', '10:30', '11:30', '14:00', '15:00', '16:00'], langs: ['English', 'Spanish'] },
  { seed: 'cf-doc-okafor', cat: 'gastro', email: 'd.okafor@crohnfriends.health', initials: 'DO', name: 'Dr. David Okafor', spec: 'Gastroenterologist', years: 21, rating: '4.9', reviews: 203, city: 'Chicago, IL', color: 'c-green', days: [3, 4, 5], slots: ['08:00', '09:00', '10:30', '13:00', '14:00', '15:30'], langs: ['English', 'French', 'Yoruba'] },
  { seed: 'cf-doc-chen', cat: 'ibd', email: 'm.chen@crohnfriends.health', initials: 'MC', name: 'Dr. Michael Chen', spec: 'IBD Specialist', years: 12, rating: '4.8', reviews: 89, city: 'Baltimore, MD', color: 'c-teal', days: [1, 3, 5], slots: ['08:30', '09:30', '11:00', '13:00', '14:30', '16:00'], langs: ['English', 'Mandarin'] },
  { seed: 'cf-doc-nair', cat: 'ibd', email: 'p.nair@crohnfriends.health', initials: 'PN', name: 'Dr. Priya Nair', spec: 'IBD Specialist', years: 14, rating: '4.9', reviews: 112, city: 'Houston, TX', color: 'c-teal', days: [2, 3, 4], langs: ['English', 'Hindi', 'Tamil'] },
  { seed: 'cf-doc-wilson', cat: 'surgeon', email: 'e.wilson@crohnfriends.health', initials: 'EW', name: 'Dr. Emma Wilson', spec: 'Colorectal Surgeon', years: 18, rating: '5.0', reviews: 156, city: 'Cleveland, OH', color: 'c-blue', days: [2, 4], slots: ['10:00', '10:30', '11:30', '15:30', '16:30'], langs: ['English'] },
  { seed: 'cf-doc-saleh', cat: 'surgeon', email: 'a.saleh@crohnfriends.health', initials: 'AS', name: 'Dr. Ahmed Saleh', spec: 'Colorectal Surgeon', years: 16, rating: '4.8', reviews: 98, city: 'Boston, MA', color: 'c-blue', days: [1, 3], langs: ['English', 'Arabic', 'French'] },
  { seed: 'cf-doc-khan', cat: 'nutrition', email: 'a.khan@crohnfriends.health', initials: 'AK', name: 'Dr. Aisha Khan', spec: 'IBD & Nutrition', years: 10, rating: '4.7', reviews: 74, city: 'Austin, TX', color: 'c-amber', days: [1, 2, 4, 5], slots: ['09:00', '10:00', '12:00', '13:30', '15:00'], langs: ['English', 'Urdu', 'Arabic'] },
  { seed: 'cf-doc-mendes', cat: 'dietitian', email: 'c.mendes@crohnfriends.health', initials: 'CM', name: 'Dr. Carla Mendes', spec: 'Registered Dietitian', years: 8, rating: '4.9', reviews: 141, city: 'Miami, FL', color: 'c-lime', days: [1, 2, 3, 4], langs: ['English', 'Portuguese', 'Spanish'] },
  { seed: 'cf-doc-hoffmann', cat: 'pediatric', email: 'l.hoffmann@crohnfriends.health', initials: 'LH', name: 'Dr. Lena Hoffmann', spec: 'Pediatric GI', years: 9, rating: '4.8', reviews: 61, city: 'Seattle, WA', color: 'c-sky', days: [1, 2, 3, 5], slots: ['09:30', '11:00', '11:30', '14:00', '16:00', '16:30'], langs: ['English', 'German'] },
  { seed: 'cf-doc-bennett', cat: 'psychologist', email: 'n.bennett@crohnfriends.health', initials: 'NB', name: 'Dr. Noah Bennett', spec: 'Health Psychologist', years: 11, rating: '4.9', reviews: 119, city: 'Denver, CO', color: 'c-violet', days: [1, 2, 3, 4, 5], langs: ['English'] },
  { seed: 'cf-doc-park', cat: 'psychologist', email: 'g.park@crohnfriends.health', initials: 'GP', name: 'Dr. Grace Park', spec: 'Clinical Psychologist', years: 13, rating: '5.0', reviews: 87, city: 'Portland, OR', color: 'c-violet', days: [2, 4, 5], langs: ['English', 'Korean'] },
  { seed: 'cf-doc-romano', cat: 'psychiatrist', email: 's.romano@crohnfriends.health', initials: 'SR', name: 'Dr. Sofia Romano', spec: 'Psychiatrist', years: 17, rating: '4.8', reviews: 104, city: 'New York, NY', color: 'c-indigo', days: [1, 3, 4], langs: ['English', 'Italian', 'Spanish'] },
  { seed: 'cf-doc-lee', cat: 'derm', email: 'h.lee@crohnfriends.health', initials: 'HL', name: 'Dr. Hannah Lee', spec: 'Dermatologist', years: 12, rating: '4.9', reviews: 132, city: 'San Diego, CA', color: 'c-rose', days: [1, 2, 4], langs: ['English', 'Korean'] },
  { seed: 'cf-doc-feld', cat: 'rheum', email: 'm.feld@crohnfriends.health', initials: 'MF', name: 'Dr. Marcus Feld', spec: 'Rheumatologist', years: 19, rating: '4.8', reviews: 95, city: 'Minneapolis, MN', color: 'c-orange', days: [2, 3, 5], langs: ['English', 'German', 'Dutch'] },
  { seed: 'cf-doc-tanaka', cat: 'ophthal', email: 'y.tanaka@crohnfriends.health', initials: 'YT', name: 'Dr. Yuki Tanaka', spec: 'Ophthalmologist', years: 15, rating: '5.0', reviews: 78, city: 'San Jose, CA', color: 'c-cyan', days: [1, 4, 5], langs: ['English', 'Japanese'] },
  { seed: 'cf-doc-grant', cat: 'pain', email: 'o.grant@crohnfriends.health', initials: 'OG', name: 'Dr. Olivia Grant', spec: 'Pain Specialist', years: 14, rating: '4.7', reviews: 66, city: 'Atlanta, GA', color: 'c-coral', days: [1, 2, 3, 4, 5], langs: ['English', 'Spanish'] },
];
/* enrich chat headers for these doctor seeds */
if (typeof CF_FRIEND_META !== 'undefined') { CF_DOCTORS.forEach((d) => { CF_FRIEND_META[d.seed] = { spec: d.spec }; }); }

/* hex → rgba helper for the coloured specialization buttons */
function cfHexA(hex, a) { const n = hex.replace('#', ''); return `rgba(${parseInt(n.slice(0, 2), 16)},${parseInt(n.slice(2, 4), 16)},${parseInt(n.slice(4, 6), 16)},${a})`; }

/* specialization catalogue — each opens the filtered list of its doctors */
const SPECIALIZATIONS = [
  { key: 'gastro', label: 'Gastroenterologist', desc: "Gut, digestion & Crohn's care", icon: Ic.gut, color: 'c-green', grad: ['#7bd853', '#3f8a3f'] },
  { key: 'ibd', label: 'IBD Specialist', desc: "Crohn's & colitis experts", icon: Ic.pulse, color: 'c-teal', grad: ['#4fd0c4', '#1fa596'] },
  { key: 'surgeon', label: 'Colorectal Surgeon', desc: 'Surgery & bowel resections', icon: Ic.clip, color: 'c-blue', grad: ['#5cb8ec', '#2f7fd4'] },
  { key: 'nutrition', label: 'IBD & Nutrition', desc: 'Diet plans built for IBD', icon: Ic.leaf, color: 'c-amber', grad: ['#f0b765', '#d98a26'] },
  { key: 'dietitian', label: 'Dietitian', desc: 'Everyday eating & gut health', icon: Ic.meal, color: 'c-lime', grad: ['#a9cf5a', '#6f9a2c'] },
  { key: 'pediatric', label: 'Pediatric GI', desc: 'Care for children & teens', icon: Ic.heart, color: 'c-sky', grad: ['#62b5f0', '#2f93d4'] },
  { key: 'psychologist', label: 'Psychologist', desc: 'Mental & emotional support', icon: Ic.mind, color: 'c-violet', grad: ['#b09cf0', '#7556d0'] },
  { key: 'psychiatrist', label: 'Psychiatrist', desc: 'Mood, anxiety & medication', icon: Ic.capsule, color: 'c-indigo', grad: ['#8c8cf0', '#5354d6'] },
  { key: 'derm', label: 'Dermatologist', desc: 'Skin flare-ups & rashes', icon: Ic.sun, color: 'c-rose', grad: ['#f08bc0', '#d4569e'] },
  { key: 'rheum', label: 'Rheumatologist', desc: 'Joints & arthritis', icon: Ic.run, color: 'c-orange', grad: ['#f0a25c', '#d97a2c'] },
  { key: 'ophthal', label: 'Ophthalmologist', desc: 'Eyes & uveitis', icon: Ic.eye, color: 'c-cyan', grad: ['#5fd6d6', '#2f9a9a'] },
  { key: 'pain', label: 'Pain Specialist', desc: 'Chronic pain management', icon: Ic.flame, color: 'c-coral', grad: ['#f0897c', '#d65a4c'] },
];

/* small location-pin glyph (no equivalent in Ic set) */
const PinIc = (p) => (<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 21s-6.5-5.6-6.5-10.5A6.5 6.5 0 0 1 12 4a6.5 6.5 0 0 1 6.5 6.5C18.5 15.4 12 21 12 21z"/><circle cx="12" cy="10.3" r="2.4"/></svg>);

function DoctorsTab() {
  const [appts, setAppts] = useS(() => (window.cfLoadAppts ? window.cfLoadAppts() : {}));
  const [apptDoc, setApptDoc] = useS(null);
  const [reviewsDoc, setReviewsDoc] = useS(null);
  const submitAppt = (seed, a) => { const next = { ...appts, [seed]: a }; setAppts(next); window.cfSaveAppts && window.cfSaveAppts(next); };
  const openDocChat = (doc) => {
    const a = appts[doc.seed];
    const ln = window.cfDocLastName ? window.cfDocLastName(doc) : doc.name;
    const draft = a
      ? `Hi Dr. ${ln}, I'm Gerard. I'd like to confirm the appointment I requested for ${window.cfFmtApptShort(a.date)} at ${window.cf12h(a.time)}. Does that time still work for you?`
      : `Hi Dr. ${ln}, I'm Gerard. I'd like to book an appointment with you. Could we find a date and time that works for you?`;
    CFChat.openWithDraft({ seed: doc.seed, name: doc.name, doctor: true }, draft);
  };
  const [spec, setSpec] = useS(null);
  const activeSpec = SPECIALIZATIONS.find((s) => s.key === spec);
  const shown = spec ? CF_DOCTORS.filter((d) => d.cat === spec) : [];
  const docCount = (key) => CF_DOCTORS.filter((d) => d.cat === key).length;

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 22px', background: 'var(--card)' }} className="no-scrollbar">
      {!spec ? (
      /* ===== specialization picker ===== */
      <div>
        {/* Friendly intro */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 18 }}>
          <div className="badge-ic" style={{ flex: 'none' }}>{Ic.shield({ width: 23, height: 23 })}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--ink)', letterSpacing: '-.01em' }}>{tr('Verified Doctors')}</div>
            <div className="muted" style={{ fontSize: 12.5, fontWeight: 500, marginTop: 3, lineHeight: 1.45 }}>{tr("A network of verified doctors supporting Crohn Friends. Pick a specialty below and we'll show you the right experts. \ud83c\udf3f")}</div>
          </div>
        </div>

        <div className="eyebrow" style={{ margin: '4px 2px 12px' }}>{tr('Choose a specialization')}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          {SPECIALIZATIONS.map((sp) => {
            const lo = sp.grad[0], hi = sp.grad[1], n = docCount(sp.key);
            return (
              <button key={sp.key} onClick={() => setSpec(sp.key)} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 13, textAlign: 'left', border: 'none', cursor: 'pointer', fontFamily: 'inherit', color: '#fff',
                padding: '13px 15px', borderRadius: 19, background: `linear-gradient(180deg,${lo},${hi})`,
                boxShadow: `0 8px 15px ${cfHexA(hi, .34)},inset 0 2px 2px rgba(255,255,255,.45),inset 0 -4px 7px ${cfHexA(hi, .5)}` }}>
                <span style={{ width: 44, height: 44, borderRadius: 13, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,.2)', boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,.25)' }}>{sp.icon({ width: 23, height: 23 })}</span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'block', fontWeight: 800, fontSize: 15, letterSpacing: '-.01em' }}>{tr(sp.label)}</span>
                  <span style={{ display: 'block', fontSize: 11.5, fontWeight: 600, opacity: .88, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tr(sp.desc)}</span>
                </span>
                <span style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ fontSize: 11.5, fontWeight: 800, padding: '3px 9px', borderRadius: 20, background: 'rgba(255,255,255,.22)' }}>{n}</span>
                  {Ic.chevR({ width: 18, height: 18, style: { opacity: .85 } })}
                </span>
              </button>);
          })}
        </div>

        <p className="muted" style={{ fontSize: 11.5, textAlign: 'center', margin: '18px 8px 0', lineHeight: 1.5 }}>
          {tr('All listed specialists are identity- and license-verified by Crohn Friends.')}
        </p>
      </div>
      ) : (
      /* ===== filtered doctor list ===== */
      <div>
        {/* back + specialty title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <button className="btn3d soft round" onClick={() => setSpec(null)} style={{ width: 42, height: 42, flex: 'none' }}>{Ic.back({ width: 20, height: 20 })}</button>
          <div className={'med-chip ' + activeSpec.color} style={{ width: 42, height: 42, borderRadius: 13, flex: 'none' }}>{activeSpec.icon({ width: 22, height: 22 })}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 16.5, fontWeight: 800, color: 'var(--ink)', letterSpacing: '-.01em' }}>{tr(activeSpec.label)}</div>
            <div className="muted" style={{ fontSize: 12, fontWeight: 500, marginTop: 1 }}>{shown.length} {trf(shown.length === 1 ? '{n} verified doctor' : '{n} verified doctors', { n: '' }).trim()} · {tr(activeSpec.desc)}</div>
          </div>
        </div>

        {/* Doctor cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
          {shown.map((d, i) => (
          <div key={i} className="card" style={{ padding: '15px 16px 14px' }}>
            {/* Identity row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ position: 'relative', flex: 'none' }}>
                <div className={'med-chip ' + d.color} style={{ width: 50, height: 50, borderRadius: '50%', fontSize: 16, fontWeight: 800, letterSpacing: '.02em' }}>{d.initials}</div>
                {/* verified tick badge */}
                <span style={{ position: 'absolute', right: -2, bottom: -2, width: 19, height: 19, borderRadius: '50%', background: 'linear-gradient(180deg,#7bd853,#54b035)', border: '2.5px solid var(--card)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 3px 7px rgba(58,140,45,.4)' }}>
                  <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor"><path d="M6.5 12.5l-4-4 1.4-1.4L6.5 9.7l5.6-5.6 1.4 1.4z"/></svg>
                </span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 15.5, fontWeight: 800, color: 'var(--ink)' }}>{d.name}</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 700, background: 'linear-gradient(180deg,#eaf7e1,#dcefce)', color: 'var(--green-700)' }}>
                    <svg width="9" height="9" viewBox="0 0 16 16" fill="currentColor"><path d="M6.5 12.5l-4-4 1.4-1.4L6.5 9.7l5.6-5.6 1.4 1.4z"/></svg>
                    {tr('Verified')}
                  </span>
                </div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--green-600)', marginTop: 2 }}>{tr(d.spec)}</div>
              </div>
            </div>

            {/* Meta row: experience · rating · location */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px 14px', margin: '12px 0 11px', fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>{Ic.clock({ width: 14, height: 14, style: { opacity: .65 } })} {d.years} {tr('yrs')}</span>
              <button onClick={() => setReviewsDoc(d)} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  border: 'none', background: 'rgba(245,166,35,.12)', cursor: 'pointer',
                  borderRadius: 10, padding: '3px 9px 3px 5px', fontFamily: 'inherit',
                  transition: 'background .15s',
                }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#f5a623" style={{ flex: 'none' }}><path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.6l1-5.8-4.3-4.1 5.9-.9z"/></svg>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-soft)' }}>{d.rating}</span>
                <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 500 }}>({d.reviews})</span>
              </button>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>{PinIc({ style: { opacity: .65 } })} {d.city}</span>
            </div>

            {/* Languages */}
            {d.langs && d.langs.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 5, marginBottom: 10 }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--muted-2)', letterSpacing: '.04em', textTransform: 'uppercase', flex: 'none' }}>{tr('Speaks:')}</span>
                {d.langs.map(l => (
                  <span key={l} style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 10, background: '#eef3f9', color: '#4a6a9a' }}>{l}</span>
                ))}
              </div>
            )}

            {/* Pending appointment request */}
            {appts[d.seed] &&
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 12px', borderRadius: 13, background: 'linear-gradient(180deg,#fdeed6,#f8ddb0)', marginBottom: 11 }}>
                <span style={{ display: 'flex', flex: 'none', color: '#b9722c' }}>{Ic.clock({ width: 16, height: 16 })}</span>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: '#8a5010', lineHeight: 1.35 }}>{trf('Requested {date} · {time} — awaiting reply (within 48h)', { date: window.cfFmtApptShort(appts[d.seed].date), time: window.cf12h(appts[d.seed].time) })}</div>
              </div>}

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn3d pill" onClick={() => setApptDoc(d)} style={{ flex: 1, fontSize: 12.5, fontWeight: 700, padding: '11px 10px', gap: 7 }}>
                {Ic.cal({ width: 16, height: 16 })} {appts[d.seed] ? tr('View request') : tr('Ask for appointment')}
              </button>
              <button className="btn3d soft pill" onClick={() => openDocChat(d)} style={{ flex: 'none', fontSize: 12.5, fontWeight: 700, padding: '11px 18px', gap: 7, color: 'var(--green-700)' }}>
                {Ic.chat({ width: 16, height: 16 })} {tr('Chat')}
              </button>
            </div>
          </div>
        ))}
        </div>

        <p className="muted" style={{ fontSize: 11.5, textAlign: 'center', margin: '16px 8px 0', lineHeight: 1.5 }}>
          {tr('All listed specialists are identity- and license-verified by Crohn Friends.')}
        </p>
      </div>
      )}

      <AppointmentSheet doctor={apptDoc} existing={apptDoc && appts[apptDoc.seed]} open={!!apptDoc}
        onClose={() => setApptDoc(null)} onSubmit={submitAppt} onChat={openDocChat} />
      <ReviewsSheet doctor={reviewsDoc} open={!!reviewsDoc} onClose={() => setReviewsDoc(null)} />
    </div>
  );
}

function CommunityScreen({ go, communityTab, setCommunityTab }) {
  const t = useT();
  const chats = useChats();
  const [localTab, setLocalTab] = useS('posts');
  const activeTab = communityTab != null ? communityTab : localTab;
  const setActiveTab = setCommunityTab || setLocalTab;
  const [chatsOpen, setChatsOpen] = useS(false);
  const [composeOpen, setComposeOpen] = useS(false);
  const tabs = [
    { id: 'posts', label: tr('Posts') },
    { id: 'cfonline', label: tr('CF Online') },
    { id: 'bestcf', label: tr('Best CF Online') },
    { id: 'doctors', label: tr('Doctors') },
  ];

  const posts = usePosts();
  const [commentPost, setCommentPost] = useS(null);
  const feed = posts.list();
  const shownPosts = activeTab === 'doctors' ? feed.filter((p) => p.role === 'Doctor') : feed;
  const unreadTotal = chats.unreadTotal();

  const addPost = ({ title, body, category }) => {
    CFPosts.addPost({ title, body, category });
    setActiveTab('posts');
    setComposeOpen(false);
  };

  const wave = 'M0,52 C 70,18 150,16 220,40 C 290,62 340,58 393,38';
  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Forest header */}
      <div style={{ position: 'relative', flex: 'none' }}>
        <div style={{ position: 'relative', backgroundImage: 'url(assets/forest-bg.png)', backgroundSize: 'cover', height: 200, paddingTop: 45, backgroundPosition: "center top" }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(20,48,26,.68) 0%,rgba(28,55,30,.55) 100%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}><TitleTopBar title={tr('Community')} /></div>
        </div>
        <svg viewBox="0 0 393 100" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, top: 104, pointerEvents: 'none', width: '387px', height: '100px', zIndex: 5 }}>
          <defs>
            <filter id="comm-glow" x="-10%" y="-60%" width="120%" height="240%"><feGaussianBlur stdDeviation="4.5" /></filter>
            <linearGradient id="comm-glowg" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#7dff52" /><stop offset="0.5" stopColor="#b6ff7e" /><stop offset="1" stopColor="#6fe84a" />
            </linearGradient>
          </defs>
          <path d={wave + ' L393,100 L0,100 Z'} fill="var(--card)" />
          <path d={wave} fill="none" stroke="#5dff2e" strokeWidth="16" strokeLinecap="round" opacity="0.4" filter="url(#comm-glow)" />
          <path d={wave} fill="none" stroke="#86ff52" strokeWidth="7" strokeLinecap="round" opacity="0.85" filter="url(#comm-glow)" />
          <path d={wave} fill="none" stroke="url(#comm-glowg)" strokeWidth="3.4" strokeLinecap="round" />
          <path d={wave} fill="none" stroke="#f2ffe6" strokeWidth="1.3" strokeLinecap="round" opacity="0.95" />
        </svg>

        {/* Category tabs */}
        <div style={{ position: 'relative', zIndex: 4, marginTop: -2, background: 'var(--card)', padding: '10px 0 0' }}>
          <div className="no-scrollbar" style={{ display: 'flex', gap: 4, overflowX: 'auto', borderBottom: '1px solid rgba(120,140,115,.14)', padding: '0 16px' }}>
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                flex: 'none', border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
                padding: '10px 8px 12px', fontSize: 13, fontWeight: activeTab === tab.id ? 700 : 500,
                color: activeTab === tab.id ? 'var(--green-700)' : 'var(--muted)',
                borderBottom: activeTab === tab.id ? '2.5px solid var(--green-600)' : '2.5px solid transparent',
                transition: 'all .15s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              }}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      {(activeTab === 'cfonline' || activeTab === 'bestcf') ? (
        <FriendsOnlineGrid best={activeTab === 'bestcf'} t={t} onChats={() => setChatsOpen(true)} unreadTotal={unreadTotal} />
      ) : activeTab === 'doctors' ? (
        <DoctorsTab />
      ) : (
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 22px', background: 'var(--card)' }} className="no-scrollbar">

        {/* Action buttons — 3D, aligned with the rest of the app */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 4 }}>
          <button className="btn3d pill" onClick={() => setComposeOpen(true)}
            style={{ flex: 1, fontSize: 13.5, fontWeight: 700, padding: '13px 12px', gap: 8 }}>
            {Ic.plus({ width: 18, height: 18 })} {tr('New Post')}
          </button>
        </div>

        {/* Section label */}
        <div className="eyebrow" style={{ margin: '22px 2px 12px' }}>
          {activeTab === 'doctors' ? tr('Posts from doctors') : tr('Recent community posts')}
        </div>

        {/* Post cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
          {shownPosts.map((post) => (
            <div key={post.id} className="card" style={{ padding: '15px 16px 13px' }}>
              {/* Post header: avatar + name + badge + time */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 4 }}>
                <div className={'med-chip ' + (post.role === 'Doctor' ? 'c-teal' : (COMM_CAT_COLOR[post.category] || 'c-green'))}
                  style={{ width: 42, height: 42, borderRadius: '50%', fontSize: 14, fontWeight: 800, letterSpacing: '.02em' }}>{post.initials}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--ink)' }}>{post.name}</span>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 3,
                      padding: '2px 9px', borderRadius: 11, fontSize: 10.5, fontWeight: 700,
                      background: post.role === 'Doctor' ? 'linear-gradient(180deg,#eaf7e1,#dcefce)' : 'rgba(120,150,115,.12)',
                      color: post.role === 'Doctor' ? 'var(--green-700)' : 'var(--muted)',
                    }}>
                      <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor"><path d="M6.5 12.5l-4-4 1.4-1.4L6.5 9.7l5.6-5.6 1.4 1.4z"/></svg>
                      {tr(post.role)}
                    </span>
                  </div>
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--green-600)' }}>{tr(post.category)} · {tr(post.time)}</span>
                </div>
                <button style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 4, color: 'var(--muted-2)', flex: 'none', display: 'flex' }}>
                  {Ic.dots({ width: 16, height: 16 })}
                </button>
              </div>

              {/* Post title + body */}
              <div style={{ padding: '6px 0 10px 0' }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--ink)', lineHeight: 1.35, marginBottom: 5, letterSpacing: '-.01em' }}>{post.title}</div>
                <div style={{ fontSize: 13, fontWeight: 400, color: 'var(--ink-soft)', lineHeight: 1.55 }}>{post.body}</div>
              </div>

              {/* Engagement row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 11, borderTop: '1px solid rgba(120,140,115,.12)' }}>
                <button onClick={() => CFPosts.toggleLike(post.id)} className="tchip" style={{ gap: 6, border: 'none', cursor: 'pointer', fontFamily: 'inherit', background: CFPosts.isLiked(post.id) ? 'rgba(224,88,76,.12)' : 'transparent', color: CFPosts.isLiked(post.id) ? '#c0392b' : 'inherit', transition: 'all .15s', borderRadius: 20 }}>
                  {Ic.heart({ width: 14, height: 14 })}{CFPosts.likesFor(post)}
                </button>
                <button onClick={() => setCommentPost(post)} className="tchip" style={{ gap: 6, border: 'none', cursor: 'pointer', fontFamily: 'inherit', borderRadius: 20 }}>
                  {Ic.chat({ width: 14, height: 14 })}{CFPosts.commentCount(post)}
                </button>
                <span style={{ flex: 1 }} />
                <button className="btn3d soft round" style={{ width: 36, height: 36, flex: 'none', padding: 0 }}>{Ic.send({ width: 15, height: 15 })}</button>
              </div>
            </div>
          ))}
        </div>

        <p className="muted" style={{ fontSize: 11.5, textAlign: 'center', margin: '16px 8px 0', lineHeight: 1.5 }}>
          {tr('Be kind and supportive. Posts are peer experiences — not medical advice.')}
        </p>
      </div>
      )}

      {/* Recent chats popup */}
      <RecentChatsSheet open={chatsOpen} onClose={() => setChatsOpen(false)} />

      {/* New post composer */}
      {composeOpen && <NewPostSheet onClose={() => setComposeOpen(false)} onSubmit={addPost} />}

      {/* Comment sheet */}
      {commentPost && <PostCommentSheet post={commentPost} onClose={() => setCommentPost(null)} />}
    </div>);
}

/* ---------- Recent Chats popup — bottom sheet listing open conversations ---------- */
function RecentChatsSheet({ open, onClose }) {
  const chats = useChats();
  if (!open) return null;
  const list = chats.list();
  const total = list.length;
  const openConv = (c) => { onClose(); CFChat.open({ seed: c.seed, name: c.name, doctor: c.doctor }); };
  return (
    <SheetPortal>
      <div className="sheet-backdrop" onClick={onClose}>
        <div className="sheet" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '86%', display: 'flex', flexDirection: 'column' }}>
          <div className="sheet-grab" style={{ flex: 'none' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flex: 'none' }}>
            <div className="badge-ic">{Ic.chat({ width: 23, height: 23 })}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-.01em' }}>{tr('Recent Chats')}</div>
              <div className="muted" style={{ fontSize: 12.5 }}>{trf(total === 1 ? '{n} open conversation' : '{n} open conversations', { n: total })}</div>
            </div>
            <button className="btn3d soft round" onClick={onClose} style={{ width: 38, height: 38, flex: 'none' }}>{Ic.x({ width: 18, height: 18 })}</button>
          </div>

          <div style={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto', margin: '0 -2px', padding: '0 2px 2px', display: 'flex', flexDirection: 'column', gap: 10 }} className="no-scrollbar">
            {list.map((c) => {
              const last = c.messages[c.messages.length - 1];
              const preview = last ? (last.from === 'me' ? tr('You: ') : '') + last.text : tr('Say hi 👋');
              return (
              <button key={c.seed} onClick={() => openConv(c)} className="card" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}>
                <div style={{ position: 'relative', flex: 'none' }}>
                  <div style={{ width: 46, height: 46, borderRadius: '50%', overflow: 'hidden',
                    border: '2.5px solid ' + (c.doctor ? 'var(--green-500)' : 'rgba(120,150,115,.3)'),
                    backgroundImage: `url(https://i.pravatar.cc/96?u=crohnfriends-${c.seed})`, backgroundSize: 'cover', backgroundPosition: 'center',
                    boxShadow: '0 3px 9px -3px rgba(20,50,25,.4)' }} />
                  <span style={{ position: 'absolute', right: 0, bottom: 0, width: 13, height: 13, borderRadius: '50%', background: '#27d367', border: '2.5px solid var(--card)' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</span>
                    {c.doctor && <span style={{ flex: 'none', display: 'inline-flex', alignItems: 'center', gap: 3, padding: '1px 7px', borderRadius: 9, fontSize: 9.5, fontWeight: 700, background: 'linear-gradient(180deg,#eaf7e1,#dcefce)', color: 'var(--green-700)' }}>
                      <svg width="9" height="9" viewBox="0 0 16 16" fill="currentColor"><path d="M6.5 12.5l-4-4 1.4-1.4L6.5 9.7l5.6-5.6 1.4 1.4z"/></svg>Doctor</span>}
                  </div>
                  <div className="muted" style={{ fontSize: 12.5, fontWeight: c.unread ? 700 : 500, color: c.unread ? 'var(--ink-soft)' : 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2 }}>{preview}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5, flex: 'none' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted-2)' }}>{cfRelTime(c.lastTs)}</span>
                  {c.unread > 0 &&
                    <span style={{ minWidth: 20, height: 20, padding: '0 6px', borderRadius: 10, background: 'linear-gradient(180deg,#7bd853,#54b035)', color: '#fff', fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 7px rgba(58,140,45,.35)' }}>{c.unread}</span>}
                </div>
              </button>
            );})}
          </div>

          <button className="btn3d" style={{ width: '100%', fontSize: 15, fontWeight: 700, borderRadius: 22, padding: '15px', marginTop: 14, flex: 'none' }}>
            {Ic.plus({ width: 18, height: 18 })} {tr('Start a new chat')}
          </button>
        </div>
      </div>
    </SheetPortal>);
}

/* ---------- New Post composer — compose & publish to the Posts feed ---------- */
function NewPostSheet({ onClose, onSubmit }) {
  const [category, setCategory] = useS('Nutrition');
  const [title, setTitle] = useS('');
  const [body, setBody] = useS('');
  const valid = title.trim().length > 0 && body.trim().length > 0;
  const submit = () => { if (valid) onSubmit({ title: title.trim(), body: body.trim(), category }); };
  return (
    <SheetPortal>
      <div className="sheet-backdrop" onClick={onClose}>
        <div className="sheet" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '92%', display: 'flex', flexDirection: 'column' }}>
          <div className="sheet-grab" style={{ flex: 'none' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18, flex: 'none' }}>
            <div className="badge-ic">{Ic.edit({ width: 22, height: 22 })}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-.01em' }}>{tr('New Post')}</div>
              <div className="muted" style={{ fontSize: 12.5 }}>{tr('Share with the community')}</div>
            </div>
            <button className="btn3d soft round" onClick={onClose} style={{ width: 38, height: 38, flex: 'none' }}>{Ic.x({ width: 18, height: 18 })}</button>
          </div>

          <div style={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto', margin: '0 -2px', padding: '0 2px' }} className="no-scrollbar">
            {/* posting as */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 18 }}>
              <UserAvatar name={CFProfile.firstName()} size={40} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--ink)' }}>{CFProfile.get().name}</div>
                <div className="muted" style={{ fontSize: 12 }}>{tr('Posting as a community member')}</div>
              </div>
            </div>

            {/* category */}
            <div className="fld">
              <label>{tr('Category')}</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {COMM_CATEGORIES.map((c) => (
                  <button key={c} onClick={() => setCategory(c)} className={'tchip' + (category === c ? ' on' : '')}
                    style={{ cursor: 'pointer', border: 'none', fontFamily: 'inherit', fontSize: 12.5 }}>
                    <span className={'med-chip ' + (COMM_CAT_COLOR[c] || 'c-green')} style={{ width: 12, height: 12, borderRadius: '50%', boxShadow: 'none' }} />{tr(c)}
                  </button>
                ))}
              </div>
            </div>

            {/* title */}
            <div className="fld">
              <label>{tr('Title')}</label>
              <input type="text" value={title} autoFocus maxLength={90} placeholder={tr('A short, clear headline')} onChange={(e) => setTitle(e.target.value)} />
            </div>

            {/* body */}
            <div className="fld">
              <label>{tr('What would you like to share?')}</label>
              <textarea value={body} rows={5} maxLength={600} placeholder={tr('Share an experience, a tip, or ask the community a question…')} onChange={(e) => setBody(e.target.value)}
                style={{ width: '100%', border: 'none', outline: 'none', fontFamily: 'inherit', fontSize: 14.5, fontWeight: 500, color: 'var(--ink)', background: '#fff', borderRadius: 15, padding: '13px 15px', resize: 'none', lineHeight: 1.5, boxShadow: 'inset 0 2px 5px rgba(60,80,55,.12),inset 0 0 0 1px rgba(120,150,115,.14)' }} />
              <div className="muted" style={{ fontSize: 11, textAlign: 'right', margin: '5px 4px 0' }}>{body.length}/600</div>
            </div>
          </div>

          <button className="btn3d pill" onClick={submit} disabled={!valid} style={{ width: '100%', padding: '15px', fontSize: 15.5, marginTop: 8, flex: 'none', opacity: valid ? 1 : .55 }}>
            {Ic.send({ width: 18, height: 18 })} {tr('Publish post')}
          </button>
        </div>
      </div>
    </SheetPortal>);
}

/* ---------- Post comment sheet ---------- */
function PostCommentSheet({ post, onClose }) {
  usePosts(); // re-render when comments change
  const sample = CFPosts.sampleComments(post).map((c) => ({ name: c.name, seed: c.seed, text: tr(c.enText), time: c.time }));
  const mine = CFPosts.userComments(post.id).map((c) => ({ name: c.name, text: c.text, time: tr('now'), mine: true }));
  const comments = [...sample, ...mine];
  const [input, setInput] = useS('');
  const submit = () => {
    if (!input.trim()) return;
    CFPosts.addComment(post.id, input.trim());
    setInput('');
  };
  return (
    <SheetPortal>
      <div className="sheet-backdrop" onClick={onClose}>
        <div className="sheet" onClick={e => e.stopPropagation()} style={{ maxHeight: '88%', display: 'flex', flexDirection: 'column' }}>
          <div className="sheet-grab" style={{ flex: 'none' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, flex: 'none' }}>
            <div className="badge-ic">{Ic.chat({ width: 22, height: 22 })}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: 17, letterSpacing: '-.01em' }}>{tr('Comments')}</div>
              <div className="muted" style={{ fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</div>
            </div>
            <button className="btn3d soft round" onClick={onClose} style={{ width: 38, height: 38, flex: 'none' }}>{Ic.x({ width: 18, height: 18 })}</button>
          </div>
          <div style={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto', margin: '0 -2px', padding: '0 2px 4px', display: 'flex', flexDirection: 'column', gap: 10 }} className="no-scrollbar">
            {comments.length === 0 && (
              <div style={{ textAlign: 'center', padding: '28px 0', color: 'var(--muted)', fontSize: 13.5, fontWeight: 600 }}>{tr('No comments yet — be the first!')}</div>
            )}
            {comments.map((c, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', flex: 'none', overflow: 'hidden',
                  border: '2px solid rgba(120,150,115,.2)',
                  background: c.mine ? 'radial-gradient(120% 120% at 50% 18%,#f4d9c2 0%,#e7b48f 42%,#c98a63 100%)' : '#c8a882',
                  backgroundImage: c.mine ? 'none' : `url(https://i.pravatar.cc/72?u=crohnfriends-${c.seed})`,
                  backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <div style={{ flex: 1, minWidth: 0, borderRadius: '4px 16px 16px 16px', padding: '10px 13px',
                  background: c.mine ? 'var(--mint-50)' : '#f3f6ee' }}>
                  <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--ink)', marginBottom: 3 }}>
                    {c.name} <span style={{ fontWeight: 500, color: 'var(--muted-2)', fontSize: 11 }}>{c.time}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.45 }}>{c.text}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 9, marginTop: 12, flex: 'none' }}>
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submit()}
              placeholder={tr('Write a comment…')}
              style={{ flex: 1, border: 'none', outline: 'none', background: '#f3f6ee', borderRadius: 22, padding: '13px 16px', fontFamily: 'inherit', fontSize: 13.5, boxShadow: 'inset 0 2px 5px rgba(60,80,55,.1)' }} />
            <button className="btn3d round" onClick={submit} disabled={!input.trim()} style={{ width: 48, height: 48, flex: 'none', padding: 0, opacity: input.trim() ? 1 : .5 }}>{Ic.send({ width: 18, height: 18 })}</button>
          </div>
        </div>
      </div>
    </SheetPortal>
  );
}

/* Friends online grid — shows full list of connected (or best) Crohn Friends */
function FriendsOnlineGrid({ best, t, onChats, unreadTotal: unreadProp = 0 }) {
  const friends = best ? CF_BEST_FRIENDS : CF_FRIENDS;
  const accent = best
    ? { ring: '#e8a020', dot: '#f5a623', name: '#6b3d10', shadow: 'rgba(120,60,10,.35)', text: '#8a5010', glow: '#f5a623', count: 26 }
    : { ring: '#3fae54', dot: '#27d367', name: '#2e5a35', shadow: 'rgba(20,50,25,.5)', text: '#3a7a3e', glow: '#27d367', count: 1987 };
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 20px', background: 'var(--card)' }} className="no-scrollbar">
      {/* Recent Chats button */}
      <div style={{ padding: '14px 0 4px' }}>
        <button className="btn3d pill" onClick={onChats}
          style={{ width: '100%', fontSize: 13.5, fontWeight: 700, padding: '13px 12px', gap: 8, position: 'relative' }}>
          {Ic.chat({ width: 18, height: 18 })} {tr('Recent Chats')}
          {unreadProp > 0 &&
            <span style={{ position: 'absolute', top: -5, right: -5, minWidth: 21, height: 21, padding: '0 6px', borderRadius: 11, background: '#e0584c', color: '#fff', fontSize: 11.5, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--card)', boxShadow: '0 3px 7px rgba(180,50,40,.4)' }}>{unreadProp}</span>}
        </button>
      </div>

      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 2px 14px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: accent.text, letterSpacing: '-.01em' }}>
            {best ? t('best_connected') : t('connected')}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: accent.glow, boxShadow: `0 0 6px ${accent.glow}`, flex: 'none' }} />
            <span style={{ fontSize: 12.5, fontWeight: 600, color: accent.name }}>{accent.count} {t('online')}</span>
          </div>
        </div>
      </div>

      {/* Avatar grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px 8px' }}>
        {friends.map((f) => (
          <FriendAvatar key={f.seed} name={f.name} seed={f.seed} size={58}
            ringColor={accent.ring} dotColor={accent.dot} nameColor={accent.name} shadowColor={accent.shadow} />
        ))}
      </div>
    </div>
  );
}

/* ---------- 5. DIET LOG ---------- */
function DietScreen() {
  const [master, setMaster] = useS(true);
  const [diet, setDiet] = useS(true);
  const [hydra, setHydra] = useS(true);
  const [sym, setSym] = useS(false);
  return (
    <div className="fade-in">
      <ForestSectionTop title="Diet Log" filterId="diet-glow">
        <div style={{ padding: '8px 24px 26px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
            <div>
              <div className="eyebrow">Daily Tracking</div>
              <h1 className="h-screen" style={{ margin: '4px 0 0' }}>Diet Log</h1>
            </div>
            <Toggle on={master} onChange={setMaster} />
          </div>

          <div style={{ display: 'flex', gap: 10, marginBottom: 22 }}>
            <button className="btn3d soft pill" style={{ flex: 1, fontSize: 14, padding: '12px 16px' }}>{Ic.pill({ width: 18, height: 18 })} Symptom Tracker</button>
            <button className="btn3d dark round" style={{ width: 48, height: 48, flex: 'none', padding: 0 }}>{Ic.shuffle({ width: 20, height: 20 })}</button>
            <button className="btn3d round" style={{ width: 48, height: 48, flex: 'none', padding: 0 }}>{Ic.plus({ width: 20, height: 20 })}</button>
          </div>

          <div className="card-solid" style={{ padding: 4 }}>
            <div className="lrow">
              <div className="badge-ic">{Ic.clip()}</div>
              <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 14.5 }}>Symptom</div><div className="muted" style={{ fontSize: 12 }}>Track flare-ups</div></div>
              <button className={"check" + (sym ? '' : ' off')} onClick={() => setSym(!sym)} style={{ borderRadius: '50%' }}>{Ic.eye({ width: 18, height: 18 })}</button>
            </div>
            <div className="lrow">
              <div className="badge-ic lite">{Ic.drop()}</div>
              <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 14.5 }}>Diet Log</div><div className="muted" style={{ fontSize: 12 }}>Meals &amp; triggers</div></div>
              <Toggle on={diet} onChange={setDiet} />
            </div>
            <div className="lrow">
              <div className="badge-ic">{Ic.clip()}</div>
              <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 14.5 }}>Hydration</div><div className="muted" style={{ fontSize: 12 }}>Daily water goal</div></div>
              <Toggle on={hydra} onChange={setHydra} />
            </div>
          </div>
        </div>
      </ForestSectionTop>
    </div>);

}

Object.assign(window, { HomeScreen, ScheduleScreen, CommunityScreen });