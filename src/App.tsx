import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './index.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-blue-500 to-indigo-600 text-white">
      <div className="flex items-center space-x-6 mb-6">
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img
            src={viteLogo}
            className="w-24 h-24 hover:scale-110 transition-transform duration-300"
            alt="Vite logo"
          />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img
            src={reactLogo}
            className="w-24 h-24 hover:scale-110 transition-transform duration-300"
            alt="React logo"
          />
        </a>
      </div>

      <h1 className="text-5xl font-bold mb-4">Vite + React</h1>

      <div className="bg-white/10 rounded-xl p-6 shadow-lg backdrop-blur-md flex flex-col items-center">
        <button
          onClick={() => setCount((count) => count + 1)}
          className="bg-white text-blue-600 font-semibold px-5 py-2 rounded-lg hover:bg-blue-100 transition"
        >
          count is {count}
        </button>
        <p className="mt-3 text-sm text-white/90 text-center">
          Edit <code className="bg-black/30 px-1 rounded">src/App.tsx</code> and save to test HMR
        </p>
      </div>

      <p className="mt-8 text-sm text-white/80">Click on the logos to learn more ⚡</p>
    </div>
  );
}

export default App;
