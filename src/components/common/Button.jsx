import { Loader2 } from 'lucide-react';

export default function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  loading = false,
  disabled = false,
  children,
  onClick,
  fullWidth = false,
  className = ''
}) {
  const base = 'relative inline-flex items-center justify-center gap-2 font-bold tracking-wide rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer overflow-hidden select-none active:scale-[0.98]';

  const variants = {
    primary: 'bg-gradient-to-r from-[#A67C00] via-[#D4AF37] to-[#F5D76E] text-[#080808] hover:shadow-[0_0_25px_rgba(212,175,55,0.45)] hover:brightness-105 border border-[rgba(255,255,255,0.2)]',
    secondary: 'bg-[rgba(212,175,55,0.06)] border border-[rgba(212,175,55,0.35)] text-[#F5D76E] hover:bg-[rgba(212,175,55,0.15)] hover:border-[#D4AF37] hover:shadow-[0_0_20px_rgba(212,175,55,0.2)]',
    ghost: 'bg-transparent text-[#9898A8] hover:text-[#F5F5F5] hover:bg-[rgba(255,255,255,0.05)] border border-transparent hover:border-[rgba(255,255,255,0.08)]',
    danger: 'bg-[rgba(234,57,67,0.12)] text-[#EA3943] border border-[rgba(234,57,67,0.35)] hover:bg-[rgba(234,57,67,0.25)] hover:shadow-[0_0_20px_rgba(234,57,67,0.3)]',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 rounded-lg',
    md: 'text-xs sm:text-sm px-4 py-2.5 rounded-xl',
    lg: 'text-sm sm:text-base px-6 py-3 rounded-xl font-extrabold',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {/* Light sweep hover effect */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />

      {loading ? (
        <Loader2 size={16} className="animate-spin text-current" />
      ) : Icon && (
        <Icon size={16} className="transition-transform duration-200 group-hover:scale-110" />
      )}
      <span>{children}</span>
    </button>
  );
}
