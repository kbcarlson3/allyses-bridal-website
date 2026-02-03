import { Link } from 'react-router-dom';
import { Scissors, Phone, Mail, Clock, AlertCircle, CheckCircle, Star, Calendar } from 'lucide-react';

export default function AlterationsPage() {
  return (
    <div className="bg-bridal-ivory">
      {/* Hero Section */}
      <section className="bg-white border-b border-bridal-taupe py-16 md:py-24 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-bridal-clay-100 text-bridal-clay-600 mb-6">
            <Scissors className="h-10 w-10" />
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-light text-bridal-charcoal-500 mb-6">
            Expert Dress Alterations
          </h1>
          <p className="text-lg md:text-xl text-bridal-charcoal-400 font-sans mb-8 max-w-3xl mx-auto leading-relaxed">
            Our professional seamstresses provide in-house alterations to ensure your dress fits perfectly for your special day.
          </p>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-12 px-4 bg-bridal-clay-50 border-y border-bridal-clay-200">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-bridal-clay-500 text-white rounded-full flex items-center justify-center">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-display text-bridal-charcoal-500 mb-2">
                Currently Scheduling Dresses from Allyse's Only
              </h2>
              <p className="text-bridal-charcoal-400 font-sans leading-relaxed">
                At this time, we are only accepting alterations for dresses purchased from Allyse's Bridal and Formal.
                This allows us to provide the best possible service and maintain our commitment to quality craftsmanship.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Expertise Section */}
      <section className="py-20 md:py-28 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <p className="section-subtitle text-bridal-clay-600 mb-4">Our Commitment</p>
            <h2 className="section-title">Why Choose Our Alterations Service?</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="bg-white p-8 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-bridal-clay-100 text-bridal-clay-600 mb-6">
                <Star className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-display text-bridal-charcoal-500 mb-3">Expert Seamstresses</h3>
              <p className="text-bridal-charcoal-400 font-sans text-sm leading-relaxed">
                Our skilled team has years of experience working with bridal and formal wear, ensuring precision and care with every stitch.
              </p>
            </div>

            <div className="bg-white p-8 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-bridal-clay-100 text-bridal-clay-600 mb-6">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-display text-bridal-charcoal-500 mb-3">Perfect Fit Guaranteed</h3>
              <p className="text-bridal-charcoal-400 font-sans text-sm leading-relaxed">
                We work meticulously to ensure your dress fits flawlessly, enhancing your natural beauty and comfort.
              </p>
            </div>

            <div className="bg-white p-8 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-bridal-clay-100 text-bridal-clay-600 mb-6">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-display text-bridal-charcoal-500 mb-3">Timely Service</h3>
              <p className="text-bridal-charcoal-400 font-sans text-sm leading-relaxed">
                We understand the importance of deadlines and work diligently to complete your alterations on schedule.
              </p>
            </div>
          </div>

          {/* Services Offered */}
          <div className="bg-white p-10 md:p-12 shadow-sm">
            <h3 className="text-3xl md:text-4xl font-display font-light text-bridal-charcoal-500 mb-10 text-center">
              Alteration Services We Provide
            </h3>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[
                { title: 'Hemming', desc: 'Adjusting the length to your perfect height' },
                { title: 'Taking In/Letting Out', desc: 'Adjusting the bodice and waistline for a perfect fit' },
                { title: 'Bustle Addition', desc: 'Creating elegant bustles for train management' },
                { title: 'Strap Adjustments', desc: 'Modifying or adding straps for comfort and style' },
                { title: 'Neckline Modifications', desc: 'Adjusting necklines for modesty or style preferences' },
                { title: 'Custom Adjustments', desc: 'Additional modifications tailored to your needs' },
              ].map((service, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <CheckCircle className="h-5 w-5 text-bridal-clay-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-sans font-semibold text-bridal-charcoal-500 mb-1">{service.title}</h4>
                    <p className="text-sm text-bridal-charcoal-400 font-sans">{service.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Cancellation Policy */}
      <section className="py-20 md:py-28 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-bridal-cream p-10 md:p-12">
            <h2 className="text-3xl md:text-4xl font-display font-light text-bridal-charcoal-500 mb-8 text-center">
              Cancellation Policy
            </h2>
            <div className="space-y-6 text-bridal-charcoal-400 font-sans leading-relaxed">
              <p>
                We understand that circumstances can change, but our alteration appointments are carefully scheduled to ensure quality time with each client.
                To maintain the highest level of service for all our customers, we have implemented the following cancellation policy:
              </p>

              <div className="bg-white border-2 border-bridal-clay-200 p-8 my-8">
                <h3 className="font-sans font-semibold text-bridal-charcoal-500 mb-6 text-lg">Important Guidelines:</h3>
                <ul className="space-y-4">
                  {[
                    { label: '48-Hour Notice Required', text: 'Appointments must be cancelled or rescheduled at least 48 hours in advance.' },
                    { label: 'Late Cancellations', text: 'Cancellations made with less than 48 hours notice may be subject to a cancellation fee.' },
                    { label: 'No-Show Policy', text: 'No-shows will be charged a fee and may affect future booking privileges.' },
                    { label: 'Rescheduling', text: "We're happy to reschedule your appointment with proper notice. Please call us as soon as possible." },
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 bg-bridal-clay-500 rounded-full mt-2.5 flex-shrink-0" />
                      <span><strong className="text-bridal-charcoal-500">{item.label}:</strong> {item.text}</span>
                    </li>
                  ))}
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
      <section className="py-20 md:py-28 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <p className="section-subtitle text-bridal-clay-600 mb-4">How It Works</p>
            <h2 className="section-title">The Alterations Process</h2>
          </div>

          <div className="space-y-12">
            {[
              {
                num: '1',
                title: 'Initial Fitting',
                desc: "During your first appointment, we'll assess your dress and discuss all necessary alterations. Our seamstress will take precise measurements and provide an estimate for the work.",
              },
              {
                num: '2',
                title: 'Alteration Work',
                desc: 'Our expert seamstresses will carefully work on your dress, making each adjustment with precision and care. We use professional techniques to ensure the integrity of your gown.',
              },
              {
                num: '3',
                title: 'Final Fitting',
                desc: "We'll schedule a final fitting to ensure everything is perfect. Any minor adjustments needed will be noted and completed promptly to guarantee your complete satisfaction.",
              },
              {
                num: '4',
                title: 'Pick Up & Enjoy',
                desc: "Once everything is perfect, you'll pick up your beautifully altered dress, ready to wear on your special day with confidence and comfort.",
              },
            ].map((step, idx) => (
              <div key={idx} className="flex gap-6">
                <div className="flex-shrink-0 w-14 h-14 bg-bridal-clay-500 text-white flex items-center justify-center font-display text-2xl">
                  {step.num}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-display text-bridal-charcoal-500 mb-3">{step.title}</h3>
                  <p className="text-bridal-charcoal-400 font-sans leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-bridal-charcoal-500 text-white">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-display font-light mb-6">
            Ready to Schedule Your Alteration?
          </h2>
          <p className="text-lg text-white/80 font-sans mb-10 max-w-2xl mx-auto">
            Contact us today to book your alteration appointment. Our team is ready to ensure your dress fits perfectly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto mb-12">
            <Link
              to="/schedule-appointment"
              className="btn-primary bg-white text-bridal-charcoal-500 hover:bg-bridal-clay-500 hover:text-white flex-1 inline-flex items-center justify-center gap-2"
            >
              <Calendar className="h-5 w-5" />
              <span>Schedule Appointment</span>
            </Link>
            <a
              href="tel:8012240059"
              className="btn-secondary border-white text-white hover:bg-white hover:text-bridal-charcoal-500 flex-1 flex items-center justify-center gap-2"
            >
              <Phone className="h-5 w-5" />
              <span>(801) 224-0059</span>
            </a>
          </div>

          <div className="pt-8 border-t border-white/20">
            <div className="flex flex-col md:flex-row justify-center items-center gap-6 text-white/60">
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                <span className="font-sans text-sm">(801) 224-0059</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                <a href="mailto:Allysesbridalandformal@gmail.com" className="hover:text-white font-sans text-sm transition-colors">
                  Allysesbridalandformal@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back Link */}
      <section className="py-8 px-4">
        <div className="container mx-auto text-center">
          <Link to="/" className="text-bridal-clay-600 hover:text-bridal-clay-700 font-sans font-medium link-underline">
            ← Back to Home
          </Link>
        </div>
      </section>
    </div>
  );
}
