import { CATEGORIES, CATEGORY_COLORS, CATEGORY_ICONS } from "./constants";

export const CategoryFilter = ({ selected, onSelect, counts = {} }) => {
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <nav className="flex flex-col gap-1">
      <p className="text-xs text-ink-600 font-mono uppercase tracking-wider px-3 mb-2">Categories</p>

      <FilterBtn
        label="All Notes"
        icon="📋"
        count={total}
        active={selected === "All"}
        onClick={() => onSelect("All")}
        colorClass="text-parchment-100"
      />

      {CATEGORIES.map((cat) => {
        const style = CATEGORY_COLORS[cat];
        return (
          <FilterBtn
            key={cat}
            label={cat}
            icon={CATEGORY_ICONS[cat]}
            count={counts[cat] || 0}
            active={selected === cat}
            onClick={() => onSelect(cat)}
            colorClass={style.text}
            activeBg={style.bg}
            activeBorder={style.border}
          />
        );
      })}
    </nav>
  );
};

const FilterBtn = ({ label, icon, count, active, onClick, colorClass, activeBg = "bg-amber-500/10", activeBorder = "border-amber-500/20" }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
      active
        ? `${activeBg} border ${activeBorder} ${colorClass} font-medium`
        : "text-parchment-200/50 hover:text-parchment-100 hover:bg-ink-800 border border-transparent"
    }`}
  >
    <span className="flex items-center gap-2">
      <span>{icon}</span>
      <span>{label}</span>
    </span>
    {count > 0 && (
      <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${active ? "bg-white/10" : "bg-ink-700"}`}>
        {count}
      </span>
    )}
  </button>
);
