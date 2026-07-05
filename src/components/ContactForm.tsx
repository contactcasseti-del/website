'use client';

import { useActionState, startTransition } from 'react';
import { submitInquiry, InquiryState } from '@/app/actions/inquiry';

const initialState: InquiryState = {};

export default function ContactForm({
  email = 'hello@casseti.co',
  instagramUrl = 'https://instagram.com',
  linkedinUrl = 'https://linkedin.com/company/casseti',
  whatsappNumber = '+91 00000 00000',
}: {
  email?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  whatsappNumber?: string;
}) {
  const [state, formAction, isPending] = useActionState(submitInquiry, initialState);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <div className="max-w-5xl mx-auto glass rounded-3xl p-8 md:p-16 text-center reveal in">
      <p className="eyebrow mb-3">07 — Get In Touch</p>
      <h2 className="font-display text-4xl md:text-6xl mb-5">Let's Build Your Next 500K</h2>
      <p className="text-inkdim max-w-lg mx-auto mb-9">
        Tell us about your page or brand, and we'll put together an editing, design, and content plan built around it.
      </p>

      {state.success ? (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 max-w-lg mx-auto mb-6 text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-circle-check text-2xl"></i>
          </div>
          <h3 className="font-display text-2xl text-ink mb-2">Message Sent Successfully!</h3>
          <p className="text-sm text-inkdim leading-relaxed">
            Thank you for reaching out! We've received your request and our team will get in touch with you shortly.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto text-left space-y-6 mb-10">
          {state.error && (
            <div className="bg-red-500/10 border border-red-500/25 text-red-400 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
              <i className="fa-solid fa-circle-exclamation"></i>
              <span>{state.error}</span>
            </div>
          )}

          {/* Service selectors */}
          <div>
            <label className="text-xs uppercase font-mono tracking-wider text-inkdim block mb-3">
              What services do you need?
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { id: 'editing', label: 'Video Editing', icon: 'fa-film' },
                { id: 'design', label: 'Graphic Design', icon: 'fa-palette' },
                { id: 'scripts', label: 'Script Writing', icon: 'fa-pen-nib' },
                { id: 'marketing', label: 'Page Management', icon: 'fa-chart-line' },
              ].map((service) => (
                <label
                  key={service.id}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border border-white/5 bg-white/2 cursor-pointer hover:border-amber/40 hover:bg-white/4 transition-all has-checked:border-amber has-checked:bg-amber/5 text-center group"
                >
                  <input
                    type="checkbox"
                    name={`service-${service.id}`}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-10 rounded-lg bg-white/5 group-hover:bg-white/10 text-inkdim peer-checked:text-amber flex items-center justify-center mb-2 transition-colors">
                    <i className={`fa-solid ${service.icon}`}></i>
                  </div>
                  <span className="text-xs font-semibold text-inkdim peer-checked:text-ink">
                    {service.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="text-xs uppercase font-mono tracking-wider text-inkdim block mb-1">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full bg-white/2 hover:bg-white/4 focus:bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-ink text-sm focus:outline-none focus:border-amber transition-colors"
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="text-xs uppercase font-mono tracking-wider text-inkdim block mb-1">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full bg-white/2 hover:bg-white/4 focus:bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-ink text-sm focus:outline-none focus:border-amber transition-colors"
                placeholder="john@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="message" className="text-xs uppercase font-mono tracking-wider text-inkdim block mb-1">
              Project Details & Accounts
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              className="w-full bg-white/2 hover:bg-white/4 focus:bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-ink text-sm focus:outline-none focus:border-amber transition-colors resize-none"
              placeholder="Tell us about your social accounts (Instagram handles, etc.) and what content volume you need..."
              required
            />
          </div>

          <div className="text-center pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="btn-solid w-full justify-center text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <i className="fa-solid fa-spinner animate-spin"></i> Submitting...
                </>
              ) : (
                <>
                  Send Inquiry <i className="fa-solid fa-arrow-up-right text-xs"></i>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Social contacts */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        <a href={`mailto:${email}`} className="btn-solid">
          <i className="fa-solid fa-envelope"></i> {email}
        </a>
        <a href={instagramUrl} className="btn-outline" target="_blank" rel="noopener noreferrer">
          <i className="fa-brands fa-instagram"></i> Message on Instagram
        </a>
      </div>
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-inkdim">
        <a href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-amber transition">
          <i className="fa-solid fa-phone"></i> {whatsappNumber}
        </a>
        <span className="flex items-center gap-2">
          <i className="fa-solid fa-location-dot"></i> Remote · Worldwide
        </span>
        <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-amber transition">
          <i className="fa-brands fa-linkedin"></i> {linkedinUrl.replace('https://', '').replace('http://', '')}
        </a>
      </div>
    </div>
  );
}
