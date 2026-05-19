const EmptyState = ({ icon = '🎬', title = 'Nothing here', message = '', action }) => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <div className="text-6xl mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-zinc-200 mb-2">{title}</h3>
    {message && <p className="text-zinc-500 max-w-sm mb-6">{message}</p>}
    {action}
  </div>
);
export default EmptyState;
 