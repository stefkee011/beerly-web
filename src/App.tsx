import { Link, Route, Routes } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from './auth';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import BeerList from './pages/BeerList';
import BeerDetail from './pages/BeerDetail';
import AddBeer from './pages/AddBeer';
import Login from './pages/Login';
import Register from './pages/Register';
import Rankings from './pages/Rankings';

const navLink = 'py-2 text-neutral-400 transition hover:text-neutral-100';

function App() {
  const { username, logout } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="flex flex-wrap items-center justify-between gap-x-8 gap-y-1 border-b border-neutral-800 px-4 py-3 sm:px-8 sm:py-6">
        <Link to="/" className="text-2xl font-semibold tracking-tight">
          Beerly
        </Link>

        <nav className="order-last flex w-full gap-6 text-sm sm:order-none sm:w-auto sm:flex-1">
          <Link to="/rankings" className={navLink}>{t('nav.rankings')}</Link>
          <Link to="/beers/new" className={navLink}>{t('addBeer.navLabel')}</Link>
        </nav>

        <div className="flex items-center gap-4 text-sm sm:gap-5">
          <LanguageSwitcher />
          {username ? (
            <>
              <span className="hidden text-neutral-400 sm:inline">{username}</span>
              <button onClick={logout} className={navLink}>{t('nav.logout')}</button>
            </>
          ) : (
            <>
              <Link to="/login" className={navLink}>{t('nav.login')}</Link>
              <Link
                to="/register"
                className="rounded-lg bg-neutral-100 px-3 py-2 font-medium text-neutral-950 hover:bg-white"
              >
                {t('nav.signup')}
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-10">
        <Routes>
          <Route path="/" element={<BeerList />} />
          <Route path="/beers/new" element={<AddBeer />} />
          <Route path="/beers/:id" element={<BeerDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/rankings" element={<Rankings />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;