import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { CartProvider } from "@/context/CartContext";
import { ClerkProvider, useUser } from "@clerk/clerk-react";
import { ConvexProvider } from "convex/react";
import { convex } from "@/lib/convex";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { isAuthorizedAdmin } from "@/config/admin";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderTracking from "./pages/OrderTracking";
import Account from "./pages/Account";
import Admin from "./pages/Admin";
import Services from "./pages/Services";
import About from "./pages/About";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import OrderDetail from "./pages/OrderDetail";

const queryClient = new QueryClient();
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_Y29tcGxldGUtZ29sZGZpc2gtNzMuY2xlcmsuYWNjb3VudHMuZGV2JA'; // Using fallback for development

// Protected Route component for admin users
const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoaded } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress;

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!user || !isAuthorizedAdmin(userEmail)) {
    return <Navigate to="/sign-in" replace />;
  }

  return <>{children}</>;
};

// Protected Route component for authenticated users
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  return <>{children}</>;
};

// This component syncs the Clerk user with our Convex database
const UserSync = () => {
  const { user } = useUser();
  const createOrUpdateUserProfile = useMutation(api.users.createOrUpdateUserProfile);

  useEffect(() => {
    if (user) {
      const email = user.primaryEmailAddress?.emailAddress;
      const name = user.fullName || '';

      if (email) {
        createOrUpdateUserProfile({
          userId: user.id,
          email,
          name,
        });
      }
    }
  }, [user, createOrUpdateUserProfile]);

  return null;
};

const ScrollToTop = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return null;
};

const App = () => (
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <ConvexProvider client={convex}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <UserSync />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:productId" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                } />
                <Route path="/order-confirmation" element={
                  <ProtectedRoute>
                    <OrderConfirmation />
                  </ProtectedRoute>
                } />
                <Route path="/order-confirmation/:orderId" element={
                  <ProtectedRoute>
                    <OrderConfirmation />
                  </ProtectedRoute>
                } />
                <Route path="/order-tracking/:orderId" element={
                  <ProtectedRoute>
                    <OrderTracking />
                  </ProtectedRoute>
                } />
                <Route path="/account" element={
                  <ProtectedRoute>
                    <Account />
                  </ProtectedRoute>
                } />
                <Route
                  path="/admin"
                  element={
                    <ProtectedAdminRoute>
                      <Admin />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="/admin/order/:id"
                  element={
                    <ProtectedAdminRoute>
                      <OrderDetail />
                    </ProtectedAdminRoute>
                  }
                />
                <Route path="/services" element={<Services />} />
                <Route path="/about" element={<About />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ConvexProvider>
  </ClerkProvider>
);

export default App;
