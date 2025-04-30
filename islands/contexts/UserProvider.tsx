// deno-lint-ignore-file no-explicit-any
import { createContext } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';
import { Team, User } from '../../lib/newtypes/index.ts';

interface UserContextType {
  user: User | null;
  team: Team | null;
  fetchUser: (formData: FormData) => Promise<void>;
  storeUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: preact.ComponentChildren }) {
  const [user, setUser] = useState<User | null>(null);
  const [team, setTeam] = useState<Team | null>(null);

  async function fetchUser(formData: FormData): Promise<void> {
    try {
      const response = await fetch(`/api/auth/login`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        // Explicitly throw structured error for form handlers
        throw new Error(result.error || 'Login failed. Please try again.');
      }

      // TODO: Fetch updated user after successful login
      await storeUser();
    } catch (err: any) {
      setUser(null);
      // Pass error to form caller
      throw err;
    }
  }

  async function storeUser() {
    try {
      const res = await fetch(`/api/auth/session?type=user`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
      }

      const user = await res.json();
      setUser(user);
    } catch (err: any) {
      console.warn('Failed to fetch user:', err);
      setUser(null);
    }
  }

  async function storeTeam() {
    try {
      const res = await fetch(`/api/auth/session?type=team`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
      }

      const team = await res.json();
      if (team) setTeam(team);
    } catch (err: any) {
      console.warn('Failed to fetch team:', err);
    }
  }

  useEffect(() => {
    if (!user) storeUser();
    if (!team) storeTeam();
  }, []);

  return (
    <UserContext.Provider value={{ user, team, fetchUser, storeUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
}
