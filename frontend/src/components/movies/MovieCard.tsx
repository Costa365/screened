import { useState } from 'react';
import { Movie } from '../../api/client';

interface MovieCardProps {
  movie: Movie;
  onEdit: (movie: Movie) => void;
  onDelete: (id: number) => void;
}

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w300';

export function MovieCard({ movie, onEdit, onDelete }: MovieCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(movie.id);
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden group relative">
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
            className="w-full aspect-[2/3] object-cover"
          />
        ) : (
          <div className="w-full aspect-[2/3] bg-gray-700 flex items-center justify-center">
            <span className="text-gray-500 text-4xl">?</span>
          </div>
        )}
      </a>

      <div className="p-3">
        <h3 className="font-medium text-white truncate" title={movie.title}>
          {movie.title}
        </h3>
        <p className="text-gray-400 text-sm">{movie.year}</p>
      </div>

      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
        <button
          onClick={() => onEdit(movie)}
          className="p-1.5 bg-gray-900/80 hover:bg-gray-900 rounded text-gray-300 hover:text-white"
          title="Edit TMDB ID"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={() => setShowConfirm(true)}
          className="p-1.5 bg-gray-900/80 hover:bg-red-600 rounded text-gray-300 hover:text-white"
          title="Delete"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {showConfirm && (
        <div className="absolute inset-0 bg-gray-900/95 flex flex-col items-center justify-center p-4">
          <p className="text-white text-center mb-4">Delete "{movie.title}"?</p>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowConfirm(false)}
              disabled={isDeleting}
              className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
