import { getCurrentUser, signOut, fetchAuthSession, fetchUserAttributes } from '@aws-amplify/auth';

export const authService = {
    async getCurrentUser() {

        try {
            const currentUser = getCurrentUser()
            
            const userAttributes = await fetchUserAttributes();
            console.log("userAttributes: ", userAttributes);
            if (userAttributes) {
                const name = userAttributes.name; // Or userAttributes.given_name, userAttributes.family_name
                console.log("User's name:", name);
                currentUser["userAttributes"] = userAttributes
                return currentUser
            }
            return await currentUser;
        } catch (error) {
            console.error('Error getting current user:', error);
            return null;
        }
    },

    async getAttributes() {
        try {
            return await fetchUserAttributes();
        } catch (error) {
            console.error('Error getting current user attributes:', error);
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