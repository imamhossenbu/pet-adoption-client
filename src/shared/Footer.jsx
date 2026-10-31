import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaPaw,
  FaHeart,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaClock,
  FaEnvelope,
  FaShieldAlt,
} from "react-icons/fa";
import logo from "../assets/logo.png";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gradient-to-b from-[#181818] via-[#141414] to-[#0D0D0D] text-white pt-16 pb-8 border-t border-gray-800 relative overflow-hidden">
      {/* Decorative background paw watermark */}
      <div className="absolute top-10 right-10 opacity-[0.03] text-[#FBAE02] pointer-events-none">
        <FaPaw size={380} />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Top 3 Info Cards (Location, Helpline, Visiting Hours) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-14 border-b border-gray-800/80">
          {/* Card 1: Address */}
          <div className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 rounded-2xl p-6 flex items-center gap-4 transition duration-300 group hover:border-[#FBAE02]/50">
            <div className="w-14 h-14 rounded-2xl bg-[#FBAE02]/10 border border-[#FBAE02]/30 flex items-center justify-center flex-shrink-0 text-[#FBAE02] group-hover:bg-[#FBAE02] group-hover:text-black transition-all duration-300 shadow-sm">
              <FaMapMarkerAlt className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-1">Our Center</p>
              <h4 className="text-base font-bold text-gray-100">516 Columbia Blvd</h4>
              <p className="text-xs text-gray-400">Sonoma, CA 21202, USA</p>
            </div>
          </div>

          {/* Card 2: Contact */}
          <div className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 rounded-2xl p-6 flex items-center gap-4 transition duration-300 group hover:border-[#FBAE02]/50">
            <div className="w-14 h-14 rounded-2xl bg-[#FBAE02]/10 border border-[#FBAE02]/30 flex items-center justify-center flex-shrink-0 text-[#FBAE02] group-hover:bg-[#FBAE02] group-hover:text-black transition-all duration-300 shadow-sm">
              <FaPhoneAlt className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-1">24/7 Pet Helpline</p>
              <h4 className="text-base font-bold text-gray-100">+1 (772) 619-6309</h4>
              <p className="text-xs text-gray-400">help@peddycare.org</p>
            </div>
          </div>

          {/* Card 3: Hours */}
          <div className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 rounded-2xl p-6 flex items-center gap-4 transition duration-300 group hover:border-[#FBAE02]/50">
            <div className="w-14 h-14 rounded-2xl bg-[#FBAE02]/10 border border-[#FBAE02]/30 flex items-center justify-center flex-shrink-0 text-[#FBAE02] group-hover:bg-[#FBAE02] group-hover:text-black transition-all duration-300 shadow-sm">
              <FaClock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-1">Adoption & Visiting Hours</p>
              <h4 className="text-base font-bold text-gray-100">Mon - Sat: 9:00 AM - 8:00 PM</h4>
              <p className="text-xs text-gray-400">Sunday: By Appointment</p>
            </div>
          </div>
        </div>

        {/* Main Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 py-14 border-b border-gray-800/80">
          {/* Column 1: Brand & Mission (Col span 4) */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" onClick={scrollToTop} className="inline-flex items-center gap-3 group">
              <img src={logo} alt="PeddyCare Logo" className="w-10 h-10 object-contain group-hover:scale-105 transition" />
              <span className="text-2xl font-black tracking-wide text-white font-serif">
                Peddy<span className="text-[#FBAE02]">Care</span>
              </span>
            </Link>

            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              PeddyCare is a non-profit animal rescue and adoption initiative dedicated to creating loving forever homes, funding veterinary emergencies, and giving every pet the dignity they deserve.
            </p>

            {/* Trust Badges */}
            <div className="pt-2 flex flex-wrap gap-2.5">
              <span className="inline-flex items-center gap-1.5 text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-gray-300">
                <FaShieldAlt className="text-[#FBAE02] text-xs" /> Verified Welfare
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-gray-300">
                <FaHeart className="text-red-500 text-xs" /> 100% Non-Profit
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links (Col span 2) */}
          <div className="lg:col-span-2">
            <h4 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FBAE02]"></span>
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link to="/" onClick={scrollToTop} className="hover:text-[#FBAE02] transition flex items-center gap-1.5">
                  › Home
                </Link>
              </li>
              <li>
                <Link to="/pet-listing" onClick={scrollToTop} className="hover:text-[#FBAE02] transition flex items-center gap-1.5">
                  › Pet Listing
                </Link>
              </li>
              <li>
                <Link to="/pet-matchmaker" onClick={scrollToTop} className="text-[#FBAE02] font-semibold hover:underline flex items-center gap-1.5">
                  › Smart Matchmaker
                  <span className="text-[10px] bg-orange-600 text-white font-bold px-1.5 py-0.2 rounded-full uppercase">New</span>
                </Link>
              </li>
              <li>
                <Link to="/donation-campaigns" onClick={scrollToTop} className="hover:text-[#FBAE02] transition flex items-center gap-1.5">
                  › Donation Campaigns
                </Link>
              </li>
              <li>
                <Link to="/services" onClick={scrollToTop} className="hover:text-[#FBAE02] transition flex items-center gap-1.5">
                  › Our Services
                </Link>
              </li>
              <li>
                <Link to="/contact" onClick={scrollToTop} className="hover:text-[#FBAE02] transition flex items-center gap-1.5">
                  › Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Pet Categories & Resources (Col span 3) */}
          <div className="lg:col-span-3">
            <h4 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FBAE02]"></span>
              Browse Categories
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link to="/pet-listing" onClick={scrollToTop} className="hover:text-[#FBAE02] transition flex items-center gap-1.5">
                  🐕 Rescue Dogs & Puppies
                </Link>
              </li>
              <li>
                <Link to="/pet-listing" onClick={scrollToTop} className="hover:text-[#FBAE02] transition flex items-center gap-1.5">
                  🐈 Domestic Cats & Kittens
                </Link>
              </li>
              <li>
                <Link to="/pet-listing" onClick={scrollToTop} className="hover:text-[#FBAE02] transition flex items-center gap-1.5">
                  🐇 Friendly Rabbits
                </Link>
              </li>
              <li>
                <Link to="/pet-listing" onClick={scrollToTop} className="hover:text-[#FBAE02] transition flex items-center gap-1.5">
                  🦜 Feathered Birds
                </Link>
              </li>
              <li>
                <Link to="/dashboard" onClick={scrollToTop} className="hover:text-[#FBAE02] transition flex items-center gap-1.5">
                  📋 User Dashboard & Requests
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Emergency Assistance & Socials (Col span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FBAE02]"></span>
              Stay Connected
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Follow our daily rescue stories, adoption reunions, and helpful pet wellness guides on social media:
            </p>

            {/* Social Icons with Glassmorphism Hover Effects */}
            <div className="flex items-center gap-2.5 pt-1">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-black hover:bg-[#FBAE02] hover:border-[#FBAE02] hover:scale-110 transition-all duration-200 shadow-sm"
                aria-label="Facebook"
              >
                <FaFacebookF className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-black hover:bg-[#FBAE02] hover:border-[#FBAE02] hover:scale-110 transition-all duration-200 shadow-sm"
                aria-label="Twitter"
              >
                <FaTwitter className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-black hover:bg-[#FBAE02] hover:border-[#FBAE02] hover:scale-110 transition-all duration-200 shadow-sm"
                aria-label="Instagram"
              >
                <FaInstagram className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-black hover:bg-[#FBAE02] hover:border-[#FBAE02] hover:scale-110 transition-all duration-200 shadow-sm"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn className="w-4 h-4" />
              </a>
            </div>

            {/* Quick Emergency Quote Box */}
            <div className="mt-4 p-3 bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-[#FBAE02]/20 rounded-xl">
              <p className="text-[11px] text-gray-300 flex items-start gap-2">
                <FaPaw className="text-[#FBAE02] w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>"Saving one animal won't change the world, but surely the world will change for that one animal."</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Legal Links */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p className="flex items-center gap-1.5 text-center sm:text-left">
            © {new Date().getFullYear()} <span className="font-bold text-gray-400">PeddyCare</span>. All rights reserved. Made with <FaHeart className="text-red-500 inline w-3 h-3" /> for animal rescue.
          </p>

          <div className="flex items-center space-x-6 text-gray-400">
            <Link to="/privacy-policy" onClick={scrollToTop} className="hover:text-[#FBAE02] transition">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/terms-of-service" onClick={scrollToTop} className="hover:text-[#FBAE02] transition">
              Terms of Service
            </Link>
            <span>•</span>
            <Link to="/adoption-policy" onClick={scrollToTop} className="hover:text-[#FBAE02] transition">
              Adoption Guidelines
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
