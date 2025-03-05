import { Files } from "./index.ts";

export enum ChatType {
    project_channel,
    private_chat,
    private_group
}

export enum Roles {
    owner,
    co_owner,
    manager,
    member,
    viewer
}

export enum Theme{
    dark,
    light,
    system
}

export enum Privacy{
    public,
    private
}

export enum ConnectionStatus{
    pending,
    accepted,
    blocked
}

export type Logo = {
    url: string;
    file?: Files
}