export default function Arrow({ direction="right", ...props }) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path d={direction==="left"?"M19 12H5m0 0 6 6m-6-6 6-6":"M5 12h14m0 0-6-6m6 6-6 6"} stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>;
}
