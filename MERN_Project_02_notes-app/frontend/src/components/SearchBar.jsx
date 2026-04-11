export const SearchBar = ({ value, onChange, placeholder = "Search notes…" }) => (
  <div className="relative">
    <svg
      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-600 pointer-events-none"
      fill="none" viewBox="0 0 24 24" stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="input-field pl-9 pr-8 text-sm"
    />
    {value && (
      <button
        onClick={() => onChange("")}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-600 hover:text-parchment-100 transition-colors"
      >
        ✕
      </button>
    )}
  </div>
);
 