/* ===================================================================
   AUTH — tiny session store + the friendly login screen.

   • Two roles: patient and doctor. Doctors go through a simulated
     license-verification step (form → checking → verified ✓ → in).
   • "Sign in" = returning user → straight into the app.
   • "Create your account" = new patient → onboarding flow.
   • Session persists to localStorage; Settings → Log out clears it.
   =================================================================== */
const { useState: useAu, useEffect: useAuE } = React;

const CF_AUTH_KEY = 'cf_auth_v1';
const CF_ONB_KEY = 'cf_onboarded_v1';

function cfLoadAuth() { try { return JSON.parse(localStorage.getItem(CF_AUTH_KEY)) || null; } catch (e) { return null; } }

const CFAuth = {
  data: cfLoadAuth(),
  listeners: new Set(),
  subscribe(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn); },
  persist() {
    try {
      if (this.data) localStorage.setItem(CF_AUTH_KEY, JSON.stringify(this.data));
      else localStorage.removeItem(CF_AUTH_KEY);
    } catch (e) {}
  },
  emit() { this.persist(); this.listeners.forEach((fn) => fn()); },
  get() { return this.data; },
  login(info) { this.data = { ...info, ts: Date.now() }; this.emit(); },
  logout() { this.data = null; this.emit(); },
  onboarded() { try { return localStorage.getItem(CF_ONB_KEY) === '1'; } catch (e) { return true; } },
  setOnboarded(v) { try { localStorage.setItem(CF_ONB_KEY, v ? '1' : '0'); } catch (e) {} this.emit(); },
};

function useAuth() {
  const [, force] = useAu(0);
  useAuE(() => CFAuth.subscribe(() => force((x) => x + 1)), []);
  return CFAuth.get();
}

/* ---------- shared bits ---------- */
const LOGIN_BG = 'radial-gradient(130% 110% at 50% 0%, #3f8a3f 0%, #2c6730 52%, #1f4c25 100%)';

function CFLogoTile({ size = 64 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: size * 0.3, overflow: 'hidden', flex: 'none', boxShadow: '0 14px 30px -10px rgba(10,35,10,.65), inset 0 1px 1px rgba(255,255,255,.4)' }}>
      <img src="uploads/CF logo-af21aac8.jpg" alt="Crohn Friends" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
    </div>);
}

/* role card — patient / doctor picker */
function RoleCard({ on, icon, title, line, onClick }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, padding: '14px 10px 12px',
      borderRadius: 20, border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center',
      background: on ? 'linear-gradient(180deg,#ffffff,#eef6e6)' : 'rgba(255,255,255,.13)',
      color: on ? 'var(--ink)' : '#dff0d4',
      boxShadow: on ? '0 12px 26px -10px rgba(10,40,10,.6), inset 0 0 0 2px var(--green-450)' : 'inset 0 0 0 1.5px rgba(255,255,255,.22)',
      transition: 'all .18s ease' }}>
      <span style={{ width: 40, height: 40, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: on ? 'radial-gradient(120% 120% at 30% 25%,#7bd853,#3f8a3f)' : 'rgba(255,255,255,.16)', color: '#fff' }}>{icon}</span>
      <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: '-.01em' }}>{title}</span>
      <span style={{ fontSize: 10.5, fontWeight: 600, lineHeight: 1.3, color: on ? 'var(--muted)' : 'rgba(223,240,212,.75)' }}>{line}</span>
    </button>);
}

