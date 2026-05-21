import { Link } from 'react-router-dom';
import { getPosterUrl, formatYear, formatRating } from '../../utils/constants';
import { useFavorites } from '../../context/FavoritesContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const PLACEHOLDER = 'https://via.placeholder.com/342x513/18181b/a1a1aa?text=No+Image';

const MovieCard = ({ movie }) => {
  const { isAuthenticated } = useAuth();
  const { isFavorited, toggleFavorite } = useFavorites();
  const favorited = isFavorited(movie.id);

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) { toast.error('Please log in to save favorites.'); return; }
    toggleFavorite({
      movieId: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      overview: movie.overview,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
      vote_count: movie.vote_count,
      genre_ids: movie.genre_ids || [],
      popularity: movie.popularity, 
    }); 
  };

  return (
    <Link to={`/movie/${movie.id}`} className="group relative block rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800/50 hover:border-amber-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10 hover:-translate-y-1">
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden bg-zinc-800">
        <img
          src={getPosterUrl(movie.poster_path) || PLACEHOLDER}
          alt={movie.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { e.target.src = PLACEHOLDER; }}
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Rating badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg">
          <svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-xs font-bold text-white">{formatRating(movie.vote_average)}</span>
        </div>

        {/* Favorite button */}
        <button onClick={handleFavorite}
          className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-sm transition-all duration-200 ${favorited ? 'bg-amber-500 text-black' : 'bg-black/60 text-zinc-300 hover:bg-amber-500/80 hover:text-black'}`}>
          <svg className="w-4 h-4" fill={favorited ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-semibold text-sm text-white leading-snug line-clamp-2 group-hover:text-amber-300 transition-colors">{movie.title}</h3>
        <p className="text-xs text-zinc-500 mt-1">{formatYear(movie.release_date)}</p>
      </div>
    </Link>
  );
};
export default MovieCard;
