'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useEmailStore } from '@/store/useEmailStore';
import { SubscriptionPlan } from '@/lib/stripe/plans';
import { getSubscriptionStatus } from '@/app/actions/subscription';

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
    const { setSubscription } = useEmailStore();
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        let supabase: any;
        try {
            supabase = createClient();
        } catch (e) {
            console.warn('[SubProvider] Not initializing Supabase client (missing keys?)');
            return;
        }
        const sessionId = searchParams.get('session_id');

        async function syncSubscription() {
            // 1. If returning from checkout, force sync happens via API, but we just need to refresh our state
            if (sessionId) {
                try {
                    // Call sync endpoint to update DB from Stripe
                    const res = await fetch(`/api/stripe/sync?session_id=${sessionId}`);
                    const data = await res.json();

                    if (data.success && data.plan) {
                        // Update store immediately if sync was successful
                        setSubscription(data.plan as SubscriptionPlan);
                        router.replace('/editor');
                        return; // We have the latest plan
                    }
                } catch (error) {
                    console.error('[SubProvider] Sync failed', error);
                }
            }

            // 2. Fetch reliable status from Server Action
            console.log('[SubProvider] Fetching subscription status from server...');
            try {
                const { plan, status, debug } = await getSubscriptionStatus();
                console.log('[SubProvider] Server Status:', { plan, status, debug });
                setSubscription(plan as SubscriptionPlan);
            } catch (err) {
                console.error('[SubProvider] Server action failed', err);
                setSubscription('free');
            }
        }

        syncSubscription();

        // 3. Listen for auth changes to re-fetch
        const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('[SubProvider] Auth Event:', event);

            if (event === 'SIGNED_OUT') {
                setSubscription('free');
                return;
            }

            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                // Re-fetch from server to be sure
                // Small delay to ensure DB updates if this was a new signup
                setTimeout(async () => {
                    const { plan } = await getSubscriptionStatus();
                    console.log('[SubProvider] Auth Change Update:', plan);
                    setSubscription(plan as SubscriptionPlan);
                }, 1000);
            }
        });

        return () => {
            authSub.unsubscribe();
        };
    }, [searchParams, router, setSubscription]);

    // 4. Realtime Listener for Profile Changes (Instant Updates)
    useEffect(() => {
        let supabase: any;
        try { supabase = createClient(); } catch { return; }

        let channel: any;

        const setupRealtime = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            channel = supabase
                .channel('schema-db-changes')
                .on(
                    'postgres_changes',
                    {
                        event: 'UPDATE',
                        schema: 'public',
                        table: 'profiles',
                        filter: `id=eq.${user.id}`,
                    },
                    (payload: any) => {
                        console.log('[SubProvider] Realtime Update:', payload);
                        if (payload.new?.subscription_plan) {
                            setSubscription(payload.new.subscription_plan as SubscriptionPlan);
                        }
                    }
                )
                .subscribe();
        };

        setupRealtime();

        return () => {
            if (channel) supabase.removeChannel(channel);
        };
    }, [setSubscription]);

    return <>{children}</>;
}
