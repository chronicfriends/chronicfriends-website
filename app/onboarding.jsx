/* ===================================================================
   ONBOARDING — a friendly, 5-step setup for new patients.

   0  Welcome      — what Crohn Friends is
   1  About you    — name + avatar colour      → CFProfile
   2  Your details — weight/height/age/years   → cf-profile (insights)
   3  Getting to know you — current status + goals → cf_onboard_v1
   4  What's inside — quick feature tour
   5  First entry  — pain / energy / mindset   → cf-checkins (today)
   6  Done         — enter the app
   =================================================================== */
const { useState: useOb } = React;

const OB_TOTAL = 5; /* numbered steps (1..5) shown in the progress bar */

function obSaveDetails(d) {
  try { localStorage.setItem('cf-profile', JSON.stringify(d)); } catch (e) {}
}
function obSaveAnswers(a) {
  try { localStorage.setItem('cf_onboard_v1', JSON.stringify(a)); } catch (e) {}
}
function obSaveFirstEntry(pain, energy, mindset) {
  try {
    const today = (window.CF_TODAY) || new Date().toISOString().slice(0, 10);
    const seed = (window.SEED) || {};
    let store = null;
    try { store = JSON.parse(localStorage.getItem('cf-checkins') || 'null'); } catch (e) {}
    if (!store || !Object.keys(store).length) store = { ...seed };
    const base = (window.CF_DEFAULTS) ? { ...CF_DEFAULTS } : {};
    store[today] = { ...base, ...(store[today] || {}), pain, energy, mindset, _checkedIn: true };
    localStorage.setItem('cf-checkins', JSON.stringify(store));
  } catch (e) {}
}

/* ---------- small pieces ---------- */
function ObScale({ value, onChange, lo, hi }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {Array.from({ length: 11 }).map((_, i) => {
        const on = i <= value, t = i / 10;
        const mix = (a, b) => Math.round(a + (b - a) * t);
        const fill = `rgb(${mix(lo[0], hi[0])},${mix(lo[1], hi[1])},${mix(lo[2], hi[2])})`;
        return (
          <button key={i} onClick={() => onChange(i)}
            style={{ flex: 1, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 11, fontWeight: 700,
              background: on ? fill : '#e8eee1', color: on ? (t > 0.42 ? '#fff' : '#5a4a3a') : 'var(--muted-2)',
              boxShadow: on ? 'inset 0 2px 3px rgba(0,0,0,.12)' : 'inset 0 1px 2px rgba(90,110,85,.18)', transition: 'background .15s ease' }}>{i}</button>);
      })}
    </div>);
}

function ObChoice({ on, children, onClick, center }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: center ? 'center' : 'left',
      justifyContent: center ? 'center' : 'flex-start',
      padding: '13px 15px', borderRadius: 16, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
      fontSize: 13.5, fontWeight: 700, color: on ? 'var(--green-700)' : 'var(--ink-soft)',
      background: on ? 'linear-gradient(180deg,#eaf7e1,#dff0d2)' : '#fff',
      boxShadow: on ? '0 6px 14px -6px rgba(58,140,45,.35), inset 0 0 0 1.5px rgba(86,184,63,.45)' : 'inset 0 0 0 1.5px rgba(120,150,115,.18), 0 4px 10px -6px rgba(30,60,30,.18)',
      transition: 'all .15s ease' }}>
      <span style={{ width: 20, height: 20, borderRadius: '50%', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: on ? 'linear-gradient(180deg,#7bd853,#54b035)' : '#eef2ea', color: '#fff',
        boxShadow: on ? '0 3px 7px rgba(58,140,45,.4)' : 'inset 0 0 0 1.5px rgba(120,150,115,.3)' }}>{on ? Ic.check({ width: 12, height: 12 }) : null}</span>
      <span style={{ flex: center ? 'none' : 1 }}>{children}</span>
    </button>);
}

