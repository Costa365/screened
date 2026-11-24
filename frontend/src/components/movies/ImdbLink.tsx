import type { ReactNode } from 'react';
import type { Movie } from '../../api/client';

interface ImdbLinkProps {
  movie: Movie;
  children: ReactNode;
  className?: string;
}

export function ImdbLink({ movie, children, className }: ImdbLinkProps) {
  const params = new URLSearchParams({ title: movie.title });
  return (
    <a
      href={`/imdb/${movie.tmdb_id}?${params}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`View ${movie.title} (${movie.year}) on IMDb`}
      className={className}
    >
      {children}
    </a>
  );
}
