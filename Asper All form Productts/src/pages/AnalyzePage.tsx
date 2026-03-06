import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Footer } from "@/components/layout/Footer";

const initial = { skinType: "", concern: "", routineLevel: "" };

const CONCERN_TO_SLUG: Record<string, string> = {
  acne: "acne-blemishes",
  aging: "anti-aging-wrinkles",
  dark_spots: "hyperpigmentation-dark-spots",
  redness: "sensitivity-redness",
  dullness: "dryness-hydration",
};

export function AnalyzePage() {
  const [form, setForm] = useState(initial);
  const navigate = useNavigate();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    const concernSlug = form.concern ? CONCERN_TO_SLUG[form.concern] ?? form.concern : "";
    navigate("/recommend", { state: { ...form, concernSlug } });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="max-w-lg mx-auto py-16 px-4 flex-1">
        <h1 className="text-3xl font-heading text-maroon mb-8 text-center">
          Personal Analysis
        </h1>
        <form
          onSubmit={handleAnalyze}
          className="bg-white rounded-sm p-8 shadow-tray border border-transparent hover:border-shiny-gold/30 transition-all duration-300 space-y-6"
        >
          <div>
            <label htmlFor="skinType" className="block mb-2 font-body text-dark-charcoal">
              Your Skin Type
            </label>
            <select
              id="skinType"
              name="skinType"
              value={form.skinType}
              onChange={handleChange}
              className="w-full border border-shiny-gold/50 rounded-sm p-2 font-body text-dark-charcoal focus:ring-2 focus:ring-shiny-gold/30"
            >
              <option value="">Select...</option>
              <option value="normal">Normal</option>
              <option value="oily">Oily</option>
              <option value="dry">Dry</option>
              <option value="combination">Combination</option>
              <option value="sensitive">Sensitive</option>
            </select>
          </div>
          <div>
            <label htmlFor="concern" className="block mb-2 font-body text-dark-charcoal">
              Primary Concern
            </label>
            <select
              id="concern"
              name="concern"
              value={form.concern}
              onChange={handleChange}
              className="w-full border border-shiny-gold/50 rounded-sm p-2 font-body text-dark-charcoal focus:ring-2 focus:ring-shiny-gold/30"
            >
              <option value="">Select...</option>
              <option value="acne">Acne</option>
              <option value="aging">Aging</option>
              <option value="dark_spots">Dark Spots</option>
              <option value="redness">Redness</option>
              <option value="dullness">Dullness</option>
            </select>
          </div>
          <div>
            <label htmlFor="routineLevel" className="block mb-2 font-body text-dark-charcoal">
              Routine Level
            </label>
            <select
              id="routineLevel"
              name="routineLevel"
              value={form.routineLevel}
              onChange={handleChange}
              className="w-full border border-shiny-gold/50 rounded-sm p-2 font-body text-dark-charcoal focus:ring-2 focus:ring-shiny-gold/30"
            >
              <option value="">Select...</option>
              <option value="essential">
                Essential (Cleanse, Moisturize, Protect)
              </option>
              <option value="complete">
                Complete (Add serum, exfoliant, spot/eye)
              </option>
            </select>
          </div>
          <button
            type="submit"
            disabled={!form.skinType || !form.concern || !form.routineLevel}
            className="w-full bg-maroon text-white py-3 mt-2 font-body tracking-widest uppercase rounded-sm shadow hover:bg-maroon/90 focus:outline-none focus:ring-2 focus:ring-shiny-gold disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            Analyze
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