function ObTourRow({ icon, title, line }) {
  return (
    <div className="card-solid" style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '14px 15px' }}>
      <div className="badge-ic">{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 800, fontSize: 14.5, color: 'var(--ink)' }}>{title}</div>
        <div className="muted" style={{ fontSize: 11.5, fontWeight: 600, lineHeight: 1.4, marginTop: 2 }}>{line}</div>
      </div>
    </div>);
}

/* one feature page of the tour */
function ObTourPage({ grad, icon, title, line, bullets }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: 6 }}>
      <div style={{ width: 86, height: 86, borderRadius: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
        background: `radial-gradient(120% 120% at 30% 25%, ${grad[0]}, ${grad[1]})`,
        boxShadow: '0 18px 36px -14px rgba(30,60,30,.5), inset 0 2px 2px rgba(255,255,255,.4), inset 0 -5px 9px rgba(0,0,0,.18)' }}>
        {icon({ width: 40, height: 40 })}
      </div>
      <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--ink)', letterSpacing: '-.01em', marginTop: 16, lineHeight: 1.25 }}>{title}</div>
      <div className="muted" style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.55, margin: '8px 0 18px', maxWidth: 300 }}>{line}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9, width: '100%' }}>
        {bullets.map((b, i) =>
          <div key={i} className="card-solid" style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '12px 15px', textAlign: 'left' }}>
            <span style={{ width: 24, height: 24, borderRadius: '50%', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
              background: `linear-gradient(180deg, ${grad[0]}, ${grad[1]})`, boxShadow: '0 3px 7px -2px rgba(30,60,30,.4)' }}>{Ic.check({ width: 13, height: 13 })}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-soft)' }}>{b}</span>
          </div>)}
      </div>
    </div>);
}

