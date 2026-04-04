import { Movie } from '../../api/client';

interface MovieTableProps {
  movies: Movie[];
  onEdit: (movie: Movie) => void;
  onDelete: (id: number) => void;
}

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w154';

export function MovieTable({ movies, onEdit, onDelete }: MovieTableProps) {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700 text-left text-sm text-gray-400">
            <th className="px-4 py-3 font-medium w-20"></th>
            <th className="px-4 py-3 font-medium">Title</th>
            <th className="px-4 py-3 font-medium w-20">Year</th>
            <th className="px-4 py-3 font-medium w-24 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {movies.map(movie => (
            <tr key={movie.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
              <td className="px-4 py-1">
                <a
                  href={`https://www.themoviedb.org/movie/${movie.tmdb_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {movie.poster_path ? (
                    <img
                      src={`${TMDB_IMAGE_BASE}${movie.poster_path}`}
                      alt=""
                      className="w-16 h-24 object-contain rounded"
                    />
                  ) : (
                    <div className="w-16 h-24 bg-gray-700 rounded flex items-center justify-center">
                      <span className="text-gray-500 text-xs">?</span>
                    </div>
                  )}
                </a>
              </td>
              <td className="px-4 py-2">
                <a
                  href={`https://www.themoviedb.org/movie/${movie.tmdb_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-primary-400"
                >
                  {movie.title}
                </a>
              </td>
              <td className="px-4 py-2 text-gray-400 text-sm">{movie.year}</td>
              <td className="px-4 py-2 text-right">
                <div className="flex justify-end space-x-1">
                  <button
                    onClick={() => onEdit(movie)}
                    className="p-1.5 hover:bg-gray-600 rounded text-gray-400 hover:text-white"
                    title="Edit"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => { if (confirm(`Delete "${movie.title}"?`)) onDelete(movie.id); }}
                    className="p-1.5 hover:bg-red-600 rounded text-gray-400 hover:text-white"
                    title="Delete"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
