import { useEffect, useRef } from 'react';
import { useNavigationContainerRef } from '@react-navigation/native';
import { analyticsService } from '../services/analytics';

/**
 * Navigation Analytics Tracker
 * Automatically tracks screen views when navigation changes
 */
export const useNavigationAnalytics = () => {
  const navigationRef = useNavigationContainerRef();
  const routeNameRef = useRef<string>();

  useEffect(() => {
    const state = navigationRef.current?.getRootState();
    
    if (state) {
      // Get the current route name
      const currentRouteName = getCurrentRouteName(state);
      
      // Save the current route name for later comparison
      routeNameRef.current = currentRouteName;
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigationRef.current?.addListener('state', () => {
      const previousRouteName = routeNameRef.current;
      const state = navigationRef.current?.getRootState();
      
      if (state) {
        const currentRouteName = getCurrentRouteName(state);

        if (previousRouteName !== currentRouteName) {
          // Track the screen view
          analyticsService.logScreenView(currentRouteName);
        }

        // Save the current route name for next comparison
        routeNameRef.current = currentRouteName;
      }
    });

    return unsubscribe;
  }, [navigationRef]);

  return navigationRef;
};

/**
 * Get the current route name from navigation state
 */
const getCurrentRouteName = (state: any): string => {
  if (!state || typeof state.index !== 'number') {
    return 'Unknown';
  }

  const route = state.routes[state.index];

  // If the route has nested state, recursively get the current route name
  if (route.state) {
    return getCurrentRouteName(route.state);
  }

  return route.name;
};
