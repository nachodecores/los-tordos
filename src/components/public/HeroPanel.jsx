"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { heroPhotos, heroSlideshow } from "@/lib/public-site/config.mjs";

function subscribeMotion(callback) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function subscribeVisibility(callback) {
  document.addEventListener("visibilitychange", callback);
  return () => document.removeEventListener("visibilitychange", callback);
}
function documentVisible() {
  return document.visibilityState !== "hidden";
}

export default function HeroPanel() {
  const section = useRef(null);
  const [slide, setSlide] = useState({ active: 0, previous: null });
  const [ready, setReady] = useState({});
  const [visible, setVisible] = useState(true);
  const [paused, setPaused] = useState(false);
  const reduced = useSyncExternalStore(subscribeMotion, reducedMotion, () => true);
  const tabVisible = useSyncExternalStore(subscribeVisibility, documentVisible, () => true);
  const multiple = heroPhotos.length > 1;
  const next = (slide.active + 1) % heroPhotos.length;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting && entry.intersectionRatio >= 0.5);
    }, { threshold: [0, 0.5] });
    observer.observe(section.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!multiple || reduced || paused || !visible || !tabVisible || !ready[slide.active] || !ready[next]) return;
    const timer = setTimeout(() => {
      setSlide(current => ({ active: (current.active + 1) % heroPhotos.length, previous: current.active }));
    }, heroSlideshow.intervalMs);
    return () => clearTimeout(timer);
  }, [multiple, reduced, paused, visible, tabVisible, ready, slide.active, next]);

  useEffect(() => {
    if (slide.previous === null) return;
    const timer = setTimeout(() => {
      setSlide(current => ({ ...current, previous: null }));
    }, heroSlideshow.crossfadeMs);
    return () => clearTimeout(timer);
  }, [slide.previous]);

  return <section
    id="inicio"
    ref={section}
    className="public-panel public-hero"
    aria-label="Inicio"
    data-hero-active={slide.active}
    style={{ "--public-hero-fade": heroSlideshow.crossfadeMs + "ms" }}
  >
    <h1 className="public-sr-only">Los Tordos. Tenés queso.</h1>
    <div className="public-photo-frame public-hero-frame">
      {heroPhotos.map((photo, index) => <div
        key={photo.id}
        className={"public-hero-slide" + (index === slide.active ? " is-active" : index === slide.previous ? " is-previous" : "")}
        aria-hidden={index !== slide.active}
      >
        <Image
          src={photo.image}
          alt={photo.alt}
          fill
          sizes="100vw"
          preload={index === 0}
          className="public-hero-photo"
          style={{ "--hero-position": photo.position, "--hero-mobile-position": photo.mobilePosition || photo.position, "--hero-brightness": photo.brightness ?? 0.83 }}
          onLoad={() => setReady(current => current[index] ? current : { ...current, [index]: true })}
        />
      </div>)}
    </div>
    {multiple && !reduced && <button
      className="public-hero-pause"
      type="button"
      aria-label={paused ? "Reanudar pase de fotos" : "Pausar pase de fotos"}
      onClick={() => setPaused(value => !value)}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        {paused ? <path d="M8 5v14l11-7z"/> : <path d="M7 5h3v14H7zm7 0h3v14h-3z"/>}
      </svg>
    </button>}
  </section>;
}
