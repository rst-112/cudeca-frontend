import { Outlet } from 'react-router-dom';
import { Navbar } from '../ui/Navbar';
import { Footer } from '../layout/Footer';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300 font-['Arimo']">
      <Navbar />

      <main className="grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
