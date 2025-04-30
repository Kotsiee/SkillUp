// lib/api/users.ts

import { getSupabaseClient } from '../../supabase/client.ts';
import { DEFAULT_IMAGES, normalizeUser, User } from '../../newtypes/index.ts';
import { Session } from 'https://esm.sh/@supabase/auth-js@2.67.3/dist/module/index.js';

/**
 * Register a new user (auth + profile).
 * @param email - Email of new user.
 * @param password - Plain text password.
 * @returns New user ID if successful.
 */
export async function registerUser(email: string, password: string): Promise<{ id: string }> {
  const supabase = getSupabaseClient();
  const authResult = await supabase.auth.signUp({
    email,
    password,
  });

  if (authResult.error || !authResult.data.user) {
    throw new Error(authResult.error?.message || 'Failed to register user.');
  }

  return { id: authResult.data.user.id };
}

/**
 * Resend Confirmation Email.
 * @param email - Email of new user.
 * @returns email sent if successful.
 */
export async function confirmEmail(email: string): Promise<string> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.resend({
    type: 'signup',
    email,
  });

  if (error) {
    throw new Error(error?.message || 'Failed to register user.');
  }

  return 'email sent';
}

/**
 * Delete a user by ID.
 * @param userId - UUID of the user.
 * @param accessToken - Supabase access token.
 * @returns Confirmation status.
 */
export async function deleteUser(userId: string, accessToken: string): Promise<boolean> {
  const supabase = getSupabaseClient(accessToken).schema('users');
  const { error } = await supabase.from('users').delete().eq('id', userId);
  if (error) throw new Error(error.message);
  return true;
}

/**
 * Log in a user with email + password.
 * If user doesn't exist in "users" table, create it based on auth profile.
 * @param email - Login email.
 * @param password - Login password.
 * @returns User data and session info.
 */
export async function loginUser(
  email: string,
  password: string
): Promise<{ user: User; session: Session }> {
  try {
    const supabase = getSupabaseClient();
    const auth = await supabase.auth.signInWithPassword({ email, password });

    if (auth.error || !auth.data) {
      throw {
        status: 401,
        message: auth.error?.message || 'Invalid credentials',
      };
    }

    const { user, session } = auth.data;

    const { data: profile, error } = await supabase
      .schema('users')
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    let fullUser: User;

    if (!profile && user.email_confirmed_at) {
      // New User, just confirmed email but no profile yet
      const fallbackUser = {
        id: user.id,
        primary_email: user.email,
        username: user.user_metadata?.username || user.email?.split('@')[0],
        first_name: user.user_metadata?.firstName || '',
        last_name: user.user_metadata?.lastName || '',
        headline: '',
        biography: '',
        profile: DEFAULT_IMAGES,
        meta: {},
      };

      const { data: inserted, error: insertErr } = await supabase
        .schema('users')
        .from('users')
        .insert(fallbackUser)
        .select()
        .single();

      if (insertErr) {
        throw {
          status: 500,
          message: insertErr.message || 'Failed to create user profile',
        };
      }

      fullUser = normalizeUser(inserted);
    } else if (profile) {
      fullUser = normalizeUser(profile);
    } else {
      throw {
        status: 422,
        message: 'User profile missing and email not confirmed.',
      };
    }

    return { user: fullUser, session };
  } catch (err) {
    // Ensure all errors passed are consistent
    if (err && typeof err === 'object' && 'status' in err && 'message' in err) {
      throw err;
    } else {
      throw {
        status: 500,
        message: (err as Error).message || 'Unexpected login error',
      };
    }
  }
}
