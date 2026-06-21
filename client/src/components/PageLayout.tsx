import Navbar from "./Navbar";
import Footer from "./Footer";

interface PageLayoutProps {
  children: React.ReactNode;
  /** Pass true for pages that are full-bleed (Home hero, etc.) */
  noFooter?: boolean;
}

export default function PageLayout({ children, noFooter = false }: PageLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {/* 64px offset for fixed navbar (h-16) */}
      <main className="flex-1 pt-16">
        {children}
      </main>
      {!noFooter && <Footer />}
    </div>
  );
}
