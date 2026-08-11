/* ===== Doctor appointments — request a slot, notify the doctor, await reply =====
   Flow: pick an available day + time → review → send. Sending "notifies" the
   doctor in-app (verified-doctor dashboard) and by email, and opens a 48-hour
   reply window in which the doctor confirms or proposes a new time. Requests
   persist per doctor in localStorage so the card and sheet show live status. */
const { useState: useAS } = React;

const CF_APPT_KEY = 'cf-appointments';
function cfLoadAppts() { try { return JSON.parse(localStorage.getItem(CF_APPT_KEY) || '{}') || {}; } catch (e) { return {}; } }
function cfSaveAppts(a) { try { localStorage.setItem(CF_APPT_KEY, JSON.stringify(a)); } catch (e) {} }

const APPT_PATIENT = 'Gerard';

/* small mail glyph (no equivalent in the Ic set) */
const MailGlyph = (p) => (<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M4 7.5l8 5.5 8-5.5"/></svg>);

function cfDocLastName(doc) { return (doc && doc.name || '').replace(/^Dr\.?\s+/i, '').trim().split(/\s+/).pop(); }

/* deterministic string hash → 0..1, so a doctor's day looks consistently booked */
function cfHash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return ((h >>> 0) % 1000) / 1000;
}

/* available time slots for a doctor on a given date (future + working weekday, minus "booked") */
function cfSlotsFor(doc, dateStr) {
  if (!doc) return [];
  const d = new Date(dateStr + 'T00:00:00');
  const today = new Date(); today.setHours(0, 0, 0, 0);
  if (d < today) return [];
  const dow = d.getDay();
  if (!(doc.days || [1, 2, 3, 4, 5]).includes(dow)) return [];
  const base = doc.slots || ['09:00', '09:30', '10:00', '11:00', '13:30', '14:00', '15:00', '16:30'];
  return base.filter((s) => cfHash(doc.seed + dateStr + s) > 0.4);
}

function cfFmtApptDate(dateStr) { return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }); }
function cfFmtApptShort(dateStr) { return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }); }
function cf12h(t) {
  const [h, m] = t.split(':').map(Number);
  const ap = h < 12 ? 'AM' : 'PM'; const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}:${String(m).padStart(2, '0')} ${ap}`;
}
function cfDeadline(ts) { return new Date(ts + 48 * 3600 * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }); }

/* ---------- availability calendar (green theme) ---------- */
function ApptCalendar({ doctor, selected, onSelect }) {
  const now = new Date();
  const [viewYear, setViewYear] = useAS(now.getFullYear());
  const [viewMonth, setViewMonth] = useAS(now.getMonth() + 1);
  const dow = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
  const nowIdx = now.getFullYear() * 12 + now.getMonth();
  const viewIdx = viewYear * 12 + (viewMonth - 1);
  const canBack = viewIdx > nowIdx;
  const canFwd = viewIdx < nowIdx + 2;
  const goBack = () => { if (!canBack) return; if (viewMonth === 1) { setViewYear((y) => y - 1); setViewMonth(12); } else setViewMonth((m) => m - 1); };
  const goFwd = () => { if (!canFwd) return; if (viewMonth === 12) { setViewYear((y) => y + 1); setViewMonth(1); } else setViewMonth((m) => m + 1); };
  const daysInMonth = new Date(viewYear, viewMonth, 0).getDate();
  const firstDow = new Date(viewYear, viewMonth - 1, 1).getDay();
  const monthLabel = new Date(viewYear, viewMonth - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const dk = (d) => `${viewYear}-${String(viewMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const todayStr = new Date().toISOString().slice(0, 10);
  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push({ blank: true });
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
          if (c.blank) return <span key={i} style={{ height: 40 }} />;
          const dateKey = dk(c.n);
          const avail = cfSlotsFor(doctor, dateKey).length > 0;
          const isSel = dateKey === selected;
          const isToday = dateKey === todayStr;
          let style = { height: 40, borderRadius: 12, border: 'none', cursor: avail ? 'pointer' : 'default', fontFamily: 'inherit', fontSize: 13.5, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', color: avail ? 'var(--green-700)' : 'var(--muted-2)', opacity: avail ? 1 : .4 };
          if (avail && !isSel) { style.background = 'linear-gradient(180deg,#eaf7e1,#dcefce)'; }
          if (isToday && !isSel) { style.boxShadow = 'inset 0 0 0 2px var(--green-450)'; }
          if (isSel) { style = { ...style, color: '#fff', background: 'radial-gradient(120% 120% at 32% 26%,#56b83f,#2c6230)', boxShadow: '0 6px 12px rgba(40,95,30,.4),inset 0 2px 2px rgba(255,255,255,.4)', opacity: 1 }; }
          return <button key={i} disabled={!avail} onClick={() => avail && onSelect(dateKey)} style={style}>{c.n}</button>;
        })}
      </div>
    </div>);
}

