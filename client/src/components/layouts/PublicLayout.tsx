import { Outlet } from 'react-router-dom';
import { Header } from '../common/Header';
import { Footer } from '../common/Footer';
import CartSidebar from '../CartSidebar';

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-bridal-ivory">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <CartSidebar />
    </div>
  );
}
