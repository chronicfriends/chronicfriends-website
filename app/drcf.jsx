/* ===== Dr. CF — AI Health Assistant Chat =====
   Dr. CF reads everything the user has logged in the app — profile,
   medications, daily check-ins (pain, energy, flares, sleep, bowel,
   lifestyle, mindset) and the food journal — and answers questions
   about THEIR health, grounded in their own data, via the Claude API. */

/* Build a compact, model-readable summary of the user's logged data. */
function buildHealthContext() {
  const today = window.CF_TODAY || '2026-06-06';
  const prof = (window.CF_loadProfileStats && window.CF_loadProfileStats()) || window.CF_PROFILE_DEFAULT || {};
  const store = (window.CF_loadStore && window.CF_loadStore()) || window.SEED || {};
  const food = (window.CF_loadFoodLog && window.CF_loadFoodLog()) || window.CF_FOOD_SEED || {};
  const meds = (window.CF_loadMeds && window.CF_loadMeds()) || [];
  const DEFAULTS = window.CF_DEFAULTS || {};
  const taken = (() => { try { return JSON.parse(localStorage.getItem('cf_taken_v2')) || {}; } catch(e) { return {}; } })();

  let ctx = `PATIENT PROFILE\n`;
  ctx += `Name: Gerard\nAge: ${prof.age ?? '—'}\nWeight: ${prof.weight ?? '—'} kg\nHeight: ${prof.height ?? '—'} cm\nYears living with Crohn's: ${prof.crohnYears ?? '—'}\nToday's date: ${today}\n\n`;

  ctx += `CURRENT MEDICATIONS\n`;
  const activeMedNames = [];
  if (meds.length) {
    meds.forEach((m) => {
      const freq = m.period === 'week' ? '1× per week' : m.period === 'fortnight' ? '1× every 15 days' : `${m.freq}× daily`;
      const times = (m.times || []).join(', ');
      const statusLabel = m.reminders ? 'ACTIVE ✓ (green toggle ON)' : 'inactive (reminders OFF)';
      ctx += `- ${m.name} ${m.strength || ''} (${m.form || 'tablet'}): ${m.dose}, ${freq}${m.food ? ', with food' : ''}. Times: ${times || '—'}. Stock: ${m.stock}. Status: ${statusLabel}.\n`;
      if (m.reminders) activeMedNames.push(`${m.name}${m.strength ? ' ' + m.strength : ''}`);
    });
    if (activeMedNames.length) ctx += `ACTIVE medications (green/enabled): ${activeMedNames.join(', ')}\n`;
  } else ctx += `- none recorded\n`;
  ctx += `\n`;

  const dates = Object.keys(store).filter((d) => d <= today).sort();
  const recent = dates.slice(-14);
  ctx += `DAILY CHECK-IN LOG (last ${recent.length} recorded days; pain 0=none..10=worst, energy 0=empty..10=full)\n`;
  recent.forEach((d) => {
    const r = { ...DEFAULTS, ...store[d] };
    const flare = r.flare === 'Yes' ? `flare YES${r.flareTypes && r.flareTypes.length ? ' (' + r.flareTypes.join(', ') + ')' : ''}` : 'flare no';
    const takenToday = [];
    const skippedToday = [];
    meds.forEach((m) => {
      (m.times || []).forEach((t) => {
        const key = `${d}|${m.id}|${t}`;
        if (taken[key] === 'taken') takenToday.push(`${m.name} @${t}`);
        else if (taken[key] === 'skip') skippedToday.push(`${m.name} @${t}`);
      });
    });
    let dosesNote = '';
    if (takenToday.length) dosesNote = `, doses taken: ${takenToday.join(', ')}`;
    if (skippedToday.length) dosesNote += `, skipped: ${skippedToday.join(', ')}`;
    ctx += `${d}: pain ${r.pain}/10, energy ${r.energy}/10${dosesNote}, ${flare}, bowel ${r.bowel}/day, sleep ${r.sleep}, water ${r.water}, activity ${r.move || '—'}, steps ${r.steps || '—'}, sun exposure ${r.sunlight}, nature ${r.nature}, mindset ${r.mindset || '—'}, alcohol ${r.alcohol}, cigarettes ${r.tobacco}\n`;
  });
  ctx += `\n`;

  const fdates = Object.keys(food).filter((d) => d <= today).sort().slice(-5);
  if (fdates.length) {
    ctx += `RECENT FOOD JOURNAL\n`;
    fdates.forEach((d) => (food[d] || []).forEach((m) => {
      ctx += `${d} ${m.time || ''}: ${m.dish} (~${m.kcal} kcal, ${m.gut === 'easy' ? 'gentle on gut' : m.gut === 'watch' ? 'worth watching' : 'generally fine'})\n`;
    }));
    ctx += `\n`;
  }
  return ctx;
}

