/* ===== App shell: screen routing + bottom tab bar ===== */
const { useState: useState_ } = React;

function App() {
  const t = useT();
  const chats = useChats();
  const [tab, setTab] = useState_('home');
  const [settingsOpen, setSettingsOpen] = useState_(false);
  const [drCFOpen, setDrCFOpen] = useState_(false);
  const [communityTab, setCommunityTab] = useState_('posts');
  const tabs = [
  ['home', t('nav_home'), 'home'],
  ['community', t('nav_community'), 'users'],
  ['schedule', t('nav_journal'), 'cal'],
  ['meds', t('nav_meds'), 'pill']];

  const goCommunity = (subTab) => { setCommunityTab(subTab || 'posts'); setTab('community'); };

  /* capture hooks (screenshot automation for the landing page) */
  React.useEffect(() => {
    window.__cf = { setTab, goCommunity, setDrCFOpen, setSettingsOpen };
  }, []);

  const screen = {
    home: <HomeScreen go={setTab} goCommunity={goCommunity} onAvatar={() => setSettingsOpen(true)} onDrCF={() => setDrCFOpen(true)} />,
    schedule: <ScheduleScreen go={setTab} />,
    meds: <MedsScreen go={setTab} />,
    community: <CommunityScreen go={setTab} communityTab={communityTab} setCommunityTab={setCommunityTab} />
  }[tab];

  return (
    <div className="phone">
      <div className="notch" />
      <div className="screen">
        <div className="screen-scroll" key={tab} style={{ letterSpacing: "0px" }}>{screen}</div>
        <div className="tabbar">
          {tabs.map(([id, lbl, ic]) =>
          <button key={id} className={"tab" + (tab === id ? ' active' : '')} onClick={() => setTab(id)}>
              <span className="tab-ic">{Ic[ic]()}</span>
              <span>{lbl}</span>
            </button>
          )}
        </div>
        {settingsOpen && <SettingsPanel onClose={() => setSettingsOpen(false)} />}
        {drCFOpen && <DrCFScreen onClose={() => setDrCFOpen(false)} />}
        {chats.active && <FriendChatScreen key={chats.active} seed={chats.active} onClose={() => CFChat.close()} />}
      </div>
    </div>);

}

/* ===== Shell: login → onboarding → app ===== */
function Shell() {
  return <App />; /* capture copy: always show the app, skip login/onboarding */
  const auth = useAuth();
  if (!auth) return (
    <div className="phone">
      <div className="notch"></div>
      <div className="screen"><LoginScreen /></div>
    </div>);
  if (!CFAuth.onboarded()) return (
    <div className="phone">
      <div className="notch"></div>
      <div className="screen"><OnboardingFlow /></div>
    </div>);
  return <App />;
}

/* scale phone to fit viewport */
function fit() {
  const stage = document.querySelector('.stage');
  const phone = document.querySelector('.phone');
  if (!stage || !phone) return;
  const pad = 24;
  const s = Math.min((window.innerWidth - pad * 2) / 393, (window.innerHeight - pad * 2) / 852, 1.35);
  phone.style.transform = `scale(${s})`;
}
window.addEventListener('resize', fit);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<div className="stage" style={{ flexDirection: "column", height: "732px", lineHeight: "2", letterSpacing: "0px" }}><Shell /></div>);
setTimeout(fit, 60);