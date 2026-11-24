import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { api } from '../api/client';

export function ImdbPage() {
  const { tmdbId } = useParams();
  const [params] = useSearchParams();
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    let active = true;
    api.getTMDBMovie(Number(tmdbId))
      .then(({ imdb_id }) => {
        if (!active) return;
        if (imdb_id && /^tt\d+$/.test(imdb_id)) {
          window.location.replace(`https://www.imdb.com/title/${imdb_id}/`);
        } else {
          setUnavailable(true);
        }
      })
      .catch(() => { if (active) setUnavailable(true); });
    return () => { active = false; };
  }, [tmdbId]);

  const title = params.get('title') || '';
  const search = new URLSearchParams({ q: title, s: 'tt' });
  return (
    <main className="p-6 text-center" role="status">
      {unavailable ? (
        <>
          <p>Couldn’t open the IMDb page for {title || 'this movie'}.</p>
          <a className="text-primary-400 underline" href={`https://www.imdb.com/find/?${search}`}>
            Search IMDb
          </a>
        </>
      ) : 'Opening IMDb…'}
    </main>
  );
}
