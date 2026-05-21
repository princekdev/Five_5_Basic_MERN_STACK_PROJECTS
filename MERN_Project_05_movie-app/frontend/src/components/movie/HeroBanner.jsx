import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBackdropUrl, formatYear, formatRating } from '../../utils/constants';
import { useFavorites } from '../../context/FavoritesContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const HeroBanner = ({ movies = [] }) => {
  const [current, setCurrent] = useState(0);
  const { isAuthenticated } = useAuth();
  const { isFavorited, toggleFavorite } = useFavorites();

  const featured = movies.slice(0, 6);
  const movie = featured[current];

  useEffect(() => {
    if (!featured.length) return;
    const timer = setInterval(() => setCurrent((c) => (c + 1) % featured.length), 7000);
    return () => clearInterval(timer);
  }, [featured.length]);

  if (!movie) return null; 
  const favorited = isFavorited(movie.id);

  const handleFavorite = () => {
    if (!isAuthenticated) { toast.error('Please log in to save favorites.'); return; }
    toggleFavorite({
      movieId: movie.id, title: movie.title, poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path, overview: movie.overview,
      release_date: movie.release_date, vote_average: movie.vote_average,
      vote_count: movie.vote_count, genre_ids: movie.genre_ids || [], popularity: movie.popularity,
    });
  };

  return (
    <div className="relative h-[70vh] min-h-[500px] overflow-hidden bg-zinc-900">
      {/* Background */}
      <div className="absolute inset-0">
        <img key={movie.id} src={getBackdropUrl(movie.backdrop_path)}
          alt="" className="w-full h-full object-cover animate-fade-in"
          onError={(e) => { e.target.style.display = 'none'; }} />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-end h-full max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="max-w-xl space-y-4">
          <div className="flex items-center gap-2 text-xs text-zinc-400 uppercase tracking-widest">
            <span className="w-6 h-px bg-amber-400" />
            <span>Trending Now</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight">{movie.title}</h1>
          <div className="flex items-center gap-4 text-sm text-zinc-400">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {formatRating(movie.vote_average)}
            </span>
            <span>{formatYear(movie.release_date)}</span>
          </div>
          <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3">{movie.overview}</p>
          <div className="flex items-center gap-3 pt-2">
            <Link to={`/movie/${movie.id}`}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-colors duration-200">
              View Details
            </Link>
            <button onClick={handleFavorite}
              className={`px-6 py-3 font-semibold rounded-xl border transition-all duration-200 ${
                favorited
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                  : 'bg-white/5 border-zinc-600 text-white hover:border-amber-500/60 hover:text-amber-300'}`}>
              {favorited ? '♥ Saved' : '♡ Save'}
            </button>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 right-6 z-10 flex gap-2">
        {featured.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-6 bg-amber-400' : 'w-1.5 bg-zinc-600 hover:bg-zinc-400'}`} />
        ))}
      </div>
    </div>
  );
};
export default HeroBanner;
