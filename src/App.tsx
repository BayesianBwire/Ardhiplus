import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Listings from './pages/Listings';
import Agents from './pages/Agents';
import Favorites from './pages/Favorites';
import MarketplaceStats from './pages/MarketplaceStats';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import PropertyDetail from './pages/PropertyDetail';
import PostProperty from './pages/PostProperty';
import FAQ from './pages/FAQ';
import Privacy from './pages/Privacy';

import VerifyEmail from './pages/VerifyEmail';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-8 sm:px-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/marketplace-stats" element={<MarketplaceStats />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/services" element={<Services />} />
          <Route path="/post-property" element={<PostProperty />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/book-survey" element={<require('./pages/BookSurvey').default />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
