import { useParams, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Spinner from '../components/common/Spinner';
import Badge from '../components/common/Badge';
import MovieGrid from '../components/movie/MovieGrid';
import { useMovieDetails } from '../hooks/useMovies';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import { getBackdropUrl, getPosterUrl, formatYear, formatRating, formatRuntime } from '../utils/constants';
import toast from 'react-hot-toast';

const PLACEHOLDER = 'https://via.placeholder.com/500x750/18181b/a1a1aa?text=No+Poster';

const MovieDetailPage = () => {
  const { id } = useParams();
  const { data: movie, loading, error } = useMovieDetails(id);
  const { isAuthenticated } = useAuth();
  const { isFavorited, toggleFavorite } = useFavorites();

  if (loading) return <Layout><div className="flex justify-center py-32"><Spinner size="lg" /></div></Layout>;
  if (error || !movie) return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-4xl mb-4">🎬</p>
        <h2 className="text-2xl font-bold text-white mb-2">Movie not found</h2>
        <Link to="/" className="text-amber-400 hover:text-amber-300">← Back to Home</Link>
      </div>
    </Layout>
  );
 
  const favorited = isFavorited(movie.id);

  const handleFavorite = () => {
    if (!isAuthenticated) { toast.error('Please log in to save favorites.'); return; }
    toggleFavorite({
      movieId: movie.id, title: movie.title, poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path, overview: movie.overview,
      release_date: movie.release_date, vote_average: movie.vote_average,
      vote_count: movie.vote_count, genre_ids: movie.genres?.map((g) => g.id) || [],
      popularity: movie.popularity,
    });
  };

  const trailer = movie.videos?.results?.find((v) => v.type === 'Trailer' && v.site === 'YouTube');
  const cast = movie.credits?.cast?.slice(0, 8) || [];
  const similar = movie.similar?.results?.slice(0, 6) || [];
  const ratingPercent = Math.round((parseFloat(movie.vote_average) / 10) * 100);
  const ratingColor = ratingPercent >= 70 ? 'text-emerald-400' : ratingPercent >= 50 ? 'text-amber-400' : 'text-red-400';

  return (
    <Layout>
      {/* Backdrop */}
      <div className="relative h-[50vh] overflow-hidden">
        <img src={getBackdropUrl(movie.backdrop_path)} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-zinc-950/20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-40 relative z-10 pb-16">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0 w-48 md:w-56 lg:w-64">
            <img src={getPosterUrl(movie.poster_path, 'lg') || PLACEHOLDER} alt={movie.title}
              className="w-full rounded-2xl shadow-2xl border border-zinc-700/50"
              onError={(e) => { e.target.src = PLACEHOLDER; }} />
          </div>

          {/* Info */}
          <div className="flex-1 space-y-5 pt-4 md:pt-16">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">{movie.title}</h1>
              {movie.tagline && <p className="text-zinc-400 italic mt-1">{movie.tagline}</p>}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Rating circle */}
              <div className="flex items-center gap-2 bg-zinc-800/80 rounded-xl px-3 py-2">
                <span className={`text-2xl font-black ${ratingColor}`}>{formatRating(movie.vote_average)}</span>
                <div className="text-left">
                  <div className="text-xs text-zinc-500">Score</div>
                  <div className="text-xs text-zinc-400">{movie.vote_count?.toLocaleString()} votes</div>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-zinc-500">Release</span>
                <span className="text-sm text-white font-medium">{movie.release_date || 'N/A'}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-zinc-500">Runtime</span>
                <span className="text-sm text-white font-medium">{formatRuntime(movie.runtime)}</span>
              </div>
            </div>

            {/* Genres */}
            {movie.genres?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((g) => <Badge key={g.id} variant="amber">{g.name}</Badge>)}
              </div>
            )}

            <p className="text-zinc-300 leading-relaxed">{movie.overview}</p>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button onClick={handleFavorite}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold border transition-all duration-200 ${
                  favorited
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-white/5 border-zinc-600 text-white hover:border-amber-500/60 hover:text-amber-300'}`}>
                <svg className="w-5 h-5" fill={favorited ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {favorited ? 'Saved' : 'Save to Favorites'}
              </button>
              {trailer && (
                <a href={`https://www.youtube.com/watch?v=${trailer.key}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl transition-colors">
                  ▶ Watch Trailer
                </a>
              )}
            </div>

            {/* Extra Info */}
            <div className="grid grid-cols-2 gap-4 text-sm pt-2">
              {movie.production_companies?.slice(0, 2).map((c) => (
                <div key={c.id}>
                  <span className="text-zinc-500 text-xs uppercase tracking-wider">Studio</span>
                  <p className="text-zinc-300 mt-0.5">{c.name}</p>
                </div>
              ))}
              {movie.spoken_languages?.slice(0, 1).map((l) => (
                <div key={l.iso_639_1}>
                  <span className="text-zinc-500 text-xs uppercase tracking-wider">Language</span>
                  <p className="text-zinc-300 mt-0.5">{l.english_name}</p>
                </div>
              ))}
              {movie.budget > 0 && (
                <div>
                  <span className="text-zinc-500 text-xs uppercase tracking-wider">Budget</span>
                  <p className="text-zinc-300 mt-0.5">${movie.budget?.toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cast */}
        {cast.length > 0 && (
          <section className="mt-14">
            <h2 className="text-2xl font-black text-white mb-6">Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
              {cast.map((person) => (
                <div key={person.id} className="text-center">
                  <div className="aspect-square rounded-full overflow-hidden bg-zinc-800 mb-2 border-2 border-zinc-700">
                    <img
                      src={person.profile_path ? `https://image.tmdb.org/t/p/w185${person.profile_path}` : 'https://via.placeholder.com/185x185/18181b/a1a1aa?text=?'}
                      alt={person.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/185x185/18181b/a1a1aa?text=?'; }}
                    />
                  </div>
                  <p className="text-xs font-semibold text-white leading-tight">{person.name}</p>
                  <p className="text-xs text-zinc-500 leading-tight mt-0.5 line-clamp-1">{person.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Similar */}
        {similar.length > 0 && (
          <section className="mt-14">
            <h2 className="text-2xl font-black text-white mb-6">Similar Movies</h2>
            <MovieGrid movies={similar} emptyTitle="" />
          </section>
        )}
      </div>
    </Layout>
  );
};
export default MovieDetailPage;
