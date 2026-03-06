import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Returns() {
  const { language } = useLanguage();
  const isAr = language === "ar";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-40 pb-20">
        <div className="luxury-container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="font-display text-4xl md:text-5xl text-cream mb-4">
                {isAr ? "الإرجاع والاستبدال" : "Returns & Exchanges"}
              </h1>
              <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />
              <p className="font-body text-cream/70">
                {isAr
                  ? "إذا لم يكن المنتج مناسباً، سنساعدكِ في خطوات الإرجاع أو الاستبدال."
                  : "If something isn't quite right, we'll help you with a return or exchange."}
              </p>
            </div>

            <div className="space-y-8 text-cream/80 font-body">
              <section className="space-y-3">
                <h2 className="font-display text-xl text-cream">
                  {isAr ? "ابدئي بطلب الإرجاع" : "Start a return"}
                </h2>
                <p>
                  {isAr
                    ? "تواصلي معنا عبر واتساب أو البريد الإلكتروني مع رقم الطلب لنراجع الحالة ونخبركِ بالخطوات التالية."
                    : "Contact us via WhatsApp or email with your order number and we'll guide you through the next steps."}
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-display text-xl text-cream">
                  {isAr ? "المنتجات المؤهلة" : "Eligible items"}
                </h2>
                <p>
                  {isAr
                    ? "تخضع أهلية الإرجاع لنوع المنتج وحالته. سنؤكد لكِ التفاصيل عند التواصل."
                    : "Return eligibility depends on the product type and condition. We'll confirm the details when you reach out."}
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-display text-xl text-cream">
                  {isAr ? "تحتاجين مساعدة؟" : "Need assistance?"}
                </h2>
                <div className="space-y-1">
                  <a
                    href="https://wa.me/962790656666"
                    className="block text-gold hover:text-gold-light transition-colors"
                  >
                    +962 79 065 6666
                  </a>
                  <a
                    href="mailto:asperpharma@gmail.com"
                    className="block text-gold hover:text-gold-light transition-colors"
                  >
                    asperpharma@gmail.com
                  </a>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
