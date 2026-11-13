import { Link, Route, Routes } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from './auth';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import BeerList from './pages/BeerList';
import BeerDetail from './pages/BeerDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Rankings from './pages/Rankings';
import AddBeer from './pages/AddBeer';

function App() {
  const { username, logout } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="flex items-center justify-between border-b border-neutral-800 px-8 py-6">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-semibold tracking-tight">Beerly</Link>
          <Link to="/rankings" className="text-sm text-neutral-400 hover:text-neutral-100">
            {t('nav.rankings')}
          </Link>
          <Link to="/beers/new" className="text-sm text-neutral-400 hover:text-neutral-100">
            {t('addBeer.navLabel')}
          </Link>
        </div>

        <div className="flex items-center gap-5 text-sm">
          <LanguageSwitcher />
          {username ? (
            <>
              <span className="text-neutral-400">{username}</span>
              <button onClick={logout} className="text-neutral-400 hover:text-neutral-100">
                {t('nav.logout')}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-neutral-400 hover:text-neutral-100">
                {t('nav.login')}
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-neutral-100 px-3 py-1.5 font-medium text-neutral-950 hover:bg-white"
              >
                {t('nav.signup')}
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-8 py-10">
        <Routes>
          <Route path="/" element={<BeerList />} />
          <Route path="/beers/:id" element={<BeerDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/rankings" element={<Rankings />} />
          <Route path="/beers/new" element={<AddBeer />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;