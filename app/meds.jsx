/* ===================================================================
   MEDICATION — a genuinely useful, fully interactive medication hub.

   Features invented for this section:
   • Next-dose hero with a LIVE countdown + one-tap "Take now"
   • A real reminder ALARM: doses ring at their time (visual pulse +
     vibration + chime), with Take / Snooze 10 min. Preview button to demo.
   • Today's dose TIMELINE — tap any dose to mark taken / skipped
   • Adherence ring, on-time streak, and a low-stock REFILL alert
   • Per-medication reminder settings — 1× / 2× / 3× daily + custom times
   • "Add medication" form sheet (and edit / delete existing)
   • Everything persists to localStorage so a refresh keeps your state
   =================================================================== */
const { useState: useMS, useEffect: useME, useRef: useMR } = React;

/* ---------- helpers ---------- */
const MED_COLORS = ['c-green', 'c-teal', 'c-amber', 'c-violet', 'c-rose'];
const DEFAULT_TIMES = { 1: ['09:00'], 2: ['09:00', '21:00'], 3: ['08:00', '14:00', '20:00'], 4: ['08:00', '12:00', '16:00', '20:00'], 5: ['08:00', '12:00', '16:00', '20:00', '22:00'], 6: ['07:00', '10:00', '13:00', '16:00', '19:00', '22:00'] };
const SOUNDS = ['Forest chime', 'Soft bell', 'Marimba', 'Birdsong'];

/* medication forms — tablet / capsule / injectable biologic / eye drops */
const MED_FORMS = [
  { key: 'tablet',    label: 'Tablet',    icon: 'pill',    unit: 'tablet',    stockLabel: 'Tablets in stock' },
  { key: 'capsule',   label: 'Capsule',   icon: 'capsule', unit: 'capsule',   stockLabel: 'Capsules in stock' },
  { key: 'injection', label: 'Injection', icon: 'syringe', unit: 'injection', stockLabel: 'Doses (pens) in stock' },
  { key: 'drops',     label: 'Eye drops', icon: 'drop',    unit: 'drop',      stockLabel: 'Drops (ml) remaining' },
];
const formOf = (k) => MED_FORMS.find((f) => f.key === k) || MED_FORMS[0];

/* dosing frequency — daily counts + weekly / fortnightly cadences (great for injectables) */
const FREQ_OPTIONS = [
  { key: '1d', count: 1, period: 'day' },
  { key: '2d', count: 2, period: 'day' },
  { key: '3d', count: 3, period: 'day' },
  { key: '4d', count: 4, period: 'day' },
  { key: '6d', count: 6, period: 'day' },
  { key: '5d', count: 5, period: 'day' },
  { key: '1w', count: 1, period: 'week' },
  { key: '1f', count: 1, period: 'fortnight' },
];
const freqLabel = (count, period) => period === 'week' ? '1× / week' : period === 'fortnight' ? '1× / 15 days' : count + '× daily';
/* translated variant for display */
const freqLabelT = (count, period) => period === 'week' ? tr('1× / week') : period === 'fortnight' ? tr('1× / 15 days') : trf('{n}× daily', { n: count });
const slotCount = (count, period) => period === 'day' ? count : 1;
const dosesPerDay = (count, period) => period === 'week' ? count / 7 : period === 'fortnight' ? count / 15 : count;
const supplyDays = (stock, count, period) => Math.floor(stock / Math.max(0.001, dosesPerDay(count, period)));
const freqKeyOf = (count, period) => (FREQ_OPTIONS.find((o) => o.count === count && o.period === period) || FREQ_OPTIONS[0]).key;

const todayKey = () => new Date().toISOString().slice(0, 10);
const toMin = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
const nowMin = (d = new Date()) => d.getHours() * 60 + d.getMinutes();
function fmt12(t) {
  let [h, m] = t.split(':').map(Number);
  const ap = h < 12 ? 'AM' : 'PM'; h = h % 12 || 12;
  return `${h}:${String(m).padStart(2, '0')} ${ap}`;
}
function countdownStr(mins) {
  if (mins <= 0) return tr('now');
  const h = Math.floor(mins / 60), m = mins % 60;
  if (h >= 24) return trf('in {d}d', { d: Math.round(h / 24) });
  if (h > 0) return trf('in {h}h {m}m', { h, m });
  return trf('in {m} min', { m });
}

