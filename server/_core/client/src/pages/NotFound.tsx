import { useLocation } from "wouter";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-6" style={{ backgroundColor: "var(--momo-bg)" }}>
      <div className="text-center max-w-lg">
        <h1 className="heading-hero text-accent mb-2" style={{ fontSize: "8rem", lineHeight: 1 }}>
          404
        </h1>
        <h2 className="heading-section mb-4">Page Not Found</h2>
        <p className="text-dim mb-10 leading-relaxed">
          The page you're looking for doesn't exist. It may have been moved, renamed, or dropped from the collection.
        </p>
        <button
          onClick={() => setLocation("/")}
          className="btn-primary inline-flex items-center gap-2"
        >
          Back to Home <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
