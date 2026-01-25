import { useState, useRef } from 'react';
import { api, ImportResult } from '../../api/client';

interface CSVImportProps {
  onComplete: () => void;
}

export function CSVImport({ onComplete }: CSVImportProps) {
  const [isImporting, setIsImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setError(null);
    setResult(null);

    try {
      const importResult = await api.importCSV(file);
      setResult(importResult);
      if (importResult.imported > 0) {
        onComplete();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed');
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-4">Import from CSV</h2>

      <p className="text-gray-400 mb-4">
        Upload a CSV file with <code className="bg-gray-700 px-1 rounded">title</code> and{' '}
        <code className="bg-gray-700 px-1 rounded">year</code> columns.
        Movies will be automatically matched with TMDB.
      </p>

      <div className="mb-4 p-4 bg-gray-700 rounded-md">
        <p className="text-sm text-gray-300 mb-2">Example CSV format:</p>
        <pre className="text-xs text-gray-400 font-mono">
{`title,year
The Matrix,1999
Inception,2010
Parasite,2019`}
        </pre>
      </div>

      <div className="flex items-center gap-4">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          disabled={isImporting}
          className="hidden"
          id="csv-upload"
        />
        <label
          htmlFor="csv-upload"
          className={`px-4 py-2 rounded-md font-medium cursor-pointer transition-colors ${
            isImporting
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-primary-600 hover:bg-primary-700 text-white'
          }`}
        >
          {isImporting ? 'Importing...' : 'Select CSV File'}
        </label>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-900/50 border border-red-500 text-red-200 rounded">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-4 p-4 bg-gray-700 rounded-md">
          <h3 className="font-medium text-white mb-2">Import Results</h3>
          <ul className="space-y-1 text-sm">
            <li className="text-green-400">Imported: {result.imported}</li>
            <li className="text-yellow-400">Skipped: {result.skipped}</li>
          </ul>
          {result.errors.length > 0 && (
            <div className="mt-3">
              <p className="text-gray-400 text-sm mb-1">Errors:</p>
              <ul className="text-red-400 text-xs space-y-1 max-h-32 overflow-y-auto">
                {result.errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
