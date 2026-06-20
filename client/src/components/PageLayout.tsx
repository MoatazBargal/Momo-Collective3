import AnnouncementBar from "./AnnouncementBar";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface PageLayoutProps {
  children: React.ReactNode;
  noFooter?: boolean;
}

export default function PageLayout({ children, noFooter = false }: PageLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">{children}</main>
      {!noFooter && <Footer />}
    </div>
  );
}
