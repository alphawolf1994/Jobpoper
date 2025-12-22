import { useCallback } from 'react';
import { analyticsService } from '../services/analytics';
import { ANALYTICS_EVENTS } from '../utils/analyticsEvents';

/**
 * Custom hook for Firebase Analytics
 * Provides easy access to analytics methods in React components
 */
export const useAnalytics = () => {
  /**
   * Log a custom event
   */
  const logEvent = useCallback(
    async (eventName: string, params?: Record<string, any>) => {
      await analyticsService.logEvent(eventName, params);
    },
    []
  );

  /**
   * Log screen view
   */
  const logScreenView = useCallback(
    async (screenName: string, screenClass?: string) => {
      await analyticsService.logScreenView(screenName, screenClass);
    },
    []
  );

  /**
   * Set user ID
   */
  const setUserId = useCallback(async (userId: string | null) => {
    await analyticsService.setUserId(userId);
  }, []);

  /**
   * Set user property
   */
  const setUserProperty = useCallback(
    async (name: string, value: string | null) => {
      await analyticsService.setUserProperty(name, value);
    },
    []
  );

  /**
   * Log login
   */
  const logLogin = useCallback(async (method: string = 'email') => {
    await analyticsService.logLogin(method);
  }, []);

  /**
   * Log signup
   */
  const logSignUp = useCallback(async (method: string = 'email') => {
    await analyticsService.logSignUp(method);
  }, []);

  /**
   * Log search
   */
  const logSearch = useCallback(async (searchTerm: string) => {
    await analyticsService.logSearch(searchTerm);
  }, []);

  /**
   * Log share
   */
  const logShare = useCallback(
    async (contentType: string, itemId: string) => {
      await analyticsService.logShare(contentType, itemId);
    },
    []
  );

  /**
   * Log job view
   */
  const logJobView = useCallback(async (jobId: string, jobTitle?: string) => {
    await analyticsService.logEvent(ANALYTICS_EVENTS.JOB_VIEW, {
      job_id: jobId,
      job_title: jobTitle,
    });
  }, []);

  /**
   * Log job application
   */
  const logJobApply = useCallback(async (jobId: string, jobTitle?: string) => {
    await analyticsService.logEvent(ANALYTICS_EVENTS.JOB_APPLY, {
      job_id: jobId,
      job_title: jobTitle,
    });
  }, []);

  /**
   * Log location permission
   */
  const logLocationPermission = useCallback(async (granted: boolean) => {
    const eventName = granted
      ? ANALYTICS_EVENTS.LOCATION_ENABLED
      : ANALYTICS_EVENTS.LOCATION_DENIED;
    await analyticsService.logEvent(eventName);
  }, []);

  return {
    logEvent,
    logScreenView,
    setUserId,
    setUserProperty,
    logLogin,
    logSignUp,
    logSearch,
    logShare,
    logJobView,
    logJobApply,
    logLocationPermission,
  };
};

export default useAnalytics;
