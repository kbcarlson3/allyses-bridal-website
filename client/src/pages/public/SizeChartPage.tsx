export default function SizeChartPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-8 text-center">
          SIZE CHART
        </h1>

        <div className="bg-white overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-3 text-left">Size</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Bust (inches)</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Waist (inches)</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Hip (inches)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-3">0-2</td>
                <td className="border border-gray-300 px-4 py-3">32-33"</td>
                <td className="border border-gray-300 px-4 py-3">24-25"</td>
                <td className="border border-gray-300 px-4 py-3">35-36"</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-3">4-6</td>
                <td className="border border-gray-300 px-4 py-3">34-35"</td>
                <td className="border border-gray-300 px-4 py-3">26-27"</td>
                <td className="border border-gray-300 px-4 py-3">37-38"</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-3">8-10</td>
                <td className="border border-gray-300 px-4 py-3">36-37"</td>
                <td className="border border-gray-300 px-4 py-3">28-29"</td>
                <td className="border border-gray-300 px-4 py-3">39-40"</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-3">12-14</td>
                <td className="border border-gray-300 px-4 py-3">38-40"</td>
                <td className="border border-gray-300 px-4 py-3">30-32"</td>
                <td className="border border-gray-300 px-4 py-3">41-43"</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-3">16-18</td>
                <td className="border border-gray-300 px-4 py-3">42-44"</td>
                <td className="border border-gray-300 px-4 py-3">34-36"</td>
                <td className="border border-gray-300 px-4 py-3">45-47"</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-3">20-22</td>
                <td className="border border-gray-300 px-4 py-3">46-48"</td>
                <td className="border border-gray-300 px-4 py-3">38-40"</td>
                <td className="border border-gray-300 px-4 py-3">49-51"</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-serif text-gray-900 mb-4">MEASUREMENTS</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              <strong>Bust:</strong> Measure around the fullest part of your bust with the tape parallel to the floor.
            </p>
            <p>
              <strong>Waist:</strong> Measure around your natural waistline, keeping the tape comfortably loose.
            </p>
            <p>
              <strong>Hip:</strong> Measure around the fullest part of your hips with the tape parallel to the floor.
            </p>
            <p className="mt-6 text-sm text-gray-600">
              Note: These measurements are approximate. We recommend scheduling an appointment for proper fitting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