/* ---------- the flow ---------- */
function OnboardingFlow() {
  const t = useT();
  const [step, setStep] = useOb(0);
  const [tourIdx, setTourIdx] = useOb(0);
  /* step 1 */
  const [name, setName] = useOb('');
  const [color, setColor] = useOb(CF_AVATAR_COLORS[0]);
  /* step 2 */
  const [weight, setWeight] = useOb('');
  const [height, setHeight] = useOb('');
  const [age, setAge] = useOb('');
  const [years, setYears] = useOb('');
  /* step 3 */
  const [status, setStatus] = useOb(null);
  const [goals, setGoals] = useOb([]);
  /* step 5 */
  const [pain, setPain] = useOb(2);
  const [energy, setEnergy] = useOb(6);
  const [mindset, setMindset] = useOb('Positive');
  /* step 6 — plan */
  const [trial, setTrial] = useOb(true);

  const firstName = (name.trim() || 'friend').split(/\s+/)[0];
  const STATUSES = ['In remission', 'Mild symptoms', 'Active flare', 'Just diagnosed'];
  const GOALS = ['Track symptoms & food', 'Stay on top of meds', 'Understand my triggers', 'Meet people like me', 'Talk to verified doctors'];
  const MINDSETS = ['Fighter', 'Positive', 'Balanced', 'Negative', 'Depressed'];
  const toggleGoal = (g) => setGoals((cur) => cur.includes(g) ? cur.filter((x) => x !== g) : [...cur, g]);

  /* feature tour pages (step 4) */
  const TOUR = [
    { grad: ['#7bd853', '#3f8a3f'], icon: Ic.cal, title: tr('Journal & daily check-in'), line: tr('Log your day in seconds — pain, energy, sleep, habits — and watch patterns appear in your charts.'), bullets: [tr('Coloured calendar of your days'), tr('Charts for every parameter'), tr('PDF report for your doctor')] },
    { grad: ['#f0b765', '#d98a26'], icon: Ic.cam, title: tr('Food scan'), line: tr('Snap your plate — we estimate portion, calories and nutrients, then forget the photo.'), bullets: [tr('Calories & nutrients in seconds'), tr('Gut-friendliness tags'), tr('Photos are never stored')] },
    { grad: ['#4fd0c4', '#1fa596'], icon: Ic.pill, title: tr('Medication'), line: tr('Reminders that ring, refill alerts and adherence tracking.'), bullets: [tr('Alarms with snooze'), tr('Low-stock refill alerts'), tr('Adherence streaks')] },
    { grad: ['#62b5f0', '#2f7fd4'], icon: Ic.users, title: tr('Community & chats'), line: tr('Share experiences, comment on posts and chat 1-to-1 with people who truly get it.'), bullets: [tr('Posts by patients & doctors'), tr('Private chats with other CFs'), tr('Your posts are saved forever')] },
    { grad: ['#b09cf0', '#7556d0'], icon: Ic.doc, title: tr('Doctors & appointments'), line: tr('Browse license-verified specialists, chat with them and request appointments — right from the app.'), bullets: [tr('12 specialties, from GI to mind'), tr('Identity & license verified'), tr('Request appointments in two taps')] },
    { grad: ['#88d96a', '#2e7d36'], icon: Ic.chat, title: tr('Dr. CF — your AI companion'), line: tr('Dr. CF reads your journal and medication and answers with insights about YOUR life — not generic advice.'), bullets: [tr('Knows your whole history'), tr('Spots lifestyle patterns'), tr('Available 24/7, in your language')] },
  ];

  const canNext = { 0: true, 1: name.trim().length > 0, 2: true, 3: !!status, 4: true, 5: true }[step];

  function next() {
    if (!canNext) return;
    if (step === 1) { try { CFProfile.update({ name: name.trim(), avatarColor: color, avatarPhoto: null }); } catch (e) {} }
    if (step === 2) {
      obSaveDetails({
        weight: Number(weight) || 68, height: Number(height) || 175,
        age: Number(age) || 29, crohnYears: Number(years) || 1 });
    }
    if (step === 3) obSaveAnswers({ status, goals });
    if (step === 4 && tourIdx < TOUR.length - 1) { setTourIdx(tourIdx + 1); return; }
    if (step === 5) obSaveFirstEntry(pain, energy, mindset);
    setStep(step + 1);
  }
  function back() {
    if (step === 4 && tourIdx > 0) { setTourIdx(tourIdx - 1); return; }
    setStep(step - 1);
  }
  function choosePlan() {
    try { localStorage.setItem('cf_plan_v1', JSON.stringify({ plan: 'yearly', priceUSD: 59.99, trial, trialDays: trial ? 14 : 0, startedTs: Date.now() })); } catch (e) {}
    setStep(7);
  }
  function finish() { CFAuth.setOnboarded(true); }

  /* numbered step (1..5) for the progress header */
  const num = Math.min(step, OB_TOTAL);

  /* ---------- welcome ---------- */
  if (step === 0) return (
    <div className="screen-scroll" style={{ background: LOGIN_BG, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: '40px 30px 20px', textAlign: 'center' }}>
        <CFLogoTile size={84} />
        <div style={{ marginTop: 6 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'rgba(214,245,205,.8)' }}>{tr('Welcome to')}</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-.02em', lineHeight: 1.15 }}>Crohn Friends</div>
        </div>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: 'rgba(223,240,212,.9)', lineHeight: 1.55, maxWidth: 290 }}>
          {tr("A safe place to track your health, understand your triggers and never feel alone with Crohn's.")}
        </div>
      </div>
      <div style={{ padding: '10px 24px 36px', display: 'flex', flexDirection: 'column', gap: 11 }}>
        <button className="btn3d pill" onClick={next} style={{ width: '100%', padding: '16px', fontSize: 16, fontWeight: 700, gap: 9 }}>
          {Ic.leaf({ width: 19, height: 19 })} {tr("Let's get to know you")}
        </button>
        <div style={{ textAlign: 'center', fontSize: 12, fontWeight: 600, color: 'rgba(214,245,205,.7)' }}>{tr('About a minute · 5 quick steps')}</div>
      </div>
    </div>);

  /* ---------- done ---------- */
  if (step === 7) return (
    <div className="screen-scroll" style={{ background: LOGIN_BG, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '40px 30px 20px', textAlign: 'center' }}>
        <div style={{ width: 76, height: 76, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
          background: 'radial-gradient(120% 120% at 30% 25%,#7bd853,#3f8a3f)', boxShadow: '0 16px 34px rgba(10,40,10,.55), inset 0 2px 2px rgba(255,255,255,.4)' }}>
          {Ic.check({ width: 36, height: 36 })}
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: '-.02em' }}>{trf("{name}, you're all set!", { name: firstName })} 🌿</div>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: 'rgba(223,240,212,.9)', lineHeight: 1.5, maxWidth: 270 }}>{tr('Your journal is live and your forest awaits.')}</div>
      </div>
      <div style={{ padding: '10px 24px 36px' }}>
        <button className="btn3d pill" onClick={finish} style={{ width: '100%', padding: '16px', fontSize: 16, fontWeight: 700, gap: 9 }}>
          {Ic.arrowR({ width: 19, height: 19 })} {tr('Enter Crohn Friends')}
        </button>
      </div>
    </div>);

  /* ---------- choose your plan (patients only — doctors never see onboarding) ---------- */
  if (step === 6) return (
    <div className="screen-scroll" style={{ background: LOGIN_BG, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '44px 26px 18px', textAlign: 'center' }}>
        <div style={{ width: 52, height: 52, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', background: 'rgba(255,255,255,.16)', boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,.25)' }}>{Ic.spark({ width: 26, height: 26 })}</div>
        <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: '-.02em', marginTop: 4 }}>{tr('Choose your plan')}</div>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: 'rgba(214,245,205,.85)' }}>{tr('Start free. Cancel anytime.')}</div>
      </div>

      <div style={{ flex: '1 0 auto', background: 'var(--card)', borderRadius: '30px 30px 0 0', padding: '20px 20px 28px', boxShadow: '0 -16px 34px -18px rgba(8,30,8,.65)', display: 'flex', flexDirection: 'column', gap: 13 }}>
        {/* free trial switch */}
        <div className="card-solid" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 15px' }}>
          <div className="badge-ic lite" style={{ width: 40, height: 40, borderRadius: 14 }}>{Ic.spark({ width: 19, height: 19 })}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: 14.5, color: 'var(--ink)' }}>{tr('Free trial enabled')}</div>
            <div className="muted" style={{ fontSize: 11.5, fontWeight: 600, marginTop: 1 }}>{tr('14 days of full access — no payment today')}</div>
          </div>
          <Toggle on={trial} onChange={setTrial} />
        </div>

        {/* yearly plan card */}
        <div style={{ position: 'relative', background: '#fff', borderRadius: 22, padding: '17px 17px 15px', boxShadow: '0 14px 30px -14px rgba(30,60,30,.35), inset 0 0 0 2px var(--green-450)' }}>
          <div style={{ position: 'absolute', top: -9, right: 16, fontSize: 9.5, fontWeight: 800, letterSpacing: '.1em', whiteSpace: 'nowrap', color: '#fff', padding: '4px 11px', borderRadius: 12, background: 'linear-gradient(180deg,#7bd853,#3f8a3f)', boxShadow: '0 5px 11px rgba(58,140,45,.4)' }}>{tr('BEST VALUE')}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--green-600)' }}>{tr('Yearly plan')}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 3 }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: 'var(--ink)', letterSpacing: '-.02em', lineHeight: 1 }}>59,99 US$</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--muted)' }}>{tr('/ year')}</span>
              </div>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--green-700)', marginTop: 4 }}>{tr("that's just 5 US$ / month")} 🌿</div>
            </div>
            <span style={{ width: 26, height: 26, borderRadius: '50%', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', background: 'linear-gradient(180deg,#7bd853,#54b035)', boxShadow: '0 4px 9px rgba(58,140,45,.4)' }}>{Ic.check({ width: 14, height: 14 })}</span>
          </div>
          <div className="muted" style={{ fontSize: 11.5, fontWeight: 600, lineHeight: 1.45, marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(120,140,115,.16)' }}>{tr('Everything unlocked: journal, food scan, doctors, Dr. CF and more.')}</div>
        </div>

        {/* trial timeline */}
        {trial &&
        <div className="card-solid" style={{ padding: '15px 17px 13px' }}>
          {[[Ic.lock, tr('Today'), tr('Full access to everything, free'), true],
            [Ic.bell, tr('Day 12'), tr('We remind you before any charge'), false],
            [Ic.star, tr('Day 14'), tr('59,99 US$ / year — cancel anytime in Settings'), false]].map(([icon, when, what, on], i, arr) =>
            <div key={i} style={{ display: 'flex', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 'none' }}>
                <span style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: on ? '#fff' : 'var(--green-600)',
                  background: on ? 'linear-gradient(180deg,#7bd853,#54b035)' : 'var(--mint-50)', boxShadow: on ? '0 4px 9px rgba(58,140,45,.4)' : 'inset 0 0 0 1.5px rgba(86,184,63,.35)' }}>{icon({ width: 14, height: 14 })}</span>
                {i < arr.length - 1 && <span style={{ width: 2.5, flex: 1, minHeight: 14, margin: '3px 0', borderRadius: 2, background: 'linear-gradient(180deg, rgba(86,184,63,.45), rgba(86,184,63,.15))' }}></span>}
              </div>
              <div style={{ paddingBottom: i < arr.length - 1 ? 14 : 0 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--ink)' }}>{when}</div>
                <div className="muted" style={{ fontSize: 11.5, fontWeight: 600, marginTop: 1, lineHeight: 1.4 }}>{what}</div>
              </div>
            </div>)}
        </div>}

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 9, paddingTop: 4 }}>
          <button className="btn3d pill" onClick={choosePlan} style={{ width: '100%', padding: '16px', fontSize: 15.5, fontWeight: 700, gap: 9 }}>
            {Ic.leaf({ width: 18, height: 18 })} {trial ? tr('Start 14-day free trial') : tr('Subscribe now · 59,99 US$ / year')}
          </button>
          {trial && <div style={{ textAlign: 'center', fontSize: 11.5, fontWeight: 600, color: 'var(--muted-2)' }}>{tr('No payment due today · Cancel anytime')}</div>}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginTop: 2 }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 11.5, fontWeight: 700, color: 'var(--muted-2)' }}>{tr('Restore purchase')}</button>
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--muted-2)' }}></span>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 11.5, fontWeight: 700, color: 'var(--muted-2)' }}>{t('terms')}</button>
          </div>
        </div>
      </div>
    </div>);

  /* ---------- numbered steps 1..5 ---------- */
  return (
    <div className="screen-scroll" style={{ background: 'var(--card)', display: 'flex', flexDirection: 'column' }}>
      {/* progress header */}
      <div style={{ padding: '36px 20px 14px', background: LOGIN_BG, borderRadius: '0 0 26px 26px', boxShadow: '0 12px 26px -16px rgba(8,30,8,.6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={back} aria-label="back" style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', cursor: 'pointer', flex: 'none', background: 'rgba(255,255,255,.16)', color: '#eafde3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{Ic.back({ width: 18, height: 18 })}</button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(214,245,205,.85)' }}>{trf('Step {a} of {b}', { a: num, b: OB_TOTAL })}</div>
            <div style={{ display: 'flex', gap: 5, marginTop: 7 }}>
              {Array.from({ length: OB_TOTAL }).map((_, i) =>
                <span key={i} style={{ flex: 1, height: 5, borderRadius: 4, background: i < num ? 'linear-gradient(90deg,#9fe07a,#74d64c)' : 'rgba(255,255,255,.22)', transition: 'background .25s ease' }}></span>)}
            </div>
          </div>
          <CFLogoTile size={36} />
        </div>
      </div>

      <div style={{ flex: 1, padding: '20px 20px 10px' }}>
        {step === 1 && <div>
          <div className="h-screen" style={{ fontSize: 22 }}>{tr('First, about you')} 👋</div>
          <div className="muted" style={{ fontSize: 13, fontWeight: 600, margin: '4px 0 18px' }}>{tr('What should we call you?')}</div>
          <div className="card-solid" style={{ padding: '18px 17px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <div style={{ width: 54, height: 54, borderRadius: '50%', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, color: '#fff', background: `radial-gradient(120% 120% at 32% 26%, ${color}, ${color})`, boxShadow: '0 8px 18px -6px rgba(30,60,30,.45), inset 0 2px 2px rgba(255,255,255,.35)' }}>
                {(name.trim() || 'CF').slice(0, 1).toUpperCase()}
              </div>
              <div className="fld" style={{ flex: 1, marginBottom: 0 }}>
                <label>{tr('Your name')}</label>
                <input type="text" value={name} autoFocus maxLength={40} placeholder="Gerard" onChange={(e) => setName(e.target.value)} />
              </div>
            </div>
            <div className="eyebrow" style={{ marginBottom: 10 }}>{tr('Choose a colour')}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 11 }}>
              {CF_AVATAR_COLORS.map((c) =>
                <button key={c} onClick={() => setColor(c)} aria-label={c} style={{ width: 38, height: 38, borderRadius: '50%', border: 'none', cursor: 'pointer', background: c,
                  boxShadow: color === c ? '0 0 0 3px #fff, 0 0 0 6px ' + c : 'inset 0 -3px 6px rgba(0,0,0,.18)', transition: 'box-shadow .15s ease' }}></button>)}
            </div>
          </div>
        </div>}

        {step === 2 && <div>
          <div className="h-screen" style={{ fontSize: 22 }}>{tr('Your details')}</div>
          <div className="muted" style={{ fontSize: 13, fontWeight: 600, margin: '4px 0 18px' }}>{tr('These personalise your insights and reports.')}</div>
          <div className="card-solid" style={{ padding: '18px 17px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 13 }}>
              {[[tr('Weight'), 'kg', weight, setWeight, '68'], [tr('Height'), 'cm', height, setHeight, '175'], [tr('Age'), tr('years'), age, setAge, '29'], [tr('Years with Crohn'), tr('years'), years, setYears, '6']].map(([lab, unit, val, set, ph], i) =>
                <div className="fld" key={i} style={{ marginBottom: 0 }}>
                  <label>{lab} <span style={{ color: 'var(--muted-2)', fontWeight: 600 }}>({unit})</span></label>
                  <input type="number" inputMode="numeric" value={val} placeholder={ph} onChange={(e) => set(e.target.value)} />
                </div>)}
            </div>
          </div>
        </div>}

        {step === 3 && <div>
          <div className="h-screen" style={{ fontSize: 22 }}>{tr('How are things right now?')}</div>
          <div className="muted" style={{ fontSize: 13, fontWeight: 600, margin: '4px 0 16px' }}>{tr('This helps us tune your daily check-in.')}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {STATUSES.map((s) => <ObChoice key={s} on={status === s} onClick={() => setStatus(s)}>{tr(s)}</ObChoice>)}
          </div>
          <div style={{ marginTop: 22 }}>
            <div style={{ fontSize: 16.5, fontWeight: 800, color: 'var(--ink)', letterSpacing: '-.01em' }}>{tr('What matters most to you?')}</div>
            <div className="muted" style={{ fontSize: 12, fontWeight: 600, margin: '3px 0 12px' }}>{tr('Pick as many as you like')}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {GOALS.map((g) => <ObChoice key={g} on={goals.includes(g)} onClick={() => toggleGoal(g)}>{tr(g)}</ObChoice>)}
            </div>
          </div>
        </div>}

        {step === 4 && <div>
          <div style={{ textAlign: 'center', marginBottom: 4 }}>
            <div className="h-screen" style={{ fontSize: 22 }}>{tr("What's inside")} 🌿</div>
            <div className="muted" style={{ fontSize: 13, fontWeight: 600, margin: '4px 0 14px' }}>{tr('Swipe through what you get')}</div>
          </div>
          <ObTourPage {...TOUR[tourIdx]} />
          {/* tour pager dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 16 }}>
            {TOUR.map((_, i) =>
              <button key={i} onClick={() => setTourIdx(i)} aria-label={'page ' + (i + 1)} style={{ width: i === tourIdx ? 22 : 8, height: 8, borderRadius: 5, border: 'none', cursor: 'pointer', padding: 0,
                background: i === tourIdx ? 'linear-gradient(90deg,#7bd853,#54b035)' : '#cfdcc6', transition: 'all .2s ease' }}></button>)}
          </div>
        </div>}

        {step === 5 && <div>
          <div className="h-screen" style={{ fontSize: 22 }}>{tr('Your first journal entry')} ✨</div>
          <div className="muted" style={{ fontSize: 13, fontWeight: 600, margin: '4px 0 16px' }}>{tr('How do you feel right now?')}</div>
          <div className="card-solid" style={{ padding: '18px 17px', display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 7, fontWeight: 700, fontSize: 13.5 }}><span style={{ color: '#d6584a', display: 'flex' }}>{Ic.flame({ width: 16, height: 16 })}</span>{tr('Pain Level')}</span>
                <span style={{ fontWeight: 800, fontSize: 15, color: '#c0392b' }}>{pain}</span>
              </div>
              <ObScale value={pain} onChange={setPain} lo={[246, 202, 191]} hi={[168, 54, 44]} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 7, fontWeight: 700, fontSize: 13.5 }}><span style={{ color: '#2f7a35', display: 'flex' }}>{Ic.bolt({ width: 16, height: 16 })}</span>{tr('Energy Level')}</span>
                <span style={{ fontWeight: 800, fontSize: 15, color: '#2f7a35' }}>{energy}</span>
              </div>
              <ObScale value={energy} onChange={setEnergy} lo={[205, 234, 178]} hi={[47, 122, 53]} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 9, display: 'flex', alignItems: 'center', gap: 7 }}><span style={{ color: '#8466d6', display: 'flex' }}>{Ic.mind({ width: 16, height: 16 })}</span>{tr('Your mindset?')}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {MINDSETS.map((m) =>
                  <button key={m} onClick={() => setMindset(m)} className={'tchip' + (mindset === m ? ' on' : '')} style={{ cursor: 'pointer', border: 'none', fontFamily: 'inherit' }}>
                    {mindset === m ? Ic.check({ width: 12, height: 12 }) : null}{tx(m)}
                  </button>)}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 14, fontSize: 11.5, fontWeight: 600, color: 'var(--muted-2)' }}>
            {Ic.check({ width: 13, height: 13 })} {tr('saved automatically')}
          </div>
        </div>}
      </div>

      {/* footer actions */}
      <div style={{ padding: '12px 20px 26px', display: 'flex', flexDirection: 'column', gap: 9 }}>
        <button className="btn3d pill" onClick={next} disabled={!canNext}
          style={{ width: '100%', padding: '15px', fontSize: 15.5, fontWeight: 700, gap: 9, opacity: canNext ? 1 : .55 }}>
          {step === 5 ? <React.Fragment>{Ic.check({ width: 18, height: 18 })} {tr('Save my first entry')}</React.Fragment> : <React.Fragment>{tr('Continue')} {Ic.arrowR({ width: 18, height: 18 })}</React.Fragment>}
        </button>
        {(step === 4 || step === 5) &&
          <button onClick={() => setStep(6)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12.5, fontWeight: 700, color: 'var(--muted-2)' }}>{tr('Skip for now')}</button>}
      </div>
    </div>);
}

Object.assign(window, { OnboardingFlow });