const DRCF_SYSTEM = `You are Dr. CF, the friendly AI health companion built into the "Crohn Friends" app for people living with Crohn's disease. Today is {today}.

You have access to THIS user's own logged data (their profile, medications, daily check-ins and food journal — provided below). Use it to answer their questions about their own health.

Rules:
- Ground every answer in the user's actual logged data. Quote specific numbers, dates and trends from it (e.g. "your pain averaged 2/10 this week, down from 4 in late May").
- Only cite values, dates and entries that explicitly appear in the data below. NEVER invent, assume or estimate entries that aren't there. If there is no check-in for today (or a day a user asks about), say it hasn't been logged yet.
- If a question can't be answered from the data, say what's missing and suggest what to log.
- Be warm, encouraging and concise — usually 2–5 sentences. Use short paragraphs or simple "-" bullets for lists. Plain text only: do NOT use markdown symbols like **, ##, or backticks. Plain language, no jargon dumps.
- You may add general, well-established lifestyle/Crohn's wellbeing context, but make clear what's their data vs. general info.
- You are NOT a substitute for their medical team. For medication changes, worsening symptoms, or anything urgent, gently tell them to contact their GI team or doctor. Never give a diagnosis.
- Reply in the same language the user writes in.`;

const SESSIONS_KEY = 'cf_drcf_sessions_v1';
function loadSessions() { try { const s = JSON.parse(localStorage.getItem(SESSIONS_KEY)); return Array.isArray(s) ? s : []; } catch(e) { return []; } }
function saveSessions(s) { try { localStorage.setItem(SESSIONS_KEY, JSON.stringify(s.slice(0, 30))); } catch(e) {} }

