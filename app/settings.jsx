/* ===================================================================
   SETTINGS — avatar-triggered panel with full health-app legal
   scaffolding + a 15-language picker. Slides in over the app.
   =================================================================== */
const { useState: useSet } = React;

const PROFILE = { name: 'Gerard', email: 'gerard@crohnfriends.app' };

/* ---------- main panel ---------- */
function SettingsPanel({ onClose }) {
  const t = useT();
  const prof = useProfile();
  const [view, setView] = useSet('main');     // 'main' | 'language' | 'editprofile' | doc-key
  const [notif, setNotif] = useSet(true);
  const [confirmOut, setConfirmOut] = useSet(false);
  const curLang = CF_LANGS.find((l) => l.code === I18n.lang) || CF_LANGS[0];

  return (
    <div className="settings-panel">
      <div className="set-head">
        <div className="row">
          <button className="set-back" onClick={onClose} aria-label="close">{Ic.x()}</button>
          <div style={{ flex: 1 }}>
            <div className="set-title">{t('settings')}</div>
            <div className="set-sub">{t('settings_sub')}</div>
          </div>
          <span style={{ color: 'rgba(234,253,227,.85)' }}>{Ic.gear({ width: 24, height: 24 })}</span>
        </div>
      </div>

      <div className="set-scroll">
        {/* profile card */}
        <button className="set-card set-row" onClick={() => setView('editprofile')} style={{ marginTop: 14, padding: '15px 16px' }}>
          <UserAvatar name={prof.name} size={52} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--ink)' }}>{prof.name}</div>
            <div className="muted" style={{ fontSize: 12.5, fontWeight: 600 }}>{prof.status ? prof.status : prof.email}</div>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--green-600)', marginTop: 3 }}>{prof.status ? prof.email : t('member_since')}</div>
          </div>
          <span style={{ color: 'var(--green-600)' }}>{Ic.edit({ width: 19, height: 19 })}</span>
        </button>

        {/* HEALTH DETAILS — moved here from the Journal section */}
        <div className="set-group-label">{t('health_details')}</div>
        <ProfileStats />

        {/* PREFERENCES */}
        <div className="set-group-label">{t('grp_prefs')}</div>
        <div className="set-card">
          <Row icon="globe" label={t('language')} value={curLang.name} onClick={() => setView('language')} />
          <RowToggleLine icon="bell" ic="teal" label={t('notifications')} on={notif} onChange={setNotif} />
        </div>

        {/* PRIVACY & DATA */}
        <div className="set-group-label">{t('grp_privacy')}</div>
        <div className="set-card">
          <Row icon="lock" label={t('consent')} onClick={() => setView('consent')} />
          <Row icon="download" ic="violet" label={t('export_data')} onClick={() => setView('export')} />
          <Row icon="trash" ic="rose" label={t('delete_account')} onClick={() => setView('delete')} />
        </div>

        {/* SUPPORT */}
        <div className="set-group-label">{t('grp_support')}</div>
        <div className="set-card">
          <Row icon="qmark" ic="teal" label={t('help')} onClick={() => setView('help')} />
          <Row icon="heart" ic="rose" label={t('emergency')} onClick={() => setView('emergency')} />
          <Row icon="info" ic="amber" label={tr('About Us')} onClick={() => setView('aboutus')} />
        </div>

        {/* LEGAL */}
        <div className="set-group-label">{t('grp_legal')}</div>
        <div className="set-card">
          <Row icon="shield" label={t('terms')} onClick={() => setView('terms')} />
          <Row icon="info" ic="amber" label={t('disclaimer')} onClick={() => setView('disclaimer')} />
          <Row icon="scale" ic="slate" label={t('licenses')} onClick={() => setView('licenses')} />
        </div>

        {/* medical disclaimer banner — single, friendly reminder */}
        <div className="note-card" style={{ background: 'linear-gradient(180deg,#fff6e6,#fdeccd)', marginTop: 16 }}>
          <span className="nic" style={{ background: 'radial-gradient(120% 120% at 30% 25%,#f0b24a,#cc8418)' }}>{Ic.info({ width: 17, height: 17 })}</span>
          <div className="ntxt" style={{ color: '#7a4a08' }}>{t('disclaimer_body')}</div>
        </div>

        {/* ABOUT */}
        <div className="set-group-label">{t('grp_about')}</div>
        <div className="set-card">
          <Row icon="star" ic="amber" label={t('rate')} onClick={() => {}} />
          <div className="set-row" style={{ cursor: 'default' }}>
            <span className="ic slate">{Ic.info({ width: 18, height: 18 })}</span>
            <span className="lbl">{t('version')}</span>
            <span className="val">2.4.0 (118)</span>
          </div>
        </div>

        {/* log out */}
        <div className="set-card" style={{ marginTop: 18 }}>
          <button className="set-row danger" onClick={() => setConfirmOut(true)}>
            <span className="ic">{Ic.logout({ width: 18, height: 18 })}</span>
            <span className="lbl">{t('logout')}</span>
          </button>
        </div>

        <div style={{ textAlign: 'center', margin: '20px 0 4px' }}>
          <CFLogo size={26} color="#a9c2a3" />
          <div className="muted" style={{ fontSize: 11, fontWeight: 600, marginTop: 4 }}>Crohn Friends · © 2026</div>
        </div>
      </div>

      {/* sub-views */}
      {view === 'language' && <LanguagePicker onBack={() => setView('main')} />}
      {view === 'editprofile' && <EditProfileView onBack={() => setView('main')} />}
      {view !== 'main' && view !== 'language' && view !== 'editprofile' &&
        <DocView docKey={view} onBack={() => setView('main')} />}

      {/* logout confirm */}
      {confirmOut &&
        <div className="sheet-backdrop" onClick={() => setConfirmOut(false)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()} style={{ paddingBottom: 24 }}>
            <div className="sheet-grab" />
            <div style={{ textAlign: 'center', padding: '4px 6px 6px' }}>
              <div style={{ width: 56, height: 56, borderRadius: 18, margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', background: 'radial-gradient(120% 120% at 30% 25%,#e8707a,#bf3f4c)' }}>{Ic.logout({ width: 26, height: 26 })}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--ink)' }}>{t('logout_confirm')}</div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button className="btn3d soft pill" onClick={() => setConfirmOut(false)} style={{ flex: 1, padding: '14px', fontSize: 15 }}>{t('cancel')}</button>
              <button className="btn3d pill" onClick={() => { setConfirmOut(false); if (window.CFAuth) CFAuth.logout(); }} style={{ flex: 1, padding: '14px', fontSize: 15, background: 'linear-gradient(180deg,#e8707a,#bf3f4c)', boxShadow: '0 8px 16px rgba(150,40,50,.4),inset 0 2px 2px rgba(255,255,255,.4)' }}>{t('logout')}</button>
            </div>
          </div>
        </div>}
    </div>
  );
}

/* ---------- rows ---------- */
function Row({ icon, ic, label, value, onClick }) {
  return (
    <button className="set-row" onClick={onClick} style={onClick ? {} : { cursor: 'default' }}>
      <span className={'ic' + (ic ? ' ' + ic : '')}>{Ic[icon]({ width: 18, height: 18 })}</span>
      <span className="lbl">{label}</span>
      {value && <span className="val">{value}</span>}
      {onClick && <span className="chev">{Ic.chevR({ width: 18, height: 18 })}</span>}
    </button>
  );
}
function RowToggleLine({ icon, ic, label, on, onChange }) {
  return (
    <div className="set-row" style={{ cursor: 'default' }}>
      <span className={'ic' + (ic ? ' ' + ic : '')}>{Ic[icon]({ width: 18, height: 18 })}</span>
      <span className="lbl">{label}</span>
      <Toggle on={on} onChange={onChange} />
    </div>
  );
}

/* ---------- language picker ---------- */
function LanguagePicker({ onBack }) {
  const t = useT();
  const [, force] = useSet(0);
  return (
    <div className="settings-panel sub">
      <div className="set-head">
        <div className="row">
          <button className="set-back" onClick={onBack} aria-label="back">{Ic.back()}</button>
          <div style={{ flex: 1 }}>
            <div className="set-title">{t('choose_language')}</div>
            <div className="set-sub">{trf('{n} languages', { n: CF_LANGS.length })}</div>
          </div>
          <span style={{ color: 'rgba(234,253,227,.85)' }}>{Ic.globe({ width: 24, height: 24 })}</span>
        </div>
      </div>
      <div className="set-scroll">
        <div className="set-card" style={{ marginTop: 14 }}>
          {CF_LANGS.map((l) => {
            const on = l.code === I18n.lang;
            return (
              <button key={l.code} className={'lang-row' + (on ? ' on' : '')}
                onClick={() => { I18n.setLang(l.code); force((x) => x + 1); }}>
                <span className="lang-glyph">{l.glyph}</span>
                <div className="lang-name">
                  <div className="n1">{l.name}</div>
                  <div className="n2">{l.en}</div>
                </div>
                {on && <span className="lang-check">{Ic.check({ width: 22, height: 22 })}</span>}
              </button>
            );
          })}
        </div>
        <p className="muted" style={{ fontSize: 11.5, textAlign: 'center', margin: '14px 10px 0', lineHeight: 1.5 }}>
          {t('language')} · {CF_LANGS.find((l) => l.code === I18n.lang).name}
        </p>
      </div>
    </div>
  );
}

/* ---------- edit profile ---------- */
function EditProfileView({ onBack }) {
  const t = useT();
  const prof = CFProfile.get();
  const [name, setName] = useSet(prof.name || '');
  const [status, setStatus] = useSet(prof.status || '');
  const [photo, setPhoto] = useSet(prof.avatarPhoto || null);
  const [color, setColor] = useSet(prof.avatarColor || null);
  const fileRef = React.useRef(null);

  const onFile = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => { setPhoto(reader.result); setColor(null); };
    reader.readAsDataURL(f);
    e.target.value = '';
  };
  const pickColor = (c) => { setColor(c); setPhoto(null); };
  const useDefault = () => { setColor(null); setPhoto(null); };
  const initials = (() => {
    const parts = (name || 'G').trim().split(/\s+/).filter(Boolean);
    const a = parts[0] ? parts[0][0] : 'G';
    const b = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (a + b).toUpperCase();
  })();
  const save = () => {
    CFProfile.update({ name: name.trim() || 'Gerard', status: status.trim(), avatarPhoto: photo, avatarColor: color });
    onBack();
  };

  /* live avatar preview */
  let preview;
  if (photo) {
    preview = <div style={{ width: 96, height: 96, borderRadius: '50%', backgroundImage: `url(${photo})`, backgroundSize: 'cover', backgroundPosition: 'center', boxShadow: '0 8px 22px -8px rgba(20,60,25,.5)' }} />;
  } else if (color) {
    preview = <div style={{ width: 96, height: 96, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 38, boxShadow: '0 8px 22px -8px rgba(20,60,25,.5)' }}>{initials}</div>;
  } else {
    preview = <div style={{ width: 96, height: 96, borderRadius: '50%', overflow: 'hidden', background: 'radial-gradient(120% 120% at 50% 18%, #f4d9c2 0%, #e7b48f 42%, #c98a63 100%)', boxShadow: '0 8px 22px -8px rgba(20,60,25,.5)' }}>
      <svg width="96" height="96" viewBox="0 0 46 46" aria-hidden="true"><ellipse cx="23" cy="18.5" rx="8.2" ry="9" fill="#5b3a2c" opacity=".92" /><path d="M8.5 46c0-9.4 6.5-15.5 14.5-15.5S37.5 36.6 37.5 46Z" fill="#5b3a2c" opacity=".92" /><circle cx="23" cy="19" r="6.4" fill="#f0c9a8" /></svg>
    </div>;
  }

  return (
    <div className="settings-panel sub">
      <div className="set-head">
        <div className="row">
          <button className="set-back" onClick={onBack} aria-label="back">{Ic.back()}</button>
          <div style={{ flex: 1 }}>
            <div className="set-title">{t('edit_profile_title')}</div>
            <div className="set-sub">{t('edit_profile_sub')}</div>
          </div>
          <span style={{ color: 'rgba(234,253,227,.85)' }}>{Ic.edit({ width: 22, height: 22 })}</span>
        </div>
      </div>
      <div className="set-scroll">
        {/* avatar preview + change */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, margin: '18px 0 8px' }}>
          {preview}
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn3d pill" onClick={() => fileRef.current && fileRef.current.click()} style={{ padding: '10px 16px', fontSize: 13, fontWeight: 700, gap: 7 }}>{Ic.cam ? Ic.cam({ width: 16, height: 16 }) : null} {tr('Upload a photo')}</button>
            {(photo || color) &&
              <button className="btn3d soft pill" onClick={useDefault} style={{ padding: '10px 16px', fontSize: 13, fontWeight: 700, gap: 7, color: 'var(--green-700)' }}>{tr('Remove photo')}</button>}
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={onFile} style={{ display: 'none' }} />
        </div>

        {/* colour swatches */}
        <div className="set-group-label">{t('choose_colour')}</div>
        <div className="set-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            {CF_AVATAR_COLORS.map((c) => {
              const on = color === c && !photo;
              return (
                <button key={c} onClick={() => pickColor(c)} aria-label={c} style={{ width: 42, height: 42, borderRadius: '50%', background: c, border: 'none', cursor: 'pointer', flex: 'none', boxShadow: on ? '0 0 0 3px var(--card), 0 0 0 5px ' + c : '0 4px 10px -4px rgba(20,50,25,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  {on ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg> : null}
                </button>);
            })}
          </div>
        </div>

        {/* name + status */}
        <div className="set-group-label">{t('your_details')}</div>
        <div className="set-card" style={{ padding: '6px 16px 16px' }}>
          <div className="fld" style={{ marginTop: 12 }}>
            <label>{t('full_name')}</label>
            <input type="text" value={name} maxLength={40} onChange={(e) => setName(e.target.value)} placeholder="Gerard" />
          </div>
          <div className="fld" style={{ marginBottom: 0 }}>
            <label>{t('status_label')}</label>
            <input type="text" value={status} maxLength={60} onChange={(e) => setStatus(e.target.value)} placeholder={tr("e.g. Crohn's warrior since 2012 \ud83c\udf3f")} />
          </div>
        </div>

        <button className="btn3d pill" onClick={save} style={{ width: '100%', padding: '15px', fontSize: 15.5, fontWeight: 700, marginTop: 18, gap: 8 }}>{Ic.check({ width: 18, height: 18 })} {t('save_changes')}</button>
      </div>
    </div>);
}