/* ---------- small shared blocks ---------- */
function DoctorMini({ doc }) {
  return (
    <div className="card-solid" style={{ padding: '14px 15px', display: 'flex', alignItems: 'center', gap: 12 }}>
      <div className={'med-chip ' + doc.color} style={{ width: 48, height: 48, borderRadius: '50%', fontSize: 16, fontWeight: 800, flex: 'none' }}>{doc.initials}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--ink)' }}>{doc.name}</div>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--green-600)', marginTop: 1 }}>{doc.spec}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 'none', fontSize: 12.5, fontWeight: 700, color: 'var(--ink-soft)' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#f5a623"><path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.6l1-5.8-4.3-4.1 5.9-.9z"/></svg>{doc.rating}
      </div>
    </div>);
}

function DeliveryRow({ icon, title, sub }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 15, background: '#fff', boxShadow: 'inset 0 0 0 1.5px rgba(120,140,115,.16),0 4px 12px -8px rgba(30,60,30,.2)' }}>
      <span style={{ width: 38, height: 38, borderRadius: 11, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--mint-50)', color: 'var(--green-600)' }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 800, fontSize: 13.5, display: 'flex', alignItems: 'center', gap: 6 }}>{title}<span style={{ display: 'inline-flex', color: '#3f9a3f' }}>{Ic.check({ width: 14, height: 14 })}</span></div>
        <div className="muted" style={{ fontSize: 11.5, fontWeight: 600, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub}</div>
      </div>
    </div>);
}

function ApptTimeline({ steps }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {steps.map((s, i) => {
        const last = i === steps.length - 1;
        const color = s.state === 'done' ? '#3f9a3f' : s.state === 'active' ? '#d98a26' : '#c2cbbd';
        return (
          <div key={i} style={{ display: 'flex', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 'none' }}>
              <span style={{ width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none',
                background: s.state === 'todo' ? '#eef3e8' : `linear-gradient(180deg,${color},${color})`, color: '#fff',
                boxShadow: s.state === 'active' ? '0 0 0 4px rgba(217,138,38,.18)' : 'none' }}>
                {s.state === 'done' ? Ic.check({ width: 14, height: 14 }) : s.state === 'active'
                  ? <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />
                  : <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#c2cbbd' }} />}
              </span>
              {!last && <span style={{ width: 2, flex: 1, minHeight: 24, background: s.state === 'done' ? '#bfe0ad' : '#e2e8db', margin: '2px 0' }} />}
            </div>
            <div style={{ paddingBottom: last ? 0 : 14, marginTop: 2 }}>
              <div style={{ fontWeight: 800, fontSize: 13.5, color: s.state === 'todo' ? 'var(--muted)' : 'var(--ink)' }}>{s.label}</div>
              <div className="muted" style={{ fontSize: 11.5, fontWeight: 600, marginTop: 2 }}>{s.sub}</div>
            </div>
          </div>);
      })}
    </div>);
}

