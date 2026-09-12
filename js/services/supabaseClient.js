// ==============================================================================
// BONDFIRE SUPABASE CLIENT SERVICE (Cloud Auth, Database & Realtime)
// ==============================================================================

import { CONFIG } from '../config.js';

let supabaseInstance = null;

export function getSupabase() {
  if (supabaseInstance) return supabaseInstance;

  if (typeof window !== 'undefined' && window.supabase && window.supabase.createClient) {
    try {
      supabaseInstance = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });
      return supabaseInstance;
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
    }
  }
  return null;
}

/**
 * Trigger Google OAuth Sign-In via Supabase
 */
export async function signInWithGoogle() {
  const sb = getSupabase();
  if (!sb) {
    console.warn('Supabase not available for Google Sign-In');
    return null;
  }
  try {
    const { data, error } = await sb.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Supabase Google Sign-In Error:', err);
    return null;
  }
}

/**
 * Get the currently authenticated Supabase user
 */
export async function getAuthUser() {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const { data: { user }, error } = await sb.auth.getUser();
    if (error || !user) return null;
    return {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Player',
      avatarUrl: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
      isPro: false,
    };
  } catch (err) {
    console.warn('Error fetching Supabase auth user:', err);
    return null;
  }
}

/**
 * Sign out from Supabase
 */
export async function signOutUser() {
  const sb = getSupabase();
  if (!sb) return;
  try {
    await sb.auth.signOut();
  } catch (err) {
    console.error('Sign out error:', err);
  }
}

/**
 * Save a new Pod/Room to Supabase Cloud
 */
export async function createCloudPod({ name, type = 'SQUAD', roomCode, createdBy = null }) {
  const sb = getSupabase();
  if (!sb) return null;

  try {
    const payload = {
      name,
      type,
      room_code: roomCode.toUpperCase(),
      is_pro: false,
      encryption_key_id: `enc_${Date.now()}`,
      created_by: createdBy,
    };

    const { data, error } = await sb
      .from('pods')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.warn('Supabase Pod creation warning:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Network error saving pod to Supabase:', err);
    return null;
  }
}

/**
 * Fetch a Pod by room code from Supabase
 */
export async function getCloudPod(roomCode) {
  const sb = getSupabase();
  if (!sb) return null;

  try {
    const { data, error } = await sb
      .from('pods')
      .select('*')
      .eq('room_code', roomCode.toUpperCase())
      .maybeSingle();

    if (error || !data) return null;
    return data;
  } catch (err) {
    console.warn('Error querying Supabase pod:', err);
    return null;
  }
}

/**
 * Save a Memory or Time Capsule to Supabase
 */
export async function saveCloudMemory({ podId = null, title, rawText, eventTimestamp = new Date(), structuredData = {} }) {
  const sb = getSupabase();
  if (!sb) return null;

  try {
    const payload = {
      pod_id: podId,
      title: title || 'Squad Memory',
      raw_text: rawText || '',
      event_timestamp: eventTimestamp,
      is_playable: true,
      structured_data: structuredData,
    };

    const { data, error } = await sb
      .from('memories')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.warn('Supabase memory save warning:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Network error saving memory to Supabase:', err);
    return null;
  }
}

/**
 * Fetch memories for a pod from Supabase
 */
export async function fetchCloudMemories(podId) {
  const sb = getSupabase();
  if (!sb) return [];

  try {
    const { data, error } = await sb
      .from('memories')
      .select('*')
      .eq('pod_id', podId)
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data;
  } catch (err) {
    console.warn('Error fetching memories from Supabase:', err);
    return [];
  }
}

/**
 * Upload an image, video, or audio blob to Supabase Cloud Storage
 * with automatic fallback to base64 Data URL if bucket is unconfigured
 */
export async function uploadCloudMedia(fileOrBlob, bucketName = 'vault-media', customFolder = 'uploads') {
  const sb = getSupabase();
  const fileExt = fileOrBlob.name ? fileOrBlob.name.split('.').pop() : (fileOrBlob.type?.includes('audio') ? 'webm' : 'jpg');
  const fileName = `${customFolder}/${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

  // Try Supabase Storage upload
  if (sb && sb.storage) {
    try {
      const { data, error } = await sb.storage
        .from(bucketName)
        .upload(fileName, fileOrBlob, {
          cacheControl: '3600',
          upsert: true,
          contentType: fileOrBlob.type || 'application/octet-stream',
        });

      if (!error && data) {
        const { data: publicUrlData } = sb.storage.from(bucketName).getPublicUrl(fileName);
        if (publicUrlData && publicUrlData.publicUrl) {
          return {
            url: publicUrlData.publicUrl,
            storagePath: fileName,
            source: 'SUPABASE_STORAGE',
          };
        }
      } else if (error) {
        console.warn('Supabase storage upload notice:', error.message);
      }
    } catch (err) {
      console.warn('Supabase storage upload exception:', err);
    }
  }

  // Graceful fallback: Convert to Data URL (base64) so user upload never breaks
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve({
        url: reader.result,
        storagePath: fileName,
        source: 'CLIENT_BASE64_FALLBACK',
      });
    };
    reader.onerror = () => {
      resolve({
        url: URL.createObjectURL(fileOrBlob),
        storagePath: fileName,
        source: 'OBJECT_URL_FALLBACK',
      });
    };
    reader.readAsDataURL(fileOrBlob);
  });
}

