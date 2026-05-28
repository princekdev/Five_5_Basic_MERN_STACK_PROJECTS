export const TMDB_IMAGE_BASE = process.env.REACT_APP_TMDB_IMAGE_BASE || 'https://image.tmdb.org/t/p';
export const POSTER_SIZES = { sm: 'w185', md: 'w342', lg: 'w500', xl: 'w780', original: 'original' };
export const BACKDROP_SIZES = { sm: 'w300', md: 'w780', lg: 'w1280', original: 'original' };

export const getPosterUrl = (path, size = 'md') =>
  path ? `${TMDB_IMAGE_BASE}/${POSTER_SIZES[size]}${path}` : null;

export const getBackdropUrl = (path, size = 'lg') =>
  path ? `${TMDB_IMAGE_BASE}/${BACKDROP_SIZES[size]}${path}` : null;

export const formatRating = (rating) => rating ? Number(rating).toFixed(1) : 'N/A';

export const formatYear = (dateStr) => dateStr ? dateStr.slice(0, 4) : 'N/A';

export const formatRuntime = (minutes) => {
  if (!minutes) return 'N/A';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

export const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'vote_average.desc', label: 'Highest Rated' },
  { value: 'release_date.desc', label: 'Newest First' },
  { value: 'release_date.asc', label: 'Oldest First' },
]; 

export const YEARS = Array.from({ length: 35 }, (_, i) => new Date().getFullYear() - i);