const SEED_MEDS = [
  { id: 'm1', name: 'Pentasa',      strength: '500mg',   form: 'tablet',    dose: '2 tablets',       freq: 3, period: 'day',       times: ['08:00','14:00','20:00'],                             food: true,  reminders: true,  stock: 18, sound: 'Forest chime', color: 'c-green' },
  { id: 'm2', name: 'Humira',       strength: '40mg',    form: 'injection', dose: '1 injection',      freq: 1, period: 'fortnight', times: ['09:00'],                                             food: false, reminders: true,  stock: 4,  sound: 'Soft bell',   color: 'c-rose' },
  { id: 'm3', name: 'Azathioprine', strength: '50mg',    form: 'tablet',    dose: '1 tablet',         freq: 1, period: 'day',       times: ['20:30'],                                             food: true,  reminders: true,  stock: 9,  sound: 'Soft bell',   color: 'c-teal' },
  { id: 'm4', name: 'Vitamin D3',   strength: '1000 IU', form: 'capsule',   dose: '1 capsule',        freq: 1, period: 'day',       times: ['09:00'],                                             food: false, reminders: false, stock: 40, sound: 'Marimba',     color: 'c-amber' },
  { id: 'm5', name: 'Predforte',    strength: '1%',      form: 'drops',     dose: '1 drop each eye',  freq: 6, period: 'day',       times: ['07:00','10:00','13:00','16:00','19:00','22:00'],      food: false, reminders: true,  stock: 10, sound: 'Soft bell',   color: 'c-violet' },
];

/* persistence */
function loadMeds() {
  try {
    const r = JSON.parse(localStorage.getItem('cf_meds_v3'));
    if (Array.isArray(r) && r.length) return r.map((m) => ({ form: 'tablet', period: 'day', ...m }));
  } catch (e) {}
  return SEED_MEDS;
}
function loadTaken() {
  try { return JSON.parse(localStorage.getItem('cf_taken_v2')) || {}; } catch (e) { return {}; }
}

/* gentle chime via WebAudio (used on user-initiated preview / take) */
function chime() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext; if (!Ctx) return;
    const ac = new Ctx(); const now = ac.currentTime;
    [660, 880, 1100].forEach((f, i) => {
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = 'sine'; o.frequency.value = f;
      o.connect(g); g.connect(ac.destination);
      const t = now + i * 0.16;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.18, t + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
      o.start(t); o.stop(t + 0.55);
    });
    setTimeout(() => ac.close(), 1200);
  } catch (e) {}
}

