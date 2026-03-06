import { Link, useNavigate } from "react-router-dom";
import { Footer } from "@/components/layout/Footer";
import { useCartStore } from "@/store/cartStore";
import { useEffect } from "react";

const SHOPIFY_CHECKOUT_URL = import.meta.env.VITE_SHOPIFY_CHECKOUT_URL ?? "";

export function CheckoutPage() {
  const { items, subtotal, clearCart } = useCartStore();
  const navigate = useNavigate();

  const hasItems = items.length > 0;

  // Redirect if cart empty
  useEffect(() => {
    if (!hasItems) {
      navigate("/cart", { replace: true });
    }
  }, [hasItems, navigate]);

  const handleCheckout = () => {
    if (SHOPIFY_CHECKOUT_URL) {
      // Redirect to Shopify checkout (would need cart token / line items in real impl)
      window.location.href = SHOPIFY_CHECKOUT_URL;
    } else {
      // Placeholder: clear cart and show thank-you
      clearCart();
      navigate("/checkout/thank-you", { replace: true });
    }
  };

  if (!hasItems) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container py-12">
        <h1 className="font-heading text-3xl font-bold text-maroon">
          Checkout
        </h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-2 max-w-4xl">
          <div>
            <h2 className="font-heading text-lg font-bold text-maroon mb-4">
              Order Summary
            </h2>
            <ul className="space-y-3">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between text-sm text-dark-charcoal"
                >
                  <span>
                    {item.title} × {item.quantity}
                  </span>
                  <span>{(item.price * item.quantity).toFixed(2)} JOD</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 font-body font-medium">
              Total: {subtotal().toFixed(2)} JOD
            </p>
          </div>

          <div>
            <h2 className="font-heading text-lg font-bold text-maroon mb-4">
              Complete Your Order
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              {SHOPIFY_CHECKOUT_URL
                ? "You will be redirected to our secure checkout."
                : "Configure VITE_SHOPIFY_CHECKOUT_URL to redirect to Shopify, or use the button below for a demo flow."}
            </p>
            <button
              type="button"
              onClick={handleCheckout}
              className="w-full py-3 bg-maroon text-white font-body font-medium hover:bg-maroon/90 transition"
            >
              {SHOPIFY_CHECKOUT_URL
                ? "Continue to Payment"
                : "Place Order (Demo)"}
            </button>
            <Link
              to="/cart"
              className="mt-4 block text-center text-sm text-gray-500 hover:text-maroon"
            >
              ← Back to cart
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
