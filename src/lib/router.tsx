import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type ReactNode,
} from "react";

export type RouteMeta = {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
};

export type RouteDefinition = {
  path: string;
  element: ReactNode;
  meta?: RouteMeta;
};

type RouterContextValue = {
  path: string;
  params: Record<string, string>;
  navigate: (to: string, options?: { replace?: boolean }) => void;
};

const RouterContext = createContext<RouterContextValue | null>(null);

export function normalizePath(path: string) {
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path || "/";
}

export type RouteMatch = {
  route: RouteDefinition;
  params: Record<string, string>;
};

export function matchRoute(path: string, routes: RouteDefinition[]): RouteMatch | null {
  const normalized = normalizePath(path);

  for (const route of routes) {
    const pattern = normalizePath(route.path);

    if (!pattern.includes(":")) {
      if (pattern === normalized) return { route, params: {} };
      continue;
    }

    const patternParts = pattern.split("/").filter(Boolean);
    const pathParts = normalized.split("/").filter(Boolean);
    if (patternParts.length !== pathParts.length) continue;

    const params: Record<string, string> = {};
    let matched = true;
    for (let i = 0; i < patternParts.length; i++) {
      const part = patternParts[i]!;
      const value = pathParts[i]!;
      if (part.startsWith(":")) {
        params[part.slice(1)] = decodeURIComponent(value);
      } else if (part !== value) {
        matched = false;
        break;
      }
    }

    if (matched) return { route, params };
  }

  return null;
}

function getCurrentPath() {
  return normalizePath(window.location.pathname);
}

function setMeta(attribute: "name" | "property", key: string, content: string) {
  const existing = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (existing) {
    existing.setAttribute("content", content);
    return;
  }
  const element = document.createElement("meta");
  element.setAttribute(attribute, key);
  element.setAttribute("content", content);
  document.head.appendChild(element);
}

export function usePath() {
  const context = useContext(RouterContext);
  if (!context) throw new Error("usePath must be used within <Router />");
  return context.path;
}

export function useParams<T extends Record<string, string> = Record<string, string>>() {
  const context = useContext(RouterContext);
  if (!context) throw new Error("useParams must be used within <Router />");
  return context.params as T;
}

export function useRoute() {
  const context = useContext(RouterContext);
  if (!context) throw new Error("useRoute must be used within <Router />");
  return context;
}

export function useNavigate() {
  const context = useContext(RouterContext);
  if (!context) throw new Error("useNavigate must be used within <Router />");
  return context.navigate;
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string };

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { to, onClick, children, ...anchorProps },
  ref,
) {
  const navigate = useNavigate();

  return (
    <a
      href={to}
      ref={ref}
      {...anchorProps}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        if (to.startsWith("http://") || to.startsWith("https://") || to.startsWith("mailto:"))
          return;
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
          return;
        if (event.currentTarget.target === "_blank") return;
        event.preventDefault();
        navigate(to);
      }}
    >
      {children}
    </a>
  );
});

export function Router({ routes, children }: { routes: RouteDefinition[]; children?: ReactNode }) {
  const [path, setPath] = useState(getCurrentPath);
  const currentPathRef = useRef(path);
  const scrollPositions = useRef<Record<string, number>>({});
  currentPathRef.current = path;

  const scrollToStoredPosition = useCallback((target: string) => {
    const top = scrollPositions.current[target] ?? 0;
    requestAnimationFrame(() => {
      window.scrollTo({ top, left: 0, behavior: "auto" });
    });
  }, []);

  const navigate = useCallback(
    (to: string, options: { replace?: boolean } = {}) => {
      const target = normalizePath(to);
      const current = currentPathRef.current;

      if (target === current) {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        return;
      }

      scrollPositions.current[current] = window.scrollY;

      if (options.replace) {
        window.history.replaceState(null, "", target);
      } else {
        window.history.pushState(null, "", target);
      }

      setPath(target);
      scrollToStoredPosition(target);
    },
    [scrollToStoredPosition],
  );

  useEffect(() => {
    const handlePopState = () => {
      const target = getCurrentPath();
      setPath(target);
      scrollToStoredPosition(target);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [scrollToStoredPosition]);

  useEffect(() => {
    const match = matchRoute(path, routes);
    const meta = match?.route.meta;

    if (!meta) {
      document.title = "Page not found — AgentGrid";
      return;
    }

    document.title = meta.title;
    setMeta("name", "description", meta.description);
    if (meta.ogTitle) setMeta("property", "og:title", meta.ogTitle);
    if (meta.ogDescription) setMeta("property", "og:description", meta.ogDescription);
  }, [path, routes]);

  const params = useMemo(() => matchRoute(path, routes)?.params ?? {}, [path, routes]);
  const value = useMemo(() => ({ path, params, navigate }), [path, params, navigate]);

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}
