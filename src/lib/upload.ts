import { createClient } from '@/lib/supabase/client';

export const uploadAvatar = async (file: File, userId: string): Promise<string> => {
    const supabase = createClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
            upsert: true,
        });

    if (uploadError) {
        throw uploadError;
    }

    const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

    return data.publicUrl;
};
