/* ===== Shared components ===== */
const { useState } = React;

/* Shared friend lists — used on Home carousels AND Community online tabs */
const CF_FRIENDS = [
{ name: 'Emma', seed: 'cf-emma' }, { name: 'Liam', seed: 'cf-liam' }, { name: 'Lucía', seed: 'cf-lucia' },
{ name: 'Marco', seed: 'cf-marco' }, { name: 'Nadia', seed: 'cf-nadia' }, { name: 'Sophie', seed: 'cf-sophie' },
{ name: 'Aisha', seed: 'cf-aisha' }, { name: 'Carlos', seed: 'cf-carlos' }, { name: 'Yuki', seed: 'cf-yuki' },
{ name: 'Priya', seed: 'cf-priya' }, { name: 'Finn', seed: 'cf-finn' }, { name: 'Amara', seed: 'cf-amara' },
{ name: 'Mateo', seed: 'cf-mateo' }, { name: 'Léa', seed: 'cf-lea' }, { name: 'Tariq', seed: 'cf-tariq' },
{ name: 'Hana', seed: 'cf-hana' }, { name: 'Diego', seed: 'cf-diego' }, { name: 'Fatima', seed: 'cf-fatima' },
{ name: 'Jonas', seed: 'cf-jonas' }, { name: 'Mei', seed: 'cf-mei' }, { name: 'Kwame', seed: 'cf-kwame' },
{ name: 'Sara', seed: 'cf-sara' }, { name: 'Ravi', seed: 'cf-ravi' }, { name: 'Ingrid', seed: 'cf-ingrid' },
{ name: 'Kofi', seed: 'cf-kofi' }, { name: 'Elena', seed: 'cf-elena' }];

const CF_BEST_FRIENDS = [
{ name: 'Emma', seed: 'best-emma' }, { name: 'Liam', seed: 'best-liam' }, { name: 'Lucía', seed: 'best-lucia' },
{ name: 'Marco', seed: 'best-marco' }, { name: 'Nadia', seed: 'best-nadia' }, { name: 'Sophie', seed: 'best-sophie' },
{ name: 'Aisha', seed: 'best-aisha' }, { name: 'Carlos', seed: 'best-carlos' }, { name: 'Yuki', seed: 'best-yuki' },
{ name: 'Priya', seed: 'best-priya' }, { name: 'Finn', seed: 'best-finn' }, { name: 'Amara', seed: 'best-amara' },
{ name: 'Mateo', seed: 'best-mateo' }, { name: 'Léa', seed: 'best-lea' }, { name: 'Tariq', seed: 'best-tariq' },
{ name: 'Hana', seed: 'best-hana' }, { name: 'Diego', seed: 'best-diego' }, { name: 'Fatima', seed: 'best-fatima' },
{ name: 'Jonas', seed: 'best-jonas' }, { name: 'Mei', seed: 'best-mei' }, { name: 'Kwame', seed: 'best-kwame' },
{ name: 'Sara', seed: 'best-sara' }, { name: 'Ravi', seed: 'best-ravi' }, { name: 'Ingrid', seed: 'best-ingrid' },
{ name: 'Kofi', seed: 'best-kofi' }, { name: 'Elena', seed: 'best-elena' }];

function StatusBar() {return null;}
function BrandTopBar() {return null;}

/* User avatar — uploaded photo, chosen colour (with initials), or the
   default procedural portrait. Reflects the live profile store. */
