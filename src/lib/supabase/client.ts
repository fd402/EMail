import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.error('SUPABASE KEYS MISSING. Auth will not work.');
        // Return a dummy object or throw a handled error
        // throwing here is fine if we catch it upstream, but usually libraries expect a URL.
        // Let's rely on the upstream catch we just added in SubscriptionProvider.
        // But to be safe, we can try/catch the library call too.
    }
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}
