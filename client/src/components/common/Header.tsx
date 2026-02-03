import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Instagram, Facebook, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { getTotalItems, openCart } = useCart();
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Collection' },
    { to: '/schedule-appointment', label: 'Book' },
    { to: '/alterations', label: 'Alterations' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-luxury shadow-luxury border-b border-editorial-pearl'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        {/* Main navigation */}
        <div className={`flex justify-between items-center transition-all duration-500 ${scrolled ? 'py-4' : 'py-6'}`}>
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 group relative z-10">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <img
                src="/assets/allyses-logo.jpg"
                alt="Allyse's Bridal and Formal"
                className={`w-auto transition-all duration-500 ${scrolled ? 'h-12' : 'h-14 md:h-16'}`}
              />
            </motion.div>
            {/* Gold underline accent on hover */}
            <motion.div
              className="absolute -bottom-1 left-0 h-px bg-gold-500"
              initial={{ width: 0 }}
              whileHover={{ width: '100%' }}
              transition={{ duration: 0.4 }}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2 xl:gap-4">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className="relative group px-4 py-2"
                >
                  <span className={`text-xs font-sans font-medium tracking-editorial uppercase transition-colors duration-300 ${
                    isActive ? 'text-editorial-black' : 'text-editorial-stone hover:text-editorial-black'
                  }`}>
                    {link.label}
                  </span>
                  {/* Gold underline on active/hover */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-px bg-gold-500"
                    initial={{ scaleX: isActive ? 1 : 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              );
            })}

            {/* Divider */}
            <div className="h-6 w-px bg-gold-500/30 mx-2" />

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <motion.a
                href="https://www.instagram.com/allyses_bridal/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="text-editorial-stone hover:text-gold-600 transition-colors duration-300"
                aria-label="Instagram"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Instagram className="h-4 w-4" />
              </motion.a>
              <motion.a
                href="https://www.facebook.com/AllysesBridalAndFormal/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-editorial-stone hover:text-gold-600 transition-colors duration-300"
                aria-label="Facebook"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Facebook className="h-4 w-4" />
              </motion.a>

              {/* Cart Icon */}
              <motion.button
                onClick={openCart}
                className="relative text-editorial-black hover:text-gold-600 transition-colors duration-300 ml-1"
                aria-label="Shopping Cart"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingCart className="h-5 w-5" />
                <AnimatePresence>
                  {getTotalItems() > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-2 -right-2 bg-gold-500 text-editorial-black text-2xs font-sans font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-gold"
                    >
                      {getTotalItems()}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </nav>

          {/* Mobile: Cart + Menu */}
          <div className="lg:hidden flex items-center gap-4">
            <motion.button
              onClick={openCart}
              className="relative text-editorial-black hover:text-gold-600 transition-colors"
              aria-label="Shopping Cart"
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingCart className="h-5 w-5" />
              <AnimatePresence>
                {getTotalItems() > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-2 -right-2 bg-gold-500 text-editorial-black text-2xs font-sans font-bold rounded-full h-4 w-4 flex items-center justify-center"
                  >
                    {getTotalItems()}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-editorial-black hover:text-gold-600 transition-colors"
              aria-label="Toggle menu"
              whileTap={{ scale: 0.95 }}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-gold-500/20 overflow-hidden"
            >
              <div className="flex flex-col gap-1 py-6">
                {navLinks.map((link, index) => {
                  const isActive = location.pathname === link.to;
                  return (
                    <motion.div
                      key={link.to}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={link.to}
                        className={`block px-4 py-3 font-sans font-medium tracking-editorial uppercase text-sm transition-colors ${
                          isActive
                            ? 'text-editorial-black bg-gold-50'
                            : 'text-editorial-stone hover:text-editorial-black hover:bg-editorial-pearl'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.label}
                        {isActive && <div className="h-px bg-gold-500 mt-2" />}
                      </Link>
                    </motion.div>
                  );
                })}

                {/* Mobile Social Icons */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex gap-6 px-4 pt-6 mt-4 border-t border-gold-500/20"
                >
                  <a
                    href="https://www.instagram.com/allyses_bridal/?hl=en"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-editorial-stone hover:text-gold-600 transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-6 w-6" />
                  </a>
                  <a
                    href="https://www.facebook.com/AllysesBridalAndFormal/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-editorial-stone hover:text-gold-600 transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-6 w-6" />
                  </a>
                </motion.div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