function UserAvatar({ name, size = 46 }) {
  const prof = useProfile();
  const label = (name || prof.name || 'Gerard') + ' profile photo';
  if (prof.avatarPhoto) {
    return (
      <div style={{ width: size, height: size, borderRadius: '50%', flex: 'none', overflow: 'hidden',
        border: '2px solid rgba(255,255,255,.85)', boxShadow: '0 4px 12px -4px rgba(10,30,12,.55)',
        backgroundImage: `url(${prof.avatarPhoto})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        aria-label={label} />);
  }
  if (prof.avatarColor) {
    return (
      <div style={{ width: size, height: size, borderRadius: '50%', flex: 'none', overflow: 'hidden',
        border: '2px solid rgba(255,255,255,.85)', boxShadow: '0 4px 12px -4px rgba(10,30,12,.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
        fontWeight: 800, fontSize: size * 0.4, letterSpacing: '.02em',
        background: `radial-gradient(120% 120% at 50% 18%, ${prof.avatarColor}, ${prof.avatarColor})` }}
        aria-label={label}>{CFProfile.initials()}</div>);
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flex: 'none', overflow: 'hidden',
      border: '2px solid rgba(255,255,255,.85)', boxShadow: '0 4px 12px -4px rgba(10,30,12,.55)',
      background: 'radial-gradient(120% 120% at 50% 18%, #f4d9c2 0%, #e7b48f 42%, #c98a63 100%)'
    }} aria-label={label}>
      <svg width={size} height={size} viewBox="0 0 46 46" aria-hidden="true">
        <ellipse cx="23" cy="18.5" rx="8.2" ry="9" fill="#5b3a2c" opacity=".92" />
        <path d="M8.5 46c0-9.4 6.5-15.5 14.5-15.5S37.5 36.6 37.5 46Z" fill="#5b3a2c" opacity=".92" />
        <circle cx="23" cy="19" r="6.4" fill="#f0c9a8" />
      </svg>
    </div>);
}

/* Friend avatar — shows a realistic placeholder photo with coloured ring + online dot */
function FriendAvatar({ name, seed, doctor, onOpen, size = 52, ringColor = '#3fae54', dotColor = '#27d367', nameColor = '#2e5a35', shadowColor = 'rgba(20,50,25,.5)' }) {
  const photoUrl = `https://i.pravatar.cc/${size * 2}?u=crohnfriends-${seed || name}`;
  const open = () => (onOpen || window.openChat || (() => {}))({ name, seed: seed || name, doctor: !!doctor });
  return (
    <button onClick={open} aria-label={`Chat with ${name}`}
    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flex: 'none', border: 'none', background: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <div style={{
          width: size, height: size, borderRadius: '50%', overflow: 'hidden',
          border: `2.5px solid ${ringColor}`, boxShadow: `0 3px 9px -3px ${shadowColor}`,
          background: '#c8a882',
          backgroundImage: `url(${photoUrl})`,
          backgroundSize: 'cover', backgroundPosition: 'center top'
        }} />
        <span style={{ position: 'absolute', right: 1, bottom: 1, width: 13, height: 13, borderRadius: '50%', background: dotColor, border: '2.5px solid #122', boxShadow: `0 0 0 1.5px ${dotColor}` }} />
      </div>
      <span style={{ fontSize: 11.5, fontWeight: 600, color: nameColor, letterSpacing: '0px' }}>{name}</span>
    </button>);
}

function ConnectedNow({ onSeeAll }) {
  const t = useT();
  const friends = CF_FRIENDS;
  return (
    <div style={{ position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(135deg, #e6f5e0 0%, #f2fbed 55%, #daefd2 100%)',
      borderTop: '1px solid rgba(80,170,80,.15)', borderBottom: '1px solid rgba(80,170,80,.15)',
      margin: "8px -24px 4px", padding: "5px 0px 30px" }}>
      <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120,
        borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(39,211,103,.18) 0%, transparent 70%)' }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 11, padding: '0 18px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 14, color: '#3a7a3e', lineHeight: 1.2 }}>{t('connected')}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#27d367', boxShadow: '0 0 6px #27d367', flex: 'none' }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#469a3f' }}>1987 {t('online')}</span>
          </div>
        </div>
        <button className="btn3d pill" onClick={onSeeAll}
        style={{ padding: '5px 14px', fontSize: 11.5, letterSpacing: '.01em', whiteSpace: 'nowrap', fontWeight: 500 }}>{t('see_all')}</button>
      </div>
      <div className="no-scrollbar" style={{ display: 'flex', overflowX: 'auto', padding: '4px 20px 2px', gap: 14, justifyContent: 'flex-start' }}>
        {friends.map((f) => <FriendAvatar key={f.name} name={f.name} seed={f.seed} />)}
      </div>
    </div>);
}

function BestConnectedNow({ onSeeAll }) {
  const t = useT();
  const friends = CF_BEST_FRIENDS;
  return (
    <div style={{ position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(135deg, #fdf3e0 0%, #fff9ee 55%, #faecd3 100%)',
      borderTop: '1px solid rgba(220,160,50,.2)', borderBottom: '1px solid rgba(220,160,50,.2)',
      margin: '12px -24px 0', padding: "12px 0px 0px" }}>
      <div style={{ position: 'absolute', top: -20, left: -20, width: 120, height: 120,
        borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(245,166,35,.2) 0%, transparent 70%)' }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 11, padding: '0 18px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 14, color: '#8a5010', lineHeight: 1.2 }}>{t('best_connected')}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f5a623', boxShadow: '0 0 6px #f5a623', flex: 'none' }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#c47a20' }}>26 {t('online')}</span>
          </div>
        </div>
        <button className="btn3d pill" onClick={onSeeAll}
        style={{ padding: '5px 14px', fontSize: 11.5, letterSpacing: '.01em', whiteSpace: 'nowrap',
          background: 'linear-gradient(180deg,#fbbe4a 0%,#f5a623 100%)',
          boxShadow: '0 8px 16px rgba(200,120,10,.38), inset 0 2px 2px rgba(255,255,255,.55), inset 0 -4px 6px rgba(160,80,0,.4)',
          fontWeight: 500, color: '#fff' }}>{t('see_all')}</button>
      </div>
      <div className="no-scrollbar" style={{ display: 'flex', overflowX: 'auto', padding: '4px 20px 2px', gap: 14, justifyContent: 'flex-start' }}>
        {friends.map((f) => <FriendAvatar key={f.name} name={f.name} seed={f.seed}
        ringColor="#e8a020" dotColor="#f5a623" nameColor="#6b3d10" shadowColor="rgba(120,60,10,.35)" />)}
      </div>
    </div>);
}

function WelcomeBar({ name, onAvatar, onDrCF }) {
  const t = useT();
  const prof = useProfile();
  const display = name || CFProfile.firstName();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '52px 24px 0' }}>
      <button className="avatar-btn" onClick={onAvatar} aria-label="Open settings">
        <UserAvatar name={display} size={46} />
        <span className="gear-badge">{Ic.gear({ width: 11, height: 11 })}</span>
      </button>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15, flex: 1 }}>
        <span style={{ color: 'rgba(234,253,227,.82)', fontSize: 12, fontWeight: 600 }}>{t('welcome')}</span>
        <span style={{ color: '#fff', fontSize: 19, fontWeight: 800, letterSpacing: '-.01em', textShadow: '0 1px 6px rgba(10,30,12,.45)' }}>{display}</span>
      </div>
      <button className="drcf-home-btn" onClick={onDrCF} aria-label="Dr. CF AI Assistant">
        <img src="uploads/CF logo-af21aac8.jpg" alt="Dr. CF" className="drcf-home-img" />
        <span className="drcf-home-pulse"></span>
        <span className="drcf-home-label" style={{ fontSize: "15px", fontWeight: "900" }}>Dr. CF</span>
      </button>
    </div>);
}

