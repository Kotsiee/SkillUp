// deno-lint-ignore-file no-explicit-any
import { createContext } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
import { User } from "../../lib/types/index.ts";

const UserContext = createContext<any>(null);

export function UserProvider(
  { children }: { children: preact.ComponentChildren },
) {
  const [user, setUser] = useState<User | null>(null);

  async function fetchUser() {
    const response = await fetch(`/api/auth/log`);
    const result = await response.json();

    if (result.error) {
      setUser(null);
    } else {
      setUser(result.user);
    }
  }

  async function storeUser(formData: FormData) {
    await fetch(`/api/auth/log`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    fetchUser();
  }

  useEffect(() => {
    if (!user)
    fetch("/api/auth/log", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((res) => {
        setUser(res.user);
      });
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
