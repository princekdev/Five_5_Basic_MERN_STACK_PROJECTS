import { useState } from 'react';
import Layout from '../components/layout/Layout';
import FilterBar from '../components/movie/FilterBar';
import MovieGrid from '../components/movie/MovieGrid';
import Pagination from '../components/common/Pagination';
import { useDiscoverMovies } from '../hooks/useMovies';

const DiscoverPage = () => {
  const [filters, setFilters] = useState({ genre: '', year: '', sort_by: 'popularity.desc', page: 1 });
  const { data, loading, error } = useDiscoverMovies(filters);

  const handlePageChange = (p) => {
    setFilters((f) => ({ ...f, page: p }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Layout> 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div>
          <h1 className="text-3xl font-black text-white">Discover Movies</h1>
          <p className="text-zinc-500 text-sm mt-1">Filter by genre, year, and more</p>
        </div>

        <FilterBar filters={filters} onChange={setFilters} />

        {data && (
          <p className="text-zinc-500 text-sm">{data.total_results?.toLocaleString() || 0} movies found</p>
        )}

        <MovieGrid movies={data?.results} loading={loading} error={error} emptyTitle="No movies found" emptyMessage="Try adjusting your filters." />

        {data?.total_pages > 1 && (
          <Pagination currentPage={filters.page} totalPages={data.total_pages} onPageChange={handlePageChange} />
        )}
      </div>
    </Layout>
  );
};
export default DiscoverPage;
