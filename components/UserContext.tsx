import { createContext } from "preact";
import { useContext } from "preact/hooks";
import { User } from "../lib/types/index.ts";

// Explicitly define the context type
const UserContext = createContext<User | null>(null);

export const useUser = (): User | null => {
    const user = useContext(UserContext);
    if (user === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return user;
};

export const UserProvider = ({ user, children }: { user: User | null; children: preact.ComponentChildren }) => {
    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};