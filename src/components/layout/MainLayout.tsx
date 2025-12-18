import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Navbar Extractada */}
      <Header />

      {/* Contenido Principal */}
      <main className="grow">
        <Outlet />
      </main>

      {/* Footer Reutilizable */}
      <Footer />
    </div>
  );
};

export default MainLayout;
