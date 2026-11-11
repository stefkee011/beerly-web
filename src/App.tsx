import { Link, Route, Routes } from 'react-router-dom';
import { useAuth } from './auth';
import BeerList from './pages/BeerList';
import BeerDetail from './pages/BeerDetail';
import Login from './pages/Login';

function App() {
  const { username, logout } = useAuth();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="flex items-center justify-between border-b border-neutral-800 px-8 py-6">
        <Link to="/" className="text-2xl font-semibold tracking-tight">Beerly</Link>

        {username ? (
          <div className="flex items-center gap-4 text-sm">
            <span className="text-neutral-400">{username}</span>
            <button onClick={logout} className="text-neutral-400 hover:text-neutral-100">
              Log out
            </button>
          </div>
        ) : (
          <Link to="/login" className="text-sm text-neutral-400 hover:text-neutral-100">
            Log in
          </Link>
        )}
      </header>

      <main className="mx-auto max-w-6xl px-8 py-10">
        <Routes>
          <Route path="/" element={<BeerList />} />
          <Route path="/beers/:id" element={<BeerDetail />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;