import { Component, type ReactNode } from "react";
import { matchRoute, Link, Router, usePath, type RouteDefinition } from "@/lib/router";
import AgentsPage from "@/pages/AgentsPage";
import ActivityDetailPage from "@/pages/ActivityDetailPage";
import ActivityPage from "@/pages/ActivityPage";
import AuthPage from "@/pages/AuthPage";
import DashboardPage from "@/pages/DashboardPage";
import HireDetailPage from "@/pages/HireDetailPage";
import MyHiresPage from "@/pages/MyHiresPage";
import TransactionDetailPage from "@/pages/TransactionDetailPage";
import TransactionsPage from "@/pages/TransactionsPage";
import LandingPage from "@/pages/LandingPage";
import MyAgentsPage from "@/pages/MyAgentsPage";
import AskGridPage from "@/pages/AskGridPage";

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
    path: "/my-agents",
    element: <MyAgentsPage />,
    meta: {
      title: "My Agents — AgentGrid",
      description: "Manage your owned agents, marketplace presence, performance, and earnings.",
      ogTitle: "My Agents — AgentGrid",
      ogDescription: "Manage your owned agents, marketplace presence, performance, and earnings.",
    },
  },
  {
    path: "/ask-grid",
    element: <AskGridPage />,
    meta: {
      title: "Ask Grid — AgentGrid",
      description:
        "Describe what you need and let Grid find, compare, and prepare the right agent hire.",
      ogTitle: "Ask Grid — AgentGrid",
      ogDescription:
        "Describe what you need and let Grid find, compare, and prepare the right agent hire.",
    },
  },
  {
    path: "/my-agents/:agentId",
    element: <MyAgentsPage />,
    meta: {
      title: "Agent management — AgentGrid",
      description: "Manage agent performance, reputation, earnings, and marketplace controls.",
      ogTitle: "Agent management — AgentGrid",
      ogDescription: "Manage agent performance, reputation, earnings, and marketplace controls.",
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
  {
    path: "/dashboard",
    element: <DashboardPage />,
    meta: {
      title: "Dashboard — AgentGrid",
      description: "Monitor your agents, runs, and spend in one place.",
      ogTitle: "Dashboard — AgentGrid",
      ogDescription: "Monitor your agents, runs, and spend in one place.",
    },
  },
  {
    path: "/hires",
    element: <MyHiresPage />,
    meta: {
      title: "My Hires — AgentGrid",
      description: "Track and manage every agent you've hired.",
      ogTitle: "My Hires — AgentGrid",
      ogDescription: "Track and manage every agent you've hired.",
    },
  },
  {
    path: "/hires/:hireId",
    element: <HireDetailPage />,
    meta: {
      title: "Hire details — AgentGrid",
      description: "Review agent execution, results, and transaction details.",
      ogTitle: "Hire details — AgentGrid",
      ogDescription: "Review agent execution, results, and transaction details.",
    },
  },
  {
    path: "/activity",
    element: <ActivityPage />,
    meta: {
      title: "Activity — AgentGrid",
      description: "Everything happening across your AgentGrid account.",
      ogTitle: "Activity — AgentGrid",
      ogDescription: "Everything happening across your AgentGrid account.",
    },
  },
  {
    path: "/activity/:activityId",
    element: <ActivityDetailPage />,
    meta: {
      title: "Activity details — AgentGrid",
      description: "Review the details of an AgentGrid account event.",
      ogTitle: "Activity details — AgentGrid",
      ogDescription: "Review the details of an AgentGrid account event.",
    },
  },
  {
    path: "/transactions",
    element: <TransactionsPage />,
    meta: {
      title: "Transactions — AgentGrid",
      description: "Track payments, blockchain transactions, and on-chain activity.",
      ogTitle: "Transactions — AgentGrid",
      ogDescription: "Track payments, blockchain transactions, and on-chain activity.",
    },
  },
  {
    path: "/transactions/:transactionId",
    element: <TransactionDetailPage />,
    meta: {
      title: "Transaction details — AgentGrid",
      description: "Review an AgentGrid payment and its on-chain details.",
      ogTitle: "Transaction details — AgentGrid",
      ogDescription: "Review an AgentGrid payment and its on-chain details.",
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
  const match = matchRoute(path, routes);

  if (!match) {
    return <NotFoundComponent />;
  }

  return <RouteErrorBoundary key={path}>{match.route.element}</RouteErrorBoundary>;
}

export default function App() {
  return (
    <Router routes={routes}>
      <RouterContent />
    </Router>
  );
}
