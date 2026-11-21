import { motion } from 'framer-motion';

export default function PayflowLogo({ collapsed = false, size = 'default' }) {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  const iconDim = isSm ? 'w-7 h-7' : isLg ? 'w-11 h-11' : 'w-9 h-9';
  const svgDim = isSm ? 18 : isLg ? 26 : 22;

  return (
    <div className="flex items-center gap-3 select-none">
      {/* Dynamic Geometric FinTech Icon */}
      <div className="relative group cursor-pointer">
        {/* Ambient Outer Halo */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#A67C00] via-[#D4AF37] to-[#F5D76E] rounded-xl blur-md opacity-40 group-hover:opacity-80 transition duration-500 group-hover:scale-105" />
        
        {/* Icon Plate */}
        <div className={`relative ${iconDim} rounded-xl bg-gradient-to-b from-[#1C1A14] to-[#0D0C09] border border-[rgba(212,175,55,0.4)] flex items-center justify-center shadow-lg shadow-black/80 overflow-hidden`}>
          {/* Subtle metallic sheen */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[rgba(255,255,255,0.1)] to-transparent pointer-events-none" />

          {/* Precision SVG Vector Emblem: Interlocking P + Fast Flow Chevrons */}
          <svg
            width={svgDim}
            height={svgDim}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transform transition-transform duration-300 group-hover:scale-110"
          >
            <defs>
              <linearGradient id="goldSheen" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F5D76E" />
                <stop offset="0.5" stopColor="#D4AF37" />
                <stop offset="1" stopColor="#9E7C20" />
              </linearGradient>
              <linearGradient id="accentGlow" x1="0" y1="12" x2="24" y2="12" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFFFFF" stopOpacity="0.9" />
                <stop offset="1" stopColor="#D4AF37" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {/* Orchestration dynamic path */}
            <path
              d="M3 7.5L8.5 2.5H15.5C18.5 2.5 21 5 21 8C21 11 18.5 13.5 15.5 13.5H9L6 16.5"
              stroke="url(#goldSheen)"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Inner Flow Velocity arrow */}
            <path
              d="M6 19.5L11.5 14H17.5"
              stroke="url(#accentGlow)"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Settlement Anchor Dot */}
            <circle cx="15.5" cy="8" r="1.5" fill="#FFF" className="animate-pulse" />
          </svg>
        </div>
      </div>

      {/* Brand Wordmark Typography */}
      {!collapsed && (
        <div className="flex flex-col">
          <div className="flex items-center tracking-tight leading-none">
            <span className="text-lg font-black text-[#F5F5F5] font-['Manrope'] tracking-wider">
              PAY
            </span>
            <span className="text-lg font-extralight bg-gradient-to-r from-[#D4AF37] via-[#F5D76E] to-[#D4AF37] bg-clip-text text-transparent font-['Manrope'] tracking-widest ml-0.5">
              FLOW
            </span>
            <span className="ml-1.5 px-1.5 py-0.2 text-[8px] font-bold tracking-widest text-[#D4AF37] bg-[rgba(212,175,55,0.12)] border border-[rgba(212,175,55,0.25)] rounded uppercase">
              PRO
            </span>
          </div>
          <span className="text-[9px] font-medium text-[#686875] tracking-widest uppercase mt-0.5">
            Orchestration
          </span>
        </div>
      )}
    </div>
  );
}
