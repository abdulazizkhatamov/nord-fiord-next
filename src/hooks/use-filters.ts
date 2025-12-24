"use client";

import { cleanEmptyParams } from "@/util/params";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useMemo, useCallback } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useFilters<T extends Record<string, any>>() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // memoize filters so it doesn't trigger rerenders
  const filters = useMemo(() => {
    return Object.fromEntries(searchParams.entries()) as T;
  }, [searchParams]);

  const setFilters = useCallback(
    (partial: Partial<T>) => {
      const mergedFilters = cleanEmptyParams({ ...filters, ...partial });

      const params = new URLSearchParams();
      Object.entries(mergedFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.set(key, String(value));
        }
      });

      const newUrl = params.toString()
        ? `${pathname}?${params.toString()}`
        : pathname;

      // only replace if URL really changed
      if (newUrl !== window.location.pathname + window.location.search) {
        router.replace(newUrl);
      }
    },
    [filters, pathname, router]
  );

  const resetFilters = useCallback(() => {
    router.replace(pathname);
  }, [pathname, router]);

  return { filters, setFilters, resetFilters };
}