function SentBlock({ doctor, date, time, existing }) {
  const requestedAt = (existing && existing.requestedAt) || Date.now();
  const ln = cfDocLastName(doctor);
  const steps = [
    { label: 'Request sent', sub: 'Just now', state: 'done' },
    { label: 'Awaiting Dr. ' + ln + "'s reply", sub: 'Responds by ' + cfDeadline(requestedAt), state: 'active' },
    { label: 'Appointment confirmed', sub: "You'll be notified", state: 'todo' }];
  return (
    <div>
      <div style={{ textAlign: 'center', padding: '4px 0 8px' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(120% 120% at 32% 26%,#7bd853,#3f8a3f)', boxShadow: '0 12px 26px -8px rgba(60,140,30,.6),inset 0 2px 3px rgba(255,255,255,.5)', color: '#fff' }}>{Ic.check({ width: 36, height: 36 })}</div>
        <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-.01em' }}>Appointment requested</div>
        <div className="muted" style={{ fontSize: 13, marginTop: 4, padding: '0 12px', lineHeight: 1.45 }}>Sent to {doctor.name}. Nothing is booked until they confirm.</div>
      </div>

      <div className="card-solid" style={{ padding: '15px 16px', margin: '14px 0', display: 'flex', alignItems: 'center', gap: 13 }}>
        <div className="badge-ic">{Ic.cal({ width: 22, height: 22 })}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 800, fontSize: 15 }}>{cfFmtApptDate(date)}</div>
          <div className="muted" style={{ fontSize: 12.5, fontWeight: 600, marginTop: 1 }}>{cf12h(time)} · 30 min consultation</div>
        </div>
        <span style={{ flex: 'none', fontSize: 10.5, fontWeight: 800, padding: '5px 11px', borderRadius: 20, background: 'linear-gradient(180deg,#fbe7c6,#f6d8a6)', color: '#9a6712' }}>Pending</span>
      </div>

      <div className="eyebrow" style={{ margin: '2px 2px 10px' }}>We let the doctor know</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 16 }}>
        <DeliveryRow icon={Ic.bellRing({ width: 18, height: 18 })} title="In-app notification" sub={`Dr. ${ln} sees this in their verified-doctor dashboard`} />
        <DeliveryRow icon={MailGlyph({ width: 18, height: 18 })} title="Email sent" sub={doctor.email} />
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '13px 15px', borderRadius: 16, background: 'var(--mint-50)', marginBottom: 18 }}>
        <span style={{ display: 'flex', flex: 'none', color: 'var(--green-600)', marginTop: 1 }}>{Ic.clock({ width: 19, height: 19 })}</span>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--green-700)', lineHeight: 1.45 }}>
          <strong style={{ fontWeight: 800 }}>48-hour reply window.</strong> Dr. {ln} will confirm your time or propose a new one — you'll get a notification either way.
        </div>
      </div>

      <div className="eyebrow" style={{ margin: '2px 2px 12px' }}>What happens next</div>
      <ApptTimeline steps={steps} />
    </div>);
}