/* =================================================================== */
function MedsScreen() {
  const t = useT();
  const [meds, setMeds] = useMS(loadMeds);
  const [taken, setTaken] = useMS(loadTaken);        // { 'YYYY-MM-DD|medId|HH:MM': 'taken'|'skip' }
  const [now, setNow] = useMS(new Date());
  const [sheet, setSheet] = useMS(null);             // { mode:'add'|'edit'|'remind', med }
  const [alarm, setAlarm] = useMS(null);             // { medId, time }
  const ringedRef = useMR({});                       // doseKeys already rung this session

  useME(() => { localStorage.setItem('cf_meds_v3', JSON.stringify(meds)); }, [meds]);
  useME(() => { localStorage.setItem('cf_taken_v2', JSON.stringify(taken)); }, [taken]);

  /* tick every second for the live countdown + alarm checks */
  useME(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const tk = todayKey();
  const keyFor = (medId, time) => `${tk}|${medId}|${time}`;

  /* build today's dose instances, sorted by time */
  const doses = [];
  meds.forEach((m) => m.times.forEach((time) => {
    if (!m.reminders && m.times.length) { /* still list, but won't ring */ }
    doses.push({ med: m, time, key: keyFor(m.id, time) });
  }));
  doses.sort((a, b) => toMin(a.time) - toMin(b.time));

  const statusOf = (d) => {
    const s = taken[d.key];
    if (s === 'taken') return 'done';
    if (s === 'skip') return 'skip';
    return toMin(d.time) < nowMin(now) - 1 ? 'miss' : 'upcoming';
  };

  const upcoming = doses.filter((d) => statusOf(d) === 'upcoming');
  const next = upcoming[0] || null;
  const nextMins = next ? toMin(next.time) - nowMin(now) : null;

  const total = doses.length;
  const doneCount = doses.filter((d) => taken[d.key] === 'taken').length;
  const pct = total ? Math.round((doneCount / total) * 100) : 0;

  /* low-stock: days of supply left */
  const lowMed = meds
    .map((m) => ({ m, days: supplyDays(m.stock, m.freq, m.period) }))
    .filter((x) => x.days <= 6)
    .sort((a, b) => a.days - b.days)[0] || null;

  const streak = (() => { try { return JSON.parse(localStorage.getItem('cf_streak_v2')) || 14; } catch (e) { return 14; } })();

  /* auto-ring when a reminder time arrives */
  useME(() => {
    if (alarm) return;
    const cur = nowMin(now);
    for (const d of doses) {
      if (!d.med.reminders) continue;
      if (taken[d.key]) continue;
      const dm = toMin(d.time);
      if (cur >= dm && cur <= dm + 1 && !ringedRef.current[d.key]) {
        ringedRef.current[d.key] = true;
        ring(d.med.id, d.time);
        break;
      }
    }
  }, [now]); // eslint-disable-line

  /* ---- actions ---- */
  function ring(medId, time) {
    setAlarm({ medId, time });
    try { navigator.vibrate && navigator.vibrate([180, 90, 180]); } catch (e) {}
    chime();
  }
  function markTaken(medId, time) {
    const k = keyFor(medId, time);
    setTaken((t) => ({ ...t, [k]: 'taken' }));
    setMeds((ms) => ms.map((m) => m.id === medId ? { ...m, stock: Math.max(0, m.stock - 1) } : m));
  }
  function markSkip(medId, time) {
    const k = keyFor(medId, time);
    setTaken((t) => ({ ...t, [k]: t[k] === 'skip' ? undefined : 'skip' }));
  }
  function toggleDose(d) {
    const s = statusOf(d);
    if (s === 'done') setTaken((t) => ({ ...t, [d.key]: undefined }));
    else markTaken(d.med.id, d.time);
  }
  function snooze() {
    if (!alarm) return;
    const k = keyFor(alarm.medId, alarm.time);
    delete ringedRef.current[k];
    const target = Date.now() + 10 * 60 * 1000;
    setAlarm(null);
    // schedule re-ring in 10 min (or sooner — demo uses real clock)
    setTimeout(() => { if (!taken[k]) ring(alarm.medId, alarm.time); }, 10 * 60 * 1000);
  }

  function saveMed(data) {
    if (sheet.mode === 'add') {
      const id = 'm' + Date.now();
      setMeds((ms) => [...ms, { ...data, id, color: MED_COLORS[ms.length % MED_COLORS.length] }]);
    } else {
      setMeds((ms) => ms.map((m) => m.id === data.id ? { ...m, ...data } : m));
    }
    setSheet(null);
  }
  function deleteMed(id) { setMeds((ms) => ms.filter((m) => m.id !== id)); setSheet(null); }
  function setReminders(id, on) { setMeds((ms) => ms.map((m) => m.id === id ? { ...m, reminders: on } : m)); }

  const alarmMed = alarm ? meds.find((m) => m.id === alarm.medId) : null;

  return (
    <div className="fade-in">
      <ForestSectionTop title={tr('Medication')} filterId="meds-glow">
        <div style={{ padding: '14px 20px 26px' }}>

          {/* ---------- STAT TILES ---------- */}
          {/* low stock refill banner */}
          {lowMed &&
            <button className="card" onClick={() => setSheet({ mode: 'edit', med: lowMed.m })}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', margin: '14px 0 2px', cursor: 'pointer', border: 'none', textAlign: 'left', background: 'linear-gradient(180deg,#fff6e6,#fdeccd)' }}>
              <span style={{ width: 38, height: 38, borderRadius: 12, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', background: 'radial-gradient(120% 120% at 30% 22%,#f0b24a,#cc8418)' }}>{Ic.refill({ width: 19, height: 19 })}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 13.5, color: '#7a4a08' }}>{trf('Running low on {name}', { name: lowMed.m.name })}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#b07a22' }}>{trf('{stock} left · about {days} days · tap to update', { stock: lowMed.m.stock, days: lowMed.days })}</div>
              </div>
              {Ic.chevR({ width: 18, height: 18, stroke: '#c08a2a' })}
            </button>
          }

          {/* ---------- MY MEDICATIONS ---------- */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '22px 0 10px' }}>
            <span className="eyebrow">{tr('My medications')}</span>
            <button className="btn3d pill" onClick={() => setSheet({ mode: 'add', med: null })}
              style={{ padding: '8px 15px', fontSize: 12.5, gap: 6 }}>{Ic.plus({ width: 16, height: 16 })} {tr('Add')}</button>
          </div>

          {meds.map((m) => {
            const days = supplyDays(m.stock, m.freq, m.period);
            const fm = formOf(m.form);
            return (
              <div className="card" key={m.id} style={{ padding: '15px 16px', marginBottom: 13 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 13 }}>
                  <div className={'med-chip ' + m.color}>{Ic[fm.icon]({ width: 23, height: 23 })}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 16.5, fontWeight: 800, color: 'var(--ink)' }}>{m.name}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--green-600)' }}>{m.strength}</span>
                      {m.form === 'injection' &&
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '2px 8px', borderRadius: 9, fontSize: 10, fontWeight: 700, background: 'linear-gradient(180deg,#fbe4e9,#f6d2da)', color: '#b14258' }}>
                          {Ic.syringe({ width: 10, height: 10 })} {tr('Injection')}
                        </span>}
                    </div>
                    <div className="muted" style={{ fontSize: 12.5, fontWeight: 600, marginTop: 2 }}>
                      {tr(m.dose)} · {freqLabelT(m.freq, m.period)}{m.food ? ' · ' + tr('with food') : ''}
                    </div>
                  </div>
                  <Toggle on={m.reminders} onChange={(v) => setReminders(m.id, v)} />
                </div>

                {/* reminder time chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 13 }}>
                  {m.times.map((t, i) =>
                    <span key={i} className={'tchip' + (m.reminders ? ' on' : '')}>{Ic.clock({ width: 13, height: 13 })}{fmt12(t)}</span>
                  )}
                  <span className="tchip" style={{ background: days <= 6 ? '#fbeccf' : '#fff', color: days <= 6 ? '#a86a14' : 'var(--muted)' }}>
                    {Ic.refill({ width: 13, height: 13 })}{m.stock} {tr('left')}
                  </span>
                </div>

                {/* actions */}
                <div style={{ display: 'flex', gap: 9, marginTop: 13 }}>
                  <button className="btn3d soft pill" onClick={() => setSheet({ mode: 'remind', med: m })}
                    style={{ flex: 1, fontSize: 13, padding: '11px 10px', gap: 7 }}>{Ic.bell({ width: 16, height: 16 })} {tr('Reminders')}</button>
                  <button className="btn3d soft round" onClick={() => setSheet({ mode: 'edit', med: m })}
                    style={{ width: 44, height: 44, flex: 'none', padding: 0 }}>{Ic.edit({ width: 18, height: 18 })}</button>
                </div>
              </div>
            );
          })}

          <p className="muted" style={{ fontSize: 11.5, textAlign: 'center', margin: '6px 8px 0', lineHeight: 1.5 }}>
            {tr('Reminders ring at each scheduled time. Tap a dose to mark it taken.')}
          </p>
        </div>
      </ForestSectionTop>

      {/* ---------- SHEETS ---------- */}
      {sheet && (sheet.mode === 'remind'
        ? <ReminderSheet med={sheet.med} onClose={() => setSheet(null)} onSave={saveMed} />
        : <MedFormSheet mode={sheet.mode} med={sheet.med} onClose={() => setSheet(null)} onSave={saveMed} onDelete={deleteMed} />)}

      {/* ---------- ALARM OVERLAY ---------- */}
      {alarm && alarmMed &&
        <AlarmOverlay med={alarmMed} time={alarm.time}
          onTake={() => { markTaken(alarm.medId, alarm.time); setAlarm(null); }}
          onSnooze={snooze} onDismiss={() => setAlarm(null)} />}
    </div>
  );
}

