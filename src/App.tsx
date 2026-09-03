import { Component, type ReactNode } from "react";
import { Link, normalizePath, Router, usePath, type RouteDefinition } from "@/lib/router";
import AgentsPage from "@/pages/AgentsPage";
import AuthPage from "@/pages/AuthPage";
import LandingPage from "@/pages/LandingPage";

const routes: RouteDefinition[] = [
  {
    path: "/",
    element: <LandingPage />,
    meta: {
      title: "AgentGrid — Hire autonomous AI agents on BNB Chain",
      description:
        "Discover, hire, and orchestrate autonomous AI agents on BNB Chain with on-chain reputation and pay-per-run billing.",
      ogTitle: "AgentGrid — Hire autonomous AI agents on BNB Chain",
      ogDescription:
        "Discover, hire, and orchestrate autonomous AI agents on BNB Chain with on-chain reputation and pay-per-run billing.",
    },
  },
  {
    path: "/agents",
    element: <AgentsPage />,
    meta: {
      title: "Agent catalog — AgentGrid marketplace",
      description:
        "Browse trading, DeFi, research, and security AI agents with live status, reputation, and pay-per-run pricing.",
      ogTitle: "Agent catalog — AgentGrid marketplace",
      ogDescription:
        "Browse trading, DeFi, research, and security AI agents with live status, reputation, and pay-per-run pricing.",
    },
  },
  {
    path: "/auth",
    element: <AuthPage />,
    meta: {
      title: "Sign up or log in — AgentGrid",
      description:
        "Create your AgentGrid account with email, Google, GitHub, or a BNB Chain wallet.",
      ogTitle: "Sign up or log in — AgentGrid",
      ogDescription:
        "Create your AgentGrid account with email, Google, GitHub, or a BNB Chain wallet.",
    },
  },
];

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-[2px] bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-[2px] border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

type RouteErrorBoundaryState = { error: Error | null };

class RouteErrorBoundary extends Component<{ children: ReactNode }, RouteErrorBoundaryState> {
  override state: RouteErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): RouteErrorBoundaryState {
    return { error };
  }

  override componentDidCatch(error: Error) {
    console.error(error);
  }

  handleReset = () => {
    this.setState({ error: null });
  };

  override render() {
    const { error } = this.state;
    if (error) {
      return <ErrorComponent error={error} reset={this.handleReset} />;
    }
    return this.props.children;
  }
}

function RouterContent() {
  const path = usePath();
  const route = routes.find((item) => normalizePath(item.path) === path);

  if (!route) {
    return <NotFoundComponent />;
  }

  return <RouteErrorBoundary key={path}>{route.element}</RouteErrorBoundary>;
}

export default function App() {
  return (
    <Router routes={routes}>
      <RouterContent />
    </Router>
  );
}
