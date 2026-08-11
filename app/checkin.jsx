/* ===== Daily Check-in — calendar + per-day parameters + analytics =====
   Lives inside the Journal (Schedule) screen. Every answer is saved per-date in
   localStorage, so moving around the calendar restores exactly what was logged.
   Each parameter has its own full-width chart with a time-range selector. */
const { useState: useCS } = React;

/* Portal sheets into the phone frame (.screen) so a transformed/tall ancestor
   can't trap the fixed overlay and push it off-screen. Falls back to body. */
function SheetPortal({ children }) {
  const host = typeof document !== 'undefined' && document.querySelector('.screen') || typeof document !== 'undefined' && document.body;
  return host ? ReactDOM.createPortal(children, host) : children;
}

/* ---------- locale helpers (i18n) ---------- */
function cfLocale() { try { return I18n.locale(); } catch (e) { return 'en-US'; } }
function cfDow() {
  try {
    /* 2026-06-07 is a Sunday — derive localized 2-letter weekday headers */
    return Array.from({ length: 7 }, (_, i) =>
      new Date(Date.UTC(2026, 5, 7 + i)).toLocaleDateString(cfLocale(), { weekday: 'short', timeZone: 'UTC' }).slice(0, 2).toUpperCase());
  } catch (e) { return ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA']; }
}

/* ---------- colour helpers ---------- */
function lerpHex(a, b, t) {
  const pa = [parseInt(a.slice(1, 3), 16), parseInt(a.slice(3, 5), 16), parseInt(a.slice(5, 7), 16)];
  const pb = [parseInt(b.slice(1, 3), 16), parseInt(b.slice(3, 5), 16), parseInt(b.slice(5, 7), 16)];
  return '#' + pa.map((v, i) => Math.round(v + (pb[i] - v) * t).toString(16).padStart(2, '0')).join('');
}
function hexA(hex, a) {
  const n = hex.replace('#', '');
  return `rgba(${parseInt(n.slice(0, 2), 16)},${parseInt(n.slice(2, 4), 16)},${parseInt(n.slice(4, 6), 16)},${a})`;
}

/* per-parameter colour palette — [lighter top, deeper bottom]. */
const PC = {
  med: ['#4fd0c4', '#1fa596'], flare: ['#f6a96b', '#e07d2c'], bowel: ['#d7b083', '#a9763e'],
  water: ['#5cb8ec', '#2f93d4'], sleep: ['#9a8cf0', '#6354d6'], move: ['#62b5f0', '#2f7fd4'],
  nature: ['#7bd853', '#54b035'], animals: ['#e0a25c', '#b9722c'], sunlight: ['#f5cf4e', '#dfa50f'], tv: ['#74c6c6', '#3f9a9a'], tobacco: ['#aab6c4', '#74859a'],
  alcohol: ['#f08bc0', '#d4569e'], subst: ['#e8c074', '#cf9a36'], mindset: ['#b09cf0', '#8466d6'],
  love: ['#7bd853', '#54b035'], toxic: ['#cf6e83', '#9e1f3a'],
  energy: ['#7bd853', '#3f8a3f'], pain: ['#f0897c', '#c0392b'],
  meditate: ['#b09cf0', '#7556d0'], relaxed: ['#9a8cf0', '#6354d6'], music: ['#7bd853', '#54b035'] };

/* ---------- date + storage model ---------- */
const TODAY = new Date().toISOString().slice(0, 10);
const T_MS = Date.parse(TODAY);
const DAY = 86400000;
const jd = (d) => '2026-06-' + String(d).padStart(2, '0');
const md = (d) => '2026-05-' + String(d).padStart(2, '0');

const DEFAULTS = { pain: 0, energy: 5, painNote: '', flare: 'No', flareTypes: [],
  bowel: '0–2', water: '0.5–1L', sleep: '5–7h', move: 'Low', steps: '2k-5k', nature: 'Yes', animals: '0h', sunlight: '0h', tv: '1–2h',
  tobacco: '0', alcohol: 'None', subst: 'None', mindset: '', love: 'Yes', toxic: 'No', sunProtect: 'No',
  meditate: 'No', relaxed: 'No', music: 'No' };

/* a little seeded history so the charts feel alive on first run */
const SEED = {
  [md(28)]: { pain: 4, energy: 5, flare: 'Yes', flareTypes: ['Diarrhea'], bowel: '4–6', water: '<0.5L', sleep: '<5h', move: 'None', steps: '500-2k', nature: 'No', animals: '0h', sunlight: '0h', tv: '2–4h', tobacco: '1–5', alcohol: 'Low', subst: 'None', mindset: 'Negative', love: 'No', toxic: 'Yes' },
  [md(30)]: { pain: 3, energy: 6, flare: 'Yes', flareTypes: ['Uveitis'], bowel: '2–4', water: '0.5–1L', sleep: '5–7h', move: 'Low', steps: '2k-5k', nature: 'Yes', animals: '1–2h', sunlight: '1–2h', tv: '1–2h', tobacco: '0', alcohol: 'None', subst: 'None', mindset: 'Balanced', love: 'Yes', toxic: 'No' },
  [jd(1)]: { pain: 2, energy: 7, flare: 'No', flareTypes: [], bowel: '2–4', water: '1–2L', sleep: '7–9h', move: 'High', steps: '5k-8k', nature: 'Yes', animals: '1–2h', sunlight: '+3h', tv: '1–2h', tobacco: '0', alcohol: 'None', subst: 'CBD', mindset: 'Positive', love: 'Yes', toxic: 'No' },
  [jd(2)]: { pain: 3, energy: 6, flare: 'No', flareTypes: [], bowel: '0–2', water: '1–2L', sleep: '5–7h', move: 'Low', steps: '2k-5k', nature: 'Yes', animals: '0h', sunlight: '1–2h', tv: '0h', tobacco: '0', alcohol: 'Low', subst: 'None', mindset: 'Balanced', love: 'Yes', toxic: 'No' },
  [jd(3)]: { pain: 2, energy: 8, flare: 'No', flareTypes: [], bowel: '0–2', water: '+2L', sleep: '7–9h', move: 'High', steps: '8k-16k', nature: 'Yes', animals: '+3h', sunlight: '+3h', tv: '1–2h', tobacco: '0', alcohol: 'None', subst: 'CBD', mindset: 'Positive', love: 'Yes', toxic: 'No' },
  [jd(4)]: { pain: 1, energy: 8, flare: 'No', flareTypes: [], bowel: '0–2', water: '1–2L', sleep: '7–9h', move: 'Low', steps: '5k-8k', nature: 'Yes', animals: '1–2h', sunlight: '+3h', tv: '0h', tobacco: '0', alcohol: 'None', subst: 'None', mindset: 'Fighter', love: 'Yes', toxic: 'No' },
  [jd(5)]: { pain: 2, energy: 7, flare: 'No', flareTypes: [], bowel: '2–4', water: '0.5–1L', sleep: '5–7h', move: 'Low', steps: '2k-5k', nature: 'Yes', animals: '0h', sunlight: '1–2h', tv: '2–4h', tobacco: '0', alcohol: 'Low', subst: 'None', mindset: 'Balanced', love: 'Yes', toxic: 'No' },
  [jd(6)]: { pain: 1, energy: 9, flare: 'No', flareTypes: [], bowel: '0–2', water: '1–2L', sleep: '7–9h', move: 'High', steps: '+16k', nature: 'Yes', animals: '+3h', sunlight: '+3h', tv: '0h', tobacco: '0', alcohol: 'None', subst: 'CBD', mindset: 'Positive', love: 'Yes', toxic: 'No' } };

function loadStore() {try {const s = JSON.parse(localStorage.getItem('cf-checkins') || 'null');return s && Object.keys(s).length ? s : null;} catch (e) {return null;}}
function saveStore(s) {try {localStorage.setItem('cf-checkins', JSON.stringify(s));} catch (e) {}}

/* ---------- parameter catalogue (drives the form AND the charts) ---------- */
const LIFE = [
{ key: 'flare',   group: 'sym',  label: 'Having a flare-up?',          chart: 'Flare-ups',            icon: Ic.spark,      color: PC.flare,    options: ['Yes', 'No'],                                             dir: -1 },
{ key: 'bowel',   group: 'sym',  label: 'Bowel mov. today?',            chart: 'Bowel movements',      icon: Ic.gut,        color: PC.bowel,    options: ['0–2', '2–4', '4–6', '+6'],                               dir: 1,  minLabel: 'Fewer', maxLabel: 'More' },
{ key: 'water',   group: 'sym',  label: 'Water drunk today?',           chart: 'Water intake',         icon: Ic.drop,       color: PC.water,    options: ['<0.5L', '0.5–1L', '1–2L', '+2L'],                       dir: 1,  minLabel: 'Less',  maxLabel: 'More' },
{ key: 'sleep',   group: 'sym',  label: 'Hours of sleep last night?',   chart: 'Sleep hours',          icon: Ic.moon,       color: PC.sleep,    options: ['<5h', '5–7h', '7–9h', '+9h'],                           dir: 1,  minLabel: 'Less',  maxLabel: 'More' },
{ key: 'move',    group: 'life', label: 'Activity level?',              chart: 'Activity level',       icon: Ic.run,        color: PC.move,     options: ['High', 'Low', 'None', 'Rest'],                           dir: -1, minLabel: 'Most active', maxLabel: 'Resting' },
{ key: 'steps',   group: 'life', label: 'Steps done today?',            chart: 'Steps today',          icon: Ic.pulse,      color: PC.move,     options: ['500', '+2k', '+5k', '+8k', '+16k'],           dir: 1,  minLabel: 'Few',   maxLabel: 'A lot' },
{ key: 'nature',  group: 'life', label: 'Time in nature?',              chart: 'Time in nature',       icon: Ic.leaf,       color: PC.nature,   options: ['Yes', 'No'],                                             dir: -1 },
{ key: 'animals', group: 'life', label: 'Time with animals',            chart: 'Time with animals',    icon: Ic.paw,        color: PC.animals,  options: ['0h', '1–2h', '+3h'],                                    dir: 1,  minLabel: 'None',  maxLabel: 'A lot' },
{ key: 'sunlight',group: 'life', label: 'Sun exposure?',                chart: 'Sun exposure',         icon: Ic.sun,        color: PC.sunlight, options: ['0h', '1–2h', '+3h'],                                    dir: 1,  minLabel: 'None',  maxLabel: 'A lot' },
{ key: 'tv',      group: 'life', label: 'TV, social media or video games', chart: 'TV & screen time',  icon: Ic.tv,         color: PC.tv,       options: ['0h', '1–2h', '2–4h', '+4h'],                            dir: 1,  minLabel: 'None',  maxLabel: 'A lot' },
{ key: 'tobacco', group: 'life', label: 'Cigarettes today?',            chart: 'Cigarettes today',     icon: Ic.smoke,      color: PC.tobacco,  options: ['0', '1–5', '5–10', '10–20', '+20'],                     dir: 1,  wrap: true, minLabel: 'None', maxLabel: 'Heavy' },
{ key: 'alcohol', group: 'life', label: 'Alcohol today?',               chart: 'Alcohol today',        icon: Ic.glass,      color: PC.alcohol,  options: ['None', 'Low', 'High'],                                   dir: 1,  minLabel: 'None',  maxLabel: 'High' },
{ key: 'subst',   group: 'life', label: 'Substances used today?',       chart: 'Substances used',      icon: Ic.flask,      color: PC.subst,    options: ['None', 'THC', 'CBD', 'Coke', 'MDMA', 'Amph', 'Keta', 'Other'], dir: 1, wrap: true },
{ key: 'mindset', group: 'mind', label: 'Your mindset today?',          chart: 'Mindset',              icon: Ic.mind,       color: PC.mindset,  options: ['Fighter', 'Positive', 'Balanced', 'Negative', 'Depressed'], dir: -1, wrap: true },
{ key: 'love',    group: 'mind', label: 'Time with loved ones today?',  chart: 'Time with loved ones', icon: Ic.lovePeople, color: PC.love,     options: ['Yes', 'No'],                                             dir: -1 },
{ key: 'toxic',   group: 'mind', label: 'Toxic people around today?',   chart: 'Toxic people around',  icon: Ic.toxic,      color: PC.toxic,    options: ['Yes', 'No'],                                             dir: -1 },
{ key: 'meditate',group: 'mind', label: 'Have you meditated today?',     chart: 'Meditation',           icon: Ic.mind,       color: PC.meditate, options: ['Yes', 'No'],                                             dir: -1 },
{ key: 'relaxed', group: 'mind', label: 'Have you been relaxed today?',  chart: 'Relaxation',           icon: Ic.moon,       color: PC.relaxed,  options: ['Yes', 'No'],                                             dir: -1 },
{ key: 'music',   group: 'mind', label: 'Did you listen to music today?',chart: 'Music listening',      icon: Ic.heart,      color: PC.music,    options: ['Yes', 'No'],                                             dir: -1 }];
const byKey = Object.fromEntries(LIFE.map((p) => [p.key, p]));

/* categorical answer → 0–10 level, and the inverse for axis labels */
function optLevel(options, value, dir) {
  const i = options.indexOf(value);
  if (i < 0) return null;
  const base = options.length > 1 ? i / (options.length - 1) * 10 : 10;
  return dir < 0 ? 10 - base : base;
}
function optAtLevel(options, dir, level) {
  const n = options.length;
  const base = dir < 0 ? 10 - level : level;
  let i = Math.round(base / 10 * (n - 1));
  i = Math.max(0, Math.min(n - 1, i));
  return options[i];
}

/* ---------- Calendar ---------- */
function CheckinCalendar({ selected, onSelect, dayTones }) {
  /* selected = 'YYYY-MM-DD' | dayTones = { 'YYYY-MM-DD': 'good'|'mid'|'bad' } */
  const dow = cfDow();
  const TODAY_STR = new Date().toISOString().slice(0, 10);
  const initYear = selected ? parseInt(selected.slice(0,4)) : new Date().getFullYear();
  const initMon  = selected ? parseInt(selected.slice(5,7)) : new Date().getMonth() + 1;
  const [viewYear,  setViewYear]  = useCS(initYear);
  const [viewMonth, setViewMonth] = useCS(initMon);
  const tones = {
    good: { bg: 'linear-gradient(180deg,#dff3cf,#cdeab4)', fg: '#3a7a3e' },
    mid:  { bg: 'linear-gradient(180deg,#fbe7c6,#f6d8a6)', fg: '#9a6712' },
    bad:  { bg: 'linear-gradient(180deg,#f6d4cc,#efbcb1)', fg: '#b0392b' } };
  const _nowY = new Date().getFullYear(), _nowM = new Date().getMonth() + 1;
  const canBack = !(viewYear === 2026 && viewMonth === 1);
  const canFwd  = !(viewYear === _nowY && viewMonth === _nowM);
  const goBack = () => { if (viewMonth === 1) { setViewYear(y => y-1); setViewMonth(12); } else setViewMonth(m => m-1); };
  const goFwd  = () => { if (!canFwd) return; if (viewMonth === 12) { setViewYear(y => y+1); setViewMonth(1); } else setViewMonth(m => m+1); };
  const daysInMonth  = new Date(viewYear, viewMonth, 0).getDate();
  const firstDayOfWk = new Date(viewYear, viewMonth - 1, 1).getDay();
  const monthLabel = new Date(viewYear, viewMonth - 1, 1).toLocaleDateString(cfLocale(), { month: 'long', year: 'numeric' });
  const dk = (d) => `${viewYear}-${String(viewMonth).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  const selInView = selected && selected.startsWith(`${viewYear}-${String(viewMonth).padStart(2,'0')}-`);
  const selDay = selInView ? parseInt(selected.slice(8)) : -1;
  const cells = [];
  for (let i = 0; i < firstDayOfWk; i++) cells.push({ blank: true });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ n: d });
  while (cells.length % 7 !== 0) cells.push({ blank: true });
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px', marginBottom: 12 }}>
        <button className="btn3d soft round" style={{ width: 34, height: 34, opacity: canBack ? 1 : .3 }} onClick={goBack} disabled={!canBack}>{Ic.chevL({ width: 18, height: 18 })}</button>
        <span style={{ fontWeight: 800, fontSize: 16 }}>{monthLabel}</span>
        <button className="btn3d soft round" style={{ width: 34, height: 34, opacity: canFwd ? 1 : .3 }} onClick={goFwd} disabled={!canFwd}>{Ic.chevR({ width: 18, height: 18 })}</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4, marginBottom: 6 }}>
        {dow.map((d) => <span key={d} style={{ textAlign: 'center', fontSize: 10.5, fontWeight: 700, color: 'var(--muted-2)', letterSpacing: '.04em' }}>{d}</span>)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4 }}>
        {cells.map((c, i) => {
          if (c.blank) return <span key={i} style={{ height: 38 }} />;
          const dateKey = dk(c.n);
          const isSel = c.n === selDay;
          const isToday = dateKey === TODAY_STR;
          const sv = dayTones[dateKey];
          let style = { height: 38, borderRadius: 12, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13.5, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', color: 'var(--ink)' };
          if (sv && !isSel) { style.background = tones[sv].bg; style.color = tones[sv].fg; }
          if (isToday && !isSel) { style.boxShadow = 'inset 0 0 0 2px var(--green-450)'; }
          if (isSel) { style = { ...style, color: '#fff', background: 'radial-gradient(120% 120% at 32% 26%,#56b83f,#2c6230)', boxShadow: '0 6px 12px rgba(40,95,30,.4),inset 0 2px 2px rgba(255,255,255,.4)' }; }
          return <button key={i} onClick={() => onSelect(dateKey)} style={style}>{c.n}</button>;
        })}
      </div>
    </div>);
}

/* ---------- 0–10 level scale ---------- */
function LevelScale({ value, onChange, theme, minLabel, maxLabel }) {
  const T = { pain: { lo: '#f6cabf', hi: '#a8362c' }, energy: { lo: '#cdeab2', hi: '#2f7a35' } }[theme];
  return (
    <div>
      <div style={{ display: 'flex', gap: 4 }}>
        {Array.from({ length: 11 }).map((_, i) => {
          const on = i <= value,t = i / 10,fill = lerpHex(T.lo, T.hi, t);
          return (
            <button key={i} onClick={() => onChange(i)}
            style={{ flex: 1, height: 34, borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 11.5, fontWeight: 700,
              background: on ? fill : '#e8eee1', color: on ? t > 0.42 ? '#fff' : '#5a4a3a' : 'var(--muted-2)',
              boxShadow: on ? 'inset 0 2px 3px rgba(0,0,0,.12)' : 'inset 0 1px 2px rgba(90,110,85,.18)',
              transition: 'background .15s ease,color .15s ease' }}>{i}</button>);
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: 'var(--muted-2)', fontWeight: 600 }}>
        <span>{minLabel}</span><span>{maxLabel}</span>
      </div>
    </div>);
}

/* ---------- segmented choice ---------- */
function SegSelect({ options, value, onChange, color = PC.nature, minLabel, maxLabel, wrap = false }) {
  const [lo, hi] = color;
  return (
    <div>
      <div style={{ display: 'flex', flexWrap: wrap ? 'wrap' : 'nowrap', gap: 4, background: '#e8eee1', borderRadius: 14, padding: 4, boxShadow: 'inset 0 2px 4px rgba(90,110,85,.2)' }}>
        {options.map((o) => {
          const on = o === value;
          return (
            <button key={o} onClick={() => onChange(o)}
            style={{ flex: wrap ? '1 1 auto' : '1 1 0', minWidth: 0, padding: '9px 10px', borderRadius: 11, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              background: on ? `linear-gradient(180deg,${lo},${hi})` : 'transparent', color: on ? '#fff' : 'var(--muted)',
              boxShadow: on ? `0 5px 11px ${hexA(hi, .32)},inset 0 2px 2px rgba(255,255,255,.45)` : 'none', transition: 'all .15s ease' }}>{tx(o)}</button>);
        })}
      </div>
      {(minLabel || maxLabel) &&
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: 'var(--muted-2)', fontWeight: 600 }}>
          <span>{tx(minLabel)}</span><span>{tx(maxLabel)}</span>
        </div>}
    </div>);
}

/* ---------- multi-select chips ---------- */
function Chips({ options, value, onToggle, color = PC.flare }) {
  const [lo, hi] = color;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {options.map((o) => {
        const on = value.includes(o);
        return (
          <button key={o} onClick={() => onToggle(o)}
          style={{ padding: '8px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12.5, fontWeight: 700,
            background: on ? `linear-gradient(180deg,${lo},${hi})` : '#fff', color: on ? '#fff' : 'var(--ink-soft)',
            boxShadow: on ? `0 5px 11px ${hexA(hi, .3)},inset 0 2px 2px rgba(255,255,255,.35)` : 'inset 0 0 0 1.5px rgba(120,140,115,.28)', transition: 'all .15s ease' }}>{tx(o)}</button>);
      })}
    </div>);
}

/* ---------- small helpers ---------- */
function ParamRow({ icon, iconColor, label, value, valueColor, children }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9, gap: 10 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 7, fontWeight: 700, fontSize: 13.5 }}>
          <span style={{ color: iconColor, display: 'flex', flex: 'none' }}>{icon}</span>{label}
        </span>
        {value != null && <span style={{ fontWeight: 800, fontSize: 15, color: valueColor, flex: 'none' }}>{value}</span>}
      </div>
      {children}
    </div>);
}
function CheckSection({ icon, title, sub, children }) {
  return (
    <div className="card-solid" style={{ padding: '18px 18px 20px', marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div className="badge-ic">{icon}</div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 17, letterSpacing: '-.01em' }}>{title}</div>
          <div className="muted" style={{ fontSize: 12.5 }}>{sub}</div>
        </div>
      </div>
      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 20 }}>{children}</div>
    </div>);
}
function GroupLabel({ children }) {
  return <div className="eyebrow" style={{ margin: '4px 2px 12px' }}>{children}</div>;
}

/* ---------- time-range dropdown ---------- */
const RANGES = [['Last 3 Days', 3], ['Last 7 Days', 7], ['Last 2 Weeks', 14], ['Last 30 Days', 30], ['Last 6 Months', 182], ['Last 12 Months', 365], ['Last 2 Years', 730]];
function RangeDropdown({ value, onChange }) {
  const [open, setOpen] = useCS(false);
  return (
    <div style={{ position: 'relative', flex: 'none' }}>
      <button onClick={() => setOpen((o) => !o)}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 11.5, fontWeight: 700, color: 'var(--ink-soft)', padding: '7px 11px', borderRadius: 12, boxShadow: 'inset 0 0 0 1.5px rgba(120,140,115,.28)', whiteSpace: 'nowrap' }}>
        {tr(value)}
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .15s ease', opacity: .6 }}><path d="M6 9l6 6 6-6" /></svg>
      </button>
      {open &&
      <React.Fragment>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
          <div style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 41, background: '#fff', borderRadius: 14, boxShadow: '0 14px 34px -8px rgba(30,60,30,.34),inset 0 0 0 1px rgba(120,140,115,.12)', padding: 6, minWidth: 156 }}>
            {RANGES.map(([l]) => {
            const active = l === value;
            return (
              <button key={l} onClick={() => {onChange(l);setOpen(false);}}
              style={{ display: 'block', width: '100%', textAlign: 'left', background: active ? 'var(--mint-50)' : 'transparent', color: active ? 'var(--green-700)' : 'var(--ink-soft)', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12.5, fontWeight: active ? 800 : 600, padding: '9px 11px', borderRadius: 9, whiteSpace: 'nowrap' }}>{tr(l)}</button>);
          })}
          </div>
        </React.Fragment>}
    </div>);
}

/* ---------- trend chart (same visual language for every parameter) ---------- */
function TrendChart({ store, days, series, idBase, max = 10, h = 140, gridLevels = [0, 5, 10] }) {
  const W = 300,H = h,pad = 10;
  const start = T_MS - (days - 1) * DAY,span = T_MS - start || 1;
  const x = (t) => (t - start) / span * W;
  const y = (v) => H - pad - v / max * (H - 2 * pad);
  const dates = Object.keys(store).map((ds) => ({ ds, t: Date.parse(ds) })).filter((o) => o.t >= start && o.t <= T_MS).sort((a, b) => a.t - b.t);
  const anyData = series.some((s) => dates.some((d) => s.get({ ...DEFAULTS, ...store[d.ds] }) != null));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: '100%', height: H, overflow: 'visible', display: 'block' }}>
      <defs>
        {series.map((s, si) =>
        <linearGradient key={si} id={`${idBase}-${si}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={s.color[1]} stopOpacity=".34" /><stop offset="1" stopColor={s.color[1]} stopOpacity="0" />
          </linearGradient>)}
      </defs>
      {gridLevels.map((g, gi) => <line key={gi} x1="0" x2={W} y1={y(g)} y2={y(g)} stroke="#d8e2d0" strokeWidth="1" vectorEffect="non-scaling-stroke" strokeDasharray="3 4" />)}
      {!anyData &&
      <text x={W / 2} y={H / 2} textAnchor="middle" fontSize="12" fontWeight="600" fill="#9aab9d" fontFamily="inherit">{tr('No entries in this range yet')}</text>}
      {series.map((s, si) => {
        const pts = dates.map((d) => [x(d.t), y(s.get({ ...DEFAULTS, ...store[d.ds] }))]).filter((p) => !isNaN(p[1]));
        if (!pts.length) return null;
        const path = 'M' + pts.map((p) => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L');
        return (
          <g key={si}>
            {pts.length > 1 && <path d={path + ` L${pts[pts.length - 1][0].toFixed(1)},${H} L${pts[0][0].toFixed(1)},${H} Z`} fill={`url(#${idBase}-${si})`} />}
            {pts.length > 1 && <path d={path} fill="none" stroke={s.color[0]} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" opacity=".5" vectorEffect="non-scaling-stroke" transform="translate(0,3)" />}
            {pts.length > 1 && <path d={path} fill="none" stroke={s.color[1]} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />}
            {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={i === pts.length - 1 ? 4.5 : 3.4} fill={s.color[1]} stroke="#fff" strokeWidth="2" vectorEffect="non-scaling-stroke" />)}
          </g>);
      })}
    </svg>);
}

