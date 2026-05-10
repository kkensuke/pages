'use client';

import React from 'react';

// ── Color palettes ──────────────────────────────────────────────────────────
const PALETTES: Record<string, [string, string, string, string]> = {
  blue:   ['#3B82F6', '#93C5FD', '#EFF6FF', '#1E3A8A'],
  purple: ['#8B5CF6', '#C4B5FD', '#F5F3FF', '#4C1D95'],
  green:  ['#10B981', '#6EE7B7', '#ECFDF5', '#064E3B'],
  amber:  ['#F59E0B', '#FCD34D', '#FFFBEB', '#78350F'],
  rose:   ['#F43F5E', '#FDA4AF', '#FFF1F2', '#881337'],
  teal:   ['#14B8A6', '#5EEAD4', '#F0FDFA', '#134E4A'],
  slate:  ['#64748B', '#CBD5E1', '#F8FAFC', '#1E293B'],
  indigo: ['#6366F1', '#A5B4FC', '#EEF2FF', '#312E81'],
};

type PaletteName = keyof typeof PALETTES;

// ── Wave ────────────────────────────────────────────────────────────────────
const WaveArt = ({ p }: { p: string[] }) => (
  <svg viewBox="0 0 800 160" xmlns="http://www.w3.org/2000/svg"
    style={{ width: '100%', height: '100%', display: 'block' }}>
    <rect width="800" height="160" fill={p[1]} opacity="0.2" />

    {/* back wave */}
    <path
      d="M0,100 C100,60 200,130 320,90 C440,50 530,120 660,85 C730,68 770,95 800,80 L800,160 L0,160 Z"
      fill={p[1]} opacity="0.55" />

    {/* mid wave */}
    <path
      d="M0,120 C130,70 250,150 420,105 C590,60 700,130 800,100 L800,160 L0,160 Z"
      fill={p[1]} opacity="0.4" />

    {/* front wave */}
    <path
      d="M0,135 C80,110 180,155 340,130 C500,105 640,150 800,125 L800,160 L0,160 Z"
      fill={p[3]} opacity="0.1" />

    {/* fine line highlights */}
    <path d="M0,90 Q200,45 400,110 T800,75"
      stroke={p[0]} strokeWidth="1.5" fill="none" opacity="0.5" />
    <path d="M0,60 Q250,95 500,55 T800,70"
      stroke={p[1]} strokeWidth="1" fill="none" opacity="0.4" />
  </svg>
);

// ── Grid ────────────────────────────────────────────────────────────────────
const GridArt = ({ p }: { p: string[] }) => {
  const cols = 16, rows = 5;
  const cw = 800 / cols, rh = 160 / rows;

  // deterministic "interesting" highlights using a simple hash
  const highlight = (c: number, r: number) =>
    ((c * 3 + r * 7) % 11 === 0) || ((c * 5 + r * 2) % 9 === 0);

  return (
    <svg viewBox="0 0 800 160" xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="800" height="160" fill={p[2]} />

      {/* grid lines */}
      {Array.from({ length: cols + 1 }, (_, i) => (
        <line key={`v${i}`} x1={i * cw} y1="0" x2={i * cw} y2="160"
          stroke={p[1]} strokeWidth="0.8" />
      ))}
      {Array.from({ length: rows + 1 }, (_, j) => (
        <line key={`h${j}`} x1="0" y1={j * rh} x2="800" y2={j * rh}
          stroke={p[1]} strokeWidth="0.8" />
      ))}

      {/* intersection dots */}
      {Array.from({ length: cols + 1 }, (_, c) =>
        Array.from({ length: rows + 1 }, (_, r) => {
          const hot = highlight(c, r);
          return (
            <circle key={`d${c}-${r}`}
              cx={c * cw} cy={r * rh}
              r={hot ? 5 : 2}
              fill={hot ? p[0] : p[1]}
              opacity={hot ? 0.9 : 0.6} />
          );
        })
      )}

      {/* diagonal accent lines */}
      <line x1="0" y1="0" x2="800" y2="160"
        stroke={p[0]} strokeWidth="1" opacity="0.18" />
      <line x1="800" y1="0" x2="0" y2="160"
        stroke={p[0]} strokeWidth="1" opacity="0.18" />
    </svg>
  );
};

