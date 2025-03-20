import { DateTime } from "https://esm.sh/luxon@3.5.0";
import { FileReference } from "../files/fileReferences.ts";
import { Project } from "./projects.ts";

export interface Task {
    id: string;
    project?: Project | Task;
    title?: string;
    description?: string;
    status?: string;
    meta?: TaskMeta;
    attachments?: FileReference[] | null;
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