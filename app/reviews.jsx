/* ===== Doctor Reviews Sheet ===== */

/* ── Review text pools per specialty ── */
const REVIEW_TEXT_POOL = {
  gastro: [
    { text: "Dr. Martinez really took the time to understand my full Crohn's history before touching my treatment plan. My symptoms have improved dramatically in three months — I finally feel genuinely heard.", stars: 5 },
    { text: "Finally a gastroenterologist who listens! She explained everything clearly, never rushed the appointment, and the follow-up care has been exceptional from day one.", stars: 5 },
    { text: "Very knowledgeable and thorough. The colonoscopy was handled professionally and the results explained in plain language. I left the appointment actually understanding my condition.", stars: 5 },
    { text: "Good overall experience. Waiting times can be a bit long but the quality of care more than makes up for it. Would still highly recommend to anyone with IBD.", stars: 4 },
    { text: "Recommended a dietary adjustment alongside my medication and it's made a huge difference. Wish I had found her sooner — ten years of struggling for nothing.", stars: 5 },
    { text: "Excellent bedside manner. She remembers details from previous visits and always checks in on lifestyle factors too, not just symptoms.", stars: 5 },
    { text: "Responsive and caring. Always answers questions in the app chat within 24 hours. That kind of availability is rare and invaluable for a chronic illness.", stars: 5 },
    { text: "Ordered a full panel of tests and caught something my previous doctor had missed for years. Thorough and proactive — exactly what you want.", stars: 4 },
  ],
  ibd: [
    { text: "Living with Crohn's for 8 years and this doctor finally got my inflammation under control. The personalised treatment plan made all the difference.", stars: 5 },
    { text: "Incredibly thorough. Reviewed my entire medical history before our first appointment and arrived with a comprehensive care plan already prepared.", stars: 5 },
    { text: "Knowledgeable about the latest biologics and helped me transition off steroids successfully. My quality of life has completely transformed.", stars: 5 },
    { text: "Takes time to answer every question and never makes me feel rushed or like a burden. That matters enormously when managing a chronic illness.", stars: 4 },
    { text: "My calprotectin levels have been in normal range for 6 months straight. After years of active inflammation, this feels genuinely life-changing.", stars: 5 },
    { text: "Very data-driven approach — reviews my check-in logs from the app before every appointment and uses them to spot patterns I'd never noticed myself.", stars: 5 },
    { text: "Helped me understand the difference between functional symptoms and actual inflammation. That knowledge changed how I manage every day.", stars: 5 },
  ],
  surgeon: [
    { text: "Had a bowel resection and recovery was smoother than I ever expected. Her surgical skill is exceptional and the aftercare programme was incredibly thorough.", stars: 5 },
    { text: "The pre-surgery consultation was detailed and genuinely reassuring. She answered every question I had, however small. The procedure went perfectly.", stars: 5 },
    { text: "Post-op care was outstanding. Regular check-ins via the app made recovery feel supported rather than frightening.", stars: 5 },
    { text: "Minimally invasive approach meant I was back on my feet in two weeks — far better than what I'd been told to expect elsewhere.", stars: 5 },
    { text: "Clear communicator who walked me through exactly what to expect before, during and after surgery. Made a scary situation genuinely manageable.", stars: 4 },
    { text: "Had a strictureplasty that avoided a full resection thanks to her conservative, expert approach. Forever grateful for that decision.", stars: 5 },
  ],
  nutrition: [
    { text: "The low-FODMAP plan she designed for my specific triggers cut my flares in half within a month. Practical, detailed, and easy to follow in real life.", stars: 5 },
    { text: "Finally someone who understands IBD nutrition deeply. No generic advice — every recommendation was tailored to my exact trigger profile.", stars: 5 },
    { text: "Identified my trigger foods through a careful elimination protocol. My gut health has genuinely never been better in six years.", stars: 5 },
    { text: "Excellent at explaining the science behind why certain foods affect Crohn's. Really helped me understand my own body rather than just follow rules.", stars: 4 },
    { text: "The meal plans are realistic and honestly delicious. She checks in regularly and adjusts them as my symptoms shift season to season.", stars: 5 },
    { text: "Helped me maintain proper nutrition during a severe flare without worsening symptoms. That balance is incredibly hard to strike.", stars: 5 },
  ],
  dietitian: [
    { text: "Created a gut-friendly meal plan I actually enjoy eating. The regular check-ins keep me accountable and make adjustments straightforward.", stars: 5 },
    { text: "Helped me rebuild a healthy relationship with food after years of anxiety stemming from my Crohn's. Life-changing work.", stars: 5 },
    { text: "Practical, evidence-based advice. Not the generic recommendations you find online — actual personalised guidance based on my logs.", stars: 5 },
    { text: "Very supportive and completely non-judgmental. Adjusted my plan multiple times until we found what genuinely works for my lifestyle.", stars: 4 },
    { text: "The food journal integration with the Crohn Friends app is brilliant. She reviews every entry before our sessions and comes prepared.", stars: 5 },
    { text: "Helped me regain healthy weight after a long flare without upsetting my gut. The balance between nutrition and comfort was perfect.", stars: 5 },
  ],
  pediatric: [
    { text: "Amazing with my daughter. She made every clinic visit feel safe and even fun. My daughter actually looks forward to appointments now — that says everything.", stars: 5 },
    { text: "Incredibly patient and thorough. Explained everything to both me and my 13-year-old in ways we could both understand at the same time.", stars: 5 },
    { text: "Got my son's Crohn's under control in under 3 months. The family-centred approach made an enormous difference to how we all cope at home.", stars: 5 },
    { text: "Always involves the child in every decision. My daughter feels empowered rather than talked around, which helps her actually engage with treatment.", stars: 5 },
    { text: "Very knowledgeable about paediatric IBD specifically. Not all gastroenterologists understand the age-specific differences in presentation — she does.", stars: 4 },
    { text: "Took time to address my anxiety as a parent as well as my son's illness. That holistic approach set her apart from everyone else we'd seen.", stars: 5 },
  ],
  psychologist: [
    { text: "Living with a chronic illness is mentally exhausting in ways people don't see. This doctor truly understands that burden and knows exactly how to address it.", stars: 5 },
    { text: "The CBT techniques for managing flare anxiety have been transformative. I'd now recommend psychological support to any Crohn's patient without hesitation.", stars: 5 },
    { text: "Helped me break the stress-flare cycle I'd been trapped in for years. Finally feeling in control of my response to symptoms again.", stars: 5 },
    { text: "Non-judgmental and genuinely warm. Every session feels like a completely safe space to process the emotional weight of living with chronic illness.", stars: 5 },
    { text: "Very knowledgeable about the gut-brain connection. The mindfulness practices have had a real, measurable impact on my day-to-day symptoms.", stars: 4 },
    { text: "Helped me communicate better with my family about my illness. The improvement in those relationships has been really remarkable.", stars: 5 },
  ],
  psychiatrist: [
    { text: "Found the right medication balance after years of struggling with depression alongside Crohn's. Thorough, compassionate, and incredibly well-informed.", stars: 5 },
    { text: "Takes time to understand how psychiatric medications interact with IBD treatments. That level of joined-up expertise is genuinely rare.", stars: 5 },
    { text: "Helped me manage my anxiety without exacerbating my Crohn's symptoms. The careful medication selection made a significant difference.", stars: 4 },
    { text: "Sensitive to the unique challenges of managing mental health alongside a chronic physical illness. Never treats them as separate problems.", stars: 5 },
    { text: "Very responsive via the app. Adjusted my prescription quickly when I reported side effects — I never felt left to manage things alone.", stars: 5 },
  ],
  derm: [
    { text: "Diagnosed my pyoderma gangrenosum in a single appointment after years of misdiagnosis elsewhere. The relief of finally having an answer was indescribable.", stars: 5 },
    { text: "Exceptional knowledge of Crohn's-related skin manifestations. Finally receiving the correct treatment after so long searching.", stars: 5 },
    { text: "Treatment for erythema nodosum worked quickly and the explanations were clear throughout. Follow-up has been thorough and attentive.", stars: 5 },
    { text: "Very knowledgeable about how biologics affect the skin over time. Works closely with my gastroenterologist for a properly coordinated approach.", stars: 4 },
    { text: "Monitored my skin meticulously during a medication change. That careful attention prevented what could easily have been a serious reaction.", stars: 5 },
  ],
  rheum: [
    { text: "Finally someone who manages my arthritis and Crohn's together rather than treating them in complete isolation. The coordinated approach is exactly what I needed.", stars: 5 },
    { text: "My joint pain has reduced by around 70% since starting treatment here. The depth of knowledge about IBD-related arthropathy is genuinely impressive.", stars: 5 },
    { text: "Thoughtful about medication choices — avoids NSAIDs that can worsen IBD. That kind of joined-up thinking is exactly what Crohn's patients need.", stars: 5 },
    { text: "Good listener who takes all symptoms seriously. Follow-up is thorough and he always checks whether treatments are affecting my IBD.", stars: 4 },
  ],
  ophthal: [
    { text: "Detected uveitis early during a routine check-up and treated it quickly before lasting damage. I cannot overstate how much that proactive care meant.", stars: 5 },
    { text: "Specialises in IBD-related eye complications. For the first time I feel my eyes are in genuinely expert, specialised hands.", stars: 5 },
    { text: "Very thorough annual check-ups that specifically screen for the conditions linked to Crohn's. Proactive rather than reactive — exactly right.", stars: 5 },
    { text: "Treated my episcleritis quickly and without fuss. The recovery was fast and the explanation of the underlying cause was genuinely helpful.", stars: 5 },
    { text: "Clear communicator and very reassuring. Makes what can be an anxious appointment feel much more manageable.", stars: 4 },
  ],
  pain: [
    { text: "The chronic pain management plan has genuinely transformed my quality of life. Non-opioid strategies that actually work for Crohn's-related pain.", stars: 5 },
    { text: "Comprehensive approach including nerve blocks, physiotherapy referrals and mindfulness techniques. Not just reaching for a prescription pad.", stars: 4 },
    { text: "After years of having my pain dismissed or minimised, Dr. Grant took it seriously and built a real, structured plan around it.", stars: 5 },
    { text: "Very knowledgeable about Crohn's-specific pain presentations. Doesn't apply generic chronic pain management — it's always properly tailored.", stars: 5 },
    { text: "The TENS therapy and trigger point work has reduced my baseline pain significantly. I can function at a level I honestly hadn't thought possible.", stars: 4 },
    { text: "Works collaboratively with my GI team throughout. The integrated approach has made a real difference to how all my symptoms are managed together.", stars: 5 },
  ],
};

