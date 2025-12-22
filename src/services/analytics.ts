import analytics from '@react-native-firebase/analytics';
import firebase from '@react-native-firebase/app';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * Firebase Analytics Service
 * Wrapper around Firebase Analytics for type-safe event tracking
 */
class AnalyticsService {
  private isInitialized = false;

  /**
   * Initialize Firebase Analytics
   * Call this once when the app starts
   */
  async initialize(): Promise<void> {
    try {
      // Ensure Firebase app is initialized (wait up to 5 seconds if needed)
      let retries = 0;
      while (firebase.apps.length === 0 && retries < 10) {
        console.log(`🔄 Waiting for Firebase app to be ready... (${retries + 1}/10)`);
        await new Promise(resolve => setTimeout(resolve, 500));
        retries++;
      }

      if (firebase.apps.length === 0) {
        console.warn('⚠️ Firebase default app not found after waiting. Analytics might fail.');
      }

      // Enable analytics collection
      await analytics().setAnalyticsCollectionEnabled(true);
      
      // Set default user properties
      await this.setUserProperty('platform', Platform.OS);
      await this.setUserProperty('app_version', Constants.expoConfig?.version || '1.0.0');
      
      this.isInitialized = true;
      console.log('✅ Firebase Analytics initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Firebase Analytics:', error);
    }
  }

  /**
   * Log a custom event
   * @param eventName - Name of the event
   * @param params - Optional parameters for the event
   */
  async logEvent(eventName: string, params?: Record<string, any>): Promise<void> {
    if (!this.isInitialized) {
      console.warn('⚠️ Analytics not initialized. Call initialize() first.');
      return;
    }

    try {
      await analytics().logEvent(eventName, params);
      console.log(`📊 Event logged: ${eventName}`, params);
    } catch (error) {
      console.error(`❌ Failed to log event ${eventName}:`, error);
    }
  }

  /**
   * Log screen view
   * @param screenName - Name of the screen
   * @param screenClass - Optional class name of the screen
   */
  async logScreenView(screenName: string, screenClass?: string): Promise<void> {
    if (!this.isInitialized) {
      console.warn('⚠️ Analytics not initialized. Call initialize() first.');
      return;
    }

    try {
      await analytics().logScreenView({
        screen_name: screenName,
        screen_class: screenClass || screenName,
      });
      console.log(`📱 Screen view logged: ${screenName}`);
    } catch (error) {
      console.error(`❌ Failed to log screen view ${screenName}:`, error);
    }
  }

  /**
   * Set user ID for tracking
   * @param userId - Unique user identifier
   */
  async setUserId(userId: string | null): Promise<void> {
    if (!this.isInitialized) {
      console.warn('⚠️ Analytics not initialized. Call initialize() first.');
      return;
    }

    try {
      await analytics().setUserId(userId);
      console.log(`👤 User ID set: ${userId}`);
    } catch (error) {
      console.error('❌ Failed to set user ID:', error);
    }
  }

  /**
   * Set user property
   * @param name - Property name
   * @param value - Property value
   */
  async setUserProperty(name: string, value: string | null): Promise<void> {
    if (!this.isInitialized) {
      console.warn('⚠️ Analytics not initialized. Call initialize() first.');
      return;
    }

    try {
      await analytics().setUserProperty(name, value);
      console.log(`🏷️ User property set: ${name} = ${value}`);
    } catch (error) {
      console.error(`❌ Failed to set user property ${name}:`, error);
    }
  }

  /**
   * Log login event
   * @param method - Login method (e.g., 'email', 'google', 'facebook')
   */
  async logLogin(method: string): Promise<void> {
    await this.logEvent('login', { method });
  }

  /**
   * Log signup event
   * @param method - Signup method (e.g., 'email', 'google', 'facebook')
   */
  async logSignUp(method: string): Promise<void> {
    await this.logEvent('sign_up', { method });
  }

  /**
   * Log search event
   * @param searchTerm - The search query
   */
  async logSearch(searchTerm: string): Promise<void> {
    await this.logEvent('search', { search_term: searchTerm });
  }

  /**
   * Log share event
   * @param contentType - Type of content being shared
   * @param itemId - ID of the item being shared
   */
  async logShare(contentType: string, itemId: string): Promise<void> {
    await this.logEvent('share', {
      content_type: contentType,
      item_id: itemId,
    });
  }

  /**
   * Log app open event
   */
  async logAppOpen(): Promise<void> {
    await this.logEvent('app_open');
  }

  /**
   * Reset analytics data (useful for logout)
   */
  async resetAnalyticsData(): Promise<void> {
    try {
      await analytics().resetAnalyticsData();
      console.log('🔄 Analytics data reset');
    } catch (error) {
      console.error('❌ Failed to reset analytics data:', error);
    }
  }

  /**
   * Enable/disable analytics collection
   * @param enabled - Whether to enable analytics
   */
  async setAnalyticsCollectionEnabled(enabled: boolean): Promise<void> {
    try {
      await analytics().setAnalyticsCollectionEnabled(enabled);
      console.log(`📊 Analytics collection ${enabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('❌ Failed to set analytics collection:', error);
    }
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService();

// Export default for convenience
export default analyticsService;
