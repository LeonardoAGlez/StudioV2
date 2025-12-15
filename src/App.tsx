import React, { useMemo, useCallback, useEffect, useState } from "react";
import {
  PrivateLayout,
  ExploreView,
  ProfileView,
  SettingsView,
} from "./pages/DashboardPage";
import { StudioEditorPage } from "./pages/StudioEditorPage";
import { AuthView } from "./pages/AuthPage";
import { LandingPage } from "./pages/LandingPage";
// Legacy demo kept for reference
// import LegacyApp from './components/temp';

function useQueryView() {
  const params = new URLSearchParams(window.location.search);
  const viewParam = params.get("view");
  const studioParam = params.get("studio");
  if (studioParam === "1") return "studio" as const;
  return viewParam === "profile" || viewParam === "settings"
    ? viewParam
    : "explore";
}

function setQueryView(view: "explore" | "profile" | "settings") {
  const url = new URL(window.location.href);
  url.searchParams.set("view", view);
  window.history.replaceState({}, "", url.toString());
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return !!localStorage.getItem("token");
    } catch {
      return false;
    }
  });

  const [showAuth, setShowAuth] = useState<boolean>(false);

  const [currentView, setCurrentView] = useState<
    "explore" | "profile" | "settings" | "studio"
  >(useQueryView());

  useEffect(() => {
    const onChange = () => setCurrentView(useQueryView());
    window.addEventListener("popstate", onChange);
    window.addEventListener("pushstate", onChange as any);
    window.addEventListener("replacestate", onChange as any);
    return () => {
      window.removeEventListener("popstate", onChange);
      window.removeEventListener("pushstate", onChange as any);
      window.removeEventListener("replacestate", onChange as any);
    };
  }, []);

  const handleViewChange = useCallback((v: string) => {
    const next = v === "profile" || v === "settings" ? v : "explore";
    setQueryView(next);
    setCurrentView(next);
  }, []);

  const content = useMemo(() => {
    switch (currentView) {
      case "profile":
        return <ProfileView />;
      case "settings":
        return <SettingsView />;
      case "studio":
        return <StudioEditorPage />;
      case "explore":
      default:
        return <ExploreView />;
    }
  }, [currentView]);

  const handleLogout = useCallback(() => {
    try {
      localStorage.removeItem("token");
    } catch {}
    setIsAuthenticated(false);
    setQueryView("explore");
  }, []);

  const handleLoginSuccess = useCallback(() => {
    setIsAuthenticated(true);
    setShowAuth(false);
    setCurrentView("explore");
  }, []);

  const handleShowAuth = useCallback(() => {
    setShowAuth(true);
  }, []);

  // Show auth modal if requested
  if (!isAuthenticated) {
    return (
      <>
        <LandingPage onLoginClick={handleShowAuth} />
        {showAuth && (
          <AuthView
            onLoginSuccess={handleLoginSuccess}
            onBack={() => setShowAuth(false)}
          />
        )}
      </>
    );
  }

  return (
    <PrivateLayout
      onViewChange={handleViewChange}
      currentView={currentView}
      onLogout={handleLogout}
    >
      {content}
    </PrivateLayout>
  );
}
