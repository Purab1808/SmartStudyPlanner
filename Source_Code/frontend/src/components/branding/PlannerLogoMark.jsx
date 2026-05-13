export default function PlannerLogoMark({ size = 58, className = '', accent = 'green' }) {
  const stroke = accent === 'dark' ? '#17211d' : '#164e3d';
  const pageFill = accent === 'dark' ? '#f7f7f2' : '#fcfdf9';
  const secondary = accent === 'dark' ? '#2d6a57' : '#2f8a6a';
  const frame = accent === 'dark' ? '#0f1714' : '#103d30';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M36 7L58.7 20.2V46.1L36 59L13.3 46.1V20.2L36 7Z"
        stroke={frame}
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      <path
        d="M24.2 44.5V30.1C27.2 30.1 29.9 30.7 32 32.6C33.1 33.6 34.2 34.8 35.1 36.4V49.2C34 47.8 32.7 46.7 31 46C29.1 45.1 27.1 44.7 24.2 44.5Z"
        fill={pageFill}
        stroke={stroke}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path
        d="M47.8 44.5V30.1C44.8 30.1 42.1 30.7 40 32.6C38.9 33.6 37.8 34.8 36.9 36.4V49.2C38 47.8 39.3 46.7 41 46C42.9 45.1 44.9 44.7 47.8 44.5Z"
        fill={pageFill}
        stroke={stroke}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path d="M36 35.2V47.8" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M27.8 35.1C29.4 35.25 30.9 35.7 32.2 36.7" stroke={secondary} strokeWidth="1.85" strokeLinecap="round" />
      <path d="M27.8 39.8C29.4 39.95 30.9 40.4 32.2 41.4" stroke={secondary} strokeWidth="1.85" strokeLinecap="round" />
      <path d="M44.2 35.1C42.6 35.25 41.1 35.7 39.8 36.7" stroke={secondary} strokeWidth="1.85" strokeLinecap="round" />
      <path d="M44.2 39.8C42.6 39.95 41.1 40.4 39.8 41.4" stroke={secondary} strokeWidth="1.85" strokeLinecap="round" />
      <circle cx="36" cy="21.8" r="8.3" fill={pageFill} stroke={frame} strokeWidth="2.6" />
      <path d="M36 17.4V21.8L39.3 24.3" stroke={frame} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M31.3 14.8L29.5 12.4" stroke={frame} strokeWidth="2" strokeLinecap="round" />
      <path d="M40.7 14.8L42.5 12.4" stroke={frame} strokeWidth="2" strokeLinecap="round" />
      <circle cx="36" cy="21.8" r="1.25" fill={frame} />
    </svg>
  );
}
