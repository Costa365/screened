import { Movie } from '../../api/client';

interface MovieSmallGridProps {
  movies: Movie[];
  onEdit: (movie: Movie) => void;
  onDelete: (id: number) => void;
}

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w92';

export function MovieSmallGrid({ movies, onEdit, onDelete }: MovieSmallGridProps) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
      {movies.map(movie => (
        <div key={movie.id} className="group relative">
          <a
            href={`https://www.themoviedb.org/movie/${movie.tmdb_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            {movie.poster_path ? (
              <img
                src={`${TMDB_IMAGE_BASE}${movie.poster_path}`}
                alt={movie.title}
                className="w-full aspect-[2/3] object-cover rounded"
              />
            ) : (
              <div className="w-full aspect-[2/3] bg-gray-700 rounded flex items-center justify-center">
                <span className="text-gray-500 text-2xl">?</span>
              </div>
            )}
          </a>
          <p className="text-xs text-gray-300 truncate mt-1" title={movie.title}>
            {movie.title}
          </p>
          <p className="text-xs text-gray-500">{movie.year}</p>

          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-0.5">
            <button
              onClick={() => onEdit(movie)}
              className="p-1 bg-gray-900/80 hover:bg-gray-900 rounded text-gray-300 hover:text-white"
              title="Edit"
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => { if (confirm(`Delete "${movie.title}"?`)) onDelete(movie.id); }}
              className="p-1 bg-gray-900/80 hover:bg-red-600 rounded text-gray-300 hover:text-white"
              title="Delete"
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