/* axis tick descriptors: numeric 0/5/10, or every categorical option at its plotted level */
function yTicksFor(opt) {
  if (!opt || opt.numeric) return [0, 5, 10].map((v) => ({ v, label: String(v) }));
  const n = opt.options.length;
  if (n < 2) return [{ v: 10, label: opt.options[0] || '' }];
  return opt.options.map((label, i) => {
    const base = i / (n - 1) * 10;
    return { v: opt.dir < 0 ? 10 - base : base, label };
  });
}

/* ---------- shared axis frame: Y labels (all metrics) + plot + X dates ---------- */
function AxisChart({ store, days, series, idBase, ticks, labelW = 74, fs = 10, muted = 'var(--muted-2)', pdf = false }) {
  const pad = 10,max = 10;
  const height = Math.max(pdf ? 150 : 152, Math.round(pad * 2 + (ticks.length - 1) * (ticks.length > 6 ? 25 : 27)));
  const fy = (v) => (height - pad - v / max * (height - 2 * pad)) / height * 100;
  const start = T_MS - (days - 1) * DAY,span = T_MS - start || 1;
  const xLabels = [0, 1, 2, 3].map((i) => new Date(start + span * i / 3).toLocaleDateString(cfLocale(), { month: 'short', day: '2-digit' }));
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      <div style={{ position: 'relative', width: labelW, flex: 'none', height, textAlign: "right" }}>
        {ticks.map((t, i) =>
        <span key={i} style={{ position: 'absolute', top: fy(t.v) + '%', right: 0, transform: 'translateY(-50%)', fontSize: fs, lineHeight: 1.05, fontWeight: 600, color: muted, textAlign: 'right', maxWidth: labelW, textWrap: 'balance' }}>{tx(t.label)}</span>)}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <TrendChart store={store} days={days} series={series} idBase={idBase} h={height} gridLevels={ticks.map((t) => t.v)} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: Math.max(8.5, fs - 1.5), color: muted, fontWeight: 600, marginTop: 6 }}>
          {xLabels.map((d, i) => <span key={i}>{d}</span>)}
        </div>
      </div>
    </div>);
}

