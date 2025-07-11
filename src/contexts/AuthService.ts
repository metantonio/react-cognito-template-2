import { getCurrentUser, signOut, fetchAuthSession } from '@aws-amplify/auth';

export const authService = {
  async getCurrentUser() {
    try {
      return await getCurrentUser();
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  async getSession() {
    try {
      return await fetchAuthSession();
    } catch (error) {
      console.error('Error fetching session:', error);
      return null;
    }
  },

  async signOut() {
    try {
      await signOut();
      return true;
    } catch (error) {
      console.error('Error signing out:', error);
      return false;
    }
  },

  async refreshSession() {
    try {
      const session = await fetchAuthSession({ forceRefresh: true });
      return session.tokens?.idToken?.toString() || null;
    } catch (error) {
      console.error('Error refreshing session:', error);
      return null;
    }
  }
};