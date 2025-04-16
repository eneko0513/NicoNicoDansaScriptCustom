import { useEffect, useState } from "react";

export const useLocation = () => {
  const [location, setLocation] = useState<RouterState["location"]>(
    window.__reactRouterDataRouter.state.location,
  );
  useEffect(() => {
    const unsubscribe = window.__reactRouterDataRouter.subscribe((state) => {
      setLocation(state.location);
    });
    return () => {
      unsubscribe();
    };
  }, []);
  return location;
};
