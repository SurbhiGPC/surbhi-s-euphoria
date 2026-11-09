import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("matches a page for all portfolio routes instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const routes = ["/", "/about", "/work", "/budget", "/contact"];

    for (const route of routes) {
      const matches = router.matchRoutes(route);
      expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
    }
  });
});
