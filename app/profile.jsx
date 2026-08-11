/* ===================================================================
   USER PROFILE — a tiny shared store for the signed-in person.
   Holds name, status line and avatar (uploaded photo OR a colour with
   initials). Persists to localStorage so edits stick across reloads,
   and notifies subscribers (avatar, welcome bar, settings, posts…).
   =================================================================== */
const CF_PROFILE_KEY = 'cf_profile_v1';

const CF_PROFILE_DEFAULTS = {
  name: 'Gerard',
  email: 'gerard@crohnfriends.app',
  status: '',          // optional short status / bio line
  avatarPhoto: null,   // dataURL of an uploaded photo
  avatarColor: null,   // hex of a chosen colour avatar (with initials)
};

/* curated avatar colours (shared chroma/lightness, varied hue) */
const CF_AVATAR_COLORS = ['#3f8a3f', '#1fa596', '#2f7fd4', '#7556d0', '#d4569e', '#d98a26', '#c0563f'];

function cfLoadProfile() {
  try {
    const r = JSON.parse(localStorage.getItem(CF_PROFILE_KEY));
    if (r && typeof r === 'object') return { ...CF_PROFILE_DEFAULTS, ...r };
  } catch (e) {}
  return { ...CF_PROFILE_DEFAULTS };
}

const CFProfile = {
  data: cfLoadProfile(),
  listeners: new Set(),
  subscribe(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn); },
  persist() { try { localStorage.setItem(CF_PROFILE_KEY, JSON.stringify(this.data)); } catch (e) {} },
  emit() { this.persist(); this.listeners.forEach((fn) => fn()); },
  get() { return this.data; },
  update(patch) { this.data = { ...this.data, ...patch }; this.emit(); },
  firstName() { return (this.data.name || 'Gerard').trim().split(/\s+/)[0]; },
  initials() {
    const parts = (this.data.name || 'G').trim().split(/\s+/).filter(Boolean);
    const a = parts[0] ? parts[0][0] : 'G';
    const b = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (a + b).toUpperCase();
  },
};

/* subscribe a component to profile changes */
function useProfile() {
  const [, force] = React.useState(0);
  React.useEffect(() => CFProfile.subscribe(() => force((x) => x + 1)), []);
  return CFProfile.get();
}

Object.assign(window, { CFProfile, useProfile, CF_AVATAR_COLORS, cfLoadProfile });
