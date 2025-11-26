import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';

// Importamos las páginas que creamos en el paso anterior
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Registro from './pages/public/Registro';
import DetalleEvento from './pages/public/DetallesEvento';
import Checkout from './pages/public/Checkout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* El MainLayout envuelve a todas las rutas públicas */}
        <Route path="/" element={<MainLayout />}>
          
          {/* Ruta principal (Home) */}
          <Route index element={<Home />} />
          
          {/* Rutas de autenticación */}
          <Route path="login" element={<Login />} />
          <Route path="registro" element={<Registro />} />
          
          {/* Ruta dinámica: El ":id" permitirá cargar eventos distintos (ej: /evento/1, /evento/99) */}
          <Route path="evento/:id" element={<DetalleEvento />} />
          
          {/* Ruta de pago */}
          <Route path="checkout" element={<Checkout />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;