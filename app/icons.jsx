/* ===== Icons (functional UI glyphs) + Forest scene ===== */
const Ic = {
  menu:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" {...p}><path d="M4 7h16M4 12h16M4 17h10"/></svg>),
  arrowR:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12h14M13 6l6 6-6 6"/></svg>),
  back:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M15 18l-6-6 6-6"/></svg>),
  dots:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" {...p}><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>),
  pill:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="8" width="18" height="8" rx="4" transform="rotate(45 12 12)"/><path d="M8.5 8.5l7 7"/></svg>),
  capsule:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="8" width="18" height="8" rx="4" transform="rotate(45 12 12)"/></svg>),
  syringe:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m18 2 4 4"/><path d="m17 7 3-3"/><path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5"/><path d="m9 11 4 4"/><path d="m5 19-3 3"/><path d="m14 4 6 6"/></svg>),
  meal:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 3v8M8 3v8M6.5 11v10M16 3c-2 0-3 2-3 5s1 5 3 5m0-10v18"/></svg>),
  drop:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3c3 4 6 7 6 10.5a6 6 0 1 1-12 0C6 10 9 7 12 3z"/></svg>),
  pulse:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 12h4l2-6 4 14 2-8h6"/></svg>),
  sun:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19"/></svg>),
  cam:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 8a2 2 0 0 1 2-2h2l1.5-2h7L17 6h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="12.5" r="3.5"/></svg>),
  plus:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" {...p}><path d="M12 5v14M5 12h14"/></svg>),
  send:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" {...p}><path d="M3.4 20.4l17.4-7.5c.9-.4.9-1.6 0-2L3.4 3.6c-.7-.3-1.5.3-1.3 1.1L3.8 11 13 12l-9.2 1-1.7 5.3c-.2.8.6 1.4 1.3 1.1z"/></svg>),
  users:(p)=>(<svg viewBox="0 0 24 24" width="27" height="27" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="8.6" r="3"/><path d="M6.4 19.2a5.6 5.6 0 0 1 11.2 0"/><circle cx="4.8" cy="8" r="2.2"/><path d="M1 17.4a4 4 0 0 1 4.3-3.8"/><circle cx="19.2" cy="8" r="2.2"/><path d="M23 17.4a4 4 0 0 0-4.3-3.8"/></svg>),
  heart:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 20s-7-4.6-9.2-9C1.3 8 2.7 4.5 6 4.5c2 0 3.2 1.3 4 2.5.8-1.2 2-2.5 4-2.5 3.3 0 4.7 3.5 3.2 6.5C19 15.4 12 20 12 20z"/></svg>),
  hand:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M8 11V5.5a1.5 1.5 0 0 1 3 0V11m0-1.5v-3a1.5 1.5 0 0 1 3 0V11m0-1.5a1.5 1.5 0 0 1 3 0V13c0 3.5-2 6.5-5.5 6.5S8 16.5 8 14l-2-3a1.4 1.4 0 0 1 2-2z"/></svg>),
  clip:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="5" y="4" width="14" height="17" rx="2.5"/><path d="M9 4.5h6V3H9zM8.5 11l2 2 4-4"/></svg>),
  eye:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>),
  home:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 11.5L12 4l8 7.5M6 10v9h12v-9"/></svg>),
  cal:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3.5" y="5" width="17" height="16" rx="3"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/></svg>),
  chat:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 5.5h16a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 20 16.5H9l-4.5 4v-4H4A1.5 1.5 0 0 1 2.5 15V7A1.5 1.5 0 0 1 4 5.5z"/></svg>),
  leaf:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 20c0-9 6-15 16-15 0 10-6 16-15 15M4 20c2-6 5-9 10-11"/></svg>),
  paw:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><ellipse cx="6" cy="9.5" rx="1.7" ry="2.3"/><ellipse cx="10" cy="6.5" rx="1.7" ry="2.4"/><ellipse cx="14" cy="6.5" rx="1.7" ry="2.4"/><ellipse cx="18" cy="9.5" rx="1.7" ry="2.3"/><path d="M12 12.5c-2.6 0-4.6 1.7-5.2 3.7-.5 1.7.8 3.3 2.6 3.3.9 0 1.7-.4 2.6-.4s1.7.4 2.6.4c1.8 0 3.1-1.6 2.6-3.3-.6-2-2.6-3.7-5.2-3.7z"/></svg>),
  shuffle:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M16 4h4v4M20 4l-6 6M4 20l5-5M16 20h4v-4M4 4l16 16"/></svg>),
  book:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path d="M8 7h7M8 11h5"/></svg>),
  flame:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3c1 3 4 4.5 4 8a4 4 0 0 1-8 0c0-1.4.5-2.4 1.2-3.2C9.6 9 11 7.5 12 3z"/><path d="M12 21a5 5 0 0 1-5-5c0-3 2-4.5 2-4.5"/></svg>),
  bolt:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M13 2L4 14h7l-1 8 9-12h-7z"/></svg>),
  moon:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 12.8A8.5 8.5 0 0 1 11.2 3 7 7 0 1 0 21 12.8z"/></svg>),
  bed:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 18V8M3 12h13a4 4 0 0 1 4 4v2M3 18h18M7 11h0"/><circle cx="7.5" cy="11" r="1.6"/></svg>),
  run:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="15" cy="5" r="2"/><path d="M13 8l-4 3 3 3 1 6M9 11l-3 1-2 4M12 14l4 1 2 4"/></svg>),
  spark:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l2.6 2.6M16.4 16.4 19 19M19 5l-2.6 2.6M7.6 16.4 5 19"/><circle cx="12" cy="12" r="3.2"/></svg>),
  gut:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 4v5a3 3 0 0 0 3 3 3 3 0 0 1 3 3 3 3 0 0 0 6 0V8"/><path d="M6 4H3.5M18 8h2.5"/></svg>),
  tv:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="2.5" y="5.5" width="19" height="12" rx="2"/><path d="M8 21h8M12 17.5V21"/></svg>),
  smoke:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="2.5" y="13.5" width="14" height="4" rx="1"/><path d="M12.5 13.5v4"/><path d="M18.5 6c.9.9.9 2 0 2.9M15.5 5c.9.9.9 2 0 2.9M21 13.5v4"/></svg>),
  glass:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M7 3h10l-1.2 7.6a3.9 3.9 0 0 1-7.6 0z"/><path d="M12 16.6V21M8.5 21h7"/></svg>),
  flask:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9.5 3h5M10.5 3v6.2l-5 8.4A1.6 1.6 0 0 0 6.9 20h10.2a1.6 1.6 0 0 0 1.4-2.4l-5-8.4V3"/><path d="M7.6 14.5h8.8"/></svg>),
  mind:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9.5 18h5M10 21h4"/><path d="M12 3a6 6 0 0 0-3.8 10.7c.5.4.8 1 .8 1.6v.2h6v-.2c0-.6.3-1.2.8-1.6A6 6 0 0 0 12 3z"/></svg>),
  lovePeople:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="8" cy="8" r="3"/><path d="M2.5 20a5.5 5.5 0 0 1 11 0"/><path d="M17.5 11.4c1.1-1.3 3.5-.6 3.5 1.1 0 1.7-3.5 3.6-3.5 3.6S14 14.2 14 12.5c0-1.7 2.4-2.4 3.5-1.1z"/></svg>),
  toxic:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M10.3 4.3 2.6 17.9A2 2 0 0 0 4.3 21h15.4a2 2 0 0 0 1.7-3.1L13.7 4.3a2 2 0 0 0-3.4 0z"/><path d="M12 9.5v4.2M12 17.2h.01"/></svg>),
  download:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3v11M8 10l4 4 4-4"/><path d="M4 17v1.5A2.5 2.5 0 0 0 6.5 21h11a2.5 2.5 0 0 0 2.5-2.5V17"/></svg>),
  chevL:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M15 18l-6-6 6-6"/></svg>),
  chevR:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9 18l6-6-6-6"/></svg>),
  bell:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M18 8a6 6 0 1 0-12 0c0 6-2.2 7.5-2.2 7.5h16.4S18 14 18 8z"/><path d="M10.3 20a2 2 0 0 0 3.4 0"/></svg>),
  bellRing:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" {...p}><path d="M12 2a6 6 0 0 0-6 6c0 5-2 6.4-2 6.4-.4.4-.1 1.1.5 1.1h15c.6 0 .9-.7.5-1.1 0 0-2-1.4-2-6.4a6 6 0 0 0-6-6z"/><path d="M10 20a2 2 0 0 0 4 0z"/><path d="M3.5 4.2 5 5.7M20.5 4.2 19 5.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/></svg>),
  clock:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 2"/></svg>),
  edit:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3z"/><path d="M13.5 6.5l3 3"/></svg>),
  trash:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 6.5h16M9 6.5V4.5h6v2M6.5 6.5 7.5 20a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1l1-13.5M10 10v7M14 10v7"/></svg>),
  snooze:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="13" r="8"/><path d="M9.5 10h5l-5 6h5M12 5V2.5M8 2.5h8"/></svg>),
  check:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12.5l4.5 4.5L19 7"/></svg>),
  x:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 6l12 12M18 6 6 18"/></svg>),
  skip:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M7 5v14M19 5v14M7 12l12-7v14z" transform="scale(-1,1) translate(-24,0)"/></svg>),
  refill:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 11A8 8 0 1 0 19 15"/><path d="M20 5v6h-6"/></svg>),
  flame2:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" {...p}><path d="M12 2c1 3.5 4.2 4.6 4.2 8.5A4.2 4.2 0 0 1 12 15a2.4 2.4 0 0 1-2.4-2.4c0-1.3 1-2 1-2-2.6.4-4.6 2.6-4.6 5.3A6 6 0 0 0 12 22a6.4 6.4 0 0 0 6.4-6.4C18.4 9 14 7 12 2z"/></svg>),
  globe:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18"/></svg>),
  shield:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3l7 3v5.5c0 4.5-3 7.8-7 9.5-4-1.7-7-5-7-9.5V6z"/><path d="M9 12l2 2 4-4"/></svg>),
  doc:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M9.5 13h6M9.5 16.5h6"/></svg>),
  scale:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3v18M7 21h10M5 7h14M5 7l-3 6a3 3 0 0 0 6 0zM19 7l-3 6a3 3 0 0 0 6 0zM12 7 6 5.5M12 7l6-1.5"/></svg>),
  info:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.5h.01"/></svg>),
  qmark:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="9"/><path d="M9.2 9.3a2.8 2.8 0 0 1 5.4 1c0 1.8-2.6 2.2-2.6 4M12 17.5h.01"/></svg>),
  star:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.6l1-5.8-4.3-4.1 5.9-.9z"/></svg>),
  logout:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M14 4h4a1.5 1.5 0 0 1 1.5 1.5v13A1.5 1.5 0 0 1 18 20h-4M10 8l-4 4 4 4M6 12h10"/></svg>),
  phone:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>),
  cookie:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3a9 9 0 1 0 9 9 3.5 3.5 0 0 1-4-4 3.5 3.5 0 0 1-5-5z"/><path d="M9 10h.01M14 13h.01M10 15h.01"/></svg>),
  sliders:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 5v6M5 15v4M12 5v3M12 12v7M19 5v9M19 18v1"/><circle cx="5" cy="13" r="2"/><circle cx="12" cy="10" r="2"/><circle cx="19" cy="16" r="2"/></svg>),
  ruler:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="2.5" y="8" width="19" height="8" rx="1.5" transform="rotate(0 12 12)"/><path d="M6.5 8v3M10 8v4M13.5 8v3M17 8v4"/></svg>),
  lock:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3M12 14.5v2"/></svg>),
  gear:(p)=>(<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="3.2"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg>),
};

