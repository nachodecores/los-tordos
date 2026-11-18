"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { heroPhotos, heroSlideshow } from "@/lib/public-site/config.mjs";
import {cleanAdjustments, heroEditorStorageKey, heroPhotoStyle} from "@/lib/public-site/hero-editing.mjs";

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
  const [editor, setEditor] = useState(null);
  const photos = heroPhotos.map(photo => ({...photo,...editor?.adjustments?.[photo.id]}));
  const reduced = useSyncExternalStore(subscribeMotion, reducedMotion, () => true);
  const tabVisible = useSyncExternalStore(subscribeVisibility, documentVisible, () => true);
  const multiple = heroPhotos.length > 1;
  const next = (slide.active + 1) % heroPhotos.length;

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development' || !new URLSearchParams(window.location.search).has('hero-editor')) return;
    function receive(event) {
      if (event.origin !== window.location.origin || event.source !== window.parent || event.data?.type !== 'hero-editor') return;
      const index = heroPhotos.findIndex(photo => photo.id === event.data.photoId);
      if (index < 0) return;
      setEditor({index, adjustments: cleanAdjustments(event.data.adjustments, heroPhotos)});
    }
    function restore() {
      try {
        const data = JSON.parse(localStorage.getItem(heroEditorStorageKey) || '{}');
        setEditor({index: 0, adjustments: cleanAdjustments(data, heroPhotos)});
      } catch { setEditor({index: 0, adjustments: {}}); }
    }
    restore();
    window.addEventListener('message', receive);
    window.parent.postMessage({type: 'hero-editor-ready'}, window.location.origin);
    return () => window.removeEventListener('message', receive);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting && entry.intersectionRatio >= 0.5);
    }, { threshold: [0, 0.5] });
    observer.observe(section.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (editor || !multiple || reduced || !visible || !tabVisible || !ready[slide.active] || !ready[next]) return;
    const timer = setTimeout(() => {
      setSlide(current => ({ active: (current.active + 1) % heroPhotos.length, previous: current.active }));
    }, heroSlideshow.intervalMs);
    return () => clearTimeout(timer);
  }, [editor, multiple, reduced, visible, tabVisible, ready, slide.active, next]);

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
    data-hero-active={editor?.index ?? slide.active}
    style={{ "--public-hero-fade": heroSlideshow.crossfadeMs + "ms" }}
  >
    <h1 className="public-sr-only">Los Tordos. Tenés queso.</h1>
    <svg width="0" height="0" aria-hidden="true" style={{position:'absolute'}}>
      <defs>{photos.map(photo => {
        const amount = photo.sharpness ?? 0;
        return <filter key={photo.id} id={'hero-sharp-'+photo.id} colorInterpolationFilters="sRGB">
          <feConvolveMatrix order="3" kernelMatrix={`0 ${-amount} 0 ${-amount} ${1+4*amount} ${-amount} 0 ${-amount} 0`} preserveAlpha="true" edgeMode="duplicate"/>
        </filter>;
      })}</defs>
    </svg>
    <div className="public-photo-frame public-hero-frame">
      {photos.map((photo, index) => <div
        key={photo.id}
        className={"public-hero-slide" + (index === (editor?.index ?? slide.active) ? " is-active" : !editor && index === slide.previous ? " is-previous" : "")}
        aria-hidden={index !== (editor?.index ?? slide.active)}
        style={heroPhotoStyle(photo)}
      >
        <Image
          src={photo.image}
          alt={photo.alt}
          fill
          sizes="100vw"
          preload={index === 0}
          className="public-hero-photo"
          onLoad={() => setReady(current => current[index] ? current : { ...current, [index]: true })}
        />
      </div>)}
    </div>
  </section>;
}
