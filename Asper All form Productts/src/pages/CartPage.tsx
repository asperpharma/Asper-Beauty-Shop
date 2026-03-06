import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { useCartStore } from "@/store/cartStore";

export function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, clearCart } =
    useCartStore();

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 container py-12">
          <h1 className="font-heading text-3xl font-bold text-maroon">
            Your Cart
          </h1>
          <p className="mt-4 font-body text-dark-charcoal">
            Your cart is empty.
          </p>
          <Link
            to="/concerns"
            className="mt-6 inline-block px-6 py-2 bg-maroon text-white font-body text-sm font-medium hover:bg-maroon/90 transition"
          >
            Shop by Concern
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container py-12">
        <h1 className="font-heading text-3xl font-bold text-maroon">
          Your Cart
        </h1>
        <p className="mt-1 text-sm text-gray-600">{items.length} item(s)</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 bg-white border border-gray-100 p-4 rounded-sm"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-24 w-24 object-cover rounded-sm"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-maroon uppercase">
                    {item.brand}
                  </span>
                  <Link
                    to={`/products/${item.handle}`}
                    className="mt-1 block font-heading text-dark-charcoal hover:text-maroon"
                  >
                    {item.title}
                  </Link>
                  <div className="mt-2 flex items-center gap-4">
                    <select
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.id, parseInt(e.target.value, 10))}
                      className="border border-gray-200 rounded px-2 py-1 text-sm"
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-maroon transition"
                      aria-label="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-body font-medium text-dark-charcoal">
                    {(item.price * item.quantity).toFixed(2)} JOD
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-100 p-6 rounded-sm sticky top-20">
              <h2 className="font-heading text-lg font-bold text-maroon">
                Order Summary
              </h2>
              <p className="mt-2 font-body text-dark-charcoal">
                Subtotal: {subtotal().toFixed(2)} JOD
              </p>
              <Link
                to="/checkout"
                className="mt-4 block w-full py-3 text-center bg-maroon text-white font-body font-medium hover:bg-maroon/90 transition"
              >
                Proceed to Checkout
              </Link>
              <button
                type="button"
                onClick={clearCart}
                className="mt-2 block w-full text-sm text-gray-500 hover:text-maroon"
              >
                Clear cart
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
