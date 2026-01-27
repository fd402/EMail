import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function inspectProfiles() {
    console.log('Inspecting profiles...');

    const { data: profiles } = await supabase
        .from('profiles')
        .select('*');

    console.log(JSON.stringify(profiles, null, 2));
}

inspectProfiles();