/* ---------- small bits ---------- */
function SectionLabel({ children }) {
  return <div className="eyebrow" style={{ margin: '20px 0 10px' }}>{children}</div>;
}

function NextDoseHero({ next, nextMins, pct, doneCount, total, onTake, onPreview }) {
  const allDone = total > 0 && doneCount === total;
  const R = 26, C = 2 * Math.PI * R;
  return (
    <div style={{ position: 'relative', borderRadius: 26, overflow: 'hidden', padding: '18px 20px',
      background: 'radial-gradient(130% 120% at 80% 0%, #3f8a3f 0%, #2c6730 55%, #1f4c25 100%)',
      boxShadow: '0 18px 36px -16px rgba(20,55,22,.7), inset 0 1px 1px rgba(255,255,255,.18)' }}>
      <div style={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, borderRadius: '50%', background: 'radial-gradient(circle, rgba(140,255,82,.25), transparent 70%)', pointerEvents: 'none' }} />

      {next ? <>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'rgba(214,245,205,.9)', fontSize: 11.5, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
          {Ic.bellRing({ width: 15, height: 15 })} {tr('Next dose')}
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, marginTop: 8 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', lineHeight: 1.1, letterSpacing: '-.01em' }}>{next.med.name} {next.med.strength}</div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: 'rgba(220,245,210,.82)', marginTop: 4 }}>{tr(next.med.dose)}{next.med.food ? ' · ' + tr('with food') : ''}</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginTop: 11, background: 'rgba(255,255,255,.14)', borderRadius: 13, padding: '6px 12px' }}>
              <span style={{ color: '#bdee9a', display: 'inline-flex' }}>{Ic.clock({ width: 15, height: 15 })}</span>
              <span style={{ fontWeight: 800, color: '#fff', fontSize: 14 }}>{fmt12(next.time)}</span>
              <span style={{ color: '#9fe07a', fontWeight: 700, fontSize: 13 }}>· {countdownStr(nextMins)}</span>
            </div>
          </div>
          {/* adherence ring */}
          <svg width="68" height="68" viewBox="0 0 68 68" style={{ flex: 'none' }}>
            <circle cx="34" cy="34" r={R} fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="6" />
            <circle cx="34" cy="34" r={R} fill="none" stroke="#86ff52" strokeWidth="6" strokeLinecap="round"
              strokeDasharray={C} strokeDashoffset={C * (1 - pct / 100)} transform="rotate(-90 34 34)" style={{ transition: 'stroke-dashoffset .5s ease' }} />
            <text x="34" y="32" textAnchor="middle" fill="#fff" fontSize="15" fontWeight="800" fontFamily="Poppins">{pct}%</text>
            <text x="34" y="44" textAnchor="middle" fill="rgba(220,245,210,.8)" fontSize="8" fontWeight="700" fontFamily="Poppins">{tr('TODAY')}</text>
          </svg>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 15 }}>
          <button className="btn3d pill" onClick={onTake} style={{ flex: 1, padding: '13px', fontSize: 14.5, gap: 8 }}>{Ic.check({ width: 18, height: 18 })} {tr('Take now')}</button>
          <button className="btn3d dark round" onClick={onPreview} title="Preview reminder" style={{ width: 48, height: 48, flex: 'none', padding: 0 }}>{Ic.bellRing({ width: 20, height: 20 })}</button>
        </div>
      </> : <>
        <div style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '6px 0' }}>
          <span style={{ width: 50, height: 50, borderRadius: 16, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,.16)', color: '#bdee9a' }}>{Ic.check({ width: 26, height: 26 })}</span>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{allDone ? tr('All doses taken 🌿') : tr('Nothing scheduled')}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(220,245,210,.82)', marginTop: 3 }}>{allDone ? tr('Great job staying on track today.') : tr('Add a medication to get reminders.')}</div>
          </div>
        </div>
      </>}
    </div>
  );
}

