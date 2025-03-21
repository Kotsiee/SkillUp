// deno-lint-ignore-file no-explicit-any
import { DateTime } from "https://esm.sh/luxon@3.5.0";
import { supabase } from "../../supabase/client.ts";
import { Task } from "../../types/index.ts";

export async function fetchTasksByID(id: string): Promise<Task | null> {
    if (!id)
        return null

    const { data, error } = await supabase
        .from("projects.tasks")
        .select('*')
        .eq('id', id)
        .single()

    if(error){
        console.log("fetchTasksByID error was found :( - " + error);
        return null;
    }

    const tasks: Task = {
        id: data.id,
        project: data.project_id,
        title: data.title,
        description: data.description,
        status: data.status,
        attachments: null,
        meta: data.meta,
        createdAt: DateTime.fromISO(data.created_at)
    }

    return tasks;
}

export async function fetchTasksByProject(id: string): Promise<Task[] | null> {
    const { data, error } = await supabase
        .from("projects.tasks")
        .select('*')
        .eq('project_id', id)

    if(error){
        console.log("fetchTasksByProject error was found :( - " + error);
        return null;
    }

    const tasks: Task[] = await Promise.all(
        data.map((d: any) => {            
            return {
                id: d.id,
                project: d.project_id,
                title: d.title,
                description: d.description,
                status: d.status,
                attachments: null,
                meta: d.meta,
                createdAt: DateTime.fromISO(d.created_at)
            };
        })
    );

    return tasks;
}