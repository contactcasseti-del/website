'use client';

import { useActionState, startTransition } from 'react';
import { login, AuthState } from '@/app/actions/auth';

const initialState: AuthState = {};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, initialState);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <div className="min-h-screen bg-void flex items-center justify-center p-4 relative">
      {/* Ambient background glows */}
      <div className="glow glow-a"></div>
      <div className="glow glow-b"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Viewfinder frame wrapper */}
        <div className="frame p-8 md:p-10 bg-voidsoft">
          <span className="corner tl"></span>
          <span className="corner tr"></span>
          <span className="corner bl"></span>
          <span className="corner br"></span>

          <div className="text-center mb-8">
            <span className="eyebrow text-xs tracking-widest text-amber font-mono">
              SECURE ACCESS
            </span>
            <h1 className="font-display text-4xl text-ink mt-2">
              CAC<span className="text-amber">eti</span> Control
            </h1>
            <p className="text-xs text-inkdim mt-2">
              Sign in to manage client inquiries, reviews, and stats.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {state.error && (
              <div className="bg-red-500/10 border border-red-500/25 text-red-400 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
                <i className="fa-solid fa-circle-exclamation"></i>
                <span>{state.error}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" className="text-xs uppercase font-mono tracking-wider text-inkdim block mb-1">
                Admin Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full bg-white/2 hover:bg-white/4 focus:bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-ink text-sm focus:outline-none focus:border-amber transition-colors"
                placeholder="admin@casseti.co"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="text-xs uppercase font-mono tracking-wider text-inkdim block mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full bg-white/2 hover:bg-white/4 focus:bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-ink text-sm focus:outline-none focus:border-amber transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="btn-solid w-full justify-center text-sm disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isPending ? (
                <>
                  <i className="fa-solid fa-spinner animate-spin"></i> Authenticating...
                </>
              ) : (
                <>
                  Log In <i className="fa-solid fa-arrow-right text-xs"></i>
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <a href="/" className="text-xs text-inkdim hover:text-amber transition-colors">
              <i className="fa-solid fa-arrow-left mr-1"></i> Back to Main Site
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