const REVIEWER_NAMES = [
  { name: 'Sarah M.',   seed: 'rev-sarah-m'   },
  { name: 'James T.',   seed: 'rev-james-t'   },
  { name: 'Olivia R.',  seed: 'rev-olivia-r'  },
  { name: 'Michael P.', seed: 'rev-michael-p' },
  { name: 'Emma L.',    seed: 'rev-emma-l'    },
  { name: 'David K.',   seed: 'rev-david-k'   },
  { name: 'Priya S.',   seed: 'rev-priya-s'   },
  { name: 'Carlos V.',  seed: 'rev-carlos-v'  },
  { name: 'Hana W.',    seed: 'rev-hana-w'    },
  { name: 'Jonas B.',   seed: 'rev-jonas-b'   },
  { name: 'Fatima A.',  seed: 'rev-fatima-a'  },
  { name: 'Liam G.',    seed: 'rev-liam-g'    },
  { name: 'Mei C.',     seed: 'rev-mei-c'     },
  { name: 'Tariq H.',   seed: 'rev-tariq-h'   },
  { name: 'Ingrid N.',  seed: 'rev-ingrid-n'  },
];

const REVIEW_DATES = [
  '2 days ago', '5 days ago', '1 week ago', '2 weeks ago',
  '3 weeks ago', '1 month ago', '6 weeks ago', '2 months ago', '3 months ago',
];

