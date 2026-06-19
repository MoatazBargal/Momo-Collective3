// Stub auth hook — server auth not active in this deployment.
// Replace with a real auth provider (Clerk, Auth0, etc.) in Phase 2.

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(_options?: UseAuthOptions) {
  return {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
    refresh: () => {},
    logout: async () => {},
  };
}
