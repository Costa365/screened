import { Movie } from '../api/client';

export function exportMoviesCsv(movies: Movie[]) {
  const rows = [['title', 'year'], ...movies.map(m => [m.title, String(m.year)])];
  const csv = rows.map(r => r.map(v => `"${v.replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'screened-movies.csv';
  a.click();
  URL.revokeObjectURL(url);
}
