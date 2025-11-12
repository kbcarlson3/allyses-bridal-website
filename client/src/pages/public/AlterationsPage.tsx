import { Link } from 'react-router-dom';
import { Scissors, Phone, Mail, Clock, AlertCircle, CheckCircle, Star } from 'lucide-react';

export default function AlterationsPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-bridal-cream py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-block p-4 bg-bridal-gold-100 rounded-full mb-6">
            <Scissors className="h-12 w-12 text-bridal-gold-500" />
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-6">
            Expert Dress Alterations
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Our professional seamstresses provide in-house alterations to ensure your dress fits perfectly for your special day.
          </p>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-12 px-4 bg-bridal-pink-50 border-y border-bridal-pink-200">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-6 w-6 text-bridal-pink-500 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-serif font-bold text-gray-900 mb-2">
                Currently Scheduling Dresses from Allyse's Only
              </h2>
              <p className="text-gray-700 leading-relaxed">
                At this time, we are only accepting alterations for dresses purchased from Allyse's Bridal and Formal.
                This allows us to provide the best possible service and maintain our commitment to quality craftsmanship.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Expertise Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="section-title">Why Choose Our Alterations Service?</h2>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="card text-center">
              <div className="inline-block p-4 bg-bridal-gold-100 rounded-full mb-4">
                <Star className="h-8 w-8 text-bridal-gold-500" />
              </div>
              <h3 className="text-xl font-serif font-bold mb-3">Expert Seamstresses</h3>
              <p className="text-gray-600">
                Our skilled team has years of experience working with bridal and formal wear, ensuring precision and care with every stitch.
              </p>
            </div>

            <div className="card text-center">
              <div className="inline-block p-4 bg-bridal-gold-100 rounded-full mb-4">
                <CheckCircle className="h-8 w-8 text-bridal-gold-500" />
              </div>
              <h3 className="text-xl font-serif font-bold mb-3">Perfect Fit Guaranteed</h3>
              <p className="text-gray-600">
                We work meticulously to ensure your dress fits flawlessly, enhancing your natural beauty and comfort.
              </p>
            </div>

            <div className="card text-center">
              <div className="inline-block p-4 bg-bridal-gold-100 rounded-full mb-4">
                <Clock className="h-8 w-8 text-bridal-gold-500" />
              </div>
              <h3 className="text-xl font-serif font-bold mb-3">Timely Service</h3>
              <p className="text-gray-600">
                We understand the importance of deadlines and work diligently to complete your alterations on schedule.
              </p>
            </div>
          </div>

          {/* Services Offered */}
          <div className="bg-gray-50 rounded-lg p-8 md:p-12">
            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-6 text-center">
              Alteration Services We Provide
            </h3>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-bridal-gold-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Hemming</h4>
                  <p className="text-sm text-gray-600">Adjusting the length to your perfect height</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-bridal-gold-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Taking In/Letting Out</h4>
                  <p className="text-sm text-gray-600">Adjusting the bodice and waistline for a perfect fit</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-bridal-gold-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Bustle Addition</h4>
                  <p className="text-sm text-gray-600">Creating elegant bustles for train management</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-bridal-gold-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Strap Adjustments</h4>
                  <p className="text-sm text-gray-600">Modifying or adding straps for comfort and style</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-bridal-gold-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Neckline Modifications</h4>
                  <p className="text-sm text-gray-600">Adjusting necklines for modesty or style preferences</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-bridal-gold-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Custom Adjustments</h4>
                  <p className="text-sm text-gray-600">Additional modifications tailored to your needs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cancellation Policy */}
      <section className="py-20 px-4 bg-bridal-cream">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6 text-center">
              Cancellation Policy
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                We understand that circumstances can change, but our alteration appointments are carefully scheduled to ensure quality time with each client.
                To maintain the highest level of service for all our customers, we have implemented the following cancellation policy:
              </p>

              <div className="bg-gray-50 rounded-lg p-6 my-6">
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Important Guidelines:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="text-bridal-gold-500 font-bold">•</span>
                    <span><strong>48-Hour Notice Required:</strong> Appointments must be cancelled or rescheduled at least 48 hours in advance.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-bridal-gold-500 font-bold">•</span>
                    <span><strong>Late Cancellations:</strong> Cancellations made with less than 48 hours notice may be subject to a cancellation fee.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-bridal-gold-500 font-bold">•</span>
                    <span><strong>No-Show Policy:</strong> No-shows will be charged a fee and may affect future booking privileges.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-bridal-gold-500 font-bold">•</span>
                    <span><strong>Rescheduling:</strong> We're happy to reschedule your appointment with proper notice. Please call us as soon as possible.</span>
                  </li>
                </ul>
              </div>

              <p>
                We appreciate your understanding and cooperation. These policies allow us to serve you and all our clients better,
                ensuring that each bride receives the attention and care she deserves.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Process */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="section-title">The Alterations Process</h2>

          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-bridal-gold-500 text-white rounded-full flex items-center justify-center font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Initial Fitting</h3>
                <p className="text-gray-700">
                  During your first appointment, we'll assess your dress and discuss all necessary alterations.
                  Our seamstress will take precise measurements and provide an estimate for the work.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-bridal-gold-500 text-white rounded-full flex items-center justify-center font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Alteration Work</h3>
                <p className="text-gray-700">
                  Our expert seamstresses will carefully work on your dress, making each adjustment with precision and care.
                  We use professional techniques to ensure the integrity of your gown.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-bridal-gold-500 text-white rounded-full flex items-center justify-center font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Final Fitting</h3>
                <p className="text-gray-700">
                  We'll schedule a final fitting to ensure everything is perfect. Any minor adjustments needed will be noted
                  and completed promptly to guarantee your complete satisfaction.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-bridal-gold-500 text-white rounded-full flex items-center justify-center font-bold text-xl">
                4
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Pick Up & Enjoy</h3>
                <p className="text-gray-700">
                  Once everything is perfect, you'll pick up your beautifully altered dress, ready to wear on your special day
                  with confidence and comfort.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gray-900 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
            Ready to Schedule Your Alteration?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Contact us today to book your alteration appointment. Our team is ready to ensure your dress fits perfectly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/schedule-appointment"
              className="px-8 py-4 bg-bridal-gold-500 text-white font-medium rounded-md hover:bg-bridal-gold-600 transition-colors duration-200"
            >
              Schedule Appointment
            </Link>
            <a
              href="tel:8012240059"
              className="px-8 py-4 bg-white text-gray-900 font-medium rounded-md hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <Phone className="h-5 w-5" />
              (801) 224-0059
            </a>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-700">
            <div className="flex flex-col md:flex-row justify-center items-center gap-6 text-gray-300">
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                <span>(801) 224-0059</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                <a href="mailto:info@allyses.com" className="hover:text-white">
                  info@allyses.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back Link */}
      <section className="py-8 px-4 bg-white">
        <div className="container mx-auto text-center">
          <Link to="/" className="text-bridal-gold-500 hover:text-bridal-gold-600 font-medium">
            ← Back to Home
          </Link>
        </div>
      </section>
    </div>
  );
}
