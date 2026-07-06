'use client';

import { useState, useRef, useEffect } from 'react';

type VideoItem = {
  id: string;
  type: string;
  title: string;
  url: string;
  thumbnail: string | null;
  category: string | null;
};

// Transform Cloudinary video URLs to serve optimized low-bitrate preview versions
function getOptimizedVideoUrl(url: string, type: string): string {
  if (url.includes('res.cloudinary.com') && url.includes('/video/upload/')) {
    // 9:16 portrait videos: cap HEIGHT to 720px → output is ~405×720 (small)
    // 16:9 landscape videos: cap WIDTH to 720px → output is ~720×405 (small)
    // Without this, w_720 on a 9:16 video = 720×1280 (3× bigger = 3× slower!)
    const sizeCap = type === 'VIDEO_9_16' ? 'h_720' : 'w_720';
    return url.replace(
      '/video/upload/',
      `/video/upload/f_auto,q_auto:low,vc_auto,${sizeCap}/`
    );
  }
  return url;
}

function VideoCard({
  item,
  idx,
  onClick,
}: {
  item: VideoItem;
  idx: number;
  onClick: (item: VideoItem, cachedUrl: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isEmbed =
    item.url.includes('drive.google.com') ||
    item.url.includes('youtube.com') ||
    item.url.includes('youtu.be') ||
    item.url.includes('vimeo.com');

  const optimizedUrl = isEmbed ? item.url : getOptimizedVideoUrl(item.url, item.type);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            // Attempt play directly — onCanPlay will also fire when ready
            if (!isEmbed && videoRef.current) {
              videoRef.current.play().catch(() => {});
            }
          } else {
            setIsVisible(false);
            if (!isEmbed && videoRef.current) {
              videoRef.current.pause();
            }
          }
        });
      },
      { threshold: 0, rootMargin: '600px 0px' } // Start loading 600px before entering view
    );

    const currentRef = containerRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => { if (currentRef) observer.unobserve(currentRef); };
  }, [isEmbed]);

  const getCardEmbedUrl = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.split(/\/|v=|\.be\//).pop()?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0`;
    }
    if (url.includes('vimeo.com')) {
      const vimeoMatch = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/i);
      if (vimeoMatch) {
        return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&muted=1&loop=1&background=1&controls=0`;
      }
    }
    if (url.includes('drive.google.com')) {
      const driveMatch = url.match(/(?:drive\.google\.com\/file\/d\/|drive\.google\.com\/open\?id=)([a-zA-Z0-9_-]{25,})/i);
      if (driveMatch) {
        return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
      }
    }
    return url;
  };

  return (
    <div ref={containerRef} className="w-full">
      <button
        onClick={() => onClick(item, optimizedUrl)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`frame w-full text-left cursor-pointer group focus:outline-none relative overflow-hidden ${
          item.type === 'VIDEO_9_16' ? 'aspect-[9/16]' : 'aspect-video'
        }`}
        style={{ transitionDelay: `${idx * 0.05}s` }}
      >
        {/* Background Media */}
        {isVisible && isEmbed ? (
          <iframe
            src={getCardEmbedUrl(item.url)}
            className="absolute inset-0 w-full h-full border-0 pointer-events-none scale-110 opacity-70"
            allow="autoplay; fullscreen"
          />
        ) : !isEmbed ? (
          <video
            ref={videoRef}
            src={optimizedUrl}
            muted
            loop
            playsInline
            autoPlay
            preload="auto"
            // Play the instant the browser has buffered enough — no waiting
            onCanPlay={() => {
              if (isVisible && videoRef.current) {
                videoRef.current.play().catch(() => {});
              }
            }}
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-90 transition-opacity duration-500 pointer-events-none"
          />
        ) : item.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.thumbnail}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-90 transition-opacity duration-500 pointer-events-none"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-voidsoft to-void opacity-70 group-hover:opacity-40 transition-opacity duration-500" />
        )}

        {/* Transparent click catcher overlay */}
        <div className="absolute inset-0 bg-transparent z-10" />

        {/* Frame details (Viewfinder corners, tag, timecode) */}
        <span className="corner tl z-20"></span>
        <span className="corner tr z-20"></span>
        <span className="corner bl z-20"></span>
        <span className="corner br"></span>
        <span className="badge-tag z-20">{item.type === 'VIDEO_9_16' ? '9:16' : '16:9'}</span>
        <span className="timecode z-20">{item.title}</span>
      </button>
    </div>
  );
}


export default function VideoPortfolio({ items }: { items: VideoItem[] }) {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [activeVideoUrl, setActiveVideoUrl] = useState('');
  const [isMuted, setIsMuted] = useState(true);
  const [isBuffering, setIsBuffering] = useState(true);

  // Higher quality for modal (q_auto = good quality, w_1080/h_1080)
  function getModalVideoUrl(url: string, type: string): string {
    if (url.includes('res.cloudinary.com') && url.includes('/video/upload/')) {
      const sizeCap = type === 'VIDEO_9_16' ? 'h_1080' : 'w_1080';
      return url.replace('/video/upload/', `/video/upload/f_auto,q_auto,vc_auto,${sizeCap}/`);
    }
    return url;
  }

  const verticalVideos = items.filter((item) => item.type === 'VIDEO_9_16');
  const cinematicVideos = items.filter((item) => item.type === 'VIDEO_16_9');

  function getVideoEmbedUrl(url: string, muted: boolean) {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.split(/\/|v=|\.be\//).pop();
      return {
        embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${muted ? '1' : '0'}`,
        isEmbed: true,
      };
    }
    
    // Google Drive links
    const driveRegex = /(?:drive\.google\.com\/file\/d\/|drive\.google\.com\/open\?id=)([a-zA-Z0-9_-]{25,})/i;
    const driveMatch = url.match(driveRegex);
    if (driveMatch) {
      return {
        embedUrl: `https://drive.google.com/file/d/${driveMatch[1]}/preview`,
        isEmbed: true,
      };
    }

    // Vimeo links
    const vimeoRegex = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/i;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch) {
      return {
        embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&muted=${muted ? '1' : '0'}`,
        isEmbed: true,
      };
    }

    // Fallback to direct HTML5 video stream
    return {
      embedUrl: url,
      isEmbed: false,
    };
  }

  const handleOpenVideo = (item: VideoItem, cachedUrl: string) => {
    setIsMuted(true);
    setIsBuffering(true);
    // Use the same URL the card already buffered — plays from browser cache instantly
    setActiveVideoUrl(cachedUrl || item.url);
    setActiveVideo(item);
  };

  const { embedUrl, isEmbed } = getVideoEmbedUrl(activeVideo?.url || '', isMuted);;

  return (
    <div>
      {/* 9:16 Vertical Section */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-6 reveal in">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <i className="fa-solid fa-mobile-screen text-amber"></i> Vertical Reels & Shorts
          </h3>
          <span className="font-mono text-xs text-inkdim border border-white/10 rounded-full px-3 py-1">
            9:16
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {verticalVideos.map((item, idx) => (
            <VideoCard
              key={item.id}
              item={item}
              idx={idx}
              onClick={handleOpenVideo}
            />
          ))}
        </div>
      </div>

      {/* 16:9 Cinematic Section */}
      <div>
        <div className="flex items-center justify-between mb-6 reveal in">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <i className="fa-solid fa-clapperboard text-amber"></i> Long Format Videos
          </h3>
          <span className="font-mono text-xs text-inkdim border border-white/10 rounded-full px-3 py-1">
            16:9 · 21:9
          </span>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {cinematicVideos.map((item, idx) => (
            <VideoCard
              key={item.id}
              item={item}
              idx={idx}
              onClick={handleOpenVideo}
            />
          ))}
        </div>
      </div>

      {/* Custom HTML5 Video Player Modal Overlay */}
      {activeVideo && (
        <div className="fixed inset-0 z-100 bg-void/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-voidsoft border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            {/* Header bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <div>
                <span className="eyebrow text-xs text-amber font-mono tracking-wider">
                  PLAYING VIDEO
                </span>
                <h4 className="font-display text-xl text-ink mt-0.5">
                  {activeVideo.title} · {activeVideo.category}
                </h4>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-ink hover:text-amber transition-colors cursor-pointer"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            {/* Video container */}
            <div className={`relative bg-black flex items-center justify-center ${
              activeVideo.type === 'VIDEO_9_16' ? 'aspect-[9/16] max-h-[70vh] mx-auto' : 'aspect-video w-full'
            }`}>
              {isEmbed ? (
                <iframe
                  src={embedUrl}
                  className="w-full h-full border-0 absolute inset-0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  key={activeVideo?.id}
                  src={activeVideoUrl || embedUrl}
                  className="w-full h-full object-contain"
                  controls
                  autoPlay
                  preload="auto"
                  muted={isMuted}
                  playsInline
                  onWaiting={() => setIsBuffering(true)}
                  onPlaying={() => setIsBuffering(false)}
                  onCanPlay={() => setIsBuffering(false)}
                />
              )}

              {/* Loading spinner shown while buffering */}
              {!isEmbed && isBuffering && (
                <div className="absolute inset-0 flex items-center justify-center bg-void/60 z-10 pointer-events-none">
                  <div className="flex flex-col items-center gap-3">
                    <svg className="animate-spin w-10 h-10 text-amber" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                    </svg>
                    <span className="text-[10px] font-mono text-inkdim tracking-widest uppercase">Loading...</span>
                  </div>
                </div>
              )}

              {/* Sound confirmation control overlay */}
              <div className="absolute bottom-4 right-4 z-10">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="glass rounded-full px-4 py-2 flex items-center gap-2 text-xs font-semibold hover:border-amber hover:text-amber transition cursor-pointer text-ink bg-void/50 border-white/10"
                >
                  {isMuted ? (
                    <>
                      <i className="fa-solid fa-volume-xmark text-amber animate-pulse"></i> Muted (Click to Unmute)
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-volume-high text-amber"></i> Sound On
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
