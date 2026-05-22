import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import MovieGrid from '../components/movie/MovieGrid';
import EmptyState from '../components/common/EmptyState';
import { useFavorites } from '../context/FavoritesContext';

// Adapt favorites schema to match MovieCard expectations
const adaptFavorite = (fav) => ({
  id: fav.movieId,
  title: fav.title,
  poster_path: fav.poster_path,
  backdrop_path: fav.backdrop_path,
  overview: fav.overview,
  release_date: fav.release_date,
  vote_average: fav.vote_average,
  vote_count: fav.vote_count,
  genre_ids: fav.genre_ids,
  popularity: fav.popularity,
});

const FavoritesPage = () => { 
  const { favorites, loading } = useFavorites();
  const adapted = favorites.map(adaptFavorite);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-white">My Favorites</h1>
            <p className="text-zinc-500 text-sm mt-1">{favorites.length} saved movie{favorites.length !== 1 ? 's' : ''}</p>
          </div>
          <Link to="/discover" className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm rounded-xl transition-colors">
            Browse More
          </Link>
        </div>

        {!loading && !favorites.length ? (
          <EmptyState
            icon="💔"
            title="No favorites yet"
            message="Start adding movies you love by clicking the heart icon on any movie card."
            action={
              <Link to="/" className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-colors">
                Browse Movies
              </Link>
            }
          />
        ) : (
          <MovieGrid movies={adapted} loading={loading} emptyTitle="No favorites yet" />
        )}
      </div>
    </Layout>
  );
};
export default FavoritesPage;
