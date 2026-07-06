'use client';

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
  return (
    <div className="max-w-5xl mx-auto glass rounded-3xl p-8 md:p-16 text-center reveal in tilt-card">
      <p className="eyebrow mb-3">07 — Get In Touch</p>
      <h2 className="font-display text-4xl md:text-6xl mb-5">Let's Build Your Next 500K</h2>
      <p className="text-inkdim max-w-lg mx-auto mb-9">
        Tell us about your page or brand, and we'll put together an editing, design, and content plan built around it.
      </p>

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



