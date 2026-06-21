import { MotionConfig } from "framer-motion";
import AnnouncementBar from "./AnnouncementBar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PageTransition from "./motion/PageTransition";

interface PageLayoutProps {
  children: React.ReactNode;
  noFooter?: boolean;
}

export default function PageLayout({ children, noFooter = false }: PageLayoutProps) {
  return (
    <MotionConfig reducedMotion="user">
      <div className="flex flex-col min-h-screen">
        <AnnouncementBar />
        <Navbar />
        <main className="flex-1">
          <PageTransition>{children}</PageTransition>
        </main>
        {!noFooter && <Footer />}
      </div>
    </MotionConfig>
  );
}
