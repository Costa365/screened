import { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { MovieGrid } from '../components/movies/MovieGrid';
import { MovieSmallGrid } from '../components/movies/MovieSmallGrid';
import { MovieTable } from '../components/movies/MovieTable';
import { AddMovieForm } from '../components/movies/AddMovieForm';
import { EditMovieModal } from '../components/movies/EditMovieModal';
import { useMovies } from '../hooks/useMovies';
import { Movie } from '../api/client';

type ViewMode = 'grid' | 'small' | 'table';

export function MoviesPage() {
  const { movies, isLoading, error, addMovie, updateMovie, deleteMovie } = useMovies();
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    return (localStorage.getItem('viewMode') as ViewMode) || 'grid';
  });

  const setView = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem('viewMode', mode);
  };

  const viewButtonClass = (mode: ViewMode) =>
    `p-1.5 rounded ${viewMode === mode ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700/50'}`;

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">My Movies</h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setView('grid')}
                className={viewButtonClass('grid')}
                title="Large icons"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setView('small')}
                className={viewButtonClass('small')}
                title="Small icons"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm6 0a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1V5zm6 0a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1V5zM4 11a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2zm6 0a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2zm6 0a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2zM4 17a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2zm6 0a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2zm6 0a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setView('table')}
                className={viewButtonClass('table')}
                title="Table"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            <span className="text-gray-400">{movies.length} movies</span>
          </div>
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
        ) : viewMode === 'grid' ? (
          <MovieGrid
            movies={movies}
            onEdit={setEditingMovie}
            onDelete={deleteMovie}
          />
        ) : viewMode === 'small' ? (
          <MovieSmallGrid
            movies={movies}
            onEdit={setEditingMovie}
            onDelete={deleteMovie}
          />
        ) : (
          <MovieTable
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
