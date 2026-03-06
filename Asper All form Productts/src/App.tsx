import { Link, Route, Routes } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChatWidget } from "@/components/BeautyAssistant/ChatWidget";
import { ConcernsPage } from "@/pages/ConcernsPage";
import { ConcernRegimenPage } from "@/pages/ConcernRegimenPage";
import { AnalyzePage } from "@/pages/AnalyzePage";
import { RecommendPage } from "@/pages/RecommendPage";
import { RegimenPage } from "@/pages/RegimenPage";
import { CartPage } from "@/pages/CartPage";
import { CheckoutPage } from "@/pages/CheckoutPage";
import { ThankYouPage } from "@/pages/ThankYouPage";
import { NotesPage } from "@/pages/NotesPage";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <ChatWidget />
    </>
  );
}

function Home() {
  return (
    <Layout>
      <main className="flex-1 container py-12">
        <h1 className="font-heading text-3xl font-bold text-maroon">
          Asper Beauty Shop
        </h1>
        <p className="mt-4 font-body text-dark-charcoal">
          Product catalog and skin regimen recommendations.
        </p>
        <p className="mt-4">
          <Link
            to="/analyze"
            className="font-body text-maroon hover:underline font-medium"
          >
            Start 3-Click Analysis →
          </Link>
          {" · "}
          <Link
            to="/concerns"
            className="font-body text-maroon hover:underline font-medium"
          >
            Shop by Concern
          </Link>
        </p>
      </main>
      <Footer />
    </Layout>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/concerns"
        element={
          <Layout>
            <ConcernsPage />
          </Layout>
        }
      />
      <Route
        path="/concerns/:concernSlug"
        element={
          <Layout>
            <ConcernRegimenPage />
          </Layout>
        }
      />
      <Route
        path="/analyze"
        element={
          <Layout>
            <AnalyzePage />
          </Layout>
        }
      />
      <Route
        path="/recommend"
        element={
          <Layout>
            <RecommendPage />
          </Layout>
        }
      />
      <Route
        path="/regimen"
        element={
          <Layout>
            <RegimenPage />
          </Layout>
        }
      />
      <Route
        path="/cart"
        element={
          <Layout>
            <CartPage />
          </Layout>
        }
      />
      <Route
        path="/checkout"
        element={
          <Layout>
            <CheckoutPage />
          </Layout>
        }
      />
      <Route
        path="/checkout/thank-you"
        element={
          <Layout>
            <ThankYouPage />
          </Layout>
        }
      />
      <Route
        path="/notes"
        element={
          <Layout>
            <NotesPage />
          </Layout>
        }
      />
    </Routes>
  );
}
