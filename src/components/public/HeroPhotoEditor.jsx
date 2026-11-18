'use client';

import {useEffect, useRef, useState} from 'react';
import {heroPhotos} from '@/lib/public-site/config.mjs';
import {adjustmentRanges, cleanAdjustments, heroEditorStorageKey} from '@/lib/public-site/hero-editing.mjs';

const defaults = {brightness:0.83, contrast:1.23, saturation:0.85, warmth:0, shadows:1, sharpness:0, zoom:1, mobileZoom:1};
const labels = {brightness:'Luminosidad', contrast:'Contraste', saturation:'Saturación', warmth:'Calidez', shadows:'Sombras de los bordes', sharpness:'Nitidez'};

export default function HeroPhotoEditor() {
  const [adjustments,setAdjustments]=useState({});
  const [loaded,setLoaded]=useState(false);
  const [selected,setSelected]=useState(heroPhotos[0].id);
  const [mode,setMode]=useState('mobile');
  const [message,setMessage]=useState('');
  const [scale,setScale]=useState(1);
  const frame=useRef(null), stage=useRef(null);
  const photo=heroPhotos.find(item=>item.id===selected);
  const current={...defaults,...photo,...adjustments[selected]};
  const positionKey=mode==='mobile'?'mobilePosition':'position';
  const zoomKey=mode==='mobile'?'mobileZoom':'zoom';
  const position=(current[positionKey]||current.position).split(' ').map(value=>parseFloat(value));
  const width=mode==='mobile'?390:1440, height=mode==='mobile'?844:900;

  useEffect(()=>{
    const frame=requestAnimationFrame(()=>{
      try { setAdjustments(cleanAdjustments(JSON.parse(localStorage.getItem(heroEditorStorageKey)||'{}'),heroPhotos)); }
      catch { setMessage('No se pudieron recuperar los ajustes anteriores.'); }
      setLoaded(true);
    });
    return ()=>cancelAnimationFrame(frame);
  },[]);
  useEffect(()=>{
    if (!loaded) return;
    try { localStorage.setItem(heroEditorStorageKey,JSON.stringify(adjustments)); }
    catch { queueMicrotask(()=>setMessage('El navegador no permite guardar. Descargá los ajustes para conservarlos.')); }
    function publish() { frame.current?.contentWindow?.postMessage({type:'hero-editor',photoId:selected,adjustments},window.location.origin); }
    function ready(event) {
      if (event.origin===window.location.origin && event.source===frame.current?.contentWindow && event.data?.type==='hero-editor-ready') publish();
    }
    window.addEventListener('message',ready);
    publish();
    return ()=>window.removeEventListener('message',ready);
  },[adjustments,selected,loaded]);
  useEffect(()=>{
    const observer=new ResizeObserver(([entry])=>setScale(Math.min(1,entry.contentRect.width/width,entry.contentRect.height/height)));
    observer.observe(stage.current);
    return ()=>observer.disconnect();
  },[width,height]);

  function change(key,value) {
    setAdjustments(previous=>({...previous,[selected]:{...previous[selected],[key]:value}}));
    setMessage('Guardado en este navegador.');
  }
  function move(axis,value) {
    const next=[...position];next[axis]=value;
    change(positionKey,next.map(item=>item+'%').join(' '));
  }
  function download() {
    const blob=new Blob([JSON.stringify(cleanAdjustments(adjustments,heroPhotos),null,2)+'\n'],{type:'application/json'});
    const url=URL.createObjectURL(blob),link=document.createElement('a');
    link.href=url;link.download='hero-adjustments.json';link.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
    setMessage('Descargado. Pasame el archivo para aplicar los ajustes a la web.');
  }
  async function upload(event) {
    const file=event.target.files?.[0];if(!file)return;
    try {
      if(file.size>100000)throw new Error();
      const input=JSON.parse(await file.text());
      if(!input||typeof input!=='object'||Array.isArray(input))throw new Error();
      setAdjustments(cleanAdjustments(input,heroPhotos));setMessage('Ajustes importados.');
    } catch {setMessage('Ese archivo no contiene ajustes válidos.');}
    event.target.value='';
  }
  function slider(key,label,min,max,step,value,onChange) {
    return <label className="photo-editor-slider" key={key}><span>{label}<output>{Number(value).toFixed(step<1?2:0)}</output></span><input type="range" min={min} max={max} step={step} value={value} onChange={event=>onChange(Number(event.target.value))}/></label>;
  }
  return <main className="photo-editor" lang="es-UY">
    <aside className="photo-editor-controls">
      <p className="photo-editor-kicker">LOS TORDOS · SOLO DESARROLLO</p>
      <h1>Fotos de Inicio</h1>
      <label className="photo-editor-select">Foto<select value={selected} onChange={event=>setSelected(event.target.value)}>{heroPhotos.map((item,index)=><option key={item.id} value={item.id}>{index+1} · {item.id.replace('provo-','')}</option>)}</select></label>
      <div className="photo-editor-modes">{['mobile','desktop'].map(item=><button type="button" key={item} aria-pressed={mode===item} onClick={()=>setMode(item)}>{item==='mobile'?'Celular':'Escritorio'}</button>)}</div>
      <fieldset disabled={!loaded}><legend>Luz y color · ambas vistas</legend>
        {Object.entries(labels).map(([key,label])=>slider(key,label,...adjustmentRanges[key],current[key],value=>change(key,value)))}
      </fieldset>
      <fieldset disabled={!loaded}><legend>Encuadre · {mode==='mobile'?'celular':'escritorio'}</legend>
        {slider('horizontal','Centro horizontal',0,100,1,position[0],value=>move(0,value))}
        {slider('vertical','Centro vertical',0,100,1,position[1],value=>move(1,value))}
        {slider(zoomKey,'Acercamiento',...adjustmentRanges[zoomKey],current[zoomKey],value=>change(zoomKey,value))}
      </fieldset>
      <p className="photo-editor-help">La nitidez realza los bordes; no recupera una foto desenfocada. El encuadre y el acercamiento se guardan por separado para cada pantalla.</p>
      <div className="photo-editor-actions">
        <button type="button" onClick={()=>{setAdjustments(previous=>{const next={...previous};delete next[selected];return next;});setMessage('Esta foto volvió a sus valores originales.');}}>Restaurar esta foto</button>
        <button type="button" className="photo-editor-primary" onClick={download} disabled={!loaded}>Descargar ajustes de todas</button>
        <label className="photo-editor-import">Importar ajustes<input type="file" accept="application/json,.json" onChange={upload}/></label>
      </div>
      <p className="photo-editor-status" role="status">{message||'Los cambios se guardan sólo en este navegador. La web pública conserva sus ajustes hasta incorporarlos al proyecto.'}</p>
      <a href="/" target="_blank" rel="noopener noreferrer">Abrir la web ↗</a>
    </aside>
    <section className="photo-editor-preview" aria-label="Vista previa de Inicio">
      <p>{mode==='mobile'?'Celular · 390 × 844':'Escritorio · 1440 × 900'} · {photo.id}</p>
      <div className="photo-editor-stage" ref={stage}><div style={{width:width*scale,height:height*scale}}>
        <iframe ref={frame} title="Vista previa real de la foto seleccionada" src="/?hero-editor=1" style={{width,height,transform:`scale(${scale})`,transformOrigin:'top left'}}/>
      </div></div>
    </section>
  </main>;
}
