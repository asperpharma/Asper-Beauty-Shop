import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Shipping() {
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
                {isAr ? "الشحن والتوصيل" : "Shipping & Delivery"}
              </h1>
              <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />
              <p className="font-body text-cream/70">
                {isAr
                  ? "تفاصيل الشحن تظهر عند إتمام الطلب مع أفضل الخيارات المتاحة."
                  : "Shipping details are shown at checkout with the best available options."}
              </p>
            </div>

            <div className="space-y-8 text-cream/80 font-body">
              <section className="space-y-3">
                <h2 className="font-display text-xl text-cream">
                  {isAr ? "المناطق المتاحة" : "Delivery areas"}
                </h2>
                <p>
                  {isAr
                    ? "نغطي التوصيل داخل الأردن. إذا كانت لديكِ منطقة خاصة، تواصلي معنا للتأكيد."
                    : "We deliver within Jordan. If you have a special delivery request, contact us to confirm."}
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-display text-xl text-cream">
                  {isAr ? "مدة التجهيز والتوصيل" : "Processing & delivery time"}
                </h2>
                <p>
                  {isAr
                    ? "نجهز الطلبات بسرعة، وقد تختلف مدة التوصيل حسب المدينة."
                    : "We process orders quickly, and delivery time can vary by city."}
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-display text-xl text-cream">
                  {isAr ? "تكلفة الشحن" : "Shipping fees"}
                </h2>
                <p>
                  {isAr
                    ? "يتم عرض تكلفة الشحن أثناء إتمام الطلب، وقد تتوفر عروض توصيل مجاني."
                    : "Shipping fees appear at checkout, and free delivery offers may apply."}
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
