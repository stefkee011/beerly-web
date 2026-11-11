import { Link, Route, Routes } from 'react-router-dom';
import BeerList from './pages/BeerList';
import BeerDetail from './pages/BeerDetail';

function App() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="border-b border-neutral-800 px-8 py-6">
        <Link to="/" className="text-2xl font-semibold tracking-tight">Beerly</Link>
      </header>

      <main className="mx-auto max-w-6xl px-8 py-10">
        <Routes>
          <Route path="/" element={<BeerList />} />
          <Route path="/beers/:id" element={<BeerDetail />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;