import { useSyncExternalStore } from "react";

function currentRoute() {
  return window.location.hash.slice(1) || "/";
}

function subscribe(cb: () => void) {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
}

export function useHashRoute() {
  const route = useSyncExternalStore(subscribe, currentRoute);
  return { route, navigate: (to: string) => void (window.location.hash = to) };
}