/* ---------- generic legal / info doc viewer ---------- */
function DocView({ docKey, onBack }) {
  const t = useT();
  const titleKey = {
    privacy: 'privacy_policy', consent: 'consent', export: 'export_data', delete: 'delete_account',
    terms: 'terms', disclaimer: 'disclaimer', cookies: 'cookies', licenses: 'licenses',
    help: 'help', contact: 'contact', emergency: 'emergency', aboutus: 'aboutus',
  }[docKey] || 'settings';

  return (
    <div className="settings-panel sub">
      <div className="set-head">
        <div className="row">
          <button className="set-back" onClick={onBack} aria-label="back">{Ic.back()}</button>
          <div style={{ flex: 1 }}>
            <div className="set-title">{docKey === 'aboutus' ? tr('About Us') : t(titleKey)}</div>
            <div className="set-sub">Crohn Friends</div>
          </div>
        </div>
      </div>
      <div className="set-scroll">
        <div style={{ marginTop: 16 }}>{docContent(docKey, t)}</div>
      </div>
    </div>
  );
}

function docContent(key, t) {
  if (key === 'disclaimer') {
    return (
      <div>
        <div className="note-card" style={{ background: 'linear-gradient(180deg,#fff6e6,#fdeccd)', marginBottom: 16 }}>
          <span className="nic" style={{ background: 'radial-gradient(120% 120% at 30% 25%,#f0b24a,#cc8418)' }}>{Ic.info({ width: 17, height: 17 })}</span>
          <div className="ntxt" style={{ color: '#7a4a08', fontWeight: 600 }}>{t('disclaimer_body')}</div>
        </div>
        <div className="doc-body">
          <p>Crohn Friends is a peer-support and self-tracking companion. It is <strong>not a substitute for professional medical advice</strong>, diagnosis, or treatment.</p>
          <h4>Not a medical device</h4>
          <p>This app is not certified as a medical device under EU MDR 2017/745 or equivalent regulations. Information shown is for general wellbeing and organisation only.</p>
          <h4>Always ask your clinician</h4>
          <p>Never disregard professional advice or delay seeking it because of something you have read in this app. Decisions about medication, dosage and treatment must be made with a qualified healthcare professional.</p>
        </div>
      </div>
    );
  }
  if (key === 'emergency') {
    return (
      <div>
        <div className="note-card" style={{ background: 'linear-gradient(180deg,#fdeceb,#fbe0de)', marginBottom: 16 }}>
          <span className="nic" style={{ background: 'radial-gradient(120% 120% at 30% 25%,#e8707a,#bf3f4c)' }}>{Ic.phone({ width: 17, height: 17 })}</span>
          <div className="ntxt" style={{ color: '#9a3640', fontWeight: 600 }}>{t('emergency_banner')}</div>
        </div>
        <div className="doc-body">
          <p>If you experience severe abdominal pain, persistent vomiting, high fever, heavy rectal bleeding or signs of dehydration, seek urgent medical care.</p>
          <h4>Emergency numbers</h4>
          <p>EU · <strong>112</strong> &nbsp; United States · <strong>911</strong> &nbsp; United Kingdom · <strong>999</strong></p>
          <p>Crohn Friends cannot contact emergency services on your behalf.</p>
        </div>
      </div>
    );
  }
  if (key === 'export') {
    return (
      <div className="doc-body">
        <p>Under the GDPR you have the right to receive a copy of the personal and health data you have stored in Crohn Friends.</p>
        <p>Your export includes your profile, journal entries, medications and reminders as a machine-readable file.</p>
        <button className="btn3d pill" style={{ width: '100%', padding: '14px', fontSize: 15, marginTop: 10 }}>{Ic.download({ width: 18, height: 18 })} {t('export_data')}</button>
      </div>
    );
  }
  if (key === 'delete') {
    return (
      <div className="doc-body">
        <p>Deleting your account permanently removes your profile, health journal, medications and community activity. This cannot be undone.</p>
        <p>In line with data-protection law, your records are erased within 30 days of confirmation.</p>
        <button className="btn3d pill" style={{ width: '100%', padding: '14px', fontSize: 15, marginTop: 10, background: 'linear-gradient(180deg,#e8707a,#bf3f4c)', boxShadow: '0 8px 16px rgba(150,40,50,.4),inset 0 2px 2px rgba(255,255,255,.4)' }}>{Ic.trash({ width: 18, height: 18 })} {t('delete_account')}</button>
      </div>
    );
  }
  if (key === 'consent') {
    return (
      <div className="doc-body">
        <p>You control how your data is used. You can change these choices at any time.</p>
        <ConsentRows />
      </div>
    );
  }
  if (key === 'licenses') {
    return (
      <div className="doc-body">
        <p>Crohn Friends is built with open-source software, used under their respective licences:</p>
        <p>React · MIT &nbsp;·&nbsp; Babel · MIT &nbsp;·&nbsp; Poppins (Google Fonts) · OFL &nbsp;·&nbsp; Feather-style icons · MIT</p>
      </div>
    );
  }
  if (key === 'contact' || key === 'help') {
    return (
      <div className="doc-body">
        <p>We are here to help. Reach our care team and find answers to common questions.</p>
        <h4>Contact</h4>
        <p>support@crohnfriends.app</p>
        <p>Typical response time: within 24 hours.</p>
      </div>
    );
  }
  if (key === 'aboutus') {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <div style={{ width: 88, height: 88, borderRadius: 24, overflow: 'hidden', boxShadow: '0 8px 24px rgba(30,80,30,.28)' }}>
            <img src="uploads/CF logo-af21aac8.jpg" alt="Crohn Friends" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
        <div className="doc-body">
          <p style={{ fontWeight: 800, fontSize: 15, color: 'var(--ink)', textAlign: 'center', marginBottom: 4 }}>Hi, I'm Gerard 👋</p>
          <p>I'm the person behind Crohn Friends. I was diagnosed with Crohn's disease in <strong>2012</strong> — which means I've been living with this condition for over 14 years. I know exactly what it feels like: the uncertainty, the flare-ups, the endless appointments, and the emotional weight that nobody outside this world fully understands.</p>
          <h4>Why I built this</h4>
          <p>When I first got my diagnosis, I felt completely alone. Finding others who truly got it was nearly impossible. I wanted to build something I wish had existed back then — a space where people with Crohn's can connect, track their health without stress, and feel genuinely understood by people who've walked the same path.</p>
          <h4>A dad of three</h4>
          <p>I'm also the proud father of three amazing kids. Raising a family while managing a chronic illness teaches you an incredible amount about resilience, patience, and finding joy in the good days. They are my biggest motivation to keep this app growing every single day.</p>
          <h4>Our mission</h4>
          <p>Crohn Friends is built with one simple goal: make living with Crohn's disease a little less lonely, a little more manageable, and a lot more connected. Every feature here comes from real lived experience — not a textbook, not a boardroom.</p>
          <p style={{ fontStyle: 'italic', color: 'var(--green-700)', fontWeight: 600, marginTop: 14 }}>— Gerard, founder &amp; fellow Crohn's warrior since 2012 🌿</p>
        </div>
      </div>
    );
  }

  /* terms — a single combined Terms, Privacy & Cookies document */
  return (
    <div className="doc-body">
      <p style={{ fontWeight: 600, color: 'var(--ink)' }}>This one document covers how Crohn Friends works, how we handle your data, and your rights — no scattered legal pages to hunt through.</p>
      <h4>Using the app</h4>
      <p>By creating an account you agree to use Crohn Friends for personal wellbeing tracking and peer support. It is not a medical device and does not replace professional care.</p>
      <h4>Your health data</h4>
      <p>Your journal entries, symptoms and medications are sensitive health data. They are encrypted in transit and at rest, stay on your device by default, and are never sold.</p>
      <h4>Cookies &amp; storage</h4>
      <p>We use only essential local storage to keep you signed in and remember your preferences — no advertising trackers.</p>
      <h4>Your rights</h4>
      <p>You can access, correct, export or delete your data at any time from <strong>Privacy &amp; Data</strong> in Settings.</p>
      <h4>Contact</h4>
      <p>Questions? Email privacy@crohnfriends.app. Last updated June 2026.</p>
    </div>
  );
}

function ConsentRows() {
  const [a, setA] = useSet(true);
  const [b, setB] = useSet(false);
  const [c, setC] = useSet(true);
  const rows = [
    ['Essential data processing', 'Required to run the app', a, setA, true],
    ['Analytics & improvement', 'Anonymous usage insights', b, setB, false],
    ['Research participation', 'Help advance Crohn’s care', c, setC, false],
  ];
  return (
    <div className="set-card" style={{ marginTop: 12 }}>
      {rows.map(([l, s, v, set, lock], i) =>
        <div className="set-row" key={i} style={{ cursor: 'default' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>{l}</div>
            <div className="muted" style={{ fontSize: 12 }}>{s}</div>
          </div>
          <Toggle on={v} onChange={lock ? () => {} : set} />
        </div>
      )}
    </div>
  );
}

Object.assign(window, { SettingsPanel });
