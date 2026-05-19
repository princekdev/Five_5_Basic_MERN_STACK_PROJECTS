const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const max = Math.min(totalPages, 500);
  const pages = [];
  const delta = 2;
  const left = Math.max(1, currentPage - delta);
  const right = Math.min(max, currentPage + delta);

  for (let i = left; i <= right; i++) pages.push(i);

  const btnBase = 'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200';
  const active = 'bg-amber-500 text-black font-bold';
  const inactive = 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700';
  const disabled = 'opacity-40 cursor-not-allowed';

  return (
    <div className="flex items-center justify-center gap-1 flex-wrap">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}
        className={`${btnBase} ${currentPage === 1 ? disabled : inactive}`}>← Prev</button>

      {left > 1 && <>
        <button onClick={() => onPageChange(1)} className={`${btnBase} ${inactive}`}>1</button>
        {left > 2 && <span className="text-zinc-500 px-1">…</span>}
      </>}

      {pages.map((p) => ( 
        <button key={p} onClick={() => onPageChange(p)}
          className={`${btnBase} ${p === currentPage ? active : inactive}`}>{p}</button>
      ))}

      {right < max && <>
        {right < max - 1 && <span className="text-zinc-500 px-1">…</span>}
        <button onClick={() => onPageChange(max)} className={`${btnBase} ${inactive}`}>{max}</button>
      </>}

      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === max}
        className={`${btnBase} ${currentPage === max ? disabled : inactive}`}>Next →</button>
    </div>
  );
};
export default Pagination;
