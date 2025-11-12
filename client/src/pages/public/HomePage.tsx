import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Send } from 'lucide-react';
import api from '../../services/api';
import type { GalleryImage, Dress, ApiResponse } from '@shared/types';

export default function HomePage() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [dresses, setDresses] = useState<Dress[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  useEffect(() => {
    loadData();
  }, []);

  // Auto-advance hero carousel every 4 seconds
  useEffect(() => {
    const heroImages = galleryImages.slice(6, 16); // Hero gallery images (indices 6-15)
    if (heroImages.length === 0) return;

    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [galleryImages]);

  const loadData = async () => {
    try {
      const [galleryRes, dressesRes, settingsRes] = await Promise.all([
        api.get<ApiResponse<GalleryImage[]>>('/gallery'),
        api.get<ApiResponse<Dress[]>>('/dresses'),
        api.get<ApiResponse<Record<string, string>>>('/settings')
      ]);

      if (galleryRes.data.success && galleryRes.data.data) {
        setGalleryImages(galleryRes.data.data);
      }
      if (dressesRes.data.success && dressesRes.data.data) {
        setDresses(dressesRes.data.data.slice(0, 12));
      }
      if (settingsRes.data.success && settingsRes.data.data) {
        setSettings(settingsRes.data.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');

    try {
      await api.post('/inquiries', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: `${formData.subject}\n\n${formData.message}\n\nAddress: ${formData.address}`,
        inquiry_type: 'general'
      });

      setFormStatus('success');
      setFormData({ name: '', email: '', phone: '', address: '', subject: '', message: '' });
      setTimeout(() => setFormStatus('idle'), 3000);
    } catch (error) {
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 3000);
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-white py-16 md:py-24 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-serif text-gray-900 mb-4">
            WELCOME TO<br />
            ALLYSE'S BRIDAL
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-6 max-w-2xl mx-auto">
            First in Fashion, Elegant by Design, Classy by Choice
          </p>
          <p className="text-base text-gray-600 mb-8 max-w-3xl mx-auto">
            Allyse's Bridal and Formal offers the most impressive collection of wedding dresses and formal wear. Visit our store today to find the wedding dress of your dreams.
          </p>
          {/* Hero Gallery Carousel */}
          <div className="max-w-4xl mx-auto aspect-video bg-gray-100 overflow-hidden relative">
            {galleryImages.slice(6, 16).length > 0 ? (
              <>
                <img
                  src={`/uploads/${galleryImages.slice(6, 16)[currentHeroImage]?.image_path}`}
                  alt="Bridal collection"
                  className="w-full h-full object-cover transition-opacity duration-500"
                />
                {/* Carousel dots */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {galleryImages.slice(6, 16).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentHeroImage(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentHeroImage ? 'bg-white w-6' : 'bg-white/50'
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-gray-400">Loading gallery...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="container mx-auto">
          <h2 className="section-title">OUR SERVICES</h2>
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Wedding Dress Consultation */}
            <div className="text-center">
              <div className="w-48 h-48 md:w-56 md:h-56 mx-auto rounded-full overflow-hidden mb-6 bg-gray-100">
                {galleryImages[0] ? (
                  <img
                    src={`/uploads/${galleryImages[0].image_path}`}
                    alt="Wedding Dress Consultation"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-gray-400">Image</p>
                  </div>
                )}
              </div>
              <h3 className="text-2xl font-serif text-gray-900 mb-2">WEDDING DRESS CONSULTATION</h3>
              <p className="text-gray-700 mb-4">Find The Perfect Dress</p>
              <Link
                to="/schedule-appointment"
                className="inline-block px-8 py-3 border border-black text-black bg-transparent hover:bg-gray-50 transition text-sm"
              >
                Schedule Now
              </Link>
            </div>

            {/* Alterations */}
            <div className="text-center">
              <div className="w-48 h-48 md:w-56 md:h-56 mx-auto rounded-full overflow-hidden mb-6 bg-gray-100">
                {galleryImages[1] ? (
                  <img
                    src={`/uploads/${galleryImages[1].image_path}`}
                    alt="Alterations"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-gray-400">Image</p>
                  </div>
                )}
              </div>
              <h3 className="text-2xl font-serif text-gray-900 mb-2">ALTERATIONS</h3>
              <p className="text-gray-700 mb-4">Customize Your Style</p>
              <Link
                to="/schedule-appointment"
                className="inline-block px-8 py-3 border border-black text-black bg-transparent hover:bg-gray-50 transition text-sm"
              >
                Schedule Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Our Products Section */}
      <section className="py-16 md:py-20 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="section-title">OUR PRODUCTS</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {dresses.map((dress) => (
              <Link
                key={dress.id}
                to={`/product/${dress.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="group"
              >
                <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden mb-3">
                  {dress.primary_image ? (
                    <img
                      src={`/uploads/${dress.primary_image.image_path}`}
                      alt={dress.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-gray-400">No Image</p>
                    </div>
                  )}
                  {dress.is_new_arrival && (
                    <div className="absolute top-2 left-2 bg-white/90 px-3 py-1 text-xs text-gray-700">
                      New Arrival
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity bg-white px-4 py-2 text-sm">
                      Quick View
                    </button>
                  </div>
                </div>
                <h3 className="text-base font-normal text-gray-900 mb-1">{dress.name}</h3>
                <p className="text-sm text-gray-600">
                  <span className="text-xs">Price</span> ${dress.price.toFixed(2)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center max-w-6xl mx-auto">
            {/* Image */}
            <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
              {galleryImages[2] ? (
                <img
                  src={`/uploads/${galleryImages[2].image_path}`}
                  alt="Our Story"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-gray-400">Image</p>
                </div>
              )}
            </div>

            {/* Text */}
            <div>
              <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6">OUR STORY</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Our Wedding Shop was established in 2000 with the purpose of selling the latest in modest formal wear. Owned and operated by Janelle Carlson, she and our design team offer unique innovative designs that are updated yearly. Allyse's Bridal and Formal has a large selection of designs and sizes at a fair price. Customers come to us for our unique designs, our large in-stock inventory, our in-house customizations and alterations, and our great customer service.
              </p>
              <Link
                to="/schedule-appointment"
                className="inline-block px-8 py-3 bg-bridal-sage-500 text-white hover:bg-bridal-sage-600 transition text-sm"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Feed Section */}
      <section className="py-16 md:py-20 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="section-title">Check out our Instagram!</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {galleryImages.slice(3, 6).map((image) => (
              <a
                key={image.id}
                href="https://www.instagram.com/allyses_bridal/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="block aspect-square bg-gray-100 overflow-hidden hover:opacity-90 transition"
              >
                <img
                  src={`/uploads/${image.image_path}`}
                  alt={image.caption || 'Instagram post'}
                  className="w-full h-full object-cover"
                />
              </a>
            ))}
          </div>
          <div className="text-center mt-8">
            <a
              href="https://www.instagram.com/allyses_bridal/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 transition"
            >
              <Instagram className="h-5 w-5" />
              <span>@allyses_bridal</span>
            </a>
          </div>
        </div>
      </section>

      {/* Store Hours Section */}
      <section className="py-16 md:py-20 px-4 bg-gray-50">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-8">STORE HOURS</h2>
          <div className="max-w-md mx-auto space-y-2">
            <p className="text-lg text-gray-800">Mon - Sat: 10am - 8pm</p>
            <p className="text-lg text-gray-800">Sun: Closed</p>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-16 md:py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-8 text-center">CONTACT US</h2>
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-4">
              <p className="text-gray-800">4801 N University Ave #120 Provo, UT 84604</p>
              <p className="text-gray-800">
                <a href="mailto:Allysesbridalandformal@gmail.com" className="hover:text-blue-600 transition">
                  Allysesbridalandformal@gmail.com
                </a>
              </p>
              <p className="text-gray-800">
                <a href="tel:8012240059" className="hover:text-blue-600 transition">
                  (801) 224-0059
                </a>
              </p>

              {/* Social Icons */}
              <div className="flex gap-4 pt-4">
                <a
                  href="https://www.instagram.com/allyses_bridal/?hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition"
                  aria-label="Instagram"
                >
                  <Instagram className="h-6 w-6" />
                </a>
                <a
                  href="https://www.facebook.com/AllysesBridalAndFormal/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition"
                  aria-label="Facebook"
                >
                  <Facebook className="h-6 w-6" />
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="input-field"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="input-field"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input-field"
              />
              <input
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="input-field"
              />
              <input
                type="text"
                placeholder="Subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
                className="input-field"
              />
              <textarea
                placeholder="Type your message here..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={5}
                className="input-field resize-none"
              />
              <button
                type="submit"
                disabled={formStatus === 'sending'}
                className="w-full px-6 py-3 bg-black text-white hover:bg-gray-800 transition text-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {formStatus === 'sending' ? 'Sending...' : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit
                  </>
                )}
              </button>
              {formStatus === 'success' && (
                <p className="text-green-600 text-sm text-center">Message sent successfully!</p>
              )}
              {formStatus === 'error' && (
                <p className="text-red-600 text-sm text-center">Failed to send message. Please try again.</p>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
