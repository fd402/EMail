'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function saveProject(projectId: string | null, name: string, content: any) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    const projectData = {
        name,
        content,
        user_id: user.id,
        updated_at: new Date().toISOString(),
    };

    // --- SUBSCRIPTION CHECK ---
    const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_plan')
        .eq('id', user.id)
        .single();

    const isPro = profile?.subscription_plan === 'pro' || profile?.subscription_plan === 'agency';

    if (projectId) {
        // Update
        const { data, error } = await supabase
            .from('projects')
            .update(projectData)
            .eq('id', projectId)
            .select()
            .single();

        if (error) throw error;
        return data;
    } else {
        const { data, error } = await supabase
            .from('projects')
            .insert([{ ...projectData, created_at: new Date().toISOString() }])
            .select()
            .single();

        if (error) throw error;
        return data;
    }
}

export async function getProjects() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

    if (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
    return data;
}

export async function getProjectById(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
}

export async function deleteProject(id: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

    if (error) throw error;
    revalidatePath('/editor');
}
