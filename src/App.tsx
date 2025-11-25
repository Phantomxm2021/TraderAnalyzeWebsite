
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { LanguageSelector } from './components/LanguageSelector';
import { AnalysisContainer } from './features/analysis/AnalysisContainer';
import { SettingsPage } from './features/settings/SettingsPage';
import { HistoryPage } from './features/history/HistoryPage';
import './locales/i18n';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <LanguageSelector />
        <Header />
        <main className="w-full max-w-3xl space-y-6">
          <Routes>
            <Route path="/" element={<AnalysisContainer />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </main>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
