const dateFormat = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});

export function WatchedDate({ value }: { value: string | null }) {
  if (!value) return null;
  return (
    <time dateTime={value} className="block text-xs text-gray-400">
      Watched {dateFormat.format(new Date(value))}
    </time>
  );
}

interface WatchedDateFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
}

export function WatchedDateField({ id, value, onChange }: WatchedDateFieldProps) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2 mb-1">
        <label htmlFor={id} className="text-sm text-gray-300">Watched on (optional)</label>
        {value && (
          <button type="button" onClick={() => onChange('')} className="text-xs text-primary-400 hover:underline">
            Clear
          </button>
        )}
      </div>
      <div className="relative">
        <input
          id={id}
          type="date"
          value={value}
          onChange={e => onChange(e.target.value)}
          aria-describedby={value ? undefined : `${id}-empty`}
          className="peer w-full min-w-0 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white [color-scheme:dark] focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        {!value && (
          <span
            id={`${id}-empty`}
            className="pointer-events-none absolute inset-y-px left-px right-10 flex items-center rounded-l-md bg-gray-700 pl-3 text-gray-300 peer-focus:hidden"
          >
            No date set
          </span>
        )}
      </div>
    </div>
  );
}
