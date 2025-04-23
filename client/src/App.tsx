import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Market from "@/pages/Market";
import Products from "@/pages/Products";
import Profile from "@/pages/Profile";
import About from "@/pages/About";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useEffect } from "react";
import { handleAuthRedirect } from "./lib/firebase";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/market" component={Market} />
      <Route path="/products" component={Products} />
      <Route path="/profile" component={Profile} />
      <Route path="/about" component={About} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    // Handle Firebase redirect when user is redirected back to app
    handleAuthRedirect();
  }, []);

  return (
    <TooltipProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Router />
        </main>
        <Footer />
      </div>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
