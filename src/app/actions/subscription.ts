'use server';

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function getSubscriptionStatus() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { plan: 'free', status: 'no_user', debug: 'No session' };
        }

        const { data: profile, error } = await supabase
            .from('profiles')
            .select('subscription_plan, subscription_status, monthly_export_count')
            .eq('id', user.id)
            .single();

        if (profile?.subscription_plan) {
            return {
                plan: profile.subscription_plan.toLowerCase(),
                status: profile.subscription_status,
                exportCount: profile.monthly_export_count || 0,
                debug: 'success'
            };
        }

        return { plan: 'free', status: 'no_profile', debug: 'Profile missing plan' };

    } catch (error: any) {
        console.error('Server Action Critical Error:', error);
        return { plan: 'free', status: 'crash', debug: error.message, exportCount: 0 };
    }
}

export async function incrementMonthlyExport() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false };

    // Use a database function/rpc for atomic increment if available, 
    // or just a simple update for now if we don't want to create migrations yet.
    // Since I can't create SQL migrations as easily as file edits, I'll fetch and update.

    const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('monthly_export_count, subscription_plan')
        .eq('id', user.id)
        .single();

    if (fetchError || !profile) {
        console.error('Increment Failed: Fetch Error', fetchError);
        return { success: false, error: 'FETCH_FAILED' };
    }

    // Limits check
    if (profile.subscription_plan === 'free' && (profile.monthly_export_count || 0) >= 3) {
        return { success: false, error: 'LIMIT_REACHED' };
    }

    const { error: updateError } = await supabase
        .from('profiles')
        .update({ monthly_export_count: (profile.monthly_export_count || 0) + 1 })
        .eq('id', user.id);

    if (updateError) {
        console.error('Increment Failed: Update Error', updateError);
        return { success: false, error: 'UPDATE_FAILED' };
    }

    return { success: true, count: (profile.monthly_export_count || 0) + 1 };
}
