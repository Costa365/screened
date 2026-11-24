import { Movie } from '../api/client';

export function exportMoviesCsv(movies: Movie[]) {
  const includeDates = movies.some(movie => movie.watched_on);
  const header = includeDates ? ['title', 'year', 'watched_on'] : ['title', 'year'];
  const rows = [header];
  for (const movie of movies) {
    const row = [movie.title, String(movie.year)];
    if (includeDates) row.push(movie.watched_on ?? '');
    rows.push(row);
  }
  const csv = rows.map(r => r.map(v => `"${v.replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'screened-movies.csv';
  a.click();
  URL.revokeObjectURL(url);
}
