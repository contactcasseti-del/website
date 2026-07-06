import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { requireSession } from '@/lib/auth';
import { logout } from '@/app/actions/auth';
import {
  deleteInquiry,
  updateInquiryStatus,
  updateStat,
  addReview,
  deleteReview,
  uploadPortfolioItem,
  deletePortfolioItem,
  updateSettings,
} from '@/app/actions/admin';

export const revalidate = 0;

export default async function AdminDashboard() {
  // Verify administrator session
  const session = await requireSession();
  const isVercel = !!process.env.VERCEL;


  // Fetch dashboard data
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: 'desc' },
  });
  const stats = await prisma.stat.findMany();
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: 'desc' },
  });
  const portfolioItems = await prisma.portfolioItem.findMany({
    orderBy: { createdAt: 'desc' },
  });
  const dbSettings = await prisma.setting.findMany();
  const settingsMap = new Map(dbSettings.map((s) => [s.key, s.value]));
  const whatsappNumber = settingsMap.get('whatsapp_number') || '+91 00000 00000';
  const contactEmail = settingsMap.get('contact_email') || 'hello@casseti.co';
  const instagramUrl = settingsMap.get('instagram_url') || 'https://instagram.com';
  const instagramUsername = settingsMap.get('instagram_username') || '@casseti.agency';
  const linkedinUrl = settingsMap.get('linkedin_url') || 'https://linkedin.com/company/casseti';

  return (
    <div className="min-h-screen bg-void py-8 px-4 md:px-8">
      {/* Ambient background glows */}
      <div className="glow glow-a"></div>
      <div className="glow glow-b"></div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-8">
        {/* Header bar */}
        <div className="glass rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/10">
          <div>
            <span className="eyebrow text-xs tracking-wider text-amber font-mono">
              CONTROL PANEL
            </span>
            <h1 className="font-display text-3xl md:text-4xl text-ink mt-0.5">
              CaSSe<span className="text-amber">TI</span> Admin Dashboard
            </h1>
            <p className="text-xs text-inkdim mt-1">
              Logged in as: <span className="text-ink font-semibold">{session.email}</span>
            </p>
          </div>

          <div className="flex gap-3">
            <a
              href="/"
              className="btn-outline !py-2 !px-4 text-xs flex items-center gap-2"
              target="_blank"
            >
              <i className="fa-solid fa-house"></i> View Site
            </a>
            <form action={logout}>
              <button
                type="submit"
                className="bg-red-500/20 text-red-300 border border-red-500/20 px-4 py-2 rounded-full text-xs font-semibold hover:bg-red-500/35 transition cursor-pointer"
              >
                <i className="fa-solid fa-right-from-bracket mr-1"></i> Log Out
              </button>
            </form>
          </div>
        </div>

        {/* Dynamic stats manager */}
        <div className="glass rounded-3xl p-6 border border-white/10">
          <h2 className="font-display text-2xl text-ink mb-4 flex items-center gap-2">
            <i className="fa-solid fa-chart-line text-amber text-lg"></i> Manage Portfolio Stats
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat) => (
              <div key={stat.id} className="bg-voidsoft border border-white/5 rounded-2xl p-5">
                <span className="text-xs text-inkdim font-mono block mb-1 uppercase tracking-wider">
                  {stat.label}
                </span>
                <form
                  action={async (formData: FormData) => {
                    'use server';
                    const value = formData.get('value') as string;
                    if (value) {
                      await updateStat(stat.id, value);
                    }
                  }}
                  className="flex gap-2 items-center"
                >
                  <input
                    type="text"
                    name="value"
                    defaultValue={stat.value}
                    required
                    className="flex-1 bg-white/2 hover:bg-white/4 focus:bg-white/5 border border-white/8 rounded-lg px-3 py-1.5 text-ink text-sm font-semibold focus:outline-none focus:border-amber transition-colors"
                  />
                  <button
                    type="submit"
                    className="bg-amber text-void px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-amberlight transition cursor-pointer"
                  >
                    Save
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>

        {/* Contact links and social settings manager */}
        <div className="glass rounded-3xl p-6 border border-white/10">
          <h2 className="font-display text-2xl text-ink mb-4 flex items-center gap-2">
            <i className="fa-solid fa-address-book text-amber text-lg"></i> Manage Contact Info & Social Links
          </h2>
          <form action={updateSettings} className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
            <div className="bg-voidsoft border border-white/5 rounded-2xl p-5 md:col-span-1">
              <label className="text-xs text-inkdim font-mono block mb-1 uppercase tracking-wider">
                WhatsApp Number
              </label>
              <input
                type="text"
                name="whatsapp_number"
                defaultValue={whatsappNumber}
                required
                className="w-full bg-white/2 hover:bg-white/4 focus:bg-white/5 border border-white/8 rounded-lg px-3 py-1.5 text-ink text-xs focus:outline-none focus:border-amber transition-colors"
              />
            </div>
            <div className="bg-voidsoft border border-white/5 rounded-2xl p-5 md:col-span-1">
              <label className="text-xs text-inkdim font-mono block mb-1 uppercase tracking-wider">
                Contact Email
              </label>
              <input
                type="email"
                name="contact_email"
                defaultValue={contactEmail}
                required
                className="w-full bg-white/2 hover:bg-white/4 focus:bg-white/5 border border-white/8 rounded-lg px-3 py-1.5 text-ink text-xs focus:outline-none focus:border-amber transition-colors"
              />
            </div>
            <div className="bg-voidsoft border border-white/5 rounded-2xl p-5 md:col-span-1">
              <label className="text-xs text-inkdim font-mono block mb-1 uppercase tracking-wider">
                Instagram URL
              </label>
              <input
                type="url"
                name="instagram_url"
                defaultValue={instagramUrl}
                required
                className="w-full bg-white/2 hover:bg-white/4 focus:bg-white/5 border border-white/8 rounded-lg px-3 py-1.5 text-ink text-xs focus:outline-none focus:border-amber transition-colors"
              />
            </div>
            <div className="bg-voidsoft border border-white/5 rounded-2xl p-5 md:col-span-1">
              <label className="text-xs text-inkdim font-mono block mb-1 uppercase tracking-wider">
                Instagram Username
              </label>
              <input
                type="text"
                name="instagram_username"
                defaultValue={instagramUsername}
                required
                className="w-full bg-white/2 hover:bg-white/4 focus:bg-white/5 border border-white/8 rounded-lg px-3 py-1.5 text-ink text-xs focus:outline-none focus:border-amber transition-colors"
              />
            </div>
            <div className="bg-voidsoft border border-white/5 rounded-2xl p-5 md:col-span-1">
              <label className="text-xs text-inkdim font-mono block mb-1 uppercase tracking-wider">
                LinkedIn URL
              </label>
              <input
                type="text"
                name="linkedin_url"
                defaultValue={linkedinUrl}
                required
                className="w-full bg-white/2 hover:bg-white/4 focus:bg-white/5 border border-white/8 rounded-lg px-3 py-1.5 text-ink text-xs focus:outline-none focus:border-amber transition-colors"
              />
            </div>
            <div className="md:col-span-5 flex justify-end">
              <button
                type="submit"
                className="bg-amber text-void px-6 py-2 rounded-xl text-xs font-bold hover:bg-amberlight transition cursor-pointer"
              >
                Save All Contacts & Social Links
              </button>
            </div>
          </form>
        </div>

        {/* Portfolio item manager (Videos & Graphics) */}
        <div className="glass rounded-3xl p-6 border border-white/10">
          <h2 className="font-display text-2xl text-ink mb-4 flex items-center gap-2">
            <i className="fa-solid fa-film text-amber text-lg"></i> Manage Portfolio Videos & Graphics
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form to add item */}
            <form
              action={uploadPortfolioItem}
              className="bg-voidsoft/50 border border-white/5 rounded-2xl p-5 space-y-4"
            >
              <span className="text-[10px] uppercase font-mono tracking-widest text-amber block font-bold">
                ADD NEW PORTFOLIO ITEM
              </span>
              
              <div>
                <label className="text-[9px] uppercase font-mono text-inkdim block mb-0.5">Item Type</label>
                <select name="type" className="w-full bg-voidsoft border border-white/8 rounded-lg px-3 py-1.5 text-ink text-xs focus:outline-none focus:border-amber">
                  <option value="VIDEO_9_16">Vertical Video (9:16)</option>
                  <option value="VIDEO_16_9">Cinematic Video (16:9)</option>
                  <option value="GRAPHIC">Graphic Design (Square)</option>
                </select>
              </div>

              <div>
                <label className="text-[9px] uppercase font-mono text-inkdim block mb-0.5">Title / Label</label>
                <input type="text" name="title" placeholder="E.g., EDIT_05 or Brand Cover" required className="w-full bg-white/2 border border-white/8 rounded-lg px-3 py-1.5 text-ink text-xs focus:outline-none focus:border-amber" />
              </div>

              <div>
                <label className="text-[9px] uppercase font-mono text-inkdim block mb-0.5">Category</label>
                <input type="text" name="category" placeholder="E.g., Reels, Cinematic, Poster" className="w-full bg-white/2 border border-white/8 rounded-lg px-3 py-1.5 text-ink text-xs focus:outline-none focus:border-amber" />
              </div>

              <div>
                <label className="text-[9px] uppercase font-mono text-inkdim block mb-0.5">Upload File</label>
                {isVercel ? (
                  <div className="w-full bg-voidsoft/50 border border-dashed border-white/10 rounded-lg px-3 py-3 text-center">
                    <p className="text-[10px] text-amber">
                      <i className="fa-solid fa-cloud-arrow-up mr-1"></i> File upload disabled in Vercel production
                    </p>
                    <p className="text-[9px] text-inkdim mt-0.5">
                      Please use the "Manual URL" field below to link a video or image.
                    </p>
                  </div>
                ) : (
                  <>
                    <input type="file" name="file" accept="video/mp4,image/jpeg,image/png" className="w-full bg-voidsoft border border-white/8 rounded-lg px-3 py-1.5 text-ink text-xs focus:outline-none focus:border-amber" />
                    <span className="text-[9px] text-inkdim mt-1 block">Upload mp4 video or image file.</span>
                  </>
                )}
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-white/5"></div>
                <span className="flex-shrink mx-4 text-[9px] font-mono text-inkdim">OR PROVIDE LINK</span>
                <div className="flex-grow border-t border-white/5"></div>
              </div>

              <div>
                <label className="text-[9px] uppercase font-mono text-inkdim block mb-0.5">Manual URL (optional)</label>
                <input type="url" name="manualUrl" placeholder="https://example.com/video.mp4" className="w-full bg-white/2 border border-white/8 rounded-lg px-3 py-1.5 text-ink text-xs focus:outline-none focus:border-amber" />
              </div>

              <div className="border-t border-white/5 pt-3">
                <span className="text-[10px] uppercase font-mono tracking-widest text-amber block font-bold mb-2">
                  CUSTOM THUMBNAIL (optional)
                </span>
                <div className="space-y-3">
                  <div>
                    <label className="text-[9px] uppercase font-mono text-inkdim block mb-0.5">Upload Thumbnail Image</label>
                    {isVercel ? (
                      <div className="w-full bg-voidsoft/50 border border-dashed border-white/10 rounded-lg px-3 py-3 text-center">
                        <p className="text-[10px] text-amber">
                          <i className="fa-solid fa-cloud-arrow-up mr-1"></i> Thumbnail upload disabled on Vercel
                        </p>
                        <p className="text-[9px] text-inkdim mt-0.5">
                          Please use the "Thumbnail Image URL" field below to link an image.
                        </p>
                      </div>
                    ) : (
                      <input type="file" name="thumbnailFile" accept="image/jpeg,image/png" className="w-full bg-voidsoft border border-white/8 rounded-lg px-3 py-1.5 text-ink text-xs focus:outline-none focus:border-amber" />
                    )}
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-mono text-inkdim block mb-0.5">Thumbnail Image URL</label>
                    <input type="url" name="thumbnailUrl" placeholder="https://example.com/thumbnail.jpg" className="w-full bg-white/2 border border-white/8 rounded-lg px-3 py-1.5 text-ink text-xs focus:outline-none focus:border-amber" />
                  </div>
                </div>
              </div>


              <button type="submit" className="btn-solid w-full justify-center !py-2 text-xs font-bold mt-2">
                Add Portfolio Item
              </button>
            </form>

            {/* List of current items */}
            <div className="lg:col-span-2 space-y-4">
              <span className="text-[10px] uppercase font-mono tracking-widest text-inkdim block font-bold">
                CURRENT ITEMS ({portfolioItems.length})
              </span>
              <div className="max-h-[380px] overflow-y-auto space-y-2 border border-white/5 rounded-2xl p-4 bg-voidsoft/30">
                {portfolioItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-voidsoft border border-white/5 rounded-xl text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-amber text-lg">
                        {item.type === 'GRAPHIC' ? (
                          <i className="fa-solid fa-image"></i>
                        ) : (
                          <i className="fa-solid fa-circle-play"></i>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-ink">{item.title}</p>
                        <p className="text-[10px] text-inkdim font-mono">
                          {item.type === 'VIDEO_9_16' ? 'Vertical (9:16)' : item.type === 'VIDEO_16_9' ? 'Cinematic (16:9)' : 'Graphic'} · {item.category || 'General'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-amber hover:underline">
                        View File
                      </a>
                      <form action={async () => {
                        'use server';
                        await deletePortfolioItem(item.id);
                      }}>
                        <button type="submit" className="text-[10px] bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-300 px-2 py-1 rounded cursor-pointer transition">
                          Delete
                        </button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Grid for Inquiries & Reviews */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Client inquiries list */}
          <div className="lg:col-span-2 glass rounded-3xl p-6 border border-white/10 space-y-4">
            <h2 className="font-display text-2xl text-ink flex items-center gap-2">
              <i className="fa-solid fa-envelope-open-text text-amber text-lg"></i> Leads & Inquiries
            </h2>

            {inquiries.length === 0 ? (
              <div className="text-center py-10 bg-voidsoft rounded-2xl border border-white/5">
                <i className="fa-regular fa-folder-open text-4xl text-inkdim mb-3 block"></i>
                <p className="text-sm text-inkdim">No inquiries received yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {inquiries.map((inquiry) => (
                  <div
                    key={inquiry.id}
                    className={`border rounded-2xl p-5 space-y-3 transition-colors ${
                      inquiry.status === 'COMPLETED'
                        ? 'border-white/5 bg-white/1 opacity-70'
                        : 'border-amber/20 bg-amber/2'
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-ink text-sm">
                          {inquiry.name} ·{' '}
                          <a
                            href={`mailto:${inquiry.email}`}
                            className="text-amber hover:underline font-normal text-xs"
                          >
                            {inquiry.email}
                          </a>
                        </h3>
                        <p className="text-[10px] text-inkdim font-mono mt-0.5">
                          Received: {new Date(inquiry.createdAt).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] uppercase font-mono px-2 py-0.5 rounded-full border ${
                            inquiry.status === 'COMPLETED'
                              ? 'border-white/10 text-inkdim bg-white/2'
                              : 'border-amber/30 text-amber bg-amber/5'
                          }`}
                        >
                          {inquiry.status}
                        </span>

                        <form
                          action={async () => {
                            'use server';
                            const newStatus =
                              inquiry.status === 'PENDING' ? 'COMPLETED' : 'PENDING';
                            await updateInquiryStatus(inquiry.id, newStatus);
                          }}
                        >
                          <button
                            type="submit"
                            className="text-[10px] bg-white/5 hover:bg-white/10 border border-white/10 px-2.5 py-1 rounded-lg cursor-pointer transition text-ink"
                          >
                            Toggle Status
                          </button>
                        </form>

                        <form
                          action={async () => {
                            'use server';
                            await deleteInquiry(inquiry.id);
                          }}
                        >
                          <button
                            type="submit"
                            className="text-[10px] bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-300 px-2.5 py-1 rounded-lg cursor-pointer transition"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </div>

                    <div className="bg-void/40 border border-white/5 rounded-xl p-3 text-xs text-ink/90 leading-relaxed">
                      <p className="font-bold text-[9px] font-mono text-inkdim mb-1 uppercase tracking-wider">
                        SERVICES REQUIRED
                      </p>
                      <p className="text-amber font-semibold mb-2">{inquiry.services}</p>
                      <p className="font-bold text-[9px] font-mono text-inkdim mb-1 uppercase tracking-wider">
                        MESSAGE
                      </p>
                      <p className="whitespace-pre-line">{inquiry.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Testimonial manager */}
          <div className="glass rounded-3xl p-6 border border-white/10 space-y-6">
            <div>
              <h2 className="font-display text-2xl text-ink mb-1 flex items-center gap-2">
                <i className="fa-solid fa-star text-amber text-lg"></i> Client Reviews
              </h2>
              <p className="text-[10px] text-inkdim leading-relaxed">
                Add new customer reviews that will automatically populate the home page block.
              </p>
            </div>

            {/* Form to add a review */}
            <form action={addReview} className="space-y-4 bg-voidsoft/50 border border-white/5 rounded-2xl p-4">
              <span className="text-[10px] uppercase font-mono tracking-widest text-amber block font-bold">
                ADD NEW REVIEW
              </span>
              <div>
                <label htmlFor="rev-name" className="text-[9px] uppercase font-mono text-inkdim block mb-0.5">
                  Client Name
                </label>
                <input
                  type="text"
                  id="rev-name"
                  name="name"
                  placeholder="E.g., Jessica Miller"
                  required
                  className="w-full bg-white/2 hover:bg-white/4 focus:bg-white/5 border border-white/8 rounded-lg px-3 py-1.5 text-ink text-xs focus:outline-none focus:border-amber transition-colors"
                />
              </div>
              <div>
                <label htmlFor="rev-location" className="text-[9px] uppercase font-mono text-inkdim block mb-0.5">
                  Client Location
                </label>
                <input
                  type="text"
                  id="rev-location"
                  name="location"
                  placeholder="E.g., Austin, TX, USA"
                  required
                  className="w-full bg-white/2 hover:bg-white/4 focus:bg-white/5 border border-white/8 rounded-lg px-3 py-1.5 text-ink text-xs focus:outline-none focus:border-amber transition-colors"
                />
              </div>
              <div>
                <label htmlFor="rev-stars" className="text-[9px] uppercase font-mono text-inkdim block mb-0.5">
                  Stars Rating
                </label>
                <select
                  id="rev-stars"
                  name="stars"
                  className="w-full bg-voidsoft border border-white/8 rounded-lg px-3 py-1.5 text-ink text-xs focus:outline-none focus:border-amber transition-colors"
                >
                  <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                  <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                  <option value="3">⭐⭐⭐ (3 Stars)</option>
                </select>
              </div>
              <div>
                <label htmlFor="rev-content" className="text-[9px] uppercase font-mono text-inkdim block mb-0.5">
                  Review Text
                </label>
                <textarea
                  id="rev-content"
                  name="content"
                  rows={3}
                  placeholder="Paste their testimonial here..."
                  required
                  className="w-full bg-white/2 hover:bg-white/4 focus:bg-white/5 border border-white/8 rounded-lg px-3 py-1.5 text-ink text-xs focus:outline-none focus:border-amber transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                className="btn-solid w-full justify-center !py-2 text-xs font-bold"
              >
                Add Testimonial
              </button>
            </form>

            {/* List of reviews */}
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-mono tracking-widest text-inkdim block font-bold">
                CURRENT REVIEWS
              </span>
              {reviews.map((review) => (
                <div key={review.id} className="bg-voidsoft border border-white/5 rounded-2xl p-4 space-y-2 relative group">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-ink">{review.name}</span>
                    <form
                      action={async () => {
                        'use server';
                        await deleteReview(review.id);
                      }}
                    >
                      <button
                        type="submit"
                        className="text-[9px] bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/25 px-2 py-0.5 rounded cursor-pointer transition"
                      >
                        Remove
                      </button>
                    </form>
                  </div>
                  <p className="text-[10px] text-inkdim font-mono">{review.location}</p>
                  <p className="text-[11px] text-ink/80 leading-normal italic">
                    "{review.content.slice(0, 100)}{review.content.length > 100 ? '...' : ''}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
