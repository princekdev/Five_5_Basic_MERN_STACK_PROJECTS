import Navbar from './Navbar';

const Layout = ({ children }) => (
  <div className="min-h-screen bg-zinc-950 text-white">
    <Navbar />
    <main className="pt-16">
      {children}
    </main>
    <footer className="border-t border-zinc-800 py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 text-center text-zinc-600 text-sm">
        <p>© {new Date().getFullYear()} CineVerse. Movie data provided by <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" className="text-amber-500/70 hover:text-amber-400 transition-colors">TMDB</a>.</p>
      </div>
    </footer>
  </div>
);
export default Layout;
 