/* ---------- LOGIN SCREEN ---------- */
function LoginScreen() {
  const t = useT();
  const [role, setRole] = useAu('patient');
  const [email, setEmail] = useAu('');
  const [pw, setPw] = useAu('');
  const [docName, setDocName] = useAu('');
  const [license, setLicense] = useAu('');
  const [spec, setSpec] = useAu('Gastroenterologist');
  const [verify, setVerify] = useAu('idle');   /* idle | busy | ok */

  const canPatient = email.trim().length > 2;
  const canDoctor = docName.trim().length > 1 && license.trim().length > 3;
  const SPECS = ['Gastroenterologist', 'IBD Specialist', 'Dietitian', 'Psychologist', 'Dermatologist', 'Rheumatologist'];

  function signInPatient() {
    if (!canPatient) return;
    CFAuth.setOnboarded(true);                       /* returning user — skip onboarding */
    CFAuth.login({ role: 'patient', email: email.trim() });
  }
  function createAccount() {
    CFAuth.setOnboarded(false);                      /* new user — go through onboarding */
    CFAuth.login({ role: 'patient', email: email.trim(), fresh: true });
  }
  function verifyDoctor() {
    if (!canDoctor || verify !== 'idle') return;
    setVerify('busy');
    setTimeout(() => {
      setVerify('ok');
      setTimeout(() => {
        try { CFProfile.update({ name: 'Dr. ' + docName.trim() }); } catch (e) {}
        CFAuth.setOnboarded(true);                   /* doctors skip patient onboarding */
        CFAuth.login({ role: 'doctor', name: docName.trim(), license: license.trim(), specialty: spec });
      }, 900);
    }, 1600);
  }

  return (
    <div className="screen-scroll" style={{ background: LOGIN_BG, display: 'flex', flexDirection: 'column' }}>
      {/* decorative leaves */}
      <div style={{ position: 'absolute', top: 14, left: -8, color: 'rgba(189,238,154,.16)', transform: 'rotate(-24deg)', pointerEvents: 'none' }}>{Ic.leaf({ width: 90, height: 90 })}</div>
      <div style={{ position: 'absolute', top: 60, right: -16, color: 'rgba(189,238,154,.12)', transform: 'rotate(30deg)', pointerEvents: 'none' }}>{Ic.leaf({ width: 120, height: 120 })}</div>

      {/* brand */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 11, padding: '40px 24px 20px', position: 'relative' }}>
        <CFLogoTile size={66} />
        <div style={{ fontSize: 25, fontWeight: 800, color: '#fff', letterSpacing: '-.02em', lineHeight: 1 }}>Crohn Friends</div>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: 'rgba(214,245,205,.85)', textAlign: 'center' }}>{tr("Your companion for life with Crohn's")} 🌿</div>
      </div>

      {/* role picker */}
      <div style={{ display: 'flex', gap: 11, padding: '4px 20px 20px', position: 'relative' }}>
        <RoleCard on={role === 'patient'} icon={Ic.heart({ width: 20, height: 20 })} title={tr("I'm a patient")} line={tr('Track, learn and connect')} onClick={() => { setRole('patient'); setVerify('idle'); }} />
        <RoleCard on={role === 'doctor'} icon={Ic.doc({ width: 20, height: 20 })} title={tr("I'm a doctor")} line={tr('Verified medical access')} onClick={() => { setRole('doctor'); setVerify('idle'); }} />
      </div>

      {/* white panel */}
      <div style={{ flex: '1 0 auto', background: 'var(--card)', borderRadius: '30px 30px 0 0', padding: '24px 22px 30px', boxShadow: '0 -16px 34px -18px rgba(8,30,8,.65)', position: 'relative' }}>
        {role === 'patient' ? (
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--ink)', letterSpacing: '-.01em' }}>{tr('Welcome back')}</div>
            <div className="muted" style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 16 }}>{tr('Log in to your forest')}</div>

            <div className="fld">
              <label>{tr('Email')}</label>
              <input type="text" value={email} placeholder="gerard@crohnfriends.app" onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="fld">
              <label>{tr('Password')}</label>
              <input type="text" value={pw} placeholder="••••••••" style={{ WebkitTextSecurity: 'disc' }} onChange={(e) => setPw(e.target.value)} />
            </div>

            <button className="btn3d pill" onClick={signInPatient} disabled={!canPatient}
              style={{ width: '100%', padding: '15px', fontSize: 15.5, fontWeight: 700, gap: 9, opacity: canPatient ? 1 : .55 }}>
              {Ic.leaf({ width: 18, height: 18 })} {tr('Sign in')}
            </button>
            <div style={{ textAlign: 'center', marginTop: 11 }}>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12.5, fontWeight: 700, color: 'var(--green-600)' }}>{tr('Forgot password?')}</button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0 14px' }}>
              <span style={{ flex: 1, height: 1, background: 'rgba(120,140,115,.25)' }}></span>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--muted-2)' }}>{tr('New to Crohn Friends?')}</span>
              <span style={{ flex: 1, height: 1, background: 'rgba(120,140,115,.25)' }}></span>
            </div>
            <button className="btn3d soft pill" onClick={createAccount}
              style={{ width: '100%', padding: '14px', fontSize: 14.5, fontWeight: 700, gap: 9, color: 'var(--green-700)' }}>
              {Ic.spark({ width: 17, height: 17 })} {tr('Create your account')}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 16, fontSize: 11, fontWeight: 600, color: 'var(--muted-2)' }}>
              {Ic.lock({ width: 13, height: 13 })} {tr('Your health data stays on your device.')}
            </div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--ink)', letterSpacing: '-.01em' }}>{tr('Doctor sign-in')}</div>
            <div className="muted" style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 16 }}>{tr('Doctor accounts are identity- and license-verified.')}</div>

            {verify === 'idle' && <div>
              <div className="fld">
                <label>{tr('Full name')}</label>
                <input type="text" value={docName} placeholder="e.g. Laura Martinez" onChange={(e) => setDocName(e.target.value)} />
              </div>
              <div className="fld">
                <label>{tr('Medical license no.')}</label>
                <input type="text" value={license} placeholder="ES-28-28456" onChange={(e) => setLicense(e.target.value)} />
              </div>
              <div className="fld">
                <label>{tr('Specialty')}</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {SPECS.map((s) =>
                    <button key={s} onClick={() => setSpec(s)} className={'tchip' + (spec === s ? ' on' : '')}
                      style={{ cursor: 'pointer', border: 'none', fontFamily: 'inherit', fontSize: 12 }}>
                      {spec === s ? Ic.check({ width: 12, height: 12 }) : null}{tr(s)}
                    </button>)}
                </div>
              </div>
              <button className="btn3d pill" onClick={verifyDoctor} disabled={!canDoctor}
                style={{ width: '100%', padding: '15px', fontSize: 15.5, fontWeight: 700, gap: 9, opacity: canDoctor ? 1 : .55 }}>
                {Ic.shield({ width: 18, height: 18 })} {tr('Verify & sign in')}
              </button>
            </div>}

            {verify === 'busy' && <div style={{ textAlign: 'center', padding: '26px 0 22px' }}>
              <div className="pdf-spin" style={{ margin: '0 auto 16px' }}></div>
              <div style={{ fontWeight: 800, fontSize: 15.5, color: 'var(--ink)' }}>{tr('Verifying your license…')}</div>
              <div className="muted" style={{ fontSize: 12.5, marginTop: 5 }}>{tr('Checked against the medical register')}</div>
            </div>}

            {verify === 'ok' && <div style={{ textAlign: 'center', padding: '26px 0 22px' }}>
              <div style={{ width: 58, height: 58, borderRadius: '50%', margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', background: 'radial-gradient(120% 120% at 30% 25%,#7bd853,#3f8a3f)', boxShadow: '0 10px 22px rgba(58,140,45,.45)' }}>{Ic.check({ width: 28, height: 28 })}</div>
              <div style={{ fontWeight: 800, fontSize: 16.5, color: 'var(--ink)' }}>{tr('License verified')} ✓</div>
              <div className="muted" style={{ fontSize: 13, marginTop: 5 }}>{trf('Welcome, Dr. {name}', { name: docName.trim().split(/\s+/).pop() })}</div>
            </div>}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 16, fontSize: 11, fontWeight: 600, color: 'var(--muted-2)' }}>
              {Ic.shield({ width: 13, height: 13 })} {tr('All listed specialists are identity- and license-verified by Crohn Friends.')}
            </div>
          </div>
        )}
      </div>
    </div>);
}

Object.assign(window, { CFAuth, useAuth, LoginScreen, CFLogoTile, LOGIN_BG });