/* ---------- ALARM OVERLAY ---------- */
function AlarmOverlay({ med, time, onTake, onSnooze, onDismiss }) {
  return (
    <div className="alarm-ov">
      <button onClick={onDismiss} aria-label="dismiss" style={{ position: 'absolute', top: 18, right: 18, width: 40, height: 40, borderRadius: '50%', border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,.14)', color: '#eafde3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{Ic.x()}</button>
      <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '.18em', color: 'rgba(214,245,205,.85)' }}>{tr('MEDICATION REMINDER')}</div>
      <div className="alarm-halo">
        <div className="alarm-bell">{Ic.bellRing({ width: 52, height: 52 })}</div>
      </div>
      <div style={{ fontSize: 40, fontWeight: 800, color: '#fff', letterSpacing: '-.02em', lineHeight: 1 }}>{fmt12(time)}</div>
      <div style={{ fontSize: 21, fontWeight: 800, color: '#eafde3', marginTop: 8 }}>{med.name} {med.strength}</div>
      <div style={{ fontSize: 14.5, fontWeight: 600, color: 'rgba(220,245,210,.8)', marginTop: 4 }}>{med.food ? trf('Take {dose} with food & water', { dose: tr(med.dose) }) : trf('Take {dose}', { dose: tr(med.dose) })}</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 280, marginTop: 30 }}>
        <button className="btn3d pill" onClick={onTake} style={{ padding: '16px', fontSize: 16, gap: 9 }}>{Ic.check({ width: 20, height: 20 })} {tr('Mark as taken')}</button>
        <button onClick={onSnooze} style={{ border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700, fontSize: 14.5, color: '#eafde3', background: 'rgba(255,255,255,.13)', borderRadius: 30, padding: '14px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>{Ic.snooze({ width: 18, height: 18 })} {tr('Snooze 10 min')}</button>
      </div>
    </div>
  );
}

