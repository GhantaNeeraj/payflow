import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function MetricCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  prefix,
  suffix,
  accentColor = '#D4AF37',
  sparklineData = []
}) {
  const isPositive = changeType === 'positive' || (change > 0 && changeType !== 'negative');
  const changeColor = isPositive ? 'text-[#16C784]' : 'text-[#EA3943]';
  const bgBadge = isPositive ? 'bg-[rgba(22,199,132,0.1)] border-[rgba(22,199,132,0.25)]' : 'bg-[rgba(234,57,67,0.1)] border-[rgba(234,57,67,0.25)]';
  const ArrowIcon = isPositive ? ArrowUpRight : ArrowDownRight;

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="group relative rounded-2xl bg-gradient-to-b from-[#111117] via-[#0E0E13] to-[#0A0A0E] border border-[rgba(212,175,55,0.14)] p-4 sm:p-5 overflow-hidden transition-all duration-300 hover:border-[rgba(212,175,55,0.45)] hover:shadow-[0_10px_35px_-5px_rgba(212,175,55,0.15)] flex flex-col justify-between"
    >
      {/* Dynamic ambient gold backlight on hover */}
      <div className="absolute -top-16 -right-16 w-32 h-32 bg-[radial-gradient(circle,rgba(212,175,55,0.18)_0%,transparent_70%)] pointer-events-none group-hover:scale-150 transition-transform duration-500" />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[rgba(212,175,55,0.4)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Top Row: Title + Icon Badge */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <span className="text-[11px] font-semibold text-[#8E8E9E] tracking-wider uppercase">
          {title}
        </span>
        {Icon && (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1C1A14] to-[#12110D] border border-[rgba(212,175,55,0.25)] flex items-center justify-center text-[#D4AF37] group-hover:text-[#F5D76E] group-hover:border-[rgba(212,175,55,0.5)] group-hover:shadow-[0_0_12px_rgba(212,175,55,0.3)] transition-all duration-300">
            <Icon size={16} />
          </div>
        )}
      </div>

      {/* Numerical Hero Metric */}
      <div className="relative z-10 my-1">
        <div className="text-xl sm:text-2xl font-black text-[#F5F5F5] font-['Manrope'] tracking-tight group-hover:text-white transition-colors flex items-baseline gap-0.5">
          {prefix && <span className="text-base text-[#D4AF37] font-semibold">{prefix}</span>}
          <span>{value}</span>
          {suffix && <span className="text-sm text-[#A1A1A1] font-normal ml-0.5">{suffix}</span>}
        </div>
      </div>

      {/* Bottom Row: Percentage change & Sparkline indicator */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[rgba(255,255,255,0.04)] relative z-10">
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md border ${bgBadge} ${changeColor}`}>
            <ArrowIcon size={13} strokeWidth={2.4} />
            <span>{Math.abs(change)}%</span>
          </div>
        )}
        <span className="text-[10px] text-[#555566] tracking-wide font-medium ml-auto">
          vs 30d avg
        </span>
      </div>

      {/* Subtle Micro Sparkline Ribbon at the Base */}
      {sparklineData && sparklineData.length > 2 && (
        <div className="absolute bottom-0 left-0 right-0 h-6 opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 24" preserveAspectRatio="none">
            <path
              d={`M0,24 ${sparklineData.map((v, i) => `L${(i / (sparklineData.length - 1)) * 100},${24 - (v / Math.max(...sparklineData)) * 18}`).join(' ')} L100,24 Z`}
              fill={accentColor}
            />
          </svg>
        </div>
      )}
    </motion.div>
  );
}
