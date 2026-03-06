import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Tracking() {
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
                {isAr ? "تتبع الطلب" : "Order Tracking"}
              </h1>
              <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />
              <p className="font-body text-cream/70">
                {isAr
                  ? "تابعي حالة طلبك بسهولة. سنبقيكِ على اطلاع بكل خطوة."
                  : "Track your order status with ease. We'll keep you updated every step of the way."}
              </p>
            </div>

            <div className="space-y-8 text-cream/80 font-body">
              <section className="space-y-3">
                <h2 className="font-display text-xl text-cream">
                  {isAr ? "كيف يتم التتبع؟" : "How tracking works"}
                </h2>
                <p>
                  {isAr
                    ? "بعد تأكيد الطلب، سيتواصل فريقنا معكِ عبر الهاتف أو واتساب لتحديث حالة الطلب وتفاصيل التوصيل."
                    : "Once your order is confirmed, our team will reach out by phone or WhatsApp with status updates and delivery details."}
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-display text-xl text-cream">
                  {isAr ? "تحتاجين مساعدة؟" : "Need help?"}
                </h2>
                <p>
                  {isAr
                    ? "راسلينا عبر واتساب أو البريد الإلكتروني وسنساعدكِ فوراً."
                    : "Message us on WhatsApp or email and we'll assist right away."}
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
