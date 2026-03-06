import { Link } from "react-router-dom";
import { Footer } from "@/components/layout/Footer";

export function ThankYouPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container py-12 flex flex-col items-center justify-center text-center">
        <h1 className="font-heading text-3xl font-bold text-maroon">
          Thank You
        </h1>
        <p className="mt-4 font-body text-dark-charcoal max-w-md">
          Your order has been received. Our team will be in touch shortly.
        </p>
        <Link
          to="/concerns"
          className="mt-8 inline-block px-6 py-2 bg-maroon text-white font-body text-sm font-medium hover:bg-maroon/90 transition"
        >
          Continue Shopping
        </Link>
      </main>
      <Footer />
    </div>
  );
}
