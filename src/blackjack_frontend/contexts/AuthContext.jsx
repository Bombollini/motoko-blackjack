import { createContext, useContext, useState, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { createActor } from '../utils/actor';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authClient, setAuthClient] = useState(null);
  const [identity, setIdentity] = useState(null);
  const [principal, setPrincipal] = useState(null);
  const [actor, setActor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    try {
      const client = await AuthClient.create();
      setAuthClient(client);

      const isAuthenticated = await client.isAuthenticated();
      setIsAuthenticated(isAuthenticated);

      if (isAuthenticated) {
        const identity = client.getIdentity();
        setIdentity(identity);
        setPrincipal(identity.getPrincipal());
        
        // Create actor with authenticated identity
        const canisterId = process.env.CANISTER_ID_BLACKJACK_BACKEND;
        console.log('Creating actor with canister ID:', canisterId);
        
        const actor = createActor(canisterId, {
          agentOptions: {
            identity,
            host: process.env.DFX_NETWORK === 'local' ? 'http://localhost:4943' : 'https://ic0.app',
          },
        });
        setActor(actor);
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async () => {
    if (!authClient) return;

    try {
      setIsLoading(true);
      
      // Use Promise wrapper for better error handling
      await new Promise((resolve, reject) => {
        authClient.login({
          identityProvider: process.env.II_URL || (process.env.DFX_NETWORK === 'local' 
            ? `http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943/`
            : 'https://identity.ic0.app'),
          onSuccess: async () => {
            try {
              await initAuth();
              resolve();
            } catch (error) {
              reject(error);
            }
          },
          onError: (error) => {
            console.error('Login error:', error);
            reject(error);
          },
          // Remove windowOpenerFeatures to use default behavior
        });
      });
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (!authClient) return;

    try {
      await authClient.logout();
      setIsAuthenticated(false);
      setIdentity(null);
      setPrincipal(null);
      setActor(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const value = {
    isAuthenticated,
    isLoading,
    identity,
    principal,
    actor,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