function DrCFScreen({ onClose }) {
  const t = useT();
  const makeWelcome = () => [
    { from: 'dr', text: t('drcf_welcome') },
    { from: 'dr', text: t('drcf_intro') },
  ];

  const [sessions, setSessions] = React.useState(loadSessions);
  const [view, setView]         = React.useState('chat'); /* capture copy: always open straight into the chat */
  const [sessionId, setSessionId] = React.useState(null);
  const [msgs, setMsgs]         = React.useState(makeWelcome);
  const [input, setInput]       = React.useState('');
  const [typing, setTyping]     = React.useState(false);
  const scrollRef               = React.useRef(null);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, typing]);

  /* Persist sessions list */
  React.useEffect(() => { saveSessions(sessions); }, [sessions]);

  /* Auto-save active conversation whenever msgs change */
  React.useEffect(() => {
    if (!sessionId) return;
    const userMsgs = msgs.filter(m => m.from === 'user');
    if (!userMsgs.length) return;
    const preview = userMsgs[0].text.slice(0, 72);
    setSessions(prev => {
      const idx = prev.findIndex(s => s.id === sessionId);
      const session = { id: sessionId, startedAt: idx >= 0 ? prev[idx].startedAt : new Date().toISOString(), preview, msgs };
      if (idx < 0) return [session, ...prev];
      const next = [...prev]; next[idx] = session; return next;
    });
  }, [msgs, sessionId]);

  const startNewChat = () => {
    setSessionId(String(Date.now()));
    setMsgs(makeWelcome());
    setInput('');
    setView('chat');
  };
  const openSession = (s) => { setSessionId(s.id); setMsgs(s.msgs); setInput(''); setView('chat'); };
  const deleteSession = (id, e) => { e.stopPropagation(); setSessions(prev => prev.filter(s => s.id !== id)); };

  const quickReplies = [
    'How has my health been this week?',
    'Any patterns between my lifestyle and flares?',
    'Tell me about my medications',
  ];

  const sendMsg = async (text) => {
    if (!text.trim() || typing) return;
    const sid = sessionId || String(Date.now());
    if (!sessionId) setSessionId(sid);
    const newMsgs = [...msgs, { from: 'user', text }];
    setMsgs(newMsgs);
    setInput('');
    setTyping(true);
    try {
      if (!window.claude || !window.claude.complete) throw new Error('no-claude');
      const today = window.CF_TODAY || '2026-06-06';
      const primer = DRCF_SYSTEM.replace('{today}', today) + '\n\n=== THIS USER\'S LOGGED HEALTH DATA ===\n' + buildHealthContext();
      const convo = newMsgs.slice(2).map((m) => ({ role: m.from === 'user' ? 'user' : 'assistant', content: m.text }));
      const messages = [
        { role: 'user', content: primer + '\n\nReview my data above, then reply to my messages as Dr. CF.' },
        { role: 'assistant', content: "Understood — I've reviewed your Crohn Friends data and I'm ready to help." },
        ...convo,
      ];
      const reply = await window.claude.complete({ messages });
      const clean = (reply || '').trim();
      setMsgs((prev) => [...prev, { from: 'dr', text: clean || "I couldn't put that together just now — could you ask again?" }]);
    } catch (e) {
      setMsgs((prev) => [...prev, { from: 'dr', text: "I'm having trouble reaching my analysis service right now. Please try again in a moment — in the meantime, you can review your trends in the Journal tab." }]);
    } finally {
      setTyping(false);
    }
  };

  /* ---- SESSIONS LIST VIEW ---- */
  if (view === 'list') {
    return (
      <div className="drcf-overlay" style={{ animation: 'drcfSlideIn .32s cubic-bezier(.22,1,.36,1)' }}>
        <div className="drcf-header">
          <button className="drcf-back" onClick={onClose} aria-label="Close">{Ic.back({ width: 20, height: 20 })}</button>
          <div className="drcf-avatar-wrap">
            <div className="drcf-avatar"><img src="uploads/CF logo-af21aac8.jpg" alt="Dr. CF" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} /></div>
            <span className="drcf-online-dot"></span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="drcf-name">Dr. CF</div>
            <div className="drcf-status">{sessions.length} saved conversation{sessions.length !== 1 ? 's' : ''}</div>
          </div>
          <div className="drcf-ai-badge">AI</div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', background: 'var(--card)' }} className="no-scrollbar">
          <div style={{ padding: '14px 16px 10px' }}>
            <button className="btn3d dark" onClick={startNewChat} style={{ width: '100%', padding: '14px', fontSize: 15, fontWeight: 700, borderRadius: 22, gap: 10 }}>
              {Ic.plus({ width: 19, height: 19 })} New conversation
            </button>
          </div>

          {sessions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 24px', color: 'var(--muted)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                <img src="uploads/CF logo-af21aac8.jpg" alt="" style={{ width: 56, height: 56, borderRadius: '50%', opacity: .3 }} />
              </div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>No conversations yet</div>
              <div style={{ fontSize: 12.5, marginTop: 4 }}>Tap "New conversation" to start.</div>
            </div>
          ) : (
            <div style={{ padding: '4px 16px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="eyebrow" style={{ margin: '8px 2px 10px' }}>Previous conversations</div>
              {sessions.map((s) => {
                const date = new Date(s.startedAt);
                const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
                const userCount = s.msgs ? s.msgs.filter(m => m.from === 'user').length : 0;
                return (
                  <div key={s.id} onClick={() => openSession(s)} role="button" tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && openSession(s)}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', cursor: 'pointer', padding: '12px 13px', borderRadius: 18, background: '#fff', boxShadow: '0 2px 10px -4px rgba(30,60,25,.18),inset 0 0 0 1.5px rgba(120,150,115,.16)' }}>
                    <div style={{ position: 'relative', flex: 'none' }}>
                      <div style={{ width: 46, height: 46, borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--green-500)', boxShadow: '0 3px 9px -3px rgba(20,50,25,.4)' }}>
                        <img src="uploads/CF logo-af21aac8.jpg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <span style={{ position: 'absolute', right: 0, bottom: 0, width: 13, height: 13, borderRadius: '50%', background: '#27d367', border: '2.5px solid #fff' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--ink)' }}>Dr. CF</span>
                        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted-2)', flex: 'none' }}>{dateStr} · {timeStr}</span>
                      </div>
                      <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--muted)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.preview || 'Conversation'}</div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--green-600)', marginTop: 3 }}>{userCount} message{userCount !== 1 ? 's' : ''}</div>
                    </div>
                    <button onClick={(e) => deleteSession(s.id, e)}
                      style={{ border: 'none', background: 'rgba(180,50,40,.1)', cursor: 'pointer', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c24f54', flex: 'none' }}>
                      {Ic.trash({ width: 15, height: 15 })}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ---- CHAT VIEW ---- */
  return (
    <div className="drcf-overlay" style={{ animation: 'drcfSlideIn .32s cubic-bezier(.22,1,.36,1)' }}>
      <div className="drcf-header">
        <button className="drcf-back" onClick={() => sessions.length > 0 ? setView('list') : onClose()} aria-label="Back">
          {Ic.back({ width: 20, height: 20 })}
        </button>
        <div className="drcf-avatar-wrap">
          <div className="drcf-avatar"><img src="uploads/CF logo-af21aac8.jpg" alt="Dr. CF" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} /></div>
          <span className="drcf-online-dot"></span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="drcf-name">Dr. CF</div>
          <div className="drcf-status">{typing ? 'analysing your data…' : t('drcf_status')}</div>
        </div>
        <button onClick={startNewChat} title="New conversation" style={{ border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,.14)', color: 'rgba(255,255,255,.85)', borderRadius: 10, padding: '5px 9px', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, flex: 'none' }}>
          {Ic.plus({ width: 12, height: 12 })} New
        </button>
        <div className="drcf-ai-badge">AI</div>
      </div>

      <div className="drcf-body" ref={scrollRef}>
        <div className="drcf-disclaimer">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b08420" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span style={{ fontWeight: 700, fontSize: 11.5, color: '#8a6510' }}>{t('drcf_disclaimer_title')}</span>
          </div>
          <span style={{ fontSize: 11, color: '#8a6a20', lineHeight: 1.45 }}>{t('drcf_disclaimer')}</span>
        </div>

        {msgs.map((m, i) => (
          <div key={i} className={`drcf-msg ${m.from === 'dr' ? 'drcf-msg-dr' : 'drcf-msg-user'}`}>
            {m.from === 'dr' && (
              <div className="drcf-msg-avatar">
                <img src="uploads/CF logo-af21aac8.jpg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              </div>
            )}
            <div className={`drcf-bubble ${m.from === 'dr' ? 'drcf-bubble-dr' : 'drcf-bubble-user'}`} style={{ whiteSpace: 'pre-wrap' }}>
              {m.text}
            </div>
          </div>
        ))}

        {typing && (
          <div className="drcf-msg drcf-msg-dr">
            <div className="drcf-msg-avatar">
              <img src="uploads/CF logo-af21aac8.jpg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            </div>
            <div className="drcf-bubble drcf-bubble-dr drcf-typing">
              <span className="drcf-dot"></span><span className="drcf-dot"></span><span className="drcf-dot"></span>
            </div>
          </div>
        )}

        {msgs.length === 2 && !typing && (
          <div className="drcf-quick-replies">
            {quickReplies.map((q, i) => (
              <button key={i} className="drcf-quick-btn" onClick={() => sendMsg(q)}>{q}</button>
            ))}
          </div>
        )}
      </div>

      <div className="drcf-input-bar">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMsg(input)}
          placeholder={t('drcf_placeholder')}
          className="drcf-input"
          disabled={typing}
        />
        <button className="drcf-send-btn" onClick={() => sendMsg(input)} disabled={!input.trim() || typing}>
          {Ic.send({ width: 18, height: 18 })}
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { DrCFScreen, buildHealthContext });
