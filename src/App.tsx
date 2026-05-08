import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Router, Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import { lazy, Suspense } from "react";
import RouteLoader from "@/components/RouteLoader";

const Home = lazy(() => import("@/pages/Home"));
const Games = lazy(() => import("@/pages/Games"));
const GameDetail = lazy(() => import("@/pages/GameDetail"));
const Leaderboard = lazy(() => import("@/pages/Leaderboard"));
const Profile = lazy(() => import("@/pages/Profile"));
const Login = lazy(() => import("@/pages/Login"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const Settings = lazy(() => import("@/pages/Settings"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const page = {
  initial: { opacity: 0, y: 10, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -10, filter: "blur(6px)" },
};

function PageWrap({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={page}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <Suspense fallback={<RouteLoader />}>
        {children}
      </Suspense>
    </motion.div>
  );
}

function Routes() {
  const [location] = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Switch key={location}>
        <Route path="/">
          <PageWrap>
            <Home />
          </PageWrap>
        </Route>

        <Route path="/games">
          <PageWrap>
            <Games />
          </PageWrap>
        </Route>

        <Route path="/games/:id">
          {(params) => (
            <PageWrap>
              <GameDetail id={(params as any).id} />
            </PageWrap>
          )}
        </Route>

        <Route path="/leaderboard">
          <PageWrap>
            <Leaderboard />
          </PageWrap>
        </Route>

        <Route path="/profile">
          <PageWrap>
            <Profile />
          </PageWrap>
        </Route>

        <Route path="/login">
          <PageWrap>
            <Login />
          </PageWrap>
        </Route>

        <Route path="/dashboard">
          <PageWrap>
            <Dashboard />
          </PageWrap>
        </Route>

        <Route path="/about">
          <PageWrap>
            <About />
          </PageWrap>
        </Route>

        <Route path="/contact">
          <PageWrap>
            <Contact />
          </PageWrap>
        </Route>

        <Route path="/settings">
          <PageWrap>
            <Settings />
          </PageWrap>
        </Route>

        <Route>
          <PageWrap>
            <NotFound />
          </PageWrap>
        </Route>
      </Switch>
    </AnimatePresence>
  );
}

function AppRouter() {
  return (
    <Router>
      <Routes />
    </Router>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" switchable>
        <AuthProvider>
          <TooltipProvider>
            <Toaster richColors />
            <AppRouter />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
