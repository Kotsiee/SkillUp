import { DateTime } from "https://esm.sh/luxon@3.5.0";
import { Files, Project } from "./index.ts";

export interface Task {
    id: string;
    project?: Project | Task;
    title?: string;
    description?: string;
    status?: string;
    meta?: TaskMeta;
    attachments?: Files[] | null;
    createdAt?: DateTime;
}

export type TaskMeta = {
    timeline: TaskTimeline;
    priority: string;
    subTasks: Task[]; // Shoud also be a pointer
    icon: string;
}

export type TaskTimeline = {
    startDate: DateTime;
    endDate: DateTime;
}