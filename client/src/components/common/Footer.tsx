import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-2">
          <Link
            to="/"
            className="text-gray-900 hover:text-blue-600 transition font-medium text-sm"
          >
            Allyse's Bridal and Formal
          </Link>
          <p className="text-gray-700 text-sm">(801) 224-0059</p>
          <p className="text-gray-700 text-sm">4801 N University Ave #120 Provo, UT 84604</p>
          <p className="text-gray-600 text-xs mt-4">
            ©2020 by Allyse's Bridal and Formal
          </p>
        </div>
      </div>
    </footer>
  );
}
