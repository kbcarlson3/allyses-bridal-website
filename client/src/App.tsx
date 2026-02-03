import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { PublicLayout } from './components/layouts/PublicLayout'
import { AdminLayout } from './components/layouts/AdminLayout'
import { CartProvider } from './context/CartContext'

// Public pages
import HomePage from './pages/public/HomePage'
import ShopPage from './pages/public/ShopPage'
import ProductPage from './pages/public/ProductPage'
import ScheduleAppointmentPage from './pages/public/ScheduleAppointmentPage'
import AlterationsPage from './pages/public/AlterationsPage'
import SizeChartPage from './pages/public/SizeChartPage'

// Admin pages
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import DressManagement from './pages/admin/DressManagement'
import AppointmentManagement from './pages/admin/AppointmentManagement'
import SettingsPage from './pages/admin/SettingsPage'
import InquiriesPage from './pages/admin/InquiriesPage'
import GalleryManagement from './pages/admin/GalleryManagement'

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          {/* Public routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/shop/:page" element={<ShopPage />} />
            <Route path="/product/:productName" element={<ProductPage />} />
            <Route path="/schedule-appointment" element={<ScheduleAppointmentPage />} />
            <Route path="/service-page/dress-alterations" element={<AlterationsPage />} />
            <Route path="/size-chart" element={<SizeChartPage />} />
          </Route>

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dresses" element={<DressManagement />} />
            <Route path="appointments" element={<AppointmentManagement />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="inquiries" element={<InquiriesPage />} />
            <Route path="gallery" element={<GalleryManagement />} />
          </Route>
        </Routes>
      </CartProvider>
    </BrowserRouter>
  )
}

export default App
