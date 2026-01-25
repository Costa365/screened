import { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { MovieGrid } from '../components/movies/MovieGrid';
import { AddMovieForm } from '../components/movies/AddMovieForm';
import { EditMovieModal } from '../components/movies/EditMovieModal';
import { useMovies } from '../hooks/useMovies';
import { Movie } from '../api/client';

export function MoviesPage() {
  const { movies, isLoading, error, addMovie, updateMovie, deleteMovie } = useMovies();
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">My Movies</h1>
          <span className="text-gray-400">{movies.length} movies</span>
        </div>

        <AddMovieForm onAdd={addMovie} />

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-600 border-t-primary-500" />
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p>No movies yet. Add your first movie above!</p>
          </div>
        ) : (
          <MovieGrid
            movies={movies}
            onEdit={setEditingMovie}
            onDelete={deleteMovie}
          />
        )}
      </div>

      {editingMovie && (
        <EditMovieModal
          movie={editingMovie}
          onSave={async (update) => {
            await updateMovie(editingMovie.id, update);
            setEditingMovie(null);
          }}
          onClose={() => setEditingMovie(null)}
        />
      )}
    </Layout>
  );
}