/* ---------- the request sheet ---------- */
function AppointmentSheet({ doctor, existing, open, onClose, onSubmit, onChat }) {
  const [phase, setPhase] = useAS('pick'); /* pick | review | sent */
  const [selDate, setSelDate] = useAS('');
  const [selTime, setSelTime] = useAS('');
  React.useEffect(() => {
    if (!open) return;
    if (existing) { setPhase('sent'); setSelDate(existing.date); setSelTime(existing.time); }
    else { setPhase('pick'); setSelDate(''); setSelTime(''); }
  }, [open, doctor && doctor.seed]);
  if (!open || !doctor) return null;

  const ln = cfDocLastName(doctor);
  const slots = selDate ? cfSlotsFor(doctor, selDate) : [];
  const submit = () => {
    const a = { date: selDate, time: selTime, status: 'pending', requestedAt: Date.now(), patient: APPT_PATIENT };
    onSubmit(doctor.seed, a);
    setPhase('sent');
  };

  return (
    <SheetPortal>
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '92%', display: 'flex', flexDirection: 'column' }}>
        <div className="sheet-grab" style={{ flex: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flex: 'none' }}>
          {phase === 'review'
            ? <button className="btn3d soft round" onClick={() => setPhase('pick')} style={{ width: 46, height: 46, flex: 'none' }}>{Ic.back({ width: 20, height: 20 })}</button>
            : <div className="badge-ic">{Ic.cal({ width: 23, height: 23 })}</div>}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-.01em' }}>{phase === 'sent' ? 'Request sent' : phase === 'review' ? 'Review request' : 'Ask for an appointment'}</div>
            <div className="muted" style={{ fontSize: 12.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doctor.name} · {doctor.spec}</div>
          </div>
          <button className="btn3d soft round" onClick={onClose} style={{ width: 38, height: 38, flex: 'none' }}>{Ic.x({ width: 18, height: 18 })}</button>
        </div>

        <div style={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto', margin: '0 -2px', padding: '0 2px 2px' }} className="no-scrollbar">
          {phase === 'pick' &&
          <div>
            <DoctorMini doc={doctor} />
            <div className="eyebrow" style={{ margin: '18px 2px 10px' }}>Pick a day Dr. {ln} is available</div>
            <div className="card-solid" style={{ padding: '16px 16px 18px', marginBottom: 16 }}>
              <ApptCalendar doctor={doctor} selected={selDate} onSelect={(d) => { setSelDate(d); setSelTime(''); }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 14, flexWrap: 'wrap', fontSize: 11.5, fontWeight: 600, color: 'var(--muted)' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 14, height: 14, borderRadius: 5, background: 'linear-gradient(180deg,#eaf7e1,#dcefce)' }} />Available</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 14, height: 14, borderRadius: 5, boxShadow: 'inset 0 0 0 2px var(--green-450)' }} />Today</span>
              </div>
            </div>
            {selDate &&
            <div className="card-solid" style={{ padding: '16px 16px 18px' }}>
              <div className="eyebrow" style={{ marginBottom: 12 }}>Times on {cfFmtApptShort(selDate)}</div>
              {slots.length === 0
                ? <div className="muted" style={{ fontSize: 13, fontWeight: 600, textAlign: 'center', padding: '10px 0' }}>No free slots this day — try another.</div>
                : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                    {slots.map((s) => {
                      const on = s === selTime;
                      return <button key={s} onClick={() => setSelTime(s)} style={{ padding: '12px 6px', borderRadius: 13, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 700,
                        background: on ? 'linear-gradient(180deg,#7bd853,#54b035)' : '#fff', color: on ? '#fff' : 'var(--ink-soft)',
                        boxShadow: on ? '0 5px 11px rgba(60,140,20,.32),inset 0 2px 2px rgba(255,255,255,.45)' : 'inset 0 0 0 1.5px rgba(120,140,115,.28)' }}>{cf12h(s)}</button>;
                    })}
                  </div>}
            </div>}
          </div>}

          {phase === 'review' &&
          <div>
            <DoctorMini doc={doctor} />
            <div className="card-solid" style={{ padding: '16px', marginTop: 14 }}>
              <div className="eyebrow" style={{ marginBottom: 12 }}>Your requested time</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                <div className="badge-ic">{Ic.cal({ width: 22, height: 22 })}</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15.5 }}>{cfFmtApptDate(selDate)}</div>
                  <div className="muted" style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{cf12h(selTime)} · 30 min consultation</div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, padding: '12px 14px', borderRadius: 14, background: 'var(--mint-50)', color: 'var(--green-700)', fontSize: 12.5, fontWeight: 600, lineHeight: 1.45, marginTop: 14 }}>
              <span style={{ display: 'flex', flex: 'none', marginTop: 1, color: 'var(--green-600)' }}>{Ic.info({ width: 17, height: 17 })}</span>
              When you send this, Dr. {ln} gets a notification in the Crohn Friends app and an email. They have 48 hours to confirm or suggest a new time.
            </div>
          </div>}

          {phase === 'sent' &&
            <SentBlock doctor={doctor} date={selDate || (existing && existing.date)} time={selTime || (existing && existing.time)} existing={existing} />}
        </div>

        <div style={{ flex: 'none', paddingTop: 14, marginTop: 6 }}>
          {phase === 'pick' &&
            <button className="btn3d pill" disabled={!selDate || !selTime} onClick={() => setPhase('review')}
              style={{ width: '100%', fontSize: 15.5, fontWeight: 700, padding: '16px', gap: 8, opacity: (selDate && selTime) ? 1 : .5 }}>
              {Ic.arrowR({ width: 18, height: 18 })} Review request
            </button>}
          {phase === 'review' &&
            <button className="btn3d pill" onClick={submit} style={{ width: '100%', fontSize: 15.5, fontWeight: 700, padding: '16px', gap: 8 }}>
              {Ic.send({ width: 18, height: 18 })} Send request to Dr. {ln}
            </button>}
          {phase === 'sent' &&
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn3d soft pill" onClick={() => { onClose(); onChat && onChat(doctor); }} style={{ flex: 1, fontSize: 14.5, fontWeight: 700, padding: '15px', gap: 7, color: 'var(--green-700)' }}>
                {Ic.chat({ width: 17, height: 17 })} Message
              </button>
              <button className="btn3d pill" onClick={onClose} style={{ flex: 1, fontSize: 14.5, fontWeight: 700, padding: '15px', gap: 7 }}>
                {Ic.check({ width: 18, height: 18 })} Done
              </button>
            </div>}
        </div>
      </div>
    </div>
    </SheetPortal>);
}

Object.assign(window, { AppointmentSheet, cfLoadAppts, cfSaveAppts, cfSlotsFor, cfFmtApptShort, cfFmtApptDate, cf12h, cfDocLastName });
