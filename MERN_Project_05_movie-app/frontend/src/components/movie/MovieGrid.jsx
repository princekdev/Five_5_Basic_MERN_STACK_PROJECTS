import MovieCard from './MovieCard';
import Spinner from '../common/Spinner';
import EmptyState from '../common/EmptyState';

const SkeletonCard = () => (
  <div className="rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 animate-pulse">
    <div className="aspect-[2/3] bg-zinc-800" />
    <div className="p-3 space-y-2">
      <div className="h-4 bg-zinc-800 rounded w-3/4" />
      <div className="h-3 bg-zinc-800 rounded w-1/3" />
    </div>
  </div>
);

const MovieGrid = ({ movies, loading, error, emptyTitle = 'No movies found', emptyMessage = '' }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array.from({ length: 18 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    ); 
  }
  if (error) {
    return <EmptyState icon="⚠️" title="Something went wrong" message={error} />;
  }
  if (!movies?.length) {
    return <EmptyState icon="🎬" title={emptyTitle} message={emptyMessage} />;
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {movies.map((movie) => <MovieCard key={movie.id || movie.movieId} movie={movie} />)}
    </div>
  );
};
export default MovieGrid;
