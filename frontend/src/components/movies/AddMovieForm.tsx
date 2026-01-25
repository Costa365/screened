import { useState, FormEvent } from 'react';
import { api, TMDBMovieResult, MovieCreate } from '../../api/client';

interface AddMovieFormProps {
  onAdd: (movie: MovieCreate) => Promise<unknown>;
}

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w92';

export function AddMovieForm({ onAdd }: AddMovieFormProps) {
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<TMDBMovieResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSearching(true);
    setError(null);
    setSearchResults([]);

    try {
      const yearNum = year ? parseInt(year, 10) : undefined;
      const result = await api.searchTMDB(title.trim(), yearNum);
      setSearchResults(result.results.slice(0, 10));
      setShowResults(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelect = async (movie: TMDBMovieResult) => {
    try {
      const movieYear = movie.release_date ? parseInt(movie.release_date.substring(0, 4), 10) : parseInt(year, 10) || new Date().getFullYear();
      await onAdd({
        title: movie.title,
        year: movieYear,
        tmdb_id: movie.id,
        poster_path: movie.poster_path,
      });
      setTitle('');
      setYear('');
      setSearchResults([]);
      setShowResults(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add movie');
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Movie title"
          className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <input
          type="text"
          value={year}
          onChange={e => setYear(e.target.value)}
          placeholder="Year (optional)"
          className="w-full sm:w-32 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <button
          type="submit"
          disabled={isSearching || !title.trim()}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors"
        >
          {isSearching ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && (
        <div className="mt-3 text-red-400 text-sm">{error}</div>
      )}

      {showResults && (
        <div className="mt-4">
          {searchResults.length === 0 ? (
            <p className="text-gray-400 text-sm">No movies found. Try a different search.</p>
          ) : (
            <div className="space-y-2">
              <p className="text-gray-400 text-sm">Select a movie:</p>
              <div className="max-h-80 overflow-y-auto space-y-2">
                {searchResults.map(movie => (
                  <button
                    key={movie.id}
                    onClick={() => handleSelect(movie)}
                    className="w-full flex items-center gap-3 p-2 bg-gray-700 hover:bg-gray-600 rounded-md text-left transition-colors"
                  >
                    {movie.poster_path ? (
                      <img
                        src={`${TMDB_IMAGE_BASE}${movie.poster_path}`}
                        alt=""
                        className="w-12 h-18 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-18 bg-gray-600 rounded flex items-center justify-center text-gray-500 text-xs">
                        ?
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{movie.title}</p>
                      <p className="text-gray-400 text-sm">
                        {movie.release_date ? movie.release_date.substring(0, 4) : 'Unknown year'}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  setShowResults(false);
                  setSearchResults([]);
                }}
                className="text-gray-400 hover:text-white text-sm"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
