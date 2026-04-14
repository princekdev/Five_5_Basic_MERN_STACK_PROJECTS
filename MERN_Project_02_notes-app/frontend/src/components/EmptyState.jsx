export const EmptyState = ({ search, category, onNew }) => {
  const isFiltered = search || (category && category !== "All");

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-5xl mb-4 opacity-40">
        {isFiltered ? "🔍" : "✒️"}
      </div>
      <h3 className="font-display text-parchment-50/60 text-lg mb-2">
        {isFiltered ? "No notes found" : "Your notebook is empty"}
      </h3>
      <p className="text-ink-600 text-sm max-w-xs mb-6">
        {isFiltered
          ? `No notes match "${search || category}". Try adjusting your search or filter.`
          : "Create your first note to start capturing thoughts, ideas, and more."}
      </p>
      {!isFiltered && (
        <button onClick={onNew} className="btn-primary text-sm">
          + Create First Note
        </button>
      )}
    </div>
  );
};
 