/* CF monogram logo */
function CFLogo({size=40,color="#fff"}){
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path d="M33 14.5C30.7 12.4 27.6 11 24 11c-7.2 0-13 5.8-13 13s5.8 13 13 13c3.6 0 6.7-1.4 9-3.5"
        stroke={color} strokeWidth="3.4" strokeLinecap="round"/>
      <path d="M22 18h13M22 24.5h10" stroke={color} strokeWidth="3.4" strokeLinecap="round"/>
    </svg>
  );
}

/* Exact CF monogram (recreated) with green→white vertical fade */
function CFMark({size=92}){
  const gid = 'cfm-' + React.useId().replace(/:/g,'');
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" aria-label="Crohn Friends">
      <defs>
        <linearGradient id={gid} gradientUnits="userSpaceOnUse" x1="60" y1="20" x2="60" y2="104">
          <stop offset="0" stopColor="#1f9d3a"/>
          <stop offset="0.55" stopColor="#43b24a"/>
          <stop offset="0.82" stopColor="#7fce77"/>
          <stop offset="1" stopColor="#ffffff"/>
        </linearGradient>
      </defs>
      <g stroke={`url(#${gid})`} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* C */}
        <path d="M68 26 L46 26 A37 37 0 0 0 46 100 L68 100"/>
        {/* F: top arm, stem, middle arm */}
        <path d="M86 26 L108 26"/>
        <path d="M86 26 L86 100"/>
        <path d="M86 63 L106 63"/>
      </g>
    </svg>
  );
}