function BrandTopBar_unused() {
  return (
    <div className="topbar">
      <button className="icon-btn" aria-label="menu">{Ic.menu()}</button>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <CFLogo size={34} />
        <span style={{ color: '#eafde3', fontSize: 11, fontWeight: 600, letterSpacing: '.04em' }}>Crohn Friends</span>
      </div>
      <button className="icon-btn" aria-label="next">{Ic.arrowR()}</button>
    </div>);
}

/* Title header with back (inner screens) */
function TitleTopBar({ title, onBack }) {
  return (
    <div className="topbar" style={{ fontWeight: '800', textAlign: 'center', lineHeight: '5' }}>
      <div style={{ width: 42 }} />
      <span className="ttl" style={{ fontSize: '26px', lineHeight: '2' }}>{title}</span>
      <div style={{ width: 42 }} />
    </div>);
}

function Toggle({ on, onChange }) {
  return (
    <button className={"toggle" + (on ? " on" : "")} onClick={() => onChange(!on)} role="switch" aria-checked={on}>
      <span className="knob" />
    </button>);
}

/* Adherence line chart */
function LineChart() {
  const pts = [18, 30, 24, 46, 40, 62, 55, 82, 70, 95];
  const ptsR = [10, 16, 28, 22, 38, 33, 50, 44, 60, 68];
  const W = 300,H = 150,max = 100;
  const step = W / (pts.length - 1);
  const coord = (v, i) => [i * step, H - v / max * H];
  const line = pts.map((v, i) => coord(v, i));
  const lineR = ptsR.map((v, i) => coord(v, i));
  const d = "M" + line.map((p) => p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" L");
  const dR = "M" + lineR.map((p) => p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" L");
  const area = d + ` L${W},${H} L0,${H} Z`;
  const areaR = dR + ` L${W},${H} L0,${H} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 150, overflow: 'visible' }}>
      <defs>
        <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#74d64c" stopOpacity=".45" /><stop offset="1" stopColor="#74d64c" stopOpacity="0" /></linearGradient>
        <linearGradient id="fillR" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e0584c" stopOpacity=".4" /><stop offset="1" stopColor="#e0584c" stopOpacity="0" /></linearGradient>
      </defs>
      {[0, 25, 50, 75, 100].map((g) =>
      <line key={g} x1="0" x2={W} y1={H - g / max * H} y2={H - g / max * H} stroke="#d4e0cc" strokeWidth="1" strokeDasharray="3 4" />
      )}
      <path d={areaR} fill="url(#fillR)" />
      <path d={dR} fill="none" stroke="#a8362c" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d={dR} fill="none" stroke="#f08a7e" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" opacity=".5" transform="translate(0,3)" />
      <circle cx={lineR[7][0]} cy={lineR[7][1]} r="4.5" fill="#c0392b" stroke="#fff" strokeWidth="2" />
      <path d={area} fill="url(#fill)" />
      <path d={d} fill="none" stroke="#3f8a3f" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke="#8fe06a" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" opacity=".5" transform="translate(0,3)" />
      <circle cx={line[7][0]} cy={line[7][1]} r="4.5" fill="#3f8a3f" stroke="#fff" strokeWidth="2" />
    </svg>);
}

Object.assign(window, { StatusBar, BrandTopBar, WelcomeBar, UserAvatar, FriendAvatar, ConnectedNow, BestConnectedNow, TitleTopBar, Toggle, LineChart, CF_FRIENDS, CF_BEST_FRIENDS });