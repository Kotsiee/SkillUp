import { DateTime } from "https://esm.sh/luxon@3.5.0";
import { ConnectionStatus, User } from "./index.ts";

export interface Connection {
    id: string;
    userId1: User;
    userId2: User;
    status: ConnectionStatus;
    createdAt: DateTime;
    updatedAt: DateTime;
}