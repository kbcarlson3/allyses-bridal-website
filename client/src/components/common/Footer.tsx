import { Link } from 'react-router-dom';
import { Instagram, Facebook, Phone, MapPin, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-editorial-black text-white mt-32 md:mt-42 lg:mt-50 relative overflow-hidden">
      {/* Decorative gold accent bar */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent" />

      <div className="container mx-auto px-6 lg:px-12 max-w-7xl py-20 md:py-24 lg:py-30 relative">
        {/* Main Footer Content - Asymmetric Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 mb-16 lg:mb-20">
          {/* Brand Column - Takes more space */}
          <div className="md:col-span-5 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Link
                to="/"
                className="inline-block group"
              >
                <h2 className="font-editorial text-4xl md:text-5xl text-white hover:text-gold-400 transition-colors duration-500">
                  Allyse's
                </h2>
                <div className="h-px bg-gold-500 mt-2 group-hover:w-full w-1/2 transition-all duration-500" />
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-editorial-stone text-base leading-relaxed font-sans max-w-md"
            >
              Utah's premier destination for modest wedding dresses and formal wear since 2000.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-gold-500 font-editorial text-lg italic"
            >
              First in Fashion, Elegant by Design, Classy by Choice
            </motion.p>

            {/* Social Icons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex gap-4 pt-2"
            >
              <motion.a
                href="https://www.instagram.com/allyses_bridal/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-editorial-stone hover:border-gold-500 flex items-center justify-center text-editorial-stone hover:text-gold-500 transition-all duration-300"
                aria-label="Instagram"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Instagram className="h-5 w-5" />
              </motion.a>
              <motion.a
                href="https://www.facebook.com/AllysesBridalAndFormal/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-editorial-stone hover:border-gold-500 flex items-center justify-center text-editorial-stone hover:text-gold-500 transition-all duration-300"
                aria-label="Facebook"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Facebook className="h-5 w-5" />
              </motion.a>
            </motion.div>
          </div>

          {/* Quick Links Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-3 space-y-6"
          >
            <h3 className="text-2xs font-sans font-semibold tracking-editorial uppercase text-gold-500">
              Navigate
            </h3>
            <nav className="flex flex-col gap-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/shop', label: 'Collection' },
                { to: '/schedule-appointment', label: 'Book Appointment' },
                { to: '/alterations', label: 'Alterations' },
                { to: '/size-chart', label: 'Size Chart' },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-editorial-pearl hover:text-white transition-colors duration-300 text-sm font-sans link-underline inline-block"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>

          {/* Contact Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="md:col-span-4 space-y-6"
          >
            <h3 className="text-2xs font-sans font-semibold tracking-editorial uppercase text-gold-500">
              Visit Us
            </h3>
            <div className="space-y-4">
              <a
                href="tel:8012240059"
                className="flex items-start gap-3 text-editorial-pearl hover:text-white transition-colors duration-300 group"
              >
                <Phone className="h-5 w-5 flex-shrink-0 mt-0.5 text-gold-500" />
                <div>
                  <div className="text-xs text-editorial-stone uppercase tracking-wide mb-1">Phone</div>
                  <span className="text-sm font-sans">(801) 224-0059</span>
                </div>
              </a>

              <a
                href="mailto:Allysesbridalandformal@gmail.com"
                className="flex items-start gap-3 text-editorial-pearl hover:text-white transition-colors duration-300 group"
              >
                <Mail className="h-5 w-5 flex-shrink-0 mt-0.5 text-gold-500" />
                <div>
                  <div className="text-xs text-editorial-stone uppercase tracking-wide mb-1">Email</div>
                  <span className="text-sm font-sans break-all">Allysesbridalandformal@gmail.com</span>
                </div>
              </a>

              <a
                href="https://maps.google.com/?q=4801+N+University+Ave+120+Provo+UT+84604"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-editorial-pearl hover:text-white transition-colors duration-300 group"
              >
                <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5 text-gold-500" />
                <div>
                  <div className="text-xs text-editorial-stone uppercase tracking-wide mb-1">Address</div>
                  <span className="text-sm font-sans">
                    4801 N University Ave #120<br />
                    Provo, UT 84604
                  </span>
                </div>
              </a>
            </div>

            <div className="pt-4 border-t border-editorial-graphite">
              <div className="text-xs text-editorial-stone uppercase tracking-wide mb-2">Hours</div>
              <p className="text-sm font-sans text-editorial-pearl">
                Monday - Saturday: 10am - 8pm<br />
                Sunday: Closed
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar with Gold Accent */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="pt-8 border-t border-editorial-graphite"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p className="text-xs text-editorial-stone font-sans">
              © {currentYear} Allyse's Bridal and Formal. All rights reserved.
            </p>
            <p className="text-xs text-editorial-stone font-sans">
              Crafted with excellence since 2000
            </p>
          </div>
        </motion.div>
      </div>

      {/* Decorative bottom gold accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
    </footer>
  );
}
