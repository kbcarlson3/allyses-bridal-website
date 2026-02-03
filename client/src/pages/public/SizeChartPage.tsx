import { Link } from 'react-router-dom';
import { Ruler } from 'lucide-react';

export default function SizeChartPage() {
  return (
    <div className="bg-bridal-ivory min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-bridal-taupe py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-bridal-clay-100 text-bridal-clay-600 mb-6">
            <Ruler className="w-8 h-8" />
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-light text-bridal-charcoal-500 mb-6">
            Size Chart
          </h1>
          <p className="text-lg text-bridal-charcoal-400 font-sans max-w-2xl mx-auto">
            Use this guide to find your perfect fit. For the most accurate sizing,
            we recommend scheduling an in-person fitting.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-20 max-w-5xl">
        {/* Size Table */}
        <div className="bg-white shadow-sm overflow-hidden mb-12">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-bridal-charcoal-500 text-white">
                  <th className="px-6 py-4 text-left font-sans font-medium text-sm tracking-wide uppercase">
                    Size
                  </th>
                  <th className="px-6 py-4 text-left font-sans font-medium text-sm tracking-wide uppercase">
                    Bust
                  </th>
                  <th className="px-6 py-4 text-left font-sans font-medium text-sm tracking-wide uppercase">
                    Waist
                  </th>
                  <th className="px-6 py-4 text-left font-sans font-medium text-sm tracking-wide uppercase">
                    Hip
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bridal-taupe">
                {[
                  { size: '0-2', bust: '32-33"', waist: '24-25"', hip: '35-36"' },
                  { size: '4-6', bust: '34-35"', waist: '26-27"', hip: '37-38"' },
                  { size: '8-10', bust: '36-37"', waist: '28-29"', hip: '39-40"' },
                  { size: '12-14', bust: '38-40"', waist: '30-32"', hip: '41-43"' },
                  { size: '16-18', bust: '42-44"', waist: '34-36"', hip: '45-47"' },
                  { size: '20-22', bust: '46-48"', waist: '38-40"', hip: '49-51"' },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-bridal-cream transition-colors">
                    <td className="px-6 py-4 font-sans font-medium text-bridal-charcoal-500">
                      {row.size}
                    </td>
                    <td className="px-6 py-4 font-sans text-bridal-charcoal-400">
                      {row.bust}
                    </td>
                    <td className="px-6 py-4 font-sans text-bridal-charcoal-400">
                      {row.waist}
                    </td>
                    <td className="px-6 py-4 font-sans text-bridal-charcoal-400">
                      {row.hip}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Measurement Instructions */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-display text-bridal-charcoal-500 mb-6">
              How to Measure
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-sans font-medium tracking-widest uppercase text-bridal-charcoal-500 mb-2">
                  Bust
                </h3>
                <p className="text-bridal-charcoal-400 font-sans text-sm leading-relaxed">
                  Measure around the fullest part of your bust with the tape parallel to the floor.
                  Keep the tape comfortably snug but not tight.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-sans font-medium tracking-widest uppercase text-bridal-charcoal-500 mb-2">
                  Waist
                </h3>
                <p className="text-bridal-charcoal-400 font-sans text-sm leading-relaxed">
                  Measure around your natural waistline, typically the narrowest part of your torso.
                  Keep the tape comfortably loose.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-sans font-medium tracking-widest uppercase text-bridal-charcoal-500 mb-2">
                  Hip
                </h3>
                <p className="text-bridal-charcoal-400 font-sans text-sm leading-relaxed">
                  Measure around the fullest part of your hips with the tape parallel to the floor,
                  usually about 7-9 inches below your waist.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-bridal-clay-50 p-8">
            <h2 className="text-2xl font-display text-bridal-charcoal-500 mb-6">
              Important Notes
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-bridal-clay-500 rounded-full mt-2 flex-shrink-0" />
                <p className="text-bridal-charcoal-400 font-sans text-sm leading-relaxed">
                  These measurements are approximate guides. Individual fit may vary based on dress style and design.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-bridal-clay-500 rounded-full mt-2 flex-shrink-0" />
                <p className="text-bridal-charcoal-400 font-sans text-sm leading-relaxed">
                  We strongly recommend scheduling an in-person appointment for accurate sizing and fitting.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-bridal-clay-500 rounded-full mt-2 flex-shrink-0" />
                <p className="text-bridal-charcoal-400 font-sans text-sm leading-relaxed">
                  Our expert seamstresses provide in-house alterations to ensure your dress fits perfectly.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-bridal-clay-500 rounded-full mt-2 flex-shrink-0" />
                <p className="text-bridal-charcoal-400 font-sans text-sm leading-relaxed">
                  For best results, have someone else take your measurements while you stand naturally.
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white p-10 md:p-12 text-center shadow-sm">
          <h2 className="text-3xl md:text-4xl font-display font-light text-bridal-charcoal-500 mb-4">
            Need Help Finding Your Size?
          </h2>
          <p className="text-bridal-charcoal-400 font-sans mb-8 max-w-2xl mx-auto">
            Our experienced team is here to help you find the perfect fit.
            Schedule an appointment for personalized sizing and fitting assistance.
          </p>
          <Link to="/schedule-appointment" className="btn-primary inline-flex">
            <span>Schedule Fitting Appointment</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