/* ---------- one chart card with its own range selector ---------- */
function ChartCard({ title, icon, accent, series, store, legend, ticks, labelW, idBase }) {
  const [range, setRange] = useCS('Last 7 Days');
  const days = (RANGES.find((r) => r[0] === range) || RANGES[1])[1];
  /* auto-fit y-axis width to the longest tick label */
  const autoLW = labelW != null ? labelW : (() => {
    const maxLen = ticks.reduce((m, t) => Math.max(m, String(t.label).length), 0);
    return Math.max(20, Math.min(58, maxLen * 5.5 + 6));
  })();
  return (
    <div className="card-solid" style={{ padding: '15px 6px 13px', marginBottom: 12, position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '0 4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
          <span style={{ display: 'flex', color: accent, flex: 'none' }}>{icon({ width: 18, height: 18 })}</span>
          <span style={{ fontWeight: 800, fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</span>
        </div>
        <RangeDropdown value={range} onChange={setRange} />
      </div>
      {legend &&
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 10, fontSize: 11.5, fontWeight: 700 }}>
          {legend.map(([lab, col]) => <span key={lab} style={{ display: 'flex', alignItems: 'center', gap: 6, color: col[1] }}><span style={{ width: 16, height: 3, borderRadius: 2, background: col[1] }} />{lab}</span>)}
        </div>}
      <div style={{ marginTop: 12 }}>
        <AxisChart store={store} days={days} series={series} idBase={idBase} ticks={ticks} labelW={autoLW} fs={9.5} />
      </div>
    </div>);
}

/* ---------- Food Journal — snap a plate, keep only the readout ----------
   The photo is never stored. We "read" the plate and keep a text summary only. */
const FOOD_SCANS = [
{ dish: 'Grilled salmon, quinoa & steamed greens', portion: 'About ¾ of a dinner plate — a palm-sized fillet, ½ cup quinoa, a generous handful of greens',
  kcal: 540, macro: { Protein: '38 g', Carbs: '44 g', Fat: '22 g', Fiber: '7 g' },
  vits: ['Vitamin D', 'B12', 'Omega-3', 'Folate'], mins: ['Selenium', 'Magnesium', 'Potassium'],
  hydration: 'Plate is fairly moist — pair with ~300 ml water', gut: 'easy',
  note: 'Low-residue and anti-inflammatory — a kind choice for a calm gut day.' },
{ dish: 'Chicken & veg stir-fry over white rice', portion: 'A full plate — roughly 1 cup rice, a cup of mixed veg, a deck-of-cards of chicken',
  kcal: 620, macro: { Protein: '34 g', Carbs: '72 g', Fat: '18 g', Fiber: '5 g' },
  vits: ['Vitamin A', 'Vitamin C', 'B6', 'Niacin'], mins: ['Iron', 'Zinc', 'Phosphorus'],
  hydration: 'Slightly salty — sip water alongside', gut: 'moderate',
  note: 'Well-cooked veg is gentler than raw. Go easy if peppers tend to bother you.' },
{ dish: 'Lentil soup with a slice of sourdough', portion: 'A deep bowl — about 1½ cups soup plus one thick slice of bread',
  kcal: 410, macro: { Protein: '21 g', Carbs: '58 g', Fat: '9 g', Fiber: '14 g' },
  vits: ['Folate', 'B1', 'Vitamin K'], mins: ['Iron', 'Manganese', 'Copper'],
  hydration: 'Broth-based — good fluid contribution', gut: 'watch',
  note: 'High fibre from lentils — wonderful in remission, but it can be a lot during a flare.' },
{ dish: 'Avocado toast with poached egg', portion: 'Two slices of toast, ½ avocado, one egg — roughly a small plate',
  kcal: 480, macro: { Protein: '19 g', Carbs: '38 g', Fat: '28 g', Fiber: '9 g' },
  vits: ['Vitamin E', 'Folate', 'B12', 'Vitamin K'], mins: ['Potassium', 'Magnesium'],
  hydration: 'Fairly dry — add a glass of water', gut: 'moderate',
  note: 'Healthy fats and protein. Whole-grain bread adds fibre — pick white if your gut is sensitive today.' },
{ dish: 'Banana, oat & yoghurt bowl', portion: 'A medium bowl — ¾ cup oats, ½ banana, a dollop of yoghurt',
  kcal: 360, macro: { Protein: '16 g', Carbs: '54 g', Fat: '8 g', Fiber: '6 g' },
  vits: ['B2', 'B12', 'Vitamin C'], mins: ['Calcium', 'Potassium', 'Phosphorus'],
  hydration: 'Yoghurt adds moisture — still pair with water', gut: 'easy',
  note: 'Soluble fibre and probiotics — a soothing, gut-friendly start to the day.' }];
const GUT_TAG = {
  easy: { label: 'Gentle on the gut', c: ['#dff3cf', '#3a7a3e'] },
  moderate: { label: 'Generally fine', c: ['#eef3d8', '#6f8a1f'] },
  watch: { label: 'Worth watching', c: ['#fbe7c6', '#9a6712'] } };

/* ---- food log: per-date list of saved meal readouts (text only, no photos) ---- */
const FOOD_SEED = {
  [jd(2)]: [
  { time: '08:20', dish: 'Banana, oat & yoghurt bowl', portion: 'A medium bowl — ¾ cup oats, ½ banana, a dollop of yoghurt', kcal: 360, gut: 'easy', note: 'Soluble fibre and probiotics — a soothing, gut-friendly start to the day.' },
  { time: '13:10', dish: 'Chicken & veg stir-fry over white rice', portion: 'A full plate — roughly 1 cup rice, a cup of mixed veg, a deck-of-cards of chicken', kcal: 620, gut: 'moderate', note: 'Well-cooked veg is gentler than raw.' }],
  [jd(4)]: [
  { time: '09:05', dish: 'Avocado toast with poached egg', portion: 'Two slices of toast, ½ avocado, one egg — roughly a small plate', kcal: 480, gut: 'moderate', note: 'Healthy fats and protein; pick white bread if sensitive today.' }],
  [jd(5)]: [
  { time: '12:40', dish: 'Lentil soup with a slice of sourdough', portion: 'A deep bowl — about 1½ cups soup plus one thick slice of bread', kcal: 410, gut: 'watch', note: 'High fibre — lovely in remission, a lot during a flare.' },
  { time: '19:30', dish: 'Grilled salmon, quinoa & steamed greens', portion: 'About ¾ of a dinner plate — a palm-sized fillet, ½ cup quinoa, greens', kcal: 540, gut: 'easy', note: 'Low-residue and anti-inflammatory.' }],
  [jd(6)]: [
  { time: '08:30', dish: 'Banana, oat & yoghurt bowl', portion: 'A medium bowl — ¾ cup oats, ½ banana, a dollop of yoghurt', kcal: 360, gut: 'easy', note: 'A soothing, gut-friendly start to the day.' }] };
function loadFoodLog() {try {const s = JSON.parse(localStorage.getItem('cf-foodlog') || 'null');return s && Object.keys(s).length ? s : null;} catch (e) {return null;}}
function saveFoodLog(s) {try {localStorage.setItem('cf-foodlog', JSON.stringify(s));} catch (e) {}}

/* compact month calendar for the food tracker (amber theme) */
function FoodCalendar({ log, onPick }) {
  /* log = { 'YYYY-MM-DD': [...meals] }  |  onPick(dateStr) */
  const dow = cfDow();
  const TODAY_STR = new Date().toISOString().slice(0, 10);
  const [viewYear,  setViewYear]  = useCS(() => new Date().getFullYear());
  const [viewMonth, setViewMonth] = useCS(() => new Date().getMonth() + 1);
  const _fNowY = new Date().getFullYear(), _fNowM = new Date().getMonth() + 1;
  const canBack = !(viewYear === 2026 && viewMonth === 1);
  const canFwd  = !(viewYear === _fNowY && viewMonth === _fNowM);
  const goBack = () => { if (viewMonth === 1) { setViewYear(y => y-1); setViewMonth(12); } else setViewMonth(m => m-1); };
  const goFwd  = () => { if (!canFwd) return; if (viewMonth === 12) { setViewYear(y => y+1); setViewMonth(1); } else setViewMonth(m => m+1); };
  const daysInMonth  = new Date(viewYear, viewMonth, 0).getDate();
  const firstDayOfWk = new Date(viewYear, viewMonth - 1, 1).getDay();
  const monthLabel = new Date(viewYear, viewMonth - 1, 1).toLocaleDateString(cfLocale(), { month: 'long', year: 'numeric' });
  const dk = (d) => `${viewYear}-${String(viewMonth).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  const cells = [];
  for (let i = 0; i < firstDayOfWk; i++) cells.push({ blank: true });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ n: d });
  while (cells.length % 7 !== 0) cells.push({ blank: true });
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px', marginBottom: 12 }}>
        <button className="btn3d soft round" style={{ width: 34, height: 34, opacity: canBack ? 1 : .3 }} onClick={goBack} disabled={!canBack}>{Ic.chevL({ width: 18, height: 18 })}</button>
        <span style={{ fontWeight: 800, fontSize: 16 }}>{monthLabel}</span>
        <button className="btn3d soft round" style={{ width: 34, height: 34, opacity: canFwd ? 1 : .3 }} onClick={goFwd} disabled={!canFwd}>{Ic.chevR({ width: 18, height: 18 })}</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4, marginBottom: 6 }}>
        {dow.map((d) => <span key={d} style={{ textAlign: 'center', fontSize: 10.5, fontWeight: 700, color: 'var(--muted-2)', letterSpacing: '.04em' }}>{d}</span>)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4 }}>
        {cells.map((c, i) => {
          if (c.blank) return <span key={i} style={{ height: 44 }} />;
          const dateKey = dk(c.n);
          const meals = log[dateKey] || [];
          const has = meals.length > 0;
          const isToday = dateKey === TODAY_STR;
          let style = { height: 44, borderRadius: 12, border: 'none', cursor: has ? 'pointer' : 'default', fontFamily: 'inherit', fontSize: 13.5, fontWeight: 700,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, background: 'transparent', color: has ? '#9a6712' : 'var(--muted-2)' };
          if (has) { style.background = 'linear-gradient(180deg,#fdeed6,#f8ddb0)'; style.boxShadow = 'inset 0 1px 2px rgba(200,150,60,.25)'; }
          if (isToday) { style.boxShadow = (has ? 'inset 0 1px 2px rgba(200,150,60,.25),' : '') + 'inset 0 0 0 2px #d98a26'; }
          return (
            <button key={i} onClick={() => has && onPick(dateKey)} style={style}>
              <span>{c.n}</span>
              {has && <span style={{ display: 'flex', gap: 2 }}>{meals.slice(0, 3).map((_, k) => <span key={k} style={{ width: 4, height: 4, borderRadius: '50%', background: '#d98a26' }} />)}</span>}
            </button>);
        })}
      </div>
    </div>);
}

function FoodJournal({ open, onClose }) {
  const [phase, setPhase] = useCS('intro'); /* intro | scanning | result | calendar | day */
  const [scan, setScan] = useCS(null);
  const [log, setLog] = useCS(() => {const s = loadFoodLog();if (s) return s;saveFoodLog(FOOD_SEED);return FOOD_SEED;});
  const [selDate, setSelDate] = useCS(TODAY);
  React.useEffect(() => {if (open) {setPhase('intro');setScan(null);}}, [open]);
  if (!open) return null;

  const runScan = () => {
    setPhase('scanning');
    setTimeout(() => {
      setScan(FOOD_SCANS[Math.floor(Math.random() * FOOD_SCANS.length)]);
      setPhase('result');
    }, 1900);
  };
  const saveSummary = () => {
    if (!scan) {onClose();return;}
    const now = new Date();
    const time = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
    const entry = { time, dish: scan.dish, portion: scan.portion, kcal: scan.kcal, gut: scan.gut, note: scan.note };
    setLog((prev) => {
      const next = { ...prev, [TODAY]: [...(prev[TODAY] || []), entry] };
      saveFoodLog(next);
      return next;
    });
    setSelDate(TODAY);setPhase('day');
  };

  const tag = scan ? GUT_TAG[scan.gut] : null;

  return (
    <SheetPortal>
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '90%', animation: 'none', transform: 'none', display: 'flex', flexDirection: 'column' }}>
        <div className="sheet-grab" style={{ flex: 'none' }} />
        {(() => {
            const inCal = phase === 'calendar' || phase === 'day';
            return (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flex: 'none' }}>
              {inCal ?
                <button className="btn3d soft round" onClick={() => setPhase(phase === 'day' ? 'calendar' : 'intro')} style={{ width: 46, height: 46, flex: 'none' }}>{Ic.back({ width: 20, height: 20 })}</button> :
                <div className="badge-ic" style={{ background: 'radial-gradient(120% 120% at 30% 25%,#f0b765,#d98a26)' }}>{Ic.cam({ width: 24, height: 24 })}</div>}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-.01em' }}>{inCal ? tr('Food calendar') : tr('Food Journal')}</div>
                <div className="muted" style={{ fontSize: 12.5 }}>{phase === 'day' ? tr('What you logged that day.') : inCal ? tr('Tap a highlighted day to see your meals.') : tr('Snap your plate — we read it, then forget the photo.')}</div>
              </div>
              <button className="btn3d soft round" onClick={onClose} style={{ width: 38, height: 38, flex: 'none' }}>{Ic.x({ width: 18, height: 18 })}</button>
            </div>);
          })()}

        {/* privacy reassurance */}
        {(phase === 'intro' || phase === 'scanning' || phase === 'result') &&
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '11px 14px', borderRadius: 14, background: 'var(--mint-50)', color: 'var(--green-700)', fontSize: 12.5, fontWeight: 600, marginBottom: 16, flex: 'none' }}>
          <span style={{ display: 'flex', color: 'var(--green-600)', flex: 'none' }}>{Ic.lock({ width: 17, height: 17 })}</span>
          {tr('The photo is analysed on-device and never saved — only this written summary is kept.')}
        </div>}

        {phase === 'intro' &&
          <div style={{ textAlign: 'center', padding: '8px 0 4px' }}>
            <div style={{ width: '100%', height: 168, borderRadius: 20, background: 'repeating-linear-gradient(135deg,#f4efe6,#f4efe6 11px,#ece5d8 11px,#ece5d8 22px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, color: '#b08b54', boxShadow: 'inset 0 2px 6px rgba(90,70,40,.12)' }}>
              {Ic.cam({ width: 44, height: 44 })}
              <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, letterSpacing: '.02em' }}>{tr('point camera at your plate')}</span>
            </div>
            <button className="btn3d" onClick={runScan} style={{ width: '100%', fontSize: 15.5, fontWeight: 700, borderRadius: 22, padding: '15px', marginTop: 18,
              background: 'linear-gradient(180deg,#f0b765,#d98a26)', boxShadow: '0 8px 16px rgba(200,130,20,.4),inset 0 2px 2px rgba(255,255,255,.55),inset 0 -4px 6px rgba(160,100,10,.45)' }}>
              {Ic.cam({ width: 19, height: 19 })} {tr('Take a photo')}
            </button>
            <button className="btn3d" onClick={() => setPhase('calendar')} style={{ width: '100%', fontSize: 14.5, fontWeight: 700, borderRadius: 22, padding: '14px', marginTop: 11, background: 'linear-gradient(180deg,#fcc67a,#df8c2a)', boxShadow: '0 8px 16px rgba(200,130,20,.38),inset 0 2px 2px rgba(255,255,255,.55),inset 0 -4px 6px rgba(150,90,10,.42)', color: '#fff' }}>
              {Ic.cal({ width: 18, height: 18 })} {tr('Food calendar track')}
            </button>
            <div className="muted" style={{ fontSize: 11.5, marginTop: 10 }}>{tr('Best results: good light, plate filling most of the frame.')}</div>
          </div>}

        {phase === 'scanning' &&
          <div style={{ textAlign: 'center', padding: '14px 0 10px' }}>
            <div style={{ position: 'relative', width: '100%', height: 168, borderRadius: 20, overflow: 'hidden', background: 'radial-gradient(120% 90% at 50% 30%,#f7d9a3,#e0a25c)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7a4d16' }}>
              {Ic.meal({ width: 50, height: 50 })}
              <div className="food-scanline" />
            </div>
            <div style={{ fontWeight: 800, fontSize: 15, marginTop: 16 }}>{tr('Reading your plate…')}</div>
            <div className="muted" style={{ fontSize: 12.5, marginTop: 4 }}>{tr('Estimating portion, calories & nutrients')}</div>
          </div>}

        {phase === 'result' && scan &&
          <div>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 4 }}>
              <div style={{ fontWeight: 800, fontSize: 17, letterSpacing: '-.01em', lineHeight: 1.25 }}>{scan.dish}</div>
              <span style={{ flex: 'none', fontSize: 11, fontWeight: 800, padding: '5px 11px', borderRadius: 20, background: tag.c[0], color: tag.c[1], whiteSpace: 'nowrap' }}>{tr(tag.label)}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 9, margin: '12px 0 14px', padding: '12px 15px', borderRadius: 16, background: '#fff7ec', boxShadow: 'inset 0 0 0 1.5px rgba(200,150,60,.22)' }}>
              <span style={{ display: 'flex', color: '#d98a26', flex: 'none' }}>{Ic.scale({ width: 19, height: 19 })}</span>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)', lineHeight: 1.4 }}><strong style={{ fontWeight: 800 }}>{tr('Quantity on the plate:')}</strong> {scan.portion}</div>
            </div>

            {/* calories headline */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, justifyContent: 'center', padding: '6px 0 14px' }}>
              <span style={{ fontSize: 40, fontWeight: 800, color: '#d98a26', lineHeight: 1 }}>{scan.kcal}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--muted)' }}>{tr('kcal · estimated')}</span>
            </div>

            {/* macros */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 14 }}>
              {Object.entries(scan.macro).map(([k, v]) =>
              <div key={k} style={{ textAlign: 'center', padding: '11px 4px', borderRadius: 14, background: '#f3f6ee', boxShadow: 'inset 0 1px 2px rgba(90,110,85,.14)' }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--ink)' }}>{v}</div>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--muted-2)', marginTop: 2 }}>{tr(k)}</div>
                </div>)}
            </div>

            {/* vitamins & minerals */}
            <div style={{ marginBottom: 6 }}>
              <div className="eyebrow" style={{ marginBottom: 8 }}>{tr('Vitamins')}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 14 }}>
                {scan.vits.map((v) => <span key={v} style={{ fontSize: 12, fontWeight: 700, padding: '6px 12px', borderRadius: 18, background: 'linear-gradient(180deg,#dff3cf,#cdeab4)', color: '#3a7a3e' }}>{v}</span>)}
              </div>
              <div className="eyebrow" style={{ marginBottom: 8 }}>{tr('Minerals')}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 14 }}>
                {scan.mins.map((v) => <span key={v} style={{ fontSize: 12, fontWeight: 700, padding: '6px 12px', borderRadius: 18, background: '#eef1f7', color: '#5566a0' }}>{v}</span>)}
              </div>
            </div>

            {/* hydration */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '11px 14px', borderRadius: 14, background: '#eef7fc', color: '#2f7fb0', fontSize: 12.5, fontWeight: 600, marginBottom: 10 }}>
              <span style={{ display: 'flex', flex: 'none' }}>{Ic.drop({ width: 17, height: 17 })}</span>{scan.hydration}
            </div>
            {/* crohn note */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, padding: '12px 14px', borderRadius: 14, background: 'var(--mint-50)', color: 'var(--green-700)', fontSize: 12.5, fontWeight: 600, lineHeight: 1.45, marginBottom: 18 }}>
              <span style={{ display: 'flex', color: 'var(--green-600)', flex: 'none', marginTop: 1 }}>{Ic.leaf({ width: 17, height: 17 })}</span>{scan.note}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn3d soft" onClick={runScan} style={{ flex: 1, fontSize: 14, fontWeight: 700, borderRadius: 20, padding: '14px' }}>
                {Ic.refill({ width: 18, height: 18 })} {tr('Scan another')}
              </button>
              <button className="btn3d" onClick={saveSummary} style={{ flex: 1, fontSize: 14, fontWeight: 700, borderRadius: 20, padding: '14px' }}>
                {Ic.check({ width: 18, height: 18 })} {tr('Save summary')}
              </button>
            </div>
            <div className="muted" style={{ fontSize: 11, textAlign: 'center', marginTop: 12 }}>{tr('Estimates only — not medical or dietary advice.')}</div>
          </div>}

        {phase === 'calendar' &&
          <div style={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto', margin: '0 -2px', padding: '0 2px' }}>
            <FoodCalendar log={log} onPick={(dateKey) => {setSelDate(dateKey);setPhase('day');}} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 16, padding: '11px 14px', borderRadius: 14, background: '#fff7ec', color: '#9a6712', fontSize: 12, fontWeight: 600, boxShadow: 'inset 0 0 0 1.5px rgba(200,150,60,.22)' }}>
              <span style={{ display: 'flex', flex: 'none', color: '#d98a26' }}>{Ic.info({ width: 16, height: 16 })}</span>
              {tr('Amber days have logged meals. Each dot is one entry — tap a day to read it back.')}
            </div>
          </div>}

        {phase === 'day' && (() => {
            const meals = log[selDate] || [];
            const dayName = new Date(selDate + 'T00:00:00').toLocaleDateString(cfLocale(), { weekday: 'long', month: 'long', day: 'numeric' });
            const total = meals.reduce((s, m) => s + (m.kcal || 0), 0);
            return (
              <div style={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto', margin: '0 -2px', padding: '0 2px 2px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 14 }}>
                <div style={{ fontWeight: 800, fontSize: 16 }}>{dayName}</div>
                {meals.length > 0 && <span style={{ flex: 'none', fontSize: 12, fontWeight: 800, color: '#d98a26' }}>{total} {tr('kcal total')}</span>}
              </div>
              {meals.length === 0 ?
                <div style={{ textAlign: 'center', padding: '34px 18px', color: 'var(--muted)' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', color: '#d9c3a0', marginBottom: 10 }}>{Ic.meal({ width: 40, height: 40 })}</div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink-soft)' }}>{tr('No meals logged this day')}</div>
                    <div style={{ fontSize: 12.5, marginTop: 4 }}>{tr('Snap a plate to start tracking.')}</div>
                  </div> :
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {meals.map((m, i) => {
                    const t = GUT_TAG[m.gut] || GUT_TAG.moderate;
                    return (
                      <div key={i} style={{ borderRadius: 18, background: '#fff', padding: '14px 15px', boxShadow: '0 8px 22px -14px rgba(120,80,20,.4),inset 0 0 0 1.5px rgba(200,150,60,.16)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <span style={{ fontSize: 11, fontWeight: 800, color: '#b08b54', fontFamily: 'monospace' }}>{m.time}</span>
                            <span style={{ flex: 1 }} />
                            <span style={{ fontSize: 10.5, fontWeight: 800, padding: '4px 9px', borderRadius: 16, background: t.c[0], color: t.c[1], whiteSpace: 'nowrap' }}>{tr(t.label)}</span>
                          </div>
                          <div style={{ fontWeight: 800, fontSize: 14.5, lineHeight: 1.3, marginBottom: 8 }}>{m.dish}</div>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12.5, fontWeight: 600, color: 'var(--ink-soft)', lineHeight: 1.4, marginBottom: 8 }}>
                            <span style={{ display: 'flex', flex: 'none', color: '#d98a26', marginTop: 1 }}>{Ic.scale({ width: 15, height: 15 })}</span>{m.portion}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: m.note ? 8 : 0 }}>
                            <span style={{ fontSize: 20, fontWeight: 800, color: '#d98a26', lineHeight: 1 }}>{m.kcal}</span>
                            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)' }}>kcal</span>
                          </div>
                          {m.note &&
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '9px 12px', borderRadius: 12, background: 'var(--mint-50)', color: 'var(--green-700)', fontSize: 12, fontWeight: 600, lineHeight: 1.4 }}>
                              <span style={{ display: 'flex', flex: 'none', color: 'var(--green-600)', marginTop: 1 }}>{Ic.leaf({ width: 15, height: 15 })}</span>{m.note}
                            </div>}
                        </div>);
                  })}
                  </div>}
            </div>);
          })()}
      </div>
    </div>
    </SheetPortal>);
}

/* ---------- simulated generated-PDF document (renders real saved data) ---------- */
function PdfDocument({ selKeys, rangeLabel, days }) {
  const store = loadStore() || SEED;
  const foodLog = loadFoodLog() || FOOD_SEED;
  const prof = loadProfileStats() || PROFILE_DEFAULT;
  const pdfMeds = (window.CF_loadMeds && window.CF_loadMeds()) || [];
  const activeMeds = pdfMeds.filter((m) => m.reminders);
  const start = T_MS - (days - 1) * DAY;
  const inRange = (ds) => {const t = Date.parse(ds);return t >= start && t <= T_MS;};
  const recs = Object.keys(store).filter(inRange).sort().map((d) => ({ date: d, ...DEFAULTS, ...store[d] }));
  const avg = (a) => a.length ? a.reduce((s, x) => s + x, 0) / a.length : null;
  const fmt1 = (v) => v == null ? '—' : v.toFixed(1);
  const avgPain = avg(recs.map((r) => r.pain));
  const avgEnergy = avg(recs.map((r) => r.energy));
  const flareDays = recs.filter((r) => r.flare === 'Yes').length;
  const foodDates = Object.keys(foodLog).filter(inRange).sort();
  const meals = foodDates.flatMap((d) => (foodLog[d] || []).map((m) => ({ date: d, ...m })));
  const totalKcal = meals.reduce((s, m) => s + (m.kcal || 0), 0);
  const wantFood = selKeys.includes('food');
  const chartKeys = selKeys.filter((k) => k !== 'food');
  const seriesFor = (k) => k === 'health' ?
  [{ color: PC.energy, get: (r) => r.energy }, { color: PC.pain, get: (r) => r.pain }] :
  [{ color: byKey[k].color, get: (r) => optLevel(byKey[k].options, r[k], byKey[k].dir) }];
  const titleFor = (k) => k === 'health' ? tr('Health Analytics') : tr(byKey[k].chart);
  const accentFor = (k) => k === 'health' ? '#3f8a3f' : byKey[k].color[1];
  const iconFor = (k) => k === 'health' ? Ic.pulse : byKey[k].icon;
  const latestFor = (k) => {for (let i = recs.length - 1; i >= 0; i--) {const r = recs[i];if (k === 'health') return 'Pain ' + r.pain + ' · Energy ' + r.energy;if (r[k] != null) return r[k];}return '—';};
  const genDate = new Date(2026, 5, 6).toLocaleDateString(cfLocale(), { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const fmtDay = (ds) => new Date(ds + 'T00:00:00').toLocaleDateString(cfLocale(), { weekday: 'short', month: 'short', day: 'numeric' });

  const eyebrow = { fontSize: 9.5, fontWeight: 800, letterSpacing: '.14em', textTransform: 'uppercase', color: '#8a9684' };
  const rule = { height: 1, background: '#e4e7df', margin: '14px 0' };
  const chip = (label, val, col) =>
  <div key={label} style={{ flex: '1 1 0', minWidth: 70, textAlign: 'center', padding: '10px 6px', borderRadius: 10, background: '#f5f7f1' }}>
      <div style={{ fontSize: 17, fontWeight: 800, color: col || '#2b3328', lineHeight: 1 }}>{val}</div>
      <div style={{ fontSize: 9, fontWeight: 700, color: '#8a9684', marginTop: 4, letterSpacing: '.02em' }}>{label}</div>
    </div>;

  return (
    <div style={{ background: '#fff', margin: '12px auto', maxWidth: 360, borderRadius: 6, boxShadow: '0 14px 34px -10px rgba(30,50,25,.4)', padding: '24px 18px', color: '#2b3328', fontSize: 12, lineHeight: 1.5 }}>
      {/* letterhead */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 11, overflow: 'hidden', flex: 'none' }}><img src="uploads/CF logo-af21aac8.jpg" alt="Crohn Friends" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: '-.01em', color: '#234e28' }}>Crohn Friends</div>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: '#8a9684', letterSpacing: '.02em' }}>{tr('Personal Health Report')}</div>
          </div>
        </div>
        <div style={{ textAlign: 'right', fontSize: 9.5, color: '#8a9684', fontWeight: 600, lineHeight: 1.55 }}>
          <div style={{ fontWeight: 800, color: '#5a6655' }}>{tr(rangeLabel)}</div>
          <div>{tr('Generated')}</div><div>{genDate}</div>
        </div>
      </div>

      <div style={rule} />

      {/* patient */}
      <div style={eyebrow}>{tr('Patient details')}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
        <div style={{ fontWeight: 800, fontSize: 14, color: '#2b3328', flex: 1 }}>Gerard</div>
        {[['Weight', prof.weight + ' kg'], ['Height', prof.height + ' cm'], ['Age', prof.age], ['With Crohn', prof.crohnYears + ' yr']].map(([l, v]) =>
        <div key={l} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 12.5, fontWeight: 800 }}>{v}</div>
            <div style={{ fontSize: 8.5, fontWeight: 700, color: '#8a9684', textTransform: 'uppercase', letterSpacing: '.05em' }}>{tr(l)}</div>
          </div>)}
      </div>

      {activeMeds.length > 0 && <React.Fragment>
        <div style={rule} />
        <div style={eyebrow}>{tr('Active medications')}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 8 }}>
          {activeMeds.map((m, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 8, background: '#f5f7f1', border: '1px solid #e4e7df' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#27d367', flex: 'none', boxShadow: '0 0 5px #27d367' }} />
              <span style={{ fontWeight: 800, fontSize: 11.5, flex: 1 }}>{m.name}{m.strength ? ' ' + m.strength : ''}</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: '#6a7464' }}>{tr(m.dose)}</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: '#8a9684', marginLeft: 4 }}>{m.period === 'week' ? tr('1× / week') : m.period === 'fortnight' ? tr('1× / 15 days') : trf('{n}× daily', { n: m.freq })}</span>
            </div>
          ))}
        </div>
      </React.Fragment>}

      <div style={rule} />

      {/* period summary */}
      <div style={eyebrow}>{tr('Period summary')}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 8 }}>
        {chip(tr('Days logged'), recs.length)}
        {chip(tr('Avg pain'), fmt1(avgPain), '#c0392b')}
        {chip(tr('Avg energy'), fmt1(avgEnergy), '#2f7a35')}
        {chip(tr('Flare days'), flareDays, '#d98a26')}
        {wantFood && chip(tr('Meals'), meals.length, '#d98a26')}
        {wantFood && chip(tr('Total kcal'), totalKcal, '#d98a26')}
      </div>

      {/* charts */}
      {chartKeys.length > 0 &&
      <React.Fragment>
          <div style={rule} />
          <div style={eyebrow}>{tr('Symptom & lifestyle trends')}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12, marginLeft: -14, marginRight: -14 }}>
            {chartKeys.map((k) => {
            const tk = k === 'health' ? yTicksFor({ numeric: true }) : yTicksFor(byKey[k]);
            const lw = (() => { const mxL = tk.reduce((m, t) => Math.max(m, String(t.label).length), 0); return Math.max(20, Math.min(58, mxL * 5.5 + 6)); })();
            const ser = seriesFor(k);
            return (
              <div key={k} style={{ border: '1px solid #e4e7df', borderRadius: 12, padding: '12px 5px 11px', background: 'linear-gradient(180deg,#fcfdfb,#f7f9f4)', breakInside: 'avoid' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 2, padding: '0 3px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, fontSize: 13 }}>
                    <span style={{ display: 'flex', width: 24, height: 24, borderRadius: 7, alignItems: 'center', justifyContent: 'center', background: '#fff', border: '1px solid #e4e7df', color: accentFor(k), flex: 'none' }}>{iconFor(k)({ width: 15, height: 15 })}</span>{titleFor(k)}
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 800, color: accentFor(k), background: '#fff', border: '1px solid #e4e7df', borderRadius: 999, padding: '3px 9px' }}>{tr(rangeLabel)}</span>
                </div>
                {ser.length > 1 &&
                <div style={{ display: 'flex', gap: 14, justifyContent: 'flex-start', margin: '8px 0 2px ' + (lw + 6) + 'px', fontSize: 10, fontWeight: 700 }}>
                    {[[tr('Energy'), PC.energy], [tr('Pain'), PC.pain]].map(([lab, col]) =>
                  <span key={lab} style={{ display: 'flex', alignItems: 'center', gap: 5, color: col[1] }}><span style={{ width: 14, height: 3, borderRadius: 2, background: col[1] }} />{lab}</span>)}
                  </div>}
                <div style={{ marginTop: 8 }}>
                  <AxisChart store={store} days={days} series={ser} idBase={'pdf-' + k} ticks={tk} labelW={lw} fs={8.5} muted="#9aa595" pdf={true} />
                </div>
              </div>);
          })}
          </div>
        </React.Fragment>}

      {/* food journal */}
      {wantFood &&
      <React.Fragment>
          <div style={rule} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={eyebrow}>{tr('Food journal — what you ate')}</span>
            <span style={{ fontSize: 9.5, fontWeight: 800, color: '#d98a26' }}>{trf(meals.length === 1 ? '{n} meal' : '{n} meals', { n: meals.length })} · {totalKcal} kcal</span>
          </div>
          {meals.length === 0 ?
        <div style={{ fontSize: 11, color: '#8a9684', marginTop: 8, fontStyle: 'italic' }}>{tr('No meals logged in this period.')}</div> :
        <div style={{ marginTop: 8 }}>
                {foodDates.map((d) =>
          <div key={d} style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 10, fontWeight: 800, color: '#5a6655', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 5 }}>{fmtDay(d)}</div>
                    {(foodLog[d] || []).map((m, i) => {
              const tg = GUT_TAG[m.gut] || GUT_TAG.moderate;
              return (
                <div key={i} style={{ display: 'flex', gap: 9, padding: '7px 0', borderTop: i === 0 ? 'none' : '1px dashed #ebeee6' }}>
                          <span style={{ fontSize: 9.5, fontWeight: 800, color: '#b08b54', fontFamily: 'monospace', flex: 'none', width: 34, paddingTop: 1 }}>{m.time}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                              <span style={{ fontWeight: 800, fontSize: 11.5 }}>{m.dish}</span>
                              <span style={{ fontWeight: 800, fontSize: 11.5, color: '#d98a26', flex: 'none' }}>{m.kcal} kcal</span>
                            </div>
                            <div style={{ fontSize: 10, color: '#6a7464', marginTop: 2 }}>{m.portion}</div>
                            <div style={{ fontSize: 9.5, fontWeight: 700, color: tg.c[1], marginTop: 3 }}>{tr(tg.label)}{m.note ? ' · ' + m.note : ''}</div>
                          </div>
                        </div>);
            })}
                  </div>)}
              </div>}
        </React.Fragment>}

      {/* footer */}
      <div style={rule} />
      <div style={{ fontSize: 8.5, color: '#9aa595', lineHeight: 1.5 }}>
        {tr('This report summarises self-tracked data from Crohn Friends. It is not a medical document and is not a substitute for professional advice. Share it with your clinician as context only.')}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 8.5, fontWeight: 700, color: '#b7c0b1', marginTop: 8 }}>
        <span>Crohn-Friends-Report.pdf</span><span>{tr('Page 1 of 1')}</span>
      </div>
    </div>);
}

/* ---------- PDF export — choose charts + time range ---------- */
const PDF_RANGES = [['Last 3 days', 3], ['Last 7 days', 7], ['Last 14 days', 14], ['Last month', 30], ['Last 6 months', 182], ['Last year', 365], ['Last 2 years', 730]];
function PdfExport({ open, onClose }) {
  const items = [{ key: 'health', label: 'Health Analytics', color: PC.energy }, { key: 'food', label: 'Food journal entries', color: ['#f0b765', '#d98a26'] }, ...LIFE.map((p) => ({ key: p.key, label: p.chart, color: p.color }))];
  const [sel, setSel] = useCS(() => new Set(items.map((i) => i.key)));
  const [range, setRange] = useCS('Last 7 days');
  const [phase, setPhase] = useCS('config'); /* config | building | preview */
  const [saved, setSaved] = useCS(false);
  React.useEffect(() => {if (open) {setPhase('config');setSel(new Set(items.map((i) => i.key)));setRange('Last 7 days');setSaved(false);}}, [open]);
  if (!open) return null;
  const toggle = (k) => setSel((prev) => {const n = new Set(prev);n.has(k) ? n.delete(k) : n.add(k);return n;});
  const allOn = sel.size === items.length;
  const days = (PDF_RANGES.find((r) => r[0] === range) || PDF_RANGES[1])[1];
  const build = () => {setSaved(false);setPhase('building');setTimeout(() => setPhase('preview'), 1700);};
  const chartCount = [...sel].filter((k) => k !== 'food').length;

  return (
    <SheetPortal>
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()} style={{ maxHeight: phase === 'preview' ? '94%' : '88%', display: 'flex', flexDirection: 'column', animation: 'none', transform: 'none' }}>
        <div className="sheet-grab" style={{ flex: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flex: 'none' }}>
          <div className="badge-ic" style={{ background: 'radial-gradient(120% 120% at 30% 25%,#b09cf0,#7556d0)' }}>{(phase === 'preview' ? Ic.doc : Ic.download)({ width: 23, height: 23 })}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-.01em' }}>{phase === 'preview' ? tr('Report preview') : tr('Download PDF')}</div>
            <div className="muted" style={{ fontSize: 12.5 }}>{phase === 'preview' ? tr('Generated from your saved entries.') : tr('Pick the charts and the period to export.')}</div>
          </div>
          <button className="btn3d soft round" onClick={onClose} style={{ width: 38, height: 38, flex: 'none' }}>{Ic.x({ width: 18, height: 18 })}</button>
        </div>

        {phase === 'config' &&
          <div style={{ flex: '1 1 auto', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            {/* time range */}
            <div className="eyebrow" style={{ marginBottom: 10, flex: 'none' }}>{tr('Time period')}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20, flex: 'none' }}>
              {PDF_RANGES.map(([l]) => {
                const on = l === range;
                return (
                  <button key={l} onClick={() => setRange(l)}
                  style={{ padding: '9px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12.5, fontWeight: 700,
                    background: on ? 'linear-gradient(180deg,#b09cf0,#7556d0)' : '#fff', color: on ? '#fff' : 'var(--ink-soft)',
                    boxShadow: on ? '0 5px 11px rgba(110,80,200,.32),inset 0 2px 2px rgba(255,255,255,.4)' : 'inset 0 0 0 1.5px rgba(120,140,115,.28)' }}>{tr(l)}</button>);
              })}
            </div>

            {/* parameters */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, flex: 'none' }}>
              <span className="eyebrow">{tr('Charts to include')}</span>
              <button onClick={() => setSel(allOn ? new Set() : new Set(items.map((i) => i.key)))}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 800, color: 'var(--green-600)' }}>
                {allOn ? tr('Clear all') : tr('Select all')}
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: '1 1 auto', minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch', margin: '0 -4px', padding: '0 4px 4px' }}>
              {items.map((it) => {
                const on = sel.has(it.key);
                return (
                  <button key={it.key} onClick={() => toggle(it.key)}
                  style={{ display: 'flex', alignItems: 'center', gap: 11, width: '100%', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', flex: 'none',
                    padding: '12px 14px', borderRadius: 14, border: 'none', background: on ? 'var(--mint-50)' : '#f3f6ee',
                    boxShadow: on ? 'inset 0 0 0 1.5px ' + hexA(it.color[1], .45) : 'inset 0 0 0 1.5px rgba(120,140,115,.16)' }}>
                    <span style={{ width: 22, height: 22, borderRadius: 7, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: on ? `linear-gradient(180deg,${it.color[0]},${it.color[1]})` : '#fff', color: '#fff',
                      boxShadow: on ? 'none' : 'inset 0 0 0 1.5px rgba(120,140,115,.3)' }}>{on && Ic.check({ width: 14, height: 14 })}</span>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: on ? 'var(--ink)' : 'var(--muted)' }}>{tr(it.label)}</span>
                  </button>);
              })}
            </div>

            {/* final download action — fixed at the bottom of the sheet, always visible */}
            <div style={{ flex: 'none', paddingTop: 14, borderTop: '1px solid rgba(120,140,115,.16)', marginTop: 4 }}>
              <button className="btn3d" onClick={build} disabled={!sel.size}
              style={{ width: '100%', fontSize: 15.5, fontWeight: 700, borderRadius: 24, padding: '16px', opacity: sel.size ? 1 : .5,
                background: 'linear-gradient(180deg,#b09cf0 0%,#8466d6 100%)', boxShadow: '0 8px 16px rgba(110,80,200,.42),inset 0 2px 2px rgba(255,255,255,.55),inset 0 -4px 6px rgba(80,55,160,.45)' }}>
                {Ic.download({ width: 19, height: 19 })} {tr('Download PDF file')} · {trf(sel.size === 1 ? '{n} section' : '{n} sections', { n: sel.size })}
              </button>
            </div>
          </div>}

        {phase === 'building' &&
          <div style={{ textAlign: 'center', padding: '34px 0 30px' }}>
            <div className="pdf-spin" style={{ margin: '0 auto 18px' }} />
            <div style={{ fontWeight: 800, fontSize: 16 }}>{tr('Building your report…')}</div>
            <div className="muted" style={{ fontSize: 12.5, marginTop: 4 }}>{trf(sel.size === 1 ? '{n} section' : '{n} sections', { n: sel.size })} · {tr(range)}</div>
          </div>}

        {phase === 'preview' &&
          <React.Fragment>
            <div style={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch', margin: '0 -8px', padding: '0 4px', background: 'linear-gradient(180deg,#e7ebe2,#dde3d6)', borderRadius: 16 }}>
              <PdfDocument selKeys={[...sel]} rangeLabel={range} days={days} />
            </div>
            <div style={{ flex: 'none', paddingTop: 14, borderTop: '1px solid rgba(120,140,115,.16)', marginTop: 10 }}>
              {saved &&
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 13px', borderRadius: 13, background: 'var(--mint-50)', color: 'var(--green-700)', fontSize: 12.5, fontWeight: 700, marginBottom: 11 }}>
                  <span style={{ display: 'flex', color: 'var(--green-600)', flex: 'none' }}>{Ic.check({ width: 17, height: 17 })}</span>
                  {tr('Saved to your phone · Crohn-Friends-Report.pdf')}
                </div>}
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn3d soft" onClick={() => setPhase('config')} style={{ flex: '0 0 auto', fontSize: 14, fontWeight: 700, borderRadius: 20, padding: '15px 18px' }}>
                  {Ic.sliders({ width: 18, height: 18 })} {tr('Adjust')}
                </button>
                <button className="btn3d" onClick={() => setSaved(true)} style={{ flex: 1, fontSize: 15, fontWeight: 700, borderRadius: 20, padding: '15px',
                  background: 'linear-gradient(180deg,#b09cf0 0%,#8466d6 100%)', boxShadow: '0 8px 16px rgba(110,80,200,.42),inset 0 2px 2px rgba(255,255,255,.55),inset 0 -4px 6px rgba(80,55,160,.45)' }}>
                  {Ic.download({ width: 18, height: 18 })} {saved ? tr('Downloaded') : tr('Download PDF file')}
                </button>
              </div>
            </div>
          </React.Fragment>}
      </div>
    </div>
    </SheetPortal>);
}

/* ---------- profile details (Weight / Height / Age / Years with Crohn) ---------- */
const PROFILE_DEFAULT = { weight: 68, height: 175, age: 29, crohnYears: 6 };
function loadProfileStats() {try {return JSON.parse(localStorage.getItem('cf-profile') || 'null') || null;} catch (e) {return null;}}
function saveProfileStats(p) {try {localStorage.setItem('cf-profile', JSON.stringify(p));} catch (e) {}}

function ProfileStats() {
  useT(); /* re-render on language change */
  const [p, setP] = useCS(() => loadProfileStats() || PROFILE_DEFAULT);
  const [editing, setEditing] = useCS(false);
  const [draft, setDraft] = useCS(p);
  const open = () => {setDraft(p);setEditing(true);};
  const save = () => {const np = { ...draft };setP(np);saveProfileStats(np);setEditing(false);};
  const stats = [
  ['Weight', p.weight, 'kg', Ic.scale],
  ['Height', p.height, 'cm', Ic.ruler],
  ['Age', p.age, 'yrs', Ic.cal],
  ['With Crohn', p.crohnYears, 'yrs', Ic.heart]];
  const fields = [['weight', 'Weight', 'kg'], ['height', 'Height', 'cm'], ['age', 'Age', 'years'], ['crohnYears', 'Years with Crohn', 'years']];
  return (
    <React.Fragment>
      <div className="card-solid" style={{ padding: '16px 18px 18px', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
            <div className="badge-ic">{Ic.heart()}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-.01em' }}>{tr('Your details')}</div>
              <div className="muted" style={{ fontSize: 12 }}>{tr('Used to personalise your insights')}</div>
            </div>
          </div>
          <button className="btn3d soft" onClick={open} style={{ padding: '9px 13px', borderRadius: 16, fontSize: 13, fontWeight: 700, flex: 'none' }}>{Ic.edit({ width: 16, height: 16 })} {tr('Edit')}</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
          {stats.map(([label, val, unit, icon]) =>
          <div key={label} style={{ textAlign: 'center', padding: '12px 4px 11px', borderRadius: 14, background: 'var(--mint-50)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--green-600)', marginBottom: 5 }}>{icon({ width: 17, height: 17 })}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 2 }}>
                <span style={{ fontSize: 19, fontWeight: 800, color: 'var(--ink)', lineHeight: 1 }}>{val}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--green-700)' }}>{tr(unit)}</span>
              </div>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--muted-2)', marginTop: 5 }}>{tr(label)}</div>
            </div>)}
        </div>
      </div>

      {editing &&
      <SheetPortal>
          <div className="sheet-backdrop" onClick={() => setEditing(false)}>
            <div className="sheet" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '90%', animation: 'none', transform: 'none' }}>
              <div className="sheet-grab" />
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                <div className="badge-ic">{Ic.edit({ width: 22, height: 22 })}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-.01em' }}>{tr('Edit your details')}</div>
                  <div className="muted" style={{ fontSize: 12.5 }}>{tr('Keep these up to date for better insights.')}</div>
                </div>
                <button className="btn3d soft round" onClick={() => setEditing(false)} style={{ width: 38, height: 38, flex: 'none' }}>{Ic.x({ width: 18, height: 18 })}</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 13 }}>
                {fields.map(([k, lab, unit]) =>
              <div className="fld" key={k} style={{ marginBottom: 0 }}>
                    <label>{tr(lab)} <span style={{ color: 'var(--muted-2)', fontWeight: 600 }}>({tr(unit)})</span></label>
                    <input type="number" inputMode="numeric" value={draft[k]}
                onChange={(e) => {const v = e.target.value;setDraft((d) => ({ ...d, [k]: v === '' ? '' : Number(v) }));}} />
                  </div>)}
              </div>
              <button className="btn3d" onClick={save} style={{ width: '100%', fontSize: 15.5, fontWeight: 700, borderRadius: 22, padding: '16px', marginTop: 20 }}>
                {Ic.check({ width: 19, height: 19 })} {tr('Save details')}
              </button>
            </div>
          </div>
        </SheetPortal>}
    </React.Fragment>);
}

/* ---------- the assembled check-in ---------- */
function DailyCheckin() {
  useT(); /* re-render on language change */
  const [foodOpen, setFoodOpen] = useCS(false);
  const [pdfOpen, setPdfOpen] = useCS(false);
  const [store, setStore] = useCS(() => {const s = loadStore();if (s) return s;saveStore(SEED);return SEED;});
  const [date, setDate] = useCS(TODAY);
  const rec = { ...DEFAULTS, ...(store[date] || {}) };
  const update = (patch) => setStore((prev) => {
    const base = { ...DEFAULTS, ...(prev[date] || {}) };
    const checkinFlag = date === TODAY ? { _checkedIn: true } : {};
    const next = { ...prev, [date]: { ...base, ...patch, ...checkinFlag } };
    saveStore(next);
    return next;
  });
  const toggleFlare = (o) => {const cur = rec.flareTypes || [];update({ flareTypes: cur.includes(o) ? cur.filter((x) => x !== o) : [...cur, o] });};

  const dayTones = {};
  Object.keys(store).forEach((dk) => { const r = store[dk]; if (r) dayTones[dk] = r.pain >= 5 ? 'bad' : r.energy >= 7 ? 'good' : 'mid'; });
  const dayName = new Date(date + 'T00:00:00').toLocaleDateString(cfLocale(), { weekday: 'short', month: 'short', day: 'numeric' });

  const Seg = (key) => {
    const p = byKey[key];
    return (
      <ParamRow key={key} icon={p.icon({ width: 17, height: 17 })} iconColor={p.color[1]} label={tr(p.label)}
      value={key === 'mindset' ? (rec.mindset ? tx(rec.mindset) : '—') : tx(rec[key])} valueColor={key === 'mindset' && !rec.mindset ? 'var(--muted-2)' : p.color[1]}>
        <SegSelect options={p.options} value={rec[key]} onChange={(v) => update({ [key]: v })} color={p.color} wrap={p.wrap} minLabel={p.minLabel} maxLabel={p.maxLabel} />
      </ParamRow>);
  };
  const lvlGet = (p) => (r) => optLevel(p.options, r[p.key], p.dir);

  return (
    <div style={{ marginTop: 22 }}>
      {/* ---- Food Journal launcher (above everything) ---- */}
      <button onClick={() => setFoodOpen(true)} className="card-solid"
      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 13, textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
        padding: '15px 16px', marginBottom: 16, border: 'none',
        background: 'linear-gradient(180deg,#fff7ec,#fdeed6)', boxShadow: '0 12px 30px -12px rgba(180,120,30,.32),inset 0 0 0 1.5px rgba(210,160,70,.28)' }}>
        <div className="badge-ic" style={{ background: 'radial-gradient(120% 120% at 30% 25%,#f0b765,#d98a26)' }}>{Ic.cam({ width: 24, height: 24 })}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: '#9a6712' }}>{tr('Food Journal')}</div>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: '#b08b54', lineHeight: 1.35 }}>{tr('Snap your plate — we read the portion, calories & nutrients, then forget the photo.')}</div>
        </div>
        <span style={{ display: 'flex', color: '#d98a26', flex: 'none' }}>{Ic.arrowR({ width: 20, height: 20 })}</span>
      </button>
      <FoodJournal open={foodOpen} onClose={() => setFoodOpen(false)} />

      {/* ---- header + calendar ---- */}
      <div className="card-solid" style={{ padding: '18px 18px 20px', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <div className="badge-ic">{Ic.cal()}</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 17, letterSpacing: '-.01em' }}>{tr('Daily check-in')}</div>
            <div className="muted" style={{ fontSize: 12.5 }}>{tr('Pick a day below — coloured days are already saved.')}</div>
          </div>
        </div>
        <CheckinCalendar selected={date} onSelect={setDate} dayTones={dayTones} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 16, padding: '12px 15px', borderRadius: 16, background: 'var(--mint-50)', color: 'var(--green-700)', fontSize: 13, fontWeight: 600 }}>
          <span style={{ display: 'flex', color: 'var(--green-600)' }}>{Ic.check({ width: 18, height: 18 })}</span>
          {tr('Logging for')} <strong style={{ fontWeight: 800 }}>{dayName}</strong> · {tr('saved automatically')}
        </div>
      </div>

      {/* ---- How do you feel? ---- */}
      <CheckSection icon={Ic.heart()} title={tr('How do you feel?')} sub={tr('The essentials — your pain and energy today.')}>
        <ParamRow icon={Ic.flame({ width: 17, height: 17 })} iconColor="#d6584a" label={tr('Pain Level')} value={rec.pain} valueColor="#c0392b">
          <LevelScale value={rec.pain} onChange={(v) => update({ pain: v })} theme="pain" minLabel={tr('No pain')} maxLabel={tr('Worst')} />
        </ParamRow>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span className="eyebrow" style={{ color: 'var(--ink-soft)' }}>{tr('Pain comment')}</span>
            <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--muted-2)', background: '#eef3e8', padding: '2px 8px', borderRadius: 10 }}>{tr('optional')}</span>
          </div>
          <input value={rec.painNote} onChange={(e) => update({ painNote: e.target.value })} placeholder={tr('e.g. felt pain in my lower back today…')}
          style={{ width: '100%', border: 'none', outline: 'none', background: '#fff', borderRadius: 14, padding: '13px 15px', fontFamily: 'inherit', fontSize: 13, boxShadow: 'inset 0 2px 5px rgba(60,80,55,.12),0 2px 6px rgba(30,60,30,.05)' }} />
        </div>
        <ParamRow icon={Ic.bolt({ width: 17, height: 17 })} iconColor="#2f7a35" label={tr('Energy Level')} value={rec.energy} valueColor="#2f7a35">
          <LevelScale value={rec.energy} onChange={(v) => update({ energy: v })} theme="energy" minLabel={tr('Very low')} maxLabel={tr('Full of energy')} />
        </ParamRow>
      </CheckSection>

      {/* ---- A bit more about your day ---- */}
      <CheckSection icon={Ic.clip()} title={tr('A bit more about your day')} sub={tr('All optional — track only what matters to you.')}>
        <GroupLabel>{tr('Symptoms & Body')}</GroupLabel>
        {Seg('flare')}
        {rec.flare === 'Yes' &&
        <div style={{ marginTop: -8 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 10 }}>{tr('Which one(s)?')}</div>
            <Chips options={['Uveitis', 'Diarrhea', 'Arthritis', 'Dermatitis', 'Psoriasis']} value={rec.flareTypes || []} onToggle={toggleFlare} color={PC.flare} />
          </div>}
        {Seg('bowel')}
        {Seg('water')}
        {Seg('sleep')}

        <div style={{ height: 1, background: 'rgba(120,140,115,.16)', margin: '2px 0' }} />
        <GroupLabel>{tr('Lifestyle & Habits')}</GroupLabel>
        {Seg('move')}
        {Seg('steps')}
        {Seg('nature')}
        {Seg('animals')}
        {Seg('sunlight')}
        {(rec.sunlight === '1–2h' || rec.sunlight === '+3h') &&
        <div style={{ marginTop: -8, marginLeft: 5, paddingLeft: 15, borderLeft: '2px solid ' + hexA(PC.sunlight[1], .35) }}>
            <ParamRow icon={Ic.shield({ width: 16, height: 16 })} iconColor={PC.sunlight[1]} label={tr('Sun protection used?')} value={tx(rec.sunProtect)} valueColor={PC.sunlight[1]}>
              <SegSelect options={['Yes', 'No']} value={rec.sunProtect} onChange={(v) => update({ sunProtect: v })} color={PC.sunlight} />
            </ParamRow>
          </div>}
        {Seg('tv')}
        {Seg('tobacco')}
        {Seg('alcohol')}
        {Seg('subst')}

        <div style={{ height: 1, background: 'rgba(120,140,115,.16)', margin: '2px 0' }} />
        <GroupLabel>{tr('Mind & People')}</GroupLabel>
        {Seg('mindset')}
        {Seg('love')}
        {Seg('toxic')}
        {Seg('meditate')}
        {Seg('relaxed')}
        {Seg('music')}
      </CheckSection>

      {/* ---- Analytics: one chart at a time, each below the previous ---- */}
      <div style={{ marginTop: 26 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, padding: '0 2px' }}>
          <div className="badge-ic">{Ic.pulse()}</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 17, letterSpacing: '-.01em' }}>{tr('Analytics')}</div>
            <div className="muted" style={{ fontSize: 12.5 }}>{tr('Every parameter over time — choose a range on each chart.')}</div>
          </div>
        </div>

        <div style={{ marginLeft: -20, marginRight: -20 }}>
        <ChartCard title={tr('Health Analytics')} icon={Ic.pulse} accent="#3f8a3f" store={store} idBase="ch-health"
          legend={[[tr('Energy Level'), PC.energy], [tr('Pain Level'), PC.pain]]}
          series={[{ color: PC.energy, get: (r) => r.energy }, { color: PC.pain, get: (r) => r.pain }]}
          ticks={yTicksFor({ numeric: true })} />

        {LIFE.map((p) =>
          <ChartCard key={p.key} title={tr(p.chart)} icon={p.icon} accent={p.color[1]} store={store} idBase={'ch-' + p.key}
          series={[{ color: p.color, get: lvlGet(p) }]}
          ticks={yTicksFor(p)} />)}
        </div>
      </div>

      {/* ---- Download PDF — at the very bottom, below the last chart ---- */}
      <button className="btn3d" onClick={() => setPdfOpen(true)} style={{ width: '100%', fontSize: 15.5, fontWeight: 700, borderRadius: 24, padding: '16px', marginTop: 8,
        background: 'linear-gradient(180deg,#b09cf0 0%,#8466d6 100%)', boxShadow: '0 8px 16px rgba(110,80,200,.42),inset 0 2px 2px rgba(255,255,255,.55),inset 0 -4px 6px rgba(80,55,160,.45)' }}>
        {Ic.download({ width: 19, height: 19 })} {tr('Download PDF file')}
      </button>
      <PdfExport open={pdfOpen} onClose={() => setPdfOpen(false)} />
    </div>);
}

Object.assign(window, { DailyCheckin, ChartCard, LIFE, PC, byKey, optLevel, optAtLevel, SEED, ProfileStats,
  CF_loadStore: loadStore, CF_DEFAULTS: DEFAULTS, CF_loadFoodLog: loadFoodLog, CF_FOOD_SEED: FOOD_SEED,
  CF_loadProfileStats: loadProfileStats, CF_PROFILE_DEFAULT: PROFILE_DEFAULT, CF_TODAY: TODAY });