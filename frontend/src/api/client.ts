const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (response.status === 401) {
    localStorage.removeItem('token');
    throw new Error('Unauthorized');
  }
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(error.detail || 'An error occurred');
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return response.json();
}

export const api = {
  async login(username: string, password: string): Promise<{ access_token: string; token_type: string }> {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
    });

    // Handle login response separately to show error messages instead of redirecting
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
      throw new Error(error.detail || 'Invalid username or password');
    }
    return response.json();
  },

  async getMe(): Promise<{ username: string }> {
    const response = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async getMovies(): Promise<Movie[]> {
    const response = await fetch(`${API_BASE}/movies`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async createMovie(movie: MovieCreate): Promise<Movie> {
    const response = await fetch(`${API_BASE}/movies`, {
      method: 'POST',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(movie),
    });
    return handleResponse(response);
  },

  async updateMovie(id: number, update: MovieUpdate): Promise<Movie> {
    const response = await fetch(`${API_BASE}/movies/${id}`, {
      method: 'PATCH',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(update),
    });
    return handleResponse(response);
  },

  async deleteMovie(id: number): Promise<void> {
    const response = await fetch(`${API_BASE}/movies/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async searchTMDB(query: string, year?: number): Promise<TMDBSearchResponse> {
    const params = new URLSearchParams({ query });
    if (year) params.append('year', year.toString());

    const response = await fetch(`${API_BASE}/tmdb/search?${params}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async getTMDBMovie(tmdbId: number): Promise<TMDBMovieDetails> {
    const response = await fetch(`${API_BASE}/tmdb/movie/${tmdbId}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async importCSV(file: File): Promise<ImportResult> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE}/import/csv`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
    });
    return handleResponse(response);
  },
};

export interface Movie {
  id: number;
  title: string;
  year: number;
  tmdb_id: number;
  poster_path: string | null;
  position: number;
  added_at: string;
}

export interface MovieCreate {
  title: string;
  year: number;
  tmdb_id: number;
  poster_path: string | null;
}

export interface MovieUpdate {
  tmdb_id?: number;
  title?: string;
  year?: number;
  poster_path?: string | null;
}

export interface TMDBMovieResult {
  id: number;
  title: string;
  release_date: string | null;
  poster_path: string | null;
  overview: string | null;
}

export interface TMDBSearchResponse {
  results: TMDBMovieResult[];
  total_results: number;
}

export interface TMDBMovieDetails {
  id: number;
  title: string;
  release_date: string | null;
  poster_path: string | null;
  overview: string | null;
  runtime: number | null;
  vote_average: number | null;
}

export interface ImportResult {
  imported: number;
  skipped: number;
  errors: string[];
}