/* Layered CSS/SVG forest scene */
function ForestScene({height=360, flip=false}){
  return (
    <div style={{position:'relative',width:'100%',height,overflow:'hidden'}}>
      {/* sky gradient */}
      <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,#bfe6a8 0%,#7cc36a 30%,#3f8a3f 75%,#2c6730 100%)'}}/>
      {/* distant hills */}
      <svg viewBox="0 0 393 360" preserveAspectRatio="xMidYMid slice" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
        <defs>
          <linearGradient id="h1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8fcf78"/><stop offset="1" stopColor="#5aa84f"/></linearGradient>
          <linearGradient id="h2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4f9846"/><stop offset="1" stopColor="#2f6e34"/></linearGradient>
          <linearGradient id="h3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#347438"/><stop offset="1" stopColor="#1d4a24"/></linearGradient>
          <linearGradient id="h4" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3f8c3f"/><stop offset="1" stopColor="#1a3d1f"/></linearGradient>
        </defs>
        <path d="M0 120 Q90 70 180 110 T393 95 V360 H0 Z" fill="url(#h1)" opacity=".9"/>
        <path d="M0 175 Q120 120 230 160 T393 150 V360 H0 Z" fill="url(#h2)"/>
        {/* mid trees */}
        <g fill="url(#h3)">
          <path d="M70 250 l22 -85 22 85 z"/>
          <path d="M50 270 l18 -64 18 64 z"/>
        </g>
        <path d="M0 230 Q100 185 210 220 T393 205 V360 H0 Z" fill="url(#h3)"/>
        {/* foreground bushy canopy */}
        <path d="M0 290 Q60 250 120 285 Q170 250 230 288 Q300 255 393 295 V360 H0 Z" fill="url(#h4)"/>
        {/* tall pine */}
        <g fill="#1f4a26">
          <path d="M250 300 l30 -150 30 150 z"/>
          <path d="M258 285 l22 -95 22 95 z" fill="#2c6230"/>
        </g>
        {/* foreground grass blades */}
        <g stroke="#2bd14a" strokeWidth="3" strokeLinecap="round" opacity=".85">
          <path d="M20 360 C24 320 30 310 26 300"/><path d="M40 360 C44 326 52 312 46 302"/>
          <path d="M340 360 C344 320 352 308 346 298"/><path d="M366 360 C370 330 378 316 372 306"/>
        </g>
      </svg>
      {/* atmospheric glow */}
      <div style={{position:'absolute',inset:0,background:'radial-gradient(80% 50% at 70% 18%, rgba(190,255,170,.5), transparent 60%)'}}/>
    </div>
  );
}

Object.assign(window,{Ic,CFLogo,CFMark,ForestScene});