/* ---------- frequency picker (daily counts + weekly / fortnightly) ---------- */
function FreqPicker({ count, period, onChange }) {
  const cur = freqKeyOf(count, period);
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {FREQ_OPTIONS.map((o) => {
        const on = o.key === cur;
        return (
          <button key={o.key} onClick={() => onChange(o)} className={'tchip' + (on ? ' on' : '')}
            style={{ cursor: 'pointer', border: 'none', fontFamily: 'inherit', fontSize: 12.5 }}>
            {on ? Ic.check({ width: 13, height: 13 }) : null}{freqLabelT(o.count, o.period)}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- REMINDER SETTINGS SHEET (frequency + times + sound) ---------- */
function ReminderSheet({ med, onClose, onSave }) {
  const [reminders, setReminders] = useMS(med.reminders);
  const [freq, setFreq] = useMS(med.freq);
  const [period, setPeriod] = useMS(med.period || 'day');
  const [times, setTimes] = useMS(med.times.slice());
  const [sound, setSound] = useMS(med.sound || SOUNDS[0]);

  function setFrequency(opt) {
    setFreq(opt.count); setPeriod(opt.period);
    const slots = slotCount(opt.count, opt.period);
    setTimes((cur) => {
      const base = (opt.period === 'day' ? DEFAULT_TIMES[opt.count] : ['09:00']).slice();
      for (let i = 0; i < slots; i++) if (cur[i]) base[i] = cur[i];
      return base;
    });
  }
  function setTimeAt(i, v) { setTimes((cur) => cur.map((t, j) => j === i ? v : t)); }
  const slots = slotCount(freq, period);
  function save() { onSave({ id: med.id, reminders, freq, period, times: times.slice(0, slots), sound }); }

  return (
    <Sheet onClose={onClose} title={tr('Reminders')} subtitle={`${med.name} ${med.strength}`} color={med.color}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', borderRadius: 16, padding: '13px 15px', marginBottom: 16, boxShadow: 'inset 0 0 0 1px rgba(120,150,115,.14)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: reminders ? 'var(--green-600)' : 'var(--muted-2)', display: 'inline-flex' }}>{Ic.bellRing({ width: 20, height: 20 })}</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: 14.5 }}>{period === 'day' ? tr('Daily alarm') : tr('Scheduled alarm')}</div>
            <div className="muted" style={{ fontSize: 12 }}>{reminders ? tr('Ringing at each time below') : tr('Reminders are off')}</div>
          </div>
        </div>
        <Toggle on={reminders} onChange={setReminders} />
      </div>

      <div className="fld">
        <label>{tr('How often?')}</label>
        <FreqPicker count={freq} period={period} onChange={setFrequency} />
      </div>

      <div className="fld">
        <label>{period === 'day' ? tr('Reminder times') : tr('Reminder time')}</label>
        <div className="time-grid">
          {Array.from({ length: slots }).map((_, i) =>
            <div className="tcell" key={i}>
              <label>{period === 'day' ? trf('Dose {i}', { i: i + 1 }) : tr('Time of dose')}</label>
              <input type="time" value={times[i] || (period === 'day' ? DEFAULT_TIMES[freq][i] : '09:00')} onChange={(e) => setTimeAt(i, e.target.value)} />
            </div>
          )}
        </div>
        {period !== 'day' &&
          <p className="muted" style={{ fontSize: 11.5, margin: '8px 3px 0', lineHeight: 1.5 }}>
            {period === 'week' ? tr('Rings once a week at this time.') : tr('Rings once every 15 days at this time.')}
          </p>}
      </div>

      <div className="fld">
        <label>{tr('Alarm sound')}</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {SOUNDS.map((s) => <button key={s} onClick={() => { setSound(s); chime(); }} className={'tchip' + (sound === s ? ' on' : '')} style={{ cursor: 'pointer', border: 'none', fontFamily: 'inherit' }}>{sound === s ? Ic.check({ width: 13, height: 13 }) : Ic.bell({ width: 13, height: 13 })}{tr(s)}</button>)}
        </div>
      </div>

      <button className="btn3d pill" onClick={save} style={{ width: '100%', padding: '15px', fontSize: 15.5, marginTop: 6 }}>{tr('Save reminders')}</button>
    </Sheet>
  );
}

/* ---------- ADD / EDIT MEDICATION FORM ---------- */
function MedFormSheet({ mode, med, onClose, onSave, onDelete }) {
  const editing = mode === 'edit';
  const [name, setName] = useMS(med?.name || '');
  const [strength, setStrength] = useMS(med?.strength || '');
  const [form, setForm] = useMS(med?.form || 'tablet');
  const [dose, setDose] = useMS(med?.dose || '1 tablet');
  const [freq, setFreq] = useMS(med?.freq || 1);
  const [period, setPeriod] = useMS(med?.period || 'day');
  const [times, setTimes] = useMS(med?.times?.slice() || DEFAULT_TIMES[1].slice());
  const [food, setFood] = useMS(med?.food ?? true);
  const [reminders, setReminders] = useMS(med?.reminders ?? true);
  const [stock, setStock] = useMS(med?.stock ?? 30);

  function setFormType(k) {
    setForm(k);
    const f = formOf(k);
    setDose(() => {
      if (k === 'drops') return '1 drop each eye';
      return `1 ${f.unit}`;
    });
    if (k === 'injection' || k === 'drops') setFood(false);
  }
  function setFrequency(opt) {
    setFreq(opt.count); setPeriod(opt.period);
    const slots = slotCount(opt.count, opt.period);
    setTimes((cur) => { const base = (opt.period === 'day' ? DEFAULT_TIMES[opt.count] : ['09:00']).slice(); for (let i = 0; i < slots; i++) if (cur[i]) base[i] = cur[i]; return base; });
  }
  function setTimeAt(i, v) { setTimes((cur) => cur.map((t, j) => j === i ? v : t)); }
  const slots = slotCount(freq, period);
  const fm = formOf(form);
  const valid = name.trim().length > 0;
  function save() {
    if (!valid) return;
    onSave({ id: med?.id, name: name.trim(), strength: strength.trim() || '', form, dose: dose.trim() || `1 ${fm.unit}`, freq, period, times: times.slice(0, slots), food, reminders, stock: Number(stock) || 0, sound: med?.sound || SOUNDS[0] });
  }

  return (
    <Sheet onClose={onClose} title={editing ? tr('Edit medication') : tr('Add medication')} subtitle={editing ? med.name : tr('New entry')} color={med?.color || 'c-green'}>
      <div style={{ display: 'flex', gap: 12 }}>
        <div className="fld" style={{ flex: 2 }}>
          <label>{tr('Name')}</label>
          <input type="text" value={name} autoFocus placeholder="e.g. Pentasa" onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="fld" style={{ flex: 1 }}>
          <label>{tr('Strength')}</label>
          <input type="text" value={strength} placeholder="500mg" onChange={(e) => setStrength(e.target.value)} />
        </div>
      </div>

      <div className="fld">
        <label>{tr('Type')}</label>
        <div className="seg">
          {MED_FORMS.map((f) => <button key={f.key} className={form === f.key ? 'on' : ''} onClick={() => setFormType(f.key)} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>{Ic[f.icon]({ width: 15, height: 15 })}{tr(f.label)}</button>)}
        </div>
      </div>

      <div className="fld">
        <label>{tr('Dose')}</label>
        <input type="text" value={dose} placeholder={`1 ${fm.unit}`} onChange={(e) => setDose(e.target.value)} />
      </div>

      <div className="fld">
        <label>{tr('How often?')}</label>
        <FreqPicker count={freq} period={period} onChange={setFrequency} />
      </div>

      <div className="fld">
        <label>{period === 'day' ? tr('Times') : tr('Time of dose')}</label>
        <div className="time-grid">
          {Array.from({ length: slots }).map((_, i) =>
            <div className="tcell" key={i}>
              <label>{period === 'day' ? trf('Dose {i}', { i: i + 1 }) : tr('Time')}</label>
              <input type="time" value={times[i] || (period === 'day' ? DEFAULT_TIMES[freq][i] : '09:00')} onChange={(e) => setTimeAt(i, e.target.value)} />
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <div className="fld" style={{ flex: 1 }}>
          <label>{tr(fm.stockLabel)}</label>
          <input type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'flex-end', paddingBottom: 2 }}>
          {form !== 'injection' && <RowToggle label={tr('With food')} icon="meal" on={food} onChange={setFood} />}
          <RowToggle label={tr('Reminders')} icon="bell" on={reminders} onChange={setReminders} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        {editing && <button className="btn3d soft round" onClick={() => onDelete(med.id)} title="Delete" style={{ width: 52, height: 52, flex: 'none', padding: 0, color: '#c24f54' }}>{Ic.trash({ width: 20, height: 20 })}</button>}
        <button className="btn3d pill" onClick={save} disabled={!valid} style={{ flex: 1, padding: '15px', fontSize: 15.5, opacity: valid ? 1 : .55 }}>{editing ? tr('Save changes') : tr('Add medication')}</button>
      </div>
    </Sheet>
  );
}

function RowToggle({ label, icon, on, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13.5, fontWeight: 700, color: 'var(--ink-soft)' }}>
        <span style={{ color: on ? 'var(--green-600)' : 'var(--muted-2)', display: 'inline-flex' }}>{Ic[icon]({ width: 17, height: 17 })}</span>{label}
      </span>
      <Toggle on={on} onChange={onChange} />
    </div>
  );
}

/* ---------- generic bottom sheet shell ---------- */
function Sheet({ title, subtitle, color = 'c-green', children, onClose }) {
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-grab" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <div className={'med-chip ' + color} style={{ width: 44, height: 44, borderRadius: 14 }}>{Ic.pill({ width: 21, height: 21 })}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 19, fontWeight: 800, color: 'var(--ink)', letterSpacing: '-.01em' }}>{title}</div>
            {subtitle && <div className="muted" style={{ fontSize: 13, fontWeight: 600 }}>{subtitle}</div>}
          </div>
          <button onClick={onClose} aria-label="close" style={{ width: 40, height: 40, borderRadius: '50%', border: 'none', cursor: 'pointer', flex: 'none', background: '#e7eee0', color: 'var(--ink-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{Ic.x({ width: 18, height: 18 })}</button>
        </div>
        {children}
      </div>
    </div>
  );
}

Object.assign(window, { MedsScreen, CF_loadMeds: loadMeds, CF_freqLabel: freqLabel });
