import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Consultation() {
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
                {isAr ? "استشارة البشرة" : "Skin Consultation"}
              </h1>
              <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />
              <p className="font-body text-cream/70">
                {isAr
                  ? "احصلي على توصيات مخصصة لروتين العناية بالبشرة."
                  : "Get personalized recommendations for your skincare routine."}
              </p>
            </div>

            <div className="space-y-8 text-cream/80 font-body">
              <section className="space-y-3">
                <h2 className="font-display text-xl text-cream">
                  {isAr ? "كيف تعمل الاستشارة؟" : "How it works"}
                </h2>
                <p>
                  {isAr
                    ? "شاركي معنا نوع بشرتكِ واحتياجاتك، وسنقترح المنتجات الأنسب لكِ."
                    : "Tell us about your skin type and goals, and we'll suggest the best products for you."}
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-display text-xl text-cream">
                  {isAr ? "احجزي الآن" : "Book your consultation"}
                </h2>
                <p>
                  {isAr
                    ? "تواصلي معنا عبر واتساب أو البريد الإلكتروني لتحديد الاستشارة."
                    : "Reach us on WhatsApp or email to schedule your consultation."}
                </p>
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
