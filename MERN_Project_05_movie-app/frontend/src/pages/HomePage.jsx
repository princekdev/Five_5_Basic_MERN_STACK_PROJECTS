import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import HeroBanner from '../components/movie/HeroBanner';
import MovieGrid from '../components/movie/MovieGrid';
import SearchBar from '../components/movie/SearchBar';
import Pagination from '../components/common/Pagination';
import { useTrendingMovies, usePopularMovies } from '../hooks/useMovies';

const HomePage = () => {
  const { data: trending, loading: trendingLoading } = useTrendingMovies();
  const [popularPage, setPopularPage] = useState(1);
  const { data: popular, loading: popularLoading } = usePopularMovies(popularPage);

  return (
    <Layout>
      {/* Hero */}
      {trendingLoading
        ? <div className="h-[70vh] bg-zinc-900 animate-pulse" />
        : <HeroBanner movies={trending?.results || []} />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Search CTA */}
        <section className="text-center space-y-4">
          <h2 className="text-2xl font-black text-white">Find Any Movie</h2>
          <div className="flex justify-center">
            <SearchBar large />
          </div>
        </section> 

        {/* Trending */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-white">Trending This Week</h2>
              <p className="text-zinc-500 text-sm mt-1">What everyone's watching right now</p>
            </div>
            <Link to="/discover" className="text-sm text-amber-400 hover:text-amber-300 font-medium transition-colors">
              See all →
            </Link>
          </div>
          <MovieGrid
            movies={trending?.results?.slice(0, 12)}
            loading={trendingLoading}
            emptyTitle="No trending movies"
          />
        </section>

        {/* Popular */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-white">Popular Movies</h2>
              <p className="text-zinc-500 text-sm mt-1">Fan favourites from around the world</p>
            </div>
            <span className="text-xs text-zinc-600">Page {popularPage}</span>
          </div>
          <MovieGrid movies={popular?.results} loading={popularLoading} emptyTitle="No popular movies" />
          {popular?.total_pages > 1 && (
            <div className="mt-8">
              <Pagination currentPage={popularPage} totalPages={popular.total_pages} onPageChange={setPopularPage} />
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};
export default HomePage;
