import { useGenres } from '../../hooks/useMovies';
import { SORT_OPTIONS, YEARS } from '../../utils/constants';

const Select = ({ value, onChange, children, label }) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-xs text-zinc-500 uppercase tracking-wider">{label}</label>}
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="bg-zinc-800 border border-zinc-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500/60 cursor-pointer min-w-[140px]">
      {children}
    </select>
  </div> 
);

const FilterBar = ({ filters, onChange }) => {
  const genres = useGenres();

  return (
    <div className="flex flex-wrap items-end gap-3 p-4 bg-zinc-900/60 rounded-xl border border-zinc-800">
      <Select label="Genre" value={filters.genre || ''} onChange={(v) => onChange({ ...filters, genre: v, page: 1 })}>
        <option value="">All Genres</option>
        {genres.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
      </Select>

      <Select label="Year" value={filters.year || ''} onChange={(v) => onChange({ ...filters, year: v, page: 1 })}>
        <option value="">All Years</option>
        {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
      </Select>

      <Select label="Sort By" value={filters.sort_by || 'popularity.desc'} onChange={(v) => onChange({ ...filters, sort_by: v, page: 1 })}>
        {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </Select>

      <button onClick={() => onChange({ genre: '', year: '', sort_by: 'popularity.desc', page: 1 })}
        className="px-3 py-2 text-sm text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 rounded-lg transition-all self-end">
        Reset
      </button>
    </div>
  );
};
export default FilterBar;
