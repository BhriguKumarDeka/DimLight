import { BrowserRouter, Routes, Route, Outlet, useLocation } from "react-router-dom"; // Added useLocation
import { ReactLenis } from 'lenis/react';
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";
import { AnimatePresence, motion } from "motion/react"; // Added motion


// Pages imports...
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Signup from "./pages/auth/Signup";
import Dashboard from "./pages/Dashboard";
import Diary from "./pages/Diary";
import JournalHistory from "./pages/JournalHistory";
import Insights from "./pages/Insights";
import Techniques from "./pages/Techniques";
import TechniqueDetail from "./pages/TechniqueDetail";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

// Wrapper for Page Animation
const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

// Inner Component to handle Location Logic
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public */}
        <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
        <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
        <Route path="/reset-password/:token" element={<PageTransition><ResetPassword /></PageTransition>} />

        {/* Protected */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Outlet />
              </DashboardLayout>
            </ProtectedRoute>
          }
        >
          {/* PageTransition */}
          <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
          <Route path="/diary" element={<PageTransition><Diary /></PageTransition>} />
          <Route path="/gallery" element={<PageTransition><JournalHistory /></PageTransition>} />
          <Route path="/insights" element={<PageTransition><Insights /></PageTransition>} />
          <Route path="/techniques" element={<PageTransition><Techniques /></PageTransition>} />
          <Route path="/techniques/:id" element={<PageTransition><TechniqueDetail /></PageTransition>} />
          <Route path="/settings" element={<PageTransition><Settings /></PageTransition>} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <ReactLenis root>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </ReactLenis>
  );
}