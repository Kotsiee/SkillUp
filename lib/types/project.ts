import { DateTime } from "https://esm.sh/luxon@3.5.0";
import { Organisation, Task } from "./index.ts";

export interface Project {
    id: string;
    organisation: Organisation | null;
    title: string;
    description?: string;
    status?: string;
    meta?: ProjectMeta;
    attachments?: string[];
    tasks?: Task[] | null;
    createdAt: DateTime;
}

export interface ProjectMeta {
    budget: number;
    contributors: number;
    timeline: ProjectTimeline;
}

export interface ProjectTimeline {
    startDate: DateTime;
    endDate: DateTime;
}