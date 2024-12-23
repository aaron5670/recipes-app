import type { User } from '@supabase/auth-js';
import { useContext, createContext, type PropsWithChildren } from 'react';
import { Alert } from 'react-native';

import { useStorageState } from '~/hooks/useStorageState';
import { supabase } from '~/utils/supabase';

export type AuthError = {
  error: string;
};

const AuthContext = createContext<{
  signIn: (email: string, password: string) => Promise<User | AuthError>;
  signUp: (fullName: string, email: string, password: string) => Promise<User | AuthError>;
  signOut: () => void;
  session?: User | null;
  isLoading: boolean;
}>({
  signIn: () => Promise.resolve({ error: 'Context not implemented.' }),
  signUp: () => Promise.resolve({ error: 'Context not implemented.' }),
  signOut: () => {},
  session: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session');

  return (
    <AuthContext.Provider
      value={{
        signIn: async (email, password) => {
          const {
            error,
            data: { user },
          } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            Alert.alert(error.message);
            return {
              error: error.message,
            };
          }
          if (!user || !user.email) {
            Alert.alert('Error', 'User not found');
            return {
              error: 'User not found',
            };
          }

          setSession(user);
          return user;
        },
        signUp: async (fullName, email, password) => {
          const {
            data: { user },
            error,
          } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
              },
            },
          });

          if (error) {
            Alert.alert('Sign Up Error', error.message);
            return {
              error: error.message,
            };
          }

          if (user && user.email) {
            setSession(user);
            return user;
          }

          return {
            error: 'Something went wrong',
          };
        },
        signOut: () => {
          setSession(null);
        },
        session,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
