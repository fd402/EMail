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
            .select('subscription_plan, subscription_status')
            .eq('id', user.id)
            .single();

        if (error) {
            console.error('Server Action Profile Fetch Error:', error);
            // If RLS fails, we might still want to return free, but let's log it.
            return { plan: 'free', status: 'error', debug: error.message };
        }

        if (profile?.subscription_plan) {
            return {
                plan: profile.subscription_plan.toLowerCase(),
                status: profile.subscription_status,
                debug: 'success'
            };
        }

        return { plan: 'free', status: 'no_profile', debug: 'Profile missing plan' };

    } catch (error: any) {
        console.error('Server Action Critical Error:', error);
        return { plan: 'free', status: 'crash', debug: error.message };
    }
}
