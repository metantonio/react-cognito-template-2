import { BrowserRouter, useLocation, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { UserProvider } from "@/contexts/UserContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "./pages/auth/login";
import Index from "./pages/Index";
import CasinoList from "./pages/casinos/CasinoList";
import CasinoDetails from "./pages/casinos/CasinoDetails";
import CreateCasino from "./pages/casinos/CreateCasino";
import ViewCasino from "./pages/casinos/ViewCasino";
import Users from "./pages/users/Users";
import Analytics from "./pages/analytics/Analytics";
import Settings from "./pages/settings/Settings";
import NotFound from "./pages/NotFound";
import { AuthProvider } from './contexts/AuthContext';
import { Amplify } from 'aws-amplify';
import { ResourcesConfig } from 'aws-amplify/utils';
import Signup from "./pages/auth/signup";

// Layouts
import AuthLayout from "./components/LoginLayout";
import DashboardLayout from "./components/MainLayout";
import CasinoSections from "./pages/casinos/CasinoSections";

const queryClient = new QueryClient();

const REACT_APP_COGNITO_USER_POOL_ID = import.meta.env.VITE_APP_COGNITO_USER_POOL_ID
const REACT_APP_COGNITO_CLIENT_ID = import.meta.env.VITE_APP_COGNITO_CLIENT_ID
const REACT_APP_COGNITO_DOMAIN = import.meta.env.VITE_APP_COGNITO_DOMAIN


const AppContent = () => {
  const location = useLocation();
  const isAuthRoute = location.pathname === "/adminpanel/login";

  const Layout = isAuthRoute ? AuthLayout : DashboardLayout;
  const amplifyConfig: ResourcesConfig = {
    Auth: {
      Cognito: {
        userPoolId: REACT_APP_COGNITO_USER_POOL_ID || '',
        userPoolClientId: REACT_APP_COGNITO_CLIENT_ID || '',
        loginWith: {
          oauth: {
            domain: REACT_APP_COGNITO_DOMAIN || '',
            scopes: ['email', 'profile', 'openid'],
            redirectSignIn: [window.location.origin + '/login', 'http://localhost:3000/adminpanel/login'],
            redirectSignOut: [window.location.origin + '/login', 'http://localhost:3000/adminpanel/login'],
            responseType: 'code',
          },
        },
      },
    },
  };

  Amplify.configure(amplifyConfig);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/adminpanel/login" replace />} />
        <Route path="/adminpanel/login" element={<Login />} />
        <Route path="/adminpanel" element={
          <ProtectedRoute permission="view_all">
            <Index />
          </ProtectedRoute>} />
        <Route path="/adminpanel/casinos" element={
          <ProtectedRoute permission="view_all">
            <CasinoList />
          </ProtectedRoute>
        } />
        <Route path="/adminpanel/casinos/create" element={
          <ProtectedRoute permission="view_all">
            <CreateCasino />
          </ProtectedRoute>
        } />
        <Route path="/adminpanel/casinos/:casinoId" element={
          <ProtectedRoute permission="view_all">
            <CasinoDetails />
          </ProtectedRoute>} />
        <Route path="/adminpanel/casinos/:casinoId/view" element={
          <ProtectedRoute permission="view_all">
            <ViewCasino />
          </ProtectedRoute>} />
        <Route
          path="/adminpanel/users"
          element={
            <ProtectedRoute permission="add_edit_delete_users">
              <Users />
            </ProtectedRoute>
          }
        />
        <Route path="/adminpanel/analytics" element={
          <ProtectedRoute permission="view_all">
            <Analytics />
          </ProtectedRoute>} />
        <Route path="/adminpanel/settings" element={
          <ProtectedRoute permission="edit_profile">
            <Settings />
          </ProtectedRoute>

        } />
        <Route path="/adminpanel/login/signup" element={<Signup />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SidebarProvider>
            <AppContent />
          </SidebarProvider>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
