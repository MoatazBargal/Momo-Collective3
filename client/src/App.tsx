import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import ProductDetail from "@/pages/ProductDetail";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Auth from "@/pages/Auth";
import Profile from "@/pages/Profile";
import Wishlist from "@/pages/Wishlist";
import AdminDashboard from "@/pages/AdminDashboard";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import PageLayout from "./components/PageLayout";

/** Pages that use their own full-screen layout (no navbar/footer from PageLayout) */
const AuthPage = () => (
  <div className="min-h-screen">
    <Auth />
  </div>
);

function Router() {
  return (
    <Switch>
      <Route path="/">
        <PageLayout>
          <Home />
        </PageLayout>
      </Route>
      <Route path="/shop">
        <PageLayout>
          <Shop />
        </PageLayout>
      </Route>
      <Route path="/product/:slug">
        {(params) => (
          <PageLayout>
            <ProductDetail params={params} />
          </PageLayout>
        )}
      </Route>
      <Route path="/about">
        <PageLayout>
          <About />
        </PageLayout>
      </Route>
      <Route path="/contact">
        <PageLayout>
          <Contact />
        </PageLayout>
      </Route>
      <Route path="/cart">
        <PageLayout>
          <Cart />
        </PageLayout>
      </Route>
      <Route path="/checkout">
        <PageLayout>
          <Checkout />
        </PageLayout>
      </Route>
      <Route path="/wishlist">
        <PageLayout>
          <Wishlist />
        </PageLayout>
      </Route>
      <Route path="/profile">
        <PageLayout>
          <Profile />
        </PageLayout>
      </Route>
      <Route path="/auth" component={AuthPage} />
      {/* Admin: no public footer, standalone layout */}
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
