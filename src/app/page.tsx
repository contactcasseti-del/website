import { prisma } from '@/lib/db';
import Navbar from '@/components/Navbar';
import VideoPortfolio from '@/components/VideoPortfolio';
import GraphicPortfolio from '@/components/GraphicPortfolio';
import ContactForm from '@/components/ContactForm';
import ScrollRedHeading from '@/components/ScrollRedHeading';

export const revalidate = 0; // Fresh database content on every request

export default async function LandingPage() {
  // Fetch dynamic content from database
  const stats = await prisma.stat.findMany();
  const reviews = await prisma.review.findMany();
  const items = await prisma.portfolioItem.findMany();
  const dbSettings = await prisma.setting.findMany();

  // Find stat values
  const followersStat = stats.find((s) => s.label.toLowerCase().includes('followers'))?.value || '500K+';
  const reachStat = stats.find((s) => s.label.toLowerCase().includes('reach'))?.value || 'Millions';
  const deliveryStat = stats.find((s) => s.label.toLowerCase().includes('delivery'))?.value || 'On-Time';

  const settingsMap = new Map(dbSettings.map((s) => [s.key, s.value]));
  const whatsappNumber = settingsMap.get('whatsapp_number') || '+91 6200539091';
  const whatsappClean = whatsappNumber.replace(/[^0-9]/g, '');
  const contactEmail = settingsMap.get('contact_email') || 'connectcasseti@gmail.com';
  const instagramUrl = settingsMap.get('instagram_url') || 'https://instagram.com';
  const instagramUsername = settingsMap.get('instagram_username') || '@casseti.agency';
  const linkedinUrl = settingsMap.get('linkedin_url') || 'https://linkedin.com/company/casseti';

  return (
    <>
      {/* Ambient background glows */}
      <div className="glow glow-a"></div>
      <div className="glow glow-b"></div>
      <div className="glow glow-c"></div>

      {/* Navigation Header */}
      <Navbar />

      <main className="relative z-10">
        {/* HERO SECTION */}
        <section id="home" className="pt-40 pb-24 px-4 md:px-8 relative overflow-hidden">
          {/* Faint Glowing Bat-Signal HUD Background Watermark */}
          <svg className="batman-signal" viewBox="0 0 512 256" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="currentColor"
              d="M256,16 C272,32 304,80 320,96 C336,112 368,128 384,128 C416,128 432,96 464,80 C480,72 496,80 504,88 C512,96 512,112 504,120 C480,144 440,168 400,176 C352,184 320,168 288,144 C272,132 264,120 256,120 C248,120 240,132 224,144 C192,168 160,184 112,176 C72,168 32,144 8,120 C0,112 0,96 8,88 C16,80 32,72 48,80 C80,96 96,128 128,128 C144,128 176,112 192,96 C208,80 240,32 256,16 Z"
            />
          </svg>

          <div className="max-w-4xl mx-auto text-center flex flex-col items-center justify-center relative z-10">
            <div className="reveal in flex flex-col items-center">
              <div className="inline-flex items-center gap-2 glass rounded-full pl-3 pr-4 py-1.5 mb-6">
                <span className="badge-dot"></span>
                <span className="text-xs font-medium text-inkdim">Open for new projects</span>
              </div>

              <p className="eyebrow mb-3">Creative Production Agency</p>
              <h1 className="font-display text-[4.2rem] leading-[0.92] sm:text-[5.5rem] md:text-[6.5rem] mb-6 hero-3d-text">
                CaSSe<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber to-ember">TI</span>
              </h1>
              <p className="text-inkdim text-base md:text-lg max-w-xl mb-8 leading-relaxed">
                We cut the reels, design the visuals, write the words, and run the pages —
                turning attention into an audience that sticks around.
              </p>

              <div className="flex flex-wrap justify-center gap-3 mb-10">
                <a href="#work" className="btn-solid">
                  View Our Work <i className="fa-solid fa-arrow-up-right text-sm"></i>
                </a>
                <a href="#contact" className="btn-outline">
                  Get in Touch
                </a>
              </div>

              <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-inkdim">
                <a href={`mailto:${contactEmail}`} className="flex items-center gap-2 hover:text-amber transition">
                  <i className="fa-solid fa-envelope"></i> {contactEmail}
                </a>
                <a href={instagramUrl} className="flex items-center gap-2 hover:text-amber transition" target="_blank" rel="noopener noreferrer">
                  <i className="fa-brands fa-instagram"></i> {instagramUsername}
                </a>
                <span className="flex items-center gap-2">
                  <i className="fa-solid fa-location-dot"></i> Remote · Worldwide
                </span>
              </div>
            </div>
          </div>


          {/* Quick stats grid */}
          <div className="max-w-6xl mx-auto mt-20 grid grid-cols-3 gap-4 md:gap-8 reveal in">
            <div className="glass rounded-2xl p-5 md:p-7 text-center tilt-card">
              <p className="font-display text-3xl md:text-4xl text-amber">{followersStat}</p>
              <p className="text-xs md:text-sm text-inkdim mt-1">Followers grown</p>
            </div>
            <div className="glass rounded-2xl p-5 md:p-7 text-center tilt-card">
              <p className="font-display text-3xl md:text-4xl text-amber">{reachStat}</p>
              <p className="text-xs md:text-sm text-inkdim mt-1">Accounts reached</p>
            </div>
            <div className="glass rounded-2xl p-5 md:p-7 text-center tilt-card">
              <p className="font-display text-3xl md:text-4xl text-amber">{deliveryStat}</p>
              <p className="text-xs md:text-sm text-inkdim mt-1">Every delivery</p>
            </div>
          </div>
        </section>

        <div className="divider-line"></div>

        {/* SERVICES SECTION */}
        <section id="services" className="section py-24 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <p className="eyebrow mb-3 reveal in">00 — What We Do</p>
            <ScrollRedHeading text="One Agency. Every Piece of Your Content." className="font-display text-4xl md:text-5xl mb-4 reveal in" />
            <p className="text-inkdim max-w-xl mb-14 reveal in">
              From the first cut to the caption to the strategy behind the post — we handle the full pipeline so your page never misses a beat.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="glass rounded-2xl p-6 reveal in tilt-card">
                <div className="w-12 h-12 rounded-xl bg-amber/15 text-amber flex items-center justify-center mb-5">
                  <i className="fa-solid fa-film"></i>
                </div>
                <h3 className="font-semibold text-lg mb-2">Video Editing</h3>
                <p className="text-sm text-inkdim leading-relaxed">
                  Reels, shorts, and cinematic edits built to stop the scroll and hold it.
                </p>
              </div>
              <div className="glass rounded-2xl p-6 reveal in tilt-card" style={{ transitionDelay: '.05s' }}>
                <div className="w-12 h-12 rounded-xl bg-amber/15 text-amber flex items-center justify-center mb-5">
                  <i className="fa-solid fa-palette"></i>
                </div>
                <h3 className="font-semibold text-lg mb-2">Graphic Design</h3>
                <p className="text-sm text-inkdim leading-relaxed">
                  Feed posts, covers, and brand visuals with one consistent, premium look.
                </p>
              </div>
              <div className="glass rounded-2xl p-6 reveal in tilt-card" style={{ transitionDelay: '.1s' }}>
                <div className="w-12 h-12 rounded-xl bg-amber/15 text-amber flex items-center justify-center mb-5">
                  <i className="fa-solid fa-pen-nib"></i>
                </div>
                <h3 className="font-semibold text-lg mb-2">Script Writing</h3>
                <p className="text-sm text-inkdim leading-relaxed">
                  Hooks, structure, and copy written to be watched, not skipped.
                </p>
              </div>
              <div className="glass rounded-2xl p-6 reveal in tilt-card" style={{ transitionDelay: '.15s' }}>
                <div className="w-12 h-12 rounded-xl bg-amber/15 text-amber flex items-center justify-center mb-5">
                  <i className="fa-solid fa-chart-line"></i>
                </div>
                <h3 className="font-semibold text-lg mb-2">Page & Content Management</h3>
                <p className="text-sm text-inkdim leading-relaxed">
                  Posting, growth strategy, and content marketing, fully managed end to end.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="divider-line"></div>

        {/* EDITING SECTION */}
        <section id="editing" className="section py-24 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <p className="eyebrow mb-3 reveal in">01 — Editing</p>
            <ScrollRedHeading text="Cut For The Feed. Built For The Big Screen." className="font-display text-4xl md:text-5xl mb-4 reveal in" />
            <p className="text-inkdim max-w-xl mb-14 reveal in">
              Two formats, one standard: fast-paced vertical edits for Reels and Shorts, and slower, long format cuts for brand films and ads. Click to watch the showreel clips.
            </p>

            <VideoPortfolio items={items.filter((i) => i.type.startsWith('VIDEO_'))} />
          </div>
        </section>

        <div className="divider-line"></div>

        {/* GRAPHIC DESIGN SECTION */}
        <section id="design" className="section py-24 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <p className="eyebrow mb-3 reveal in">02 — Graphic Design</p>
            <ScrollRedHeading text="Visuals That Match The Brand, Every Time" className="font-display text-4xl md:text-5xl mb-4 reveal in" />
            <p className="text-inkdim max-w-xl mb-14 reveal in">
              From single feed posts and brand covers to full carousel slides and logo concepts — click to inspect details.
            </p>

            <GraphicPortfolio items={items.filter((i) => i.type === 'GRAPHIC')} />
          </div>
        </section>

        <div className="divider-line"></div>

        {/* TOOLKIT SECTION */}
        <section id="tools" className="section py-20 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <p className="eyebrow mb-3 reveal in">03 — Toolkit</p>
            <ScrollRedHeading text="Built With The Industry Standard" className="font-display text-3xl md:text-4xl mb-12 reveal in" />

            <div className="grid grid-cols-4 md:grid-cols-8 gap-4 md:gap-6">
              {[
                { name: 'Premiere', shortcut: 'Pr', bg: 'rgba(0,55,105,.5)', text: '#66C6FF' },
                { name: 'After FX', shortcut: 'Ae', bg: 'rgba(60,20,90,.5)', text: '#D8A6FF' },
                { name: 'Photoshop', shortcut: 'Ps', bg: 'rgba(0,45,90,.5)', text: '#5BB8FF' },
                { name: 'Illustrator', shortcut: 'Ai', bg: 'rgba(90,45,0,.5)', text: '#FFB25B' },
                { name: 'CapCut', shortcut: 'Cc', bg: 'rgba(20,20,20,.6)', text: '#F4F1EC' },
                { name: 'Resolve', shortcut: 'Dr', bg: 'rgba(60,10,35,.5)', text: '#FF7BA8' },
                { name: 'Canva', shortcut: 'Ca', bg: 'rgba(0,55,55,.5)', text: '#5BEAD1' },
                { name: 'Figma', shortcut: 'Fg', bg: 'rgba(60,45,0,.5)', text: '#FFD37A' },
              ].map((tool, idx) => (
                <div key={tool.name} className="tool-badge reveal in" style={{ transitionDelay: `${idx * 0.03}s` }}>
                  <div className="icon" style={{ backgroundColor: tool.bg, color: tool.text }}>
                    {tool.shortcut}
                  </div>
                  <p className="text-center text-xs text-inkdim mt-2">{tool.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="divider-line"></div>

        {/* SCRIPT WRITING SECTION */}
        <section id="scripts" className="section py-24 px-4 md:px-8">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
            <div className="reveal in">
              <p className="eyebrow mb-3">04 — Script Writing</p>
              <ScrollRedHeading text="The Words Before The Cut" className="font-display text-4xl md:text-5xl mb-6" />
              <p className="text-inkdim leading-relaxed mb-6">
                Our script archive lives inside our clients' private content calendars, so there's no public portfolio to show here yet.
                What we can tell you: we write hooks that earn the first three seconds, structure that keeps watch-time high,
                and a voice that matches the page it's written for — then we manage the whole process from first draft to final cut.
              </p>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <i className="fa-solid fa-circle-check text-amber"></i> Hook-first openings built for retention
                </li>
                <li className="flex items-center gap-3">
                  <i className="fa-solid fa-circle-check text-amber"></i> Platform-native pacing for Reels, Shorts & YouTube
                </li>
                <li className="flex items-center gap-3">
                  <i className="fa-solid fa-circle-check text-amber"></i> Brand-voice matching for creators & businesses
                </li>
                <li className="flex items-center gap-3">
                  <i className="fa-solid fa-circle-check text-amber"></i> Ad scripts & UGC-style briefs
                </li>
              </ul>
              <p className="text-xs text-inkdim mt-6 border border-white/10 rounded-full inline-block px-4 py-2">
                Portfolio in progress — ask us for a free sample script on a call.
              </p>
            </div>

            <div className="glass rounded-2xl p-6 md:p-8 font-mono text-xs md:text-sm leading-relaxed reveal in tilt-card" style={{ transitionDelay: '.1s' }}>
              <p className="text-inkdim mb-3">// sample structure we follow</p>
              <p className="text-amber mb-1">
                HOOK <span className="text-inkdim">(0–3s)</span>
              </p>
              <p className="text-ink mb-4">A bold claim or question that stops the scroll.</p>
              <p className="text-amber mb-1">
                SETUP <span className="text-inkdim">(3–8s)</span>
              </p>
              <p className="text-ink mb-4">Establish the problem or the stakes in one line.</p>
              <p className="text-amber mb-1">
                PAYOFF <span className="text-inkdim">(8–20s)</span>
              </p>
              <p className="text-ink mb-4">Deliver the value — the tip, the story, the reveal.</p>
              <p className="text-amber mb-1">
                CTA <span className="text-inkdim">(final 2–3s)</span>
              </p>
              <p className="text-ink">One clear next step — follow, comment, or click.</p>
            </div>
          </div>
        </section>

        <div className="divider-line"></div>

        {/* CASE STUDY SECTION */}
        <section id="work" className="section py-24 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <p className="eyebrow mb-3 reveal in">05 — Past Work</p>
            <ScrollRedHeading text="Growing @Officer_Barza" className="font-display text-4xl md:text-5xl mb-14 reveal in" />

            <div className="glass rounded-3xl p-6 md:p-10 grid lg:grid-cols-2 gap-10 items-center tilt-card">
              <div className="reveal in">
                <p className="text-inkdim leading-relaxed mb-6">
                  CaSSeTI took over full content operations for the Officer Barza page — editing, posting cadence, and growth
                  strategy — and scaled it into one of its niche's most-watched accounts. Every video was cut, captioned,
                  and scheduled by our team from start to finish.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-white/10 p-5">
                    <p className="font-display text-3xl text-amber">500K+</p>
                    <p className="text-xs text-inkdim mt-1">Followers gained</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 p-5">
                    <p className="font-display text-3xl text-amber">Millions</p>
                    <p className="text-xs text-inkdim mt-1">Accounts reached</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 p-5 col-span-2">
                    <p className="font-display text-2xl text-amber">Full-Service</p>
                    <p className="text-xs text-inkdim mt-1">Editing, posting & growth — fully managed</p>
                  </div>
                </div>
              </div>

              <div className="reveal in" style={{ transitionDelay: '.1s' }}>
                <div className="glass rounded-2xl p-6 max-w-sm mx-auto">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber to-ember flex items-center justify-center font-display text-void text-lg">
                      OB
                    </div>
                    <div>
                      <p className="font-semibold text-sm">@officer_barza</p>
                      <p className="text-xs text-inkdim">Managed by CaSSeTI</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 divide-x divide-white/10 text-center border-t border-white/10 pt-4">
                    <div>
                      <p className="font-display text-lg text-ink">500K+</p>
                      <p className="text-[10px] text-inkdim">Followers</p>
                    </div>
                    <div>
                      <p className="font-display text-lg text-ink">Millions</p>
                      <p className="text-[10px] text-inkdim">Reached</p>
                    </div>
                    <div>
                      <p className="font-display text-lg text-ink">CaSSeTI</p>
                      <p className="text-[10px] text-inkdim">Managed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="divider-line"></div>

        {/* TESTIMONIALS SECTION */}
        <section id="reviews" className="section py-24 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <p className="eyebrow mb-3 reveal in">06 — Client Reviews</p>
            <ScrollRedHeading text="What Clients Say" className="font-display text-4xl md:text-5xl mb-14 reveal in" />

            <div className="grid md:grid-cols-3 gap-5">
              {reviews.map((review, idx) => (
                <div
                  key={review.id}
                  className="glass rounded-2xl p-6 reveal in tilt-card"
                  style={{ transitionDelay: `${idx * 0.05}s` }}
                >
                  <div className="flex gap-1 mb-4 star text-sm">
                    {Array.from({ length: review.stars }).map((_, i) => (
                      <i key={i} className="fa-solid fa-star"></i>
                    ))}
                  </div>
                  <p className="text-sm text-ink leading-relaxed mb-6">"{review.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber/20 text-amber flex items-center justify-center font-semibold text-sm">
                      {review.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{review.name}</p>
                      <p className="text-xs text-inkdim">{review.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="divider-line"></div>

        {/* CONTACT SECTION */}
        <section id="contact" className="section py-24 px-4 md:px-8">
          <ContactForm
            email={contactEmail}
            instagramUrl={instagramUrl}
            linkedinUrl={linkedinUrl}
            whatsappNumber={whatsappNumber}
          />
        </section>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 px-4 md:px-8 py-10 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <a href="#home" className="font-display text-xl">
            CaSSe<span className="text-amber">TI</span>
          </a>
          <p className="text-xs text-inkdim">© 2026 CaSSeTI. All rights reserved.</p>
          <div className="flex gap-4 text-inkdim">
            <a href={instagramUrl} className="hover:text-amber transition" target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-instagram text-lg"></i>
            </a>
            <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-amber transition">
              <i className="fa-brands fa-linkedin text-lg"></i>
            </a>
            <a href={`https://wa.me/${whatsappClean}`} className="hover:text-amber transition" target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-whatsapp text-lg"></i>
            </a>
          </div>
        </div>
      </footer>

      {/* Floating call-to-actions */}
      <div className="fixed left-4 bottom-4 md:left-8 md:bottom-8 z-50">
        <a
          href="#contact"
          className="glass rounded-full pl-4 pr-5 py-3 flex items-center gap-2 text-sm font-medium hover:border-amber transition"
        >
          <i className="fa-solid fa-arrow-up-right text-amber animate-pulse"></i> Book a Call
        </a>
      </div>
      <a
        href={`https://wa.me/${whatsappClean}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed right-4 bottom-4 md:right-8 md:bottom-8 z-50 w-14 h-14 rounded-full bg-amber text-void flex items-center justify-center text-xl shadow-lg hover:scale-105 transition"
        aria-label="Chat on WhatsApp"
      >
        <i className="fa-brands fa-whatsapp"></i>
      </a>
    </>
  );
}
