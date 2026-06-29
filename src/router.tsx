import { createRouter, createRootRoute, createRoute, Outlet } from "@tanstack/react-router";
import { useTheme } from "./components/themeToggle/useTheme.ts";
import App from "./App.tsx";

const rootRoute = createRootRoute({
  component: () => {
    useTheme();
    return <Outlet />;
  },
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <App />,
});

const routeTree = rootRoute.addChildren([indexRoute]);

export const router = createRouter({
  routeTree,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
