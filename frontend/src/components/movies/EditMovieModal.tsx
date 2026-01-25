import { useState, FormEvent } from 'react';
import { Movie, MovieUpdate, api } from '../../api/client';

interface EditMovieModalProps {
  movie: Movie;
  onSave: (update: MovieUpdate) => Promise<void>;
  onClose: () => void;
}

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w300';

export function EditMovieModal({ movie, onSave, onClose }: EditMovieModalProps) {
  const [tmdbId, setTmdbId] = useState(movie.tmdb_id.toString());
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<{
    title: string;
    year: number;
    poster_path: string | null;
  } | null>(null);

  const handleLookup = async () => {
    const id = parseInt(tmdbId, 10);
    if (isNaN(id)) {
      setError('Invalid TMDB ID');
      return;
    }

    setIsLoading(true);
    setError(null);
    setPreview(null);

    try {
      const details = await api.getTMDBMovie(id);
      setPreview({
        title: details.title,
        year: details.release_date ? parseInt(details.release_date.substring(0, 4), 10) : movie.year,
        poster_path: details.poster_path,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to lookup movie');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!preview) return;

    setIsSaving(true);
    setError(null);

    try {
      await onSave({
        tmdb_id: parseInt(tmdbId, 10),
        title: preview.title,
        year: preview.year,
        poster_path: preview.poster_path,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-white mb-4">Edit Movie</h2>
        <p className="text-gray-400 text-sm mb-4">
          Current: {movie.title} ({movie.year})
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              TMDB ID
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tmdbId}
                onChange={e => setTmdbId(e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="button"
                onClick={handleLookup}
                disabled={isLoading}
                className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md"
              >
                {isLoading ? '...' : 'Lookup'}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm">{error}</div>
          )}

          {preview && (
            <div className="flex gap-4 p-3 bg-gray-700 rounded-md">
              {preview.poster_path ? (
                <img
                  src={`${TMDB_IMAGE_BASE}${preview.poster_path}`}
                  alt=""
                  className="w-20 h-30 object-cover rounded"
                />
              ) : (
                <div className="w-20 h-30 bg-gray-600 rounded flex items-center justify-center text-gray-500">
                  ?
                </div>
              )}
              <div>
                <p className="text-white font-medium">{preview.title}</p>
                <p className="text-gray-400 text-sm">{preview.year}</p>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!preview || isSaving}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-md"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
