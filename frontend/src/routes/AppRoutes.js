// frontend/src/routes/AppRoutes.js
import React, { Suspense, lazy } from "react";
import { Navigate, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import PageTransition from "../layout/PageTransition";
import AdminLayout from "../layout/AdminLayout";
import ProtectedRoute from "../components/common/ProtectedRoute";
import { useDarkMode } from "../context/DarkModeContext";

// Admin (lazy for better initial bundle size)
const AdminLogin = lazy(() => import("../pages/admin/Login"));
const Dashboard = lazy(() => import("../pages/admin/Dashboard"));
const Posts = lazy(() => import("../pages/admin/Posts"));
const ServicesAdmin = lazy(() => import("../pages/admin/Services"));
const GalleryAdmin = lazy(() => import("../pages/admin/Gallery"));
const Inbox = lazy(() => import("../pages/admin/Inbox"));
const HomePageAdmin = lazy(() => import("../pages/admin/HomePage"));
const AboutAdmin = lazy(() => import("../pages/admin/About"));
const ResumeAdmin = lazy(() => import("../pages/admin/Resume"));
const SocialLinksAdmin = lazy(() => import("../pages/admin/SocialLinks"));

// Lazy public pages
const TemplatePage = lazy(() => import("../pages/public/TemplatePage"));

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function LoadingScreen() {
  const { isDark } = useDarkMode();
  return (
    <div className={cx("min-h-[60vh] grid place-items-center", isDark ? "text-white/60" : "text-black/60")}>
      Loading...
    </div>
  );
}

export default function AppRoutes() {
  const location = useLocation();

  const withTransition = (element) => (
    <PageTransition>
      <Suspense fallback={<LoadingScreen />}>{element}</Suspense>
    </PageTransition>
  );
  const withAdminLayout = (element) => (
    <Suspense fallback={<LoadingScreen />}>
      <AdminLayout>{element}</AdminLayout>
    </Suspense>
  );

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public */}
        <Route path="/" element={withTransition(<TemplatePage page="home" />)} />
        <Route path="/about" element={withTransition(<TemplatePage page="about" />)} />
        <Route path="/resume" element={withTransition(<TemplatePage page="resume" />)} />
        <Route path="/service" element={withTransition(<TemplatePage page="service" />)} />
        <Route path="/service/:slug" element={withTransition(<TemplatePage page="serviceDetails" />)} />
        <Route path="/project" element={withTransition(<TemplatePage page="project" />)} />
        <Route path="/project/:slug" element={withTransition(<TemplatePage page="projectDetails" />)} />
        <Route path="/portfolio" element={<Navigate to="/project" replace />} />
        <Route path="/blog" element={withTransition(<TemplatePage page="blog" />)} />
        <Route path="/blog/:slug" element={withTransition(<TemplatePage page="blog" />)} />
        <Route path="/contact" element={withTransition(<TemplatePage page="contact" />)} />
        <Route path="/certifications" element={withTransition(<TemplatePage page="certifications" />)} />
        <Route path="/certifications/:slug" element={withTransition(<TemplatePage page="certifications" />)} />

        {/* Admin */}
        <Route
          path="/admin/login"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <AdminLogin />
            </Suspense>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              {withAdminLayout(<Dashboard />)}
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/posts"
          element={
            <ProtectedRoute>
              {withAdminLayout(<Posts />)}
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/services"
          element={
            <ProtectedRoute>
              {withAdminLayout(<ServicesAdmin />)}
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/gallery"
          element={
            <ProtectedRoute>
              {withAdminLayout(<GalleryAdmin />)}
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/inbox"
          element={
            <ProtectedRoute>
              {withAdminLayout(<Inbox />)}
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/homepage"
          element={
            <ProtectedRoute>
              {withAdminLayout(<HomePageAdmin />)}
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/about"
          element={
            <ProtectedRoute>
              {withAdminLayout(<AboutAdmin />)}
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/resume"
          element={
            <ProtectedRoute>
              {withAdminLayout(<ResumeAdmin />)}
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/social-links"
          element={
            <ProtectedRoute>
              {withAdminLayout(<SocialLinksAdmin />)}
            </ProtectedRoute>
          }
        />
        {/* Fallback */}
        <Route path="*" element={withTransition(<ErrorPage />)} />
      </Routes>
    </AnimatePresence>
  );
}

function ErrorPage() {
  const { isDark } = useDarkMode();
  return (
    <div className={cx("min-h-[60vh] grid place-items-center", isDark ? "text-white/60" : "text-black/60")}>
      Page not found
    </div>
  );
}
