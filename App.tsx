import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppView } from './types';
import { Layout } from './components/Layout';
import { Onboarding } from './views/Onboarding';
import { PlanPreview } from './views/PlanPreview';
import { GenerationLoader } from './views/GenerationLoader';
import { Dashboard } from './views/Dashboard';
import { MealsView } from './views/MealsView';
import { WorkoutsView } from './views/WorkoutsView';
import { ShoppingListView } from './views/ShoppingListView';
import { AuthView } from './views/Auth.tsx';
import { ProgressView } from './views/Progress.tsx';
import { LoadingScreen } from './views/LoadingScreen.tsx';
import { ProfileView } from './views/Profile.tsx';
import { SettingsView } from './views/Settings.tsx';
import { ActiveSessionView } from './views/ActiveSessionView.tsx';
import { LandingPage } from './views/LandingPage.tsx';
import { useAuthStore, useAppStore } from './store/useStore';
import { supabase } from './lib/supabaseClient';
import { api } from './services/apiClient';

const queryClient = new QueryClient();

const AppContent: React.FC = () => {
  // Default State: LANDING page is first
  const [view, setView] = useState<AppView>(AppView.LANDING);

  const { plan, setPlan } = useAppStore();
  const { isAuthenticated, user, login, logout, setProfile } = useAuthStore();
  const [isAppLoading, setIsAppLoading] = useState(true);

  // Check Session on Mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          login(session.user);
          api.setToken(session.access_token);

          try {
            // Fetch User Profile & Plan from Backend
            const profileData = await api.getProfile();
            setProfile(profileData);

            if (profileData.plan_json) {
              setPlan(profileData.plan_json);
            }
            // If authenticated, go to Dashboard (unless we want to force Landing first? Usually Auth users go to Dashboard)
            setView(AppView.DASHBOARD);
          } catch (e) {
            console.error("Failed to fetch profile (User might be new or backend down):", e);
            setView(AppView.DASHBOARD);
          }
        }
      } catch (err) {
        console.error("Session check failed:", err);
      } finally {
        setIsAppLoading(false);
      }
    };
    checkSession();
  }, [login, setProfile, setPlan]);

  if (isAppLoading) return <LoadingScreen />;

  // --- Authenticated Layout Views ---
  const mainViews = [AppView.DASHBOARD, AppView.MEALS, AppView.WORKOUTS, AppView.SHOPPING, AppView.SETTINGS, AppView.PROFILE];

  if (isAuthenticated && view === AppView.ACTIVE_SESSION) {
    return <ActiveSessionView plan={plan!} onExit={() => setView(AppView.DASHBOARD)} />;
  }

  if (isAuthenticated && mainViews.includes(view)) {
    return (
      <Layout currentView={view} setView={setView} onLogout={async () => {
        await supabase.auth.signOut();
        logout();
        setView(AppView.LANDING);
      }}>
        {view === AppView.DASHBOARD && <Dashboard plan={plan || {
          summary: '', dailyCalories: 0, macroTarget: { protein: 0, carbs: 0, fats: 0 },
          weeklyMeals: [], weeklyWorkouts: [], shoppingList: []
        }} onStartSession={() => setView(AppView.ACTIVE_SESSION)} />}
        {view === AppView.MEALS && plan && <MealsView plan={plan} />}
        {view === AppView.WORKOUTS && plan && <WorkoutsView plan={plan} onStartSession={() => setView(AppView.ACTIVE_SESSION)} />}
        {view === AppView.SHOPPING && plan && <ShoppingListView plan={plan} />}
        {view === AppView.PROFILE && <ProfileView />}
        {view === AppView.SETTINGS && <SettingsView />}
      </Layout>
    );
  }

  // --- Unauthenticated / Flow Views ---

  // 0. LANDING PAGE (Entry Point)
  if (view === AppView.LANDING) {
    return <LandingPage
      onGetStarted={() => setView(AppView.ONBOARDING)}
      onLogin={() => setView(AppView.LOGIN)}
    />;
  }

  // 1. LOGIN
  if (view === AppView.LOGIN) {
    return <AuthView
      mode="login"
      onSuccess={() => setView(AppView.DASHBOARD)}
      onRegisterClick={() => setView(AppView.ONBOARDING)}
    />;
  }

  // 2. ONBOARDING
  if (view === AppView.ONBOARDING) {
    return <Onboarding
      onComplete={() => setView(AppView.REGISTER)}
      onLoginClick={() => setView(AppView.LOGIN)}
    />;
  }

  // 3. REGISTER
  if (view === AppView.REGISTER) {
    return <AuthView
      mode="register"
      onSuccess={() => setView(AppView.LOADING)}
      onLoginClick={() => setView(AppView.LOGIN)}
    />;
  }

  // 4. LOADING
  if (view === AppView.LOADING) {
    return <GenerationLoader
      onComplete={() => setView(AppView.DASHBOARD)}
      onFail={() => setView(AppView.ONBOARDING)}
    />;
  }

  // Fallback
  return <LoadingScreen />;
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
};

export default App;