// ── Mandala ─────────────────────────────────────────────────────────────────
const MandalaArt = ({ p }: { p: string[] }) => {
  const ring = (n: number, radius: number, rx: number, ry: number, fill: string, op = 0.7) =>
    Array.from({ length: n }, (_, i) => {
      const deg = i * (360 / n);
      const rad = (deg * Math.PI) / 180;
      const cx = Math.cos(rad) * radius;
      const cy = Math.sin(rad) * radius;
      return (
        <ellipse key={i} cx="0" cy="0" rx={rx} ry={ry}
          transform={`translate(${cx},${cy}) rotate(${deg})`}
          fill={fill} opacity={op} />
      );
    });

  const Center = ({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) => (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      {ring(12, 52, 22, 8, p[1], 0.55)}
      {ring(8,  32, 14, 6, p[0], 0.65)}
      {ring(6,  18, 10, 4, p[3], 0.7)}
      <circle cx="0" cy="0" r="10" fill={p[0]} opacity="0.9" />
      <circle cx="0" cy="0" r="5"  fill={p[2]} />
    </g>
  );

  return (
    <svg viewBox="0 0 800 160" xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="800" height="160" fill={p[2]} />
      <Center x={80}  y={80} scale={0.6} />
      <Center x={240} y={80} scale={0.75} />
      <Center x={400} y={80} scale={1} />
      <Center x={560} y={80} scale={0.75} />
      <Center x={720} y={80} scale={0.6} />
    </svg>
  );
};

// ── Flow ─────────────────────────────────────────────────────────────────────
const FlowArt = ({ p }: { p: string[] }) => (
  <svg viewBox="0 0 800 160" xmlns="http://www.w3.org/2000/svg"
    style={{ width: '100%', height: '100%', display: 'block' }}>
    <rect width="800" height="160" fill={p[2]} />

    {/* thick ribbon strokes */}
    <path d="M-50,120 C150,40  350,160 550,80  C700,20  780,100 850,60"
      stroke={p[1]} strokeWidth="50" fill="none" opacity="0.35" strokeLinecap="round" />
    <path d="M-50,80  C100,160 300,30  520,120 C680,190 790,70  850,110"
      stroke={p[0]} strokeWidth="35" fill="none" opacity="0.3" strokeLinecap="round" />
    <path d="M-50,40  C200,120 400,10  600,100 C730,160 800,60  850,90"
      stroke={p[1]} strokeWidth="22" fill="none" opacity="0.8" strokeLinecap="round" />

    {/* fine line accents */}
    <path d="M0,100 Q200,30 400,130 T800,80"
      stroke={p[3]} strokeWidth="2" fill="none" opacity="0.6" />
    <path d="M0,55  Q200,130 400,40 T800,100"
      stroke={p[0]} strokeWidth="1.5" fill="none" opacity="0.5" />
    <path d="M0,130 Q300,70 600,140 T800,110"
      stroke={p[1]} strokeWidth="1" fill="none" opacity="0.4" />
  </svg>
);

// ── Mosaic ───────────────────────────────────────────────────────────────────
const MosaicArt = ({ p }: { p: string[] }) => {
  const cols = 20, rows = 6;
  const cw = 800 / cols, rh = 160 / rows;
  const gap = 3;

  const pickColor = (c: number, r: number): string => {
    const v = Math.sin(c * 0.72 + r * 1.3) * Math.cos(c * 0.4 - r * 0.9);
    if (v < -0.5) return p[3];
    if (v < 0)    return p[0];
    if (v < 0.4)  return p[1];
    return p[2];
  };

  const pickOpacity = (c: number, r: number) =>
    0.45 + 0.55 * Math.abs(Math.sin(c * 0.6 + r * 1.1));

  return (
    <svg viewBox="0 0 800 160" xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="800" height="160" fill={p[2]} />
      {Array.from({ length: cols }, (_, c) =>
        Array.from({ length: rows }, (_, r) => (
          <rect key={`${c}-${r}`}
            x={c * cw + gap / 2}
            y={r * rh + gap / 2}
            width={cw - gap}
            height={rh - gap}
            rx="4"
            fill={pickColor(c, r)}
            opacity={pickOpacity(c, r)} />
        ))
      )}
    </svg>
  );
};

// ── Public component ─────────────────────────────────────────────────────────
interface ArtBlockProps {
  type?:  string;
  color?: string;
  height?: string;
}

const ArtBlock: React.FC<ArtBlockProps> = ({
  type  = 'wave',
  color = 'blue',
  height = '160px',
}) => {
  const p = PALETTES[color as PaletteName] ?? PALETTES.blue;

  const renderArt = () => {
    switch (type) {
      case 'grid':    return <GridArt    p={p} />;
      case 'mandala': return <MandalaArt p={p} />;
      case 'flow':    return <FlowArt    p={p} />;
      case 'mosaic':  return <MosaicArt  p={p} />;
      default:        return <WaveArt    p={p} />;
    }
  };

  return (
    <div
      style={{
        width: '100%',
        height,
        borderRadius: '0.75rem',
        overflow: 'hidden',
        margin: '1.5rem 0',
        border: `1px solid ${p[1]}`,
        boxShadow: `0 4px 24px 0 ${p[0]}22`,
      }}
    >
      {renderArt()}
    </div>
  );
};

export default ArtBlock;
