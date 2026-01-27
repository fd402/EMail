'use server';

import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function registerUser(email: string, password: string, name: string) {
    try {
        // Validate inputs
        if (!email || !password || password.length < 8) {
            return { success: false, error: "Invalid email or password (min 8 characters)" };
        }

        // Check if user already exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('email')
            .eq('email', email)
            .single();

        if (existingUser) {
            return { success: false, error: "Email already registered" };
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Insert user into database
        const { data, error } = await supabase
            .from('users')
            .insert([
                {
                    email,
                    password_hash: passwordHash,
                    name: name || email.split('@')[0],
                }
            ])
            .select()
            .single();

        if (error) {
            console.error("Supabase error:", error);
            return { success: false, error: "Failed to create account" };
        }

        return { success: true, user: data };
    } catch (error) {
        console.error("Registration error:", error);
        return { success: false, error: "An unexpected error occurred" };
    }
}
