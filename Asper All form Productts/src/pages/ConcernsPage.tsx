import { Link } from "react-router-dom";
import { Footer } from "@/components/layout/Footer";
import { ALL_CONCERNS } from "@/lib/getProductsByConcern";

export function ConcernsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container py-12">
        <h1 className="font-heading text-3xl font-bold text-maroon">
          Shop by Concern
        </h1>
        <p className="mt-2 font-body text-dark-charcoal">
          Select your skin concern to see your pharmacist-recommended regimen.
        </p>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {ALL_CONCERNS.map((c) => (
            <Link
              key={c.slug}
              to={`/concerns/${c.slug}`}
              className="block p-6 rounded-sm border border-transparent hover:border-shiny-gold bg-white shadow-sm hover:shadow-md transition-all duration-300"
            >
              <span className="font-heading text-lg font-medium text-maroon">
                {c.label}
              </span>
              <span className="mt-2 block font-body text-sm text-dark-charcoal">
                See My Regimen →
              </span>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
