import { Phone, ShieldCheck, Truck } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-soft-ivory border-t-2 border-shiny-gold pt-16 pb-8">
      <div className="container mx-auto px-4">
        {/* Top Section: The 3 Pillars of Trust */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 border-b border-gray-200 pb-12">
          <div className="flex flex-col items-center text-center">
            <ShieldCheck className="h-10 w-10 text-maroon mb-4" />
            <h3 className="font-heading text-lg font-bold text-maroon">
              Authentic Quality
            </h3>
            <p className="font-body text-sm text-dark-charcoal mt-2">
              100% Original Dermocosmetics.
              <br />
              Pharmacist Verified.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <Truck className="h-10 w-10 text-maroon mb-4" />
            <h3 className="font-heading text-lg font-bold text-maroon">
              Express Delivery
            </h3>
            <p className="font-body text-sm text-dark-charcoal mt-2">
              Next-day delivery in Amman.
              <br />
              Free shipping over 50 JOD.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <Phone className="h-10 w-10 text-maroon mb-4" />
            <h3 className="font-heading text-lg font-bold text-maroon">
              Expert Support
            </h3>
            <p className="font-body text-sm text-dark-charcoal mt-2">
              Questions? Chat with our
              <br />
              Digital Concierge 24/7.
            </p>
          </div>
        </div>

        {/* Middle Section: Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <h2 className="font-heading text-2xl text-maroon font-bold mb-4">
              Asper Beauty Shop
            </h2>
            <p className="font-body text-sm text-dark-charcoal max-w-xs leading-relaxed">
              Merging the purity of science with the luxury of care. Your
              personalized regimen awaits.
            </p>
          </div>

          <div>
            <h4 className="font-heading text-maroon font-bold mb-4">Shop</h4>
            <ul className="space-y-2 font-body text-sm text-dark-charcoal">
              <li>
                <Link
                  to="/brands/vichy"
                  className="hover:text-shiny-gold transition"
                >
                  Vichy
                </Link>
              </li>
              <li>
                <Link
                  to="/brands/laroche"
                  className="hover:text-shiny-gold transition"
                >
                  La Roche-Posay
                </Link>
              </li>
              <li>
                <Link
                  to="/concerns"
                  className="hover:text-shiny-gold transition"
                >
                  Shop by Concern
                </Link>
              </li>
              <li>
                <Link
                  to="/concerns"
                  className="hover:text-shiny-gold transition"
                >
                  See My Regimen
                </Link>
              </li>
              <li>
                <Link
                  to="/offers"
                  className="hover:text-shiny-gold transition"
                >
                  Exclusive Offers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-maroon font-bold mb-4">
              Legal & Care
            </h4>
            <ul className="space-y-2 font-body text-sm text-dark-charcoal">
              <li>
                <Link
                  to="/shipping"
                  className="hover:text-shiny-gold transition"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/returns"
                  className="hover:text-shiny-gold transition"
                >
                  Returns & Hygiene
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-shiny-gold transition"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-shiny-gold transition"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="text-center font-body text-xs text-gray-500 pt-8">
          <p>
            © {new Date().getFullYear()} Asper Beauty Shop. All rights reserved.
          </p>
          <p className="mt-2">Amman, Jordan • CR No. 123456</p>
        </div>
      </div>
    </footer>
  );
};
