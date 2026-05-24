import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import SearchBar from '../components/movie/SearchBar';
import MovieGrid from '../components/movie/MovieGrid';
import Pagination from '../components/common/Pagination';
import { useSearchMovies } from '../hooks/useMovies';
import { YEARS } from '../utils/constants';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [page, setPage] = useState(1);
  const [year, setYear] = useState('');

  useEffect(() => { setPage(1); }, [query]);

  const { data, loading, error } = useSearchMovies(query, page, year || undefined);

  const handlePageChange = (p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-black text-white">Search Movies</h1>
          <SearchBar initialQuery={query} autoFocus large />
        </div>

        {query && ( 
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-zinc-400 text-sm">
              {loading ? 'Searching…' : data ? `${data.total_results?.toLocaleString() || 0} results for "${query}"` : ''}
            </span>
            <select value={year} onChange={(e) => { setYear(e.target.value); setPage(1); }}
              className="bg-zinc-800 border border-zinc-700 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-amber-500/60 cursor-pointer">
              <option value="">Any Year</option>
              {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        )}

        {query ? (
          <>
            <MovieGrid
              movies={data?.results}
              loading={loading}
              error={error}
              emptyTitle={`No results for "${query}"`}
              emptyMessage="Try a different title or check your spelling."
            />
            {data?.total_pages > 1 && (
              <Pagination currentPage={page} totalPages={data.total_pages} onPageChange={handlePageChange} />
            )}
          </>
        ) : (
          <div className="text-center py-20 text-zinc-500">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-lg">Type a movie title above to start searching</p>
          </div>
        )}
      </div>
    </Layout>
  );
};
export default SearchPage;
