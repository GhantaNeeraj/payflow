export default function Select({ options, value, onChange, placeholder, label, icon: Icon, className = '' }) {
  return (
    <div className={className}>
      {label && <label className="block text-xs font-medium text-[#A1A1A1] mb-1.5">{label}</label>}
      <div className="relative">
        {Icon && <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#686868] pointer-events-none" />}
        <select value={value} onChange={e => onChange(e.target.value)}
          className={`w-full bg-[#101010] border border-[rgba(255,255,255,0.08)] rounded-lg text-sm text-[#F5F5F5] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30 transition-colors appearance-none cursor-pointer ${Icon ? 'pl-9 pr-8 py-2' : 'pl-3 pr-8 py-2'}`}
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23686868' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}>
          {placeholder && <option value="">{placeholder}</option>}
          {options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
        </select>
      </div>
    </div>
  );
}
