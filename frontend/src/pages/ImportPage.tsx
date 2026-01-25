import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { CSVImport } from '../components/import/CSVImport';

export function ImportPage() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Import Movies</h1>
        <CSVImport onComplete={() => navigate('/')} />
      </div>
    </Layout>
  );
}
