import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, ArrowRight, Calendar, Scissors, Sparkles } from 'lucide-react';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';
import type { GalleryImage, Dress, ApiResponse } from '@shared/types';

export default function HomePage() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [dresses, setDresses] = useState<Dress[]>([]);
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    loadData();
  }, []);

  // Auto-advance hero carousel every 5 seconds
  useEffect(() => {
    const heroImages = galleryImages.slice(6, 16);
    if (heroImages.length === 0) return;

    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [galleryImages]);

  const loadData = async () => {
    try {
      const [galleryRes, dressesRes] = await Promise.all([
        api.get<ApiResponse<GalleryImage[]>>('/gallery'),
        api.get<ApiResponse<Dress[]>>('/dresses'),
      ]);

      if (galleryRes.data.success && galleryRes.data.data) {
        setGalleryImages(galleryRes.data.data);
      }
      if (dressesRes.data.success && dressesRes.data.data) {
        setDresses(dressesRes.data.data.slice(0, 8));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const heroImages = galleryImages.slice(6, 16);

  return (
    <div className="bg-bridal-ivory">
      {/* Hero Section - Full Screen Editorial */}
      <section className="relative h-[85vh] min-h-[600px] bg-bridal-charcoal-500 overflow-hidden">
        {/* Background Image Carousel */}
        <div className="absolute inset-0">
          {heroImages.length > 0 ? (
            <>
              {heroImages.map((image, index) => (
                <div
                  key={image.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentHeroImage ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <img
                    src={`/uploads/${image.image_path}`}
                    alt="Bridal collection"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-bridal-charcoal-900/40 via-bridal-charcoal-900/30 to-bridal-charcoal-900/60" />
                </div>
              ))}
            </>
          ) : (
            <div className="w-full h-full bg-bridal-charcoal-700" />
          )}
        </div>

        {/* Hero Content */}
        <div className="relative h-full container mx-auto px-4 lg:px-8 flex items-center">
          <div className="max-w-3xl animate-fade-in">
            <p className="section-subtitle text-bridal-clay-300 mb-6 animate-slide-up">
              First in Fashion, Elegant by Design
            </p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-light text-white mb-8 leading-none animate-slide-up delay-100">
              Discover Your<br />
              Perfect Dress
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-xl font-sans animate-slide-up delay-200">
              Utah's premier destination for modest wedding dresses and formal wear.
              Experience timeless elegance since 2000.
            </p>
            <div className="flex flex-wrap gap-4 animate-slide-up delay-300">
              <Link to="/shop" className="btn-primary group">
                <span className="flex items-center gap-2">
                  Browse Collection
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link to="/schedule-appointment" className="btn-secondary bg-transparent border-white text-white hover:bg-white hover:text-bridal-charcoal-500">
                Book Appointment
              </Link>
            </div>
          </div>
        </div>

        {/* Carousel Indicators */}
        {heroImages.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentHeroImage(index)}
                className={`h-1 rounded-full transition-all ${
                  index === currentHeroImage
                    ? 'bg-white w-12'
                    : 'bg-white/40 w-8 hover:bg-white/60'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Services Section - Asymmetric Layout */}
      <section className="py-24 md:py-32 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <p className="section-subtitle text-bridal-clay-600 mb-4">What We Offer</p>
            <h2 className="section-title">Our Services</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Consultations Card */}
            <div className="group card-elevated bg-white p-8 lg:p-12 hover:bg-bridal-cream transition-colors duration-300">
              <div className="flex items-start gap-6 mb-6">
                <div className="p-4 bg-bridal-clay-100 text-bridal-clay-600">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-display text-bridal-charcoal-500 mb-2">
                    Bridal Consultations
                  </h3>
                  <p className="text-bridal-charcoal-400 font-sans text-sm mb-4">
                    Personalized one-on-one sessions
                  </p>
                </div>
              </div>
              {galleryImages[0] && (
                <div className="aspect-[4/3] overflow-hidden mb-6">
                  <img
                    src={`/uploads/${galleryImages[0].image_path}`}
                    alt="Wedding Dress Consultation"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              )}
              <p className="text-bridal-charcoal-400 font-sans text-sm leading-relaxed mb-6">
                Experience our extensive collection of modest wedding gowns with expert guidance.
                Find the perfect dress that reflects your unique style and vision.
              </p>
              <Link
                to="/schedule-appointment"
                className="inline-flex items-center gap-2 text-bridal-clay-600 font-sans font-medium text-sm link-underline"
              >
                Schedule Consultation
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Alterations Card */}
            <div className="group card-elevated bg-white p-8 lg:p-12 hover:bg-bridal-cream transition-colors duration-300">
              <div className="flex items-start gap-6 mb-6">
                <div className="p-4 bg-bridal-clay-100 text-bridal-clay-600">
                  <Scissors className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-display text-bridal-charcoal-500 mb-2">
                    Expert Alterations
                  </h3>
                  <p className="text-bridal-charcoal-400 font-sans text-sm mb-4">
                    In-house customization & tailoring
                  </p>
                </div>
              </div>
              {galleryImages[1] && (
                <div className="aspect-[4/3] overflow-hidden mb-6">
                  <img
                    src={`/uploads/${galleryImages[1].image_path}`}
                    alt="Alterations"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              )}
              <p className="text-bridal-charcoal-400 font-sans text-sm leading-relaxed mb-6">
                Our skilled team provides meticulous alterations and custom modifications
                to ensure your dress fits perfectly.
              </p>
              <Link
                to="/service-page/dress-alterations"
                className="inline-flex items-center gap-2 text-bridal-clay-600 font-sans font-medium text-sm link-underline"
              >
                Learn More
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Dresses - Editorial Grid */}
      <section className="py-24 md:py-32 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="section-subtitle text-bridal-clay-600 mb-4">Latest Collection</p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-light text-bridal-charcoal-500">
                Featured Dresses
              </h2>
            </div>
            <Link
              to="/shop"
              className="hidden md:inline-flex items-center gap-2 text-bridal-charcoal-500 font-sans font-medium text-sm hover:text-bridal-clay-600 transition-colors link-underline"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {dresses.map((dress, index) => (
              <Link
                key={dress.id}
                to={`/product/${dress.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                className="product-card group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative aspect-[3/4] bg-bridal-cream overflow-hidden">
                  {dress.primary_image ? (
                    <img
                      src={`/uploads/${dress.primary_image.image_path}`}
                      alt={dress.name}
                      className="product-card-image"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-bridal-charcoal-300">
                      <p>No Image</p>
                    </div>
                  )}
                  <div className="product-card-overlay" />

                  {dress.is_new_arrival && (
                    <div className="absolute top-4 left-4 bg-bridal-clay-500 text-white px-3 py-1 text-xs font-sans font-medium tracking-widest uppercase">
                      New
                    </div>
                  )}

                  {/* Quick Add Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart(dress);
                    }}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 btn-primary text-xs py-2 px-6"
                  >
                    <span>Add to Cart</span>
                  </button>
                </div>

                <div className="pt-4">
                  <h3 className="font-display text-lg text-bridal-charcoal-500 mb-1 group-hover:text-bridal-clay-600 transition-colors">
                    {dress.name}
                  </h3>
                  <p className="text-bridal-clay-600 font-sans font-medium text-sm">
                    {dress.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12 md:hidden">
            <Link to="/shop" className="btn-secondary">
              View All Dresses
            </Link>
          </div>
        </div>
      </section>

      {/* Our Story - Asymmetric Split */}
      <section className="py-24 md:py-32 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image */}
            <div className="order-2 lg:order-1 relative">
              {galleryImages[2] ? (
                <div className="relative">
                  <div className="aspect-[4/5] overflow-hidden">
                    <img
                      src={`/uploads/${galleryImages[2].image_path}`}
                      alt="Our Story"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Decorative Element */}
                  <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-bridal-clay-200 -z-10 hidden md:block" />
                </div>
              ) : (
                <div className="aspect-[4/5] bg-bridal-cream" />
              )}
            </div>

            {/* Text */}
            <div className="order-1 lg:order-2">
              <p className="section-subtitle text-bridal-clay-600 mb-4">Since 2000</p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-light text-bridal-charcoal-500 mb-6 leading-tight">
                Our Story
              </h2>
              <div className="space-y-4 text-bridal-charcoal-400 font-sans leading-relaxed mb-8">
                <p>
                  Established in 2000, Allyse's Bridal and Formal was founded with a vision to provide
                  the latest in modest formal wear. Owned and operated by Janelle Carlson, our boutique
                  has become Utah's premier destination for brides seeking elegance and sophistication.
                </p>
                <p>
                  Our design team offers unique, innovative designs that are updated yearly, ensuring you
                  have access to the latest trends while maintaining timeless elegance. We pride ourselves
                  on our extensive in-stock inventory, in-house customizations, and exceptional customer service.
                </p>
              </div>
              <Link to="/schedule-appointment" className="btn-outline-clay">
                Schedule Your Visit
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Feed */}
      <section className="py-24 md:py-32 px-4 bg-bridal-charcoal-500 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-sm md:text-base font-sans font-light text-bridal-clay-300 tracking-widest uppercase mb-4">
              Follow Our Journey
            </p>
            <h2 className="text-4xl md:text-5xl font-display font-light mb-6">
              @allyses_bridal
            </h2>
            <a
              href="https://www.instagram.com/allyses_bridal/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-bridal-clay-300 hover:text-white transition-colors"
            >
              <Instagram className="h-5 w-5" />
              <span className="font-sans text-sm">Follow us on Instagram</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {galleryImages.slice(3, 6).map((image) => (
              <a
                key={image.id}
                href="https://www.instagram.com/allyses_bridal/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="block aspect-square overflow-hidden group"
              >
                <img
                  src={`/uploads/${image.image_path}`}
                  alt={image.caption || 'Instagram post'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Store Info - Contact CTA */}
      <section className="py-24 md:py-32 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="section-subtitle text-bridal-clay-600 mb-4">Visit Us</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-light text-bridal-charcoal-500 mb-8">
            We'd Love to Meet You
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-12 text-left">
            <div className="space-y-3">
              <h3 className="text-sm font-sans font-medium tracking-widest uppercase text-bridal-charcoal-500 mb-3">
                Location
              </h3>
              <p className="text-bridal-charcoal-400 font-sans">
                4801 N University Ave #120<br />
                Provo, UT 84604
              </p>
              <a
                href="tel:8012240059"
                className="block text-bridal-clay-600 hover:text-bridal-clay-700 font-sans font-medium transition-colors"
              >
                (801) 224-0059
              </a>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-sans font-medium tracking-widest uppercase text-bridal-charcoal-500 mb-3">
                Hours
              </h3>
              <p className="text-bridal-charcoal-400 font-sans">
                Monday - Saturday<br />
                10:00 AM - 8:00 PM
              </p>
              <p className="text-bridal-charcoal-400 font-sans">
                Sunday: Closed
              </p>
            </div>
          </div>

          <Link to="/schedule-appointment" className="btn-primary inline-flex">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Schedule an Appointment
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
