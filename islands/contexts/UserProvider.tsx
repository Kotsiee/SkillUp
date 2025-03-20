// deno-lint-ignore-file no-explicit-any
import { createContext } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
import { User } from "../../lib/types/index.ts";

const UserContext = createContext<any>(null);

export function UserProvider(
  { children }: { children: preact.ComponentChildren },
) {
  const [user, setUser] = useState<User | null>(null);

  async function fetchUser(formData: FormData) {
    const response = await fetch(`/api/auth/login`, {method: 'POST', body: formData});
    const result = await response.json();

    if (result.error) {
      setUser(null);
    } else {
      setUser(result.user);
    }
  }

  async function storeUser() {
    try {
      const res = await fetch(`/api/auth/session`, {
        method: "GET",
        credentials: "include",
      });
      
      if (!res.ok) {
        throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
      }
  
      const user = await res.json();
      setUser(user);
    }
    catch (err: any) {
      console.warn("Failed to fetch user:", err);
    }
  }

  useEffect(() => {
    if (!user) {
      storeUser()
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, fetchUser, storeUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
