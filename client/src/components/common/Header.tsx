import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Instagram, Facebook, ShoppingCart } from 'lucide-react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Main navigation */}
        <div className="py-4 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img
              src="/assets/allyses-logo.jpg"
              alt="Allyse's Bridal and Formal"
              className="h-12 md:h-16 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition text-sm">
              Home
            </Link>
            <Link to="/schedule-appointment" className="text-gray-700 hover:text-blue-600 transition text-sm">
              Schedule Appointment
            </Link>
            <Link to="/shop" className="text-gray-700 hover:text-blue-600 transition text-sm">
              Shop
            </Link>
            <Link to="/size-chart" className="text-gray-700 hover:text-blue-600 transition text-sm">
              Size Chart
            </Link>

            {/* Social Icons */}
            <a
              href="https://www.instagram.com/allyses_bridal/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="https://www.facebook.com/AllysesBridalAndFormal/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5" />
            </a>

            {/* Cart Icon */}
            <button
              className="relative text-gray-700 hover:text-gray-900 transition"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-2 -right-2 bg-bridal-sage-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                0
              </span>
            </button>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/schedule-appointment"
                className="text-gray-700 hover:text-blue-600 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Schedule Appointment
              </Link>
              <Link
                to="/shop"
                className="text-gray-700 hover:text-blue-600 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                to="/size-chart"
                className="text-gray-700 hover:text-blue-600 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Size Chart
              </Link>

              {/* Mobile Social Icons */}
              <div className="flex gap-6 pt-4 border-t border-gray-200">
                <a
                  href="https://www.instagram.com/allyses_bridal/?hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900"
                  aria-label="Instagram"
                >
                  <Instagram className="h-6 w-6" />
                </a>
                <a
                  href="https://www.facebook.com/AllysesBridalAndFormal/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900"
                  aria-label="Facebook"
                >
                  <Facebook className="h-6 w-6" />
                </a>
                <button
                  className="relative text-gray-700"
                  aria-label="Shopping Cart"
                >
                  <ShoppingCart className="h-6 w-6" />
                  <span className="absolute -top-2 -right-2 bg-bridal-sage-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    0
                  </span>
                </button>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
