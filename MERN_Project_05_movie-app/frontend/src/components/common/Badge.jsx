const variants = {
  default: 'bg-zinc-800 text-zinc-300',
  amber: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
  green: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
  red: 'bg-red-500/20 text-red-300 border border-red-500/30',
};
const Badge = ({ children, variant = 'default', className = '' }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
    {children}
  </span>
);
export default Badge;
 