/* deterministic integer hash */
function cfRevHash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

function getReviewsForDoctor(doc) {
  const pool = REVIEW_TEXT_POOL[doc.cat] || REVIEW_TEXT_POOL.gastro;
  const count = 5 + (cfRevHash(doc.seed + 'cnt') % 3); // 5–7 reviews
  const seen = new Set();
  const reviews = [];
  for (let i = 0; reviews.length < count && i < count * 3; i++) {
    const textIdx    = cfRevHash(doc.seed + 'tx' + i) % pool.length;
    if (seen.has(textIdx)) continue;
    seen.add(textIdx);
    const revIdx     = cfRevHash(doc.seed + 'rv' + i) % REVIEWER_NAMES.length;
    const dateIdx    = cfRevHash(doc.seed + 'dt' + i) % REVIEW_DATES.length;
    reviews.push({ ...pool[textIdx], reviewer: REVIEWER_NAMES[revIdx], date: REVIEW_DATES[dateIdx] });
  }
  return reviews;
}

/* [5★%,4★%,3★%,2★%,1★%] from overall rating */
function getRatingDist(rating) {
  const r = parseFloat(rating);
  if (r >= 5.0) return [95, 4,  1,  0, 0];
  if (r >= 4.9) return [87, 10, 2,  1, 0];
  if (r >= 4.8) return [78, 17, 3,  2, 0];
  if (r >= 4.7) return [70, 18, 7,  3, 2];
  return              [62, 20, 10, 5, 3];
}

