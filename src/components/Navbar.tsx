'use client';

import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'services', 'editing', 'design', 'scripts', 'work', 'reviews'];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'editing', label: 'Editing' },
    { id: 'design', label: 'Design' },
    { id: 'scripts', label: 'Scripts' },
    { id: 'work', label: 'Work' },
    { id: 'reviews', label: 'Reviews' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-4 mt-4 md:mx-8 md:mt-6">
        <div className="glass rounded-full px-5 md:px-6 py-3 flex items-center justify-between max-w-6xl mx-auto">
          <a href="#home" className="font-display text-2xl tracking-wide text-ink hover:text-amber transition-colors">
            CaSSe<span className="text-amber">TI</span>
          </a>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={`navlink ${activeSection === link.id ? 'active' : ''}`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a href="#contact" className="hidden lg:inline-flex btn-solid !py-2.5 !px-5 text-sm">
            Start a Project
          </a>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-ink text-xl w-9 h-9 flex items-center justify-center cursor-pointer"
            aria-label="Toggle menu"
          >
            <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
          </button>
        </div>

        {/* Mobile menu panel */}
        {isOpen && (
          <div className="lg:hidden glass rounded-3xl mt-2 max-w-6xl mx-auto overflow-hidden transition-all duration-300">
            <nav className="flex flex-col p-3 gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={() => setIsOpen(false)}
                  className={`navlink text-center ${activeSection === link.id ? 'active' : ''}`}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setIsOpen(false)}
                className="btn-solid justify-center mt-2 text-sm"
              >
                Start a Project
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