/* ── tiny helper: render N filled/empty stars ── */
function StarRow({ rating, size = 14, gap = 3 }) {
  const filled = Math.round(parseFloat(rating));
  return (
    <div style={{ display: 'flex', gap }}>
      {[1,2,3,4,5].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i <= filled ? '#f5a623' : '#dde8d2'}>
          <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.6l1-5.8-4.3-4.1 5.9-.9z"/>
        </svg>
      ))}
    </div>
  );
}

/* ── the sheet itself ── */
function ReviewsSheet({ doctor, open, onClose }) {
  const [helpful, setHelpful] = React.useState({});

  if (!open || !doctor) return null;

  const reviews = getReviewsForDoctor(doctor);
  const dist    = getRatingDist(doctor.rating);

  const toggleHelpful = (i, val) =>
    setHelpful((prev) => ({ ...prev, [i]: prev[i] === val ? null : val }));

  return (
    <SheetPortal>
      <div className="sheet-backdrop" onClick={onClose}>
        <div className="sheet" onClick={(e) => e.stopPropagation()}
          style={{ maxHeight: '92%', display: 'flex', flexDirection: 'column' }}>

          {/* grab bar */}
          <div className="sheet-grab" style={{ flex: 'none' }} />

          {/* ── header ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 20px 18px', flex: 'none' }}>
            <div style={{ position: 'relative', flex: 'none' }}>
              <div className={'med-chip ' + doctor.color}
                style={{ width: 50, height: 50, borderRadius: '50%', fontSize: 16, fontWeight: 800 }}>
                {doctor.initials}
              </div>
              <span style={{ position: 'absolute', right: -2, bottom: -2, width: 19, height: 19, borderRadius: '50%',
                background: 'linear-gradient(180deg,#7bd853,#54b035)', border: '2.5px solid var(--card)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                boxShadow: '0 3px 7px rgba(58,140,45,.4)' }}>
                <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor"><path d="M6.5 12.5l-4-4 1.4-1.4L6.5 9.7l5.6-5.6 1.4 1.4z"/></svg>
              </span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--ink)', letterSpacing: '-.01em', lineHeight: 1.2 }}>{doctor.name}</div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--green-600)', marginTop: 2 }}>{doctor.spec}</div>
            </div>
            <button className="btn3d soft round" onClick={onClose} style={{ width: 38, height: 38, flex: 'none' }}>
              {Ic.x({ width: 18, height: 18 })}
            </button>
          </div>

          {/* ── scrollable body ── */}
          <div style={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto', padding: '0 20px 28px' }} className="no-scrollbar">

            {/* ── rating summary ── */}
            <div style={{
              background: 'linear-gradient(135deg,#f1f9e8 0%,#e8f5d8 100%)',
              borderRadius: 26, padding: '20px 20px 18px', marginBottom: 22,
              boxShadow: 'inset 0 0 0 1.5px rgba(90,150,70,.18), 0 8px 22px -10px rgba(40,100,25,.18)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>

                {/* big number + stars */}
                <div style={{ textAlign: 'center', flex: 'none', minWidth: 80 }}>
                  <div style={{ fontSize: 54, fontWeight: 900, color: 'var(--ink)', letterSpacing: '-3px', lineHeight: 1 }}>
                    {doctor.rating}
                  </div>
                  <div style={{ marginTop: 6, display: 'flex', justifyContent: 'center' }}>
                    <StarRow rating={doctor.rating} size={18} gap={3} />
                  </div>
                  <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--muted)', marginTop: 6, lineHeight: 1 }}>
                    {doctor.reviews} reviews
                  </div>
                </div>

                {/* bar chart */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {dist.map((pct, idx) => {
                    const stars = 5 - idx;
                    const barColor = pct > 60
                      ? 'linear-gradient(90deg,#7bd853,#54b035)'
                      : pct > 25
                        ? 'linear-gradient(90deg,#a8d460,#78aa38)'
                        : 'linear-gradient(90deg,#cce08a,#a8c05a)';
                    return (
                      <div key={stars} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', width: 8, textAlign: 'right', flex: 'none' }}>{stars}</span>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="#f5a623" style={{ flex: 'none' }}>
                          <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.6l1-5.8-4.3-4.1 5.9-.9z"/>
                        </svg>
                        <div style={{ flex: 1, height: 8, borderRadius: 5, background: 'rgba(120,150,90,.14)', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: pct + '%', borderRadius: 5, background: barColor, transition: 'width .7s cubic-bezier(.22,1,.36,1)' }} />
                        </div>
                        <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--muted)', width: 28, flex: 'none', textAlign: 'right' }}>{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── section label ── */}
            <div className="eyebrow" style={{ margin: '0 2px 14px' }}>Patient reviews</div>

            {/* ── review cards ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
              {reviews.map((rev, i) => (
                <div key={i} style={{
                  background: '#fff', borderRadius: 22, padding: '15px 17px 13px',
                  boxShadow: 'inset 0 0 0 1.5px rgba(110,148,88,.16), 0 6px 18px -8px rgba(30,60,22,.16)',
                }}>
                  {/* reviewer row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 11 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%', flex: 'none', overflow: 'hidden',
                      border: '2px solid rgba(100,158,75,.22)',
                      backgroundImage: `url(https://i.pravatar.cc/80?u=${rev.reviewer.seed})`,
                      backgroundSize: 'cover', backgroundPosition: 'center top',
                      background: '#c8d8b8',
                    }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--ink)', lineHeight: 1.2 }}>{rev.reviewer.name}</div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted-2)', marginTop: 2 }}>Verified patient · {rev.date}</div>
                    </div>
                    <div style={{ flex: 'none' }}>
                      <StarRow rating={rev.stars} size={13} gap={2} />
                    </div>
                  </div>

                  {/* review text */}
                  <p style={{ margin: 0, fontSize: 13.5, fontWeight: 400, color: 'var(--ink-soft)', lineHeight: 1.65, textWrap: 'pretty' }}>
                    {rev.text}
                  </p>

                  {/* helpful row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, paddingTop: 11, borderTop: '1px solid rgba(110,148,88,.12)' }}>
                    <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--muted-2)', flex: 1 }}>Helpful?</span>
                    <button onClick={() => toggleHelpful(i, 'yes')} style={{
                      border: helpful[i] === 'yes' ? 'none' : '1.5px solid rgba(100,150,80,.25)',
                      background: helpful[i] === 'yes' ? 'linear-gradient(180deg,#7bd853,#54b035)' : 'transparent',
                      borderRadius: 11, padding: '4px 13px', fontSize: 11.5, fontWeight: 700,
                      color: helpful[i] === 'yes' ? '#fff' : 'var(--green-700)', cursor: 'pointer',
                      display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'inherit',
                      boxShadow: helpful[i] === 'yes' ? '0 4px 10px rgba(58,140,45,.3)' : 'none',
                      transition: 'all .15s ease',
                    }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
                        <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                      </svg>
                      Yes
                    </button>
                    <button onClick={() => toggleHelpful(i, 'no')} style={{
                      border: helpful[i] === 'no' ? 'none' : '1.5px solid rgba(110,148,88,.2)',
                      background: helpful[i] === 'no' ? 'linear-gradient(180deg,#e8f0e0,#d8e8c8)' : 'transparent',
                      borderRadius: 11, padding: '4px 13px', fontSize: 11.5, fontWeight: 700,
                      color: helpful[i] === 'no' ? 'var(--ink-soft)' : 'var(--muted)', cursor: 'pointer',
                      fontFamily: 'inherit', transition: 'all .15s ease',
                    }}>
                      No
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <p style={{ fontSize: 11.5, textAlign: 'center', color: 'var(--muted)', margin: '18px 8px 0', lineHeight: 1.55 }}>
              All reviews are from verified Crohn Friends patients.
            </p>
          </div>
        </div>
      </div>
    </SheetPortal>
  );
}

Object.assign(window, { ReviewsSheet, StarRow });
