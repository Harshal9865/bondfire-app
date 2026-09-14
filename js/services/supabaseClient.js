// ==============================================================================
// BONDFIRE SUPABASE CLIENT SERVICE (Cloud Auth, Database & Realtime)
// ==============================================================================

import { CONFIG } from '../config.js';
import { store } from '../state/store.js';

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

// ==============================================================================
// SUPABASE REALTIME PRESENCE & MULTIPLAYER BROADCAST ENGINE
// Syncs real players across Mobile, Laptop & Tablets in real-time
// ==============================================================================

let activeRoomChannel = null;

export function syncRealtimeRoom(roomCode, playerInfo = {}) {
  const sb = getSupabase();
  if (!sb || !roomCode) {
    console.warn('Supabase not initialized for realtime room channel');
    return null;
  }

  const cleanCode = roomCode.toUpperCase();
  const channelName = `bondfire_room_${cleanCode}`;

  // If already subscribed to this exact channel, update presence
  if (activeRoomChannel && activeRoomChannel.topic === `realtime:${channelName}`) {
    if (playerInfo.id || playerInfo.name) {
      activeRoomChannel.track(playerInfo).catch(() => {});
    }
    return activeRoomChannel;
  }

  // Unsubscribe from previous room channel if switching rooms
  if (activeRoomChannel) {
    try {
      activeRoomChannel.unsubscribe();
    } catch {}
    activeRoomChannel = null;
  }

  const user = playerInfo.id ? playerInfo : (store ? store.getState().currentUser : {});
  const userId = user.id || `usr_${Date.now()}`;
  const userName = user.name || (user.displayName ? user.displayName.split(' ')[0] : 'Camper');
  const userAvatar = user.avatar || user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userName)}`;

  activeRoomChannel = sb.channel(channelName, {
    config: {
      presence: { key: userId },
      broadcast: { ack: true },
    },
  });

  // 1. PRESENCE SYNC: Real campers joining from Mobile, Laptop, etc.
  activeRoomChannel
    .on('presence', { event: 'sync' }, () => {
      const state = activeRoomChannel.presenceState();
      console.log('⚡ [Supabase Realtime Sync] Active Campers in Room:', state);

      const livePlayers = [];
      Object.values(state).forEach((presences) => {
        if (Array.isArray(presences)) {
          presences.forEach((p) => {
            if (p && (p.name || p.displayName)) {
              const pName = p.name || p.displayName;
              livePlayers.push({
                id: p.id || `usr_${pName}`,
                name: pName,
                avatar: p.avatar || p.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(pName)}`,
                role: p.isHost ? 'HOST' : 'Player',
                isReady: true,
              });
            }
          });
        }
      });

      if (livePlayers.length > 0 && store) {
        // Unique players by normalized name
        const unique = Array.from(new Map(livePlayers.map((p) => [p.name.toLowerCase(), p])).values());
        const currentRoom = store.getState().activeRoom;
        store.setState({
          activeRoom: {
            ...currentRoom,
            players: unique,
          },
        });
      }
    })
    // 2. BROADCAST SYNC: Start game, card turns, and votes across all devices
    .on('broadcast', { event: 'BONDFIRE_ROOM_EVENT' }, ({ payload }) => {
      console.log('⚡ [Supabase Broadcast Received]', payload);
      if (!payload || !store) return;

      if (payload.action === 'START_COUNTDOWN') {
        const currentRoom = store.getState().activeRoom;
        const targetMode = payload.gameMode || currentRoom?.selectedGameMode || 'SQUAD';

        // Pre-configure game state on camper device
        store.setState({
          activeRoom: {
            ...currentRoom,
            selectedGameMode: targetMode,
          },
          activeGame: {
            ...store.getState().activeGame,
            mode: targetMode,
            roundIndex: payload.roundIndex || 1,
            dynamicDeck: payload.dynamicDeck || store.getState().activeGame?.dynamicDeck,
            selectedOption: null,
            isAnswerRevealed: false,
          },
        });

        const finalizeCamperCountdown = () => {
          store.setState({ currentView: 'GAME' });
          window.location.hash = '#/GAME';
        };

        // Launch pre-game rules example & countdown on camper devices immediately
        if (typeof document !== 'undefined' && !document.getElementById('game-countdown-overlay')) {
          import('../components/gameCountdownOverlay.js').then(({ triggerGameCountdown }) => {
            triggerGameCountdown({
              mode: targetMode,
              title: payload.title || currentRoom?.podName || 'Bondfire Arena',
              onComplete: finalizeCamperCountdown,
            });
          }).catch(finalizeCamperCountdown);
        }
      } else if (payload.action === 'START_GAME') {
        const currentRoom = store.getState().activeRoom;
        const targetMode = payload.gameMode || currentRoom?.selectedGameMode || 'RED_FLAG_COURT';

        const finalizeStart = () => {
          store.setState({
            currentView: 'GAME',
            activeRoom: {
              ...currentRoom,
              selectedGameMode: targetMode,
            },
            activeGame: {
              ...store.getState().activeGame,
              roundIndex: payload.roundIndex || 1,
              dynamicDeck: payload.dynamicDeck || store.getState().activeGame?.dynamicDeck,
              selectedOption: null,
              isAnswerRevealed: false,
            },
          });
          window.location.hash = '#/GAME';
        };

        if (typeof document !== 'undefined' && !document.getElementById('game-countdown-overlay')) {
          import('../components/gameCountdownOverlay.js').then(({ triggerGameCountdown }) => {
            triggerGameCountdown({
              mode: targetMode,
              title: currentRoom?.podName || 'Bondfire Arena',
              onComplete: finalizeStart,
            });
          }).catch(finalizeStart);
        } else {
          finalizeStart();
        }
      } else if (payload.action === 'START_BOTTLE') {
        const finalizeBottle = () => {
          store.setState({ currentView: 'BOTTLE' });
          window.location.hash = '#/BOTTLE';
        };
        if (typeof document !== 'undefined' && !document.getElementById('game-countdown-overlay')) {
          import('../components/gameCountdownOverlay.js').then(({ triggerGameCountdown }) => {
            triggerGameCountdown({
              mode: 'ARCADE',
              title: payload.title || 'Spin the Bottle',
              onComplete: finalizeBottle,
            });
          }).catch(finalizeBottle);
        } else {
          finalizeBottle();
        }
      } else if (payload.action === 'START_ARCADE_GAME') {
        const targetView = payload.view || 'ARCADE';
        const finalizeArcade = () => {
          store.setView(targetView);
          window.location.hash = `#/${targetView}`;
        };
        if (typeof document !== 'undefined' && !document.getElementById('game-countdown-overlay')) {
          import('../components/gameCountdownOverlay.js').then(({ triggerGameCountdown }) => {
            triggerGameCountdown({
              mode: payload.mode || 'ARCADE',
              title: payload.title || 'Arcade Game',
              onComplete: finalizeArcade,
            });
          }).catch(finalizeArcade);
        } else {
          finalizeArcade();
        }
      } else if (payload.action === 'SELECT_OPTION') {
        const activeGame = store.getState().activeGame;
        store.setState({
          activeGame: {
            ...activeGame,
            selectedOption: payload.option,
            isAnswerRevealed: payload.isAnswerRevealed ?? true,
          },
        });
      } else if (payload.action === 'NEXT_ROUND') {
        const activeGame = store.getState().activeGame;
        store.setState({
          activeGame: {
            ...activeGame,
            roundIndex: payload.roundIndex,
            selectedOption: null,
            isAnswerRevealed: false,
          },
        });
      } else if (payload.action === 'START_DUO_SESSION') {
        const currentRoom = store.getState().activeRoom;
        const finalizeDuo = () => {
          store.setState({
            currentView: 'COUPLE',
            activeRoom: {
              ...currentRoom,
              sessionStarted: true,
            },
          });
          window.location.hash = '#/COUPLE';
        };

        if (typeof document !== 'undefined' && !document.getElementById('game-countdown-overlay')) {
          import('../components/gameCountdownOverlay.js').then(({ triggerGameCountdown }) => {
            triggerGameCountdown({
              mode: 'US',
              title: 'Us Mode · Date Night Compatibility',
              onComplete: finalizeDuo,
            });
          }).catch(finalizeDuo);
        } else {
          finalizeDuo();
        }
      } else if (payload.action === 'PARTNER_JOINED' || payload.action === 'CAMPER_JOINED') {
        if (payload.player) {
          const currentRoom = store.getState().activeRoom;
          const existing = currentRoom.players || [];
          if (!existing.some((p) => p.id === payload.player.id || p.name.toLowerCase() === payload.player.name.toLowerCase())) {
            store.setState({
              activeRoom: {
                ...currentRoom,
                players: [...existing, payload.player],
              },
            });
          }
        }
      } else if (payload.action === 'POD_CHAT_MESSAGE' && payload.message) {
        if (typeof store.addPodChatMessage === 'function') {
          store.addPodChatMessage(payload.message, false);
        }
      } else if (payload.action === 'WHISPER_NOTE_SENT' && payload.note) {
        if (typeof store.addDuoWhisperNote === 'function') {
          store.addDuoWhisperNote(payload.note, false);
        }
      } else if (payload.action === 'VOICE_NOTE_SENT' && payload.voiceNote) {
        if (typeof store.addDuoVoiceNote === 'function') {
          store.addDuoVoiceNote(payload.voiceNote, false);
        }
      } else if (payload.action === 'SYNC_STREAM' && payload.url) {
        window.dispatchEvent(new CustomEvent('bondfire:sync-stream', { detail: { url: payload.url } }));
      }
    })
    .subscribe(async (status) => {
      console.log(`⚡ Supabase Realtime channel [${channelName}] status:`, status);
      if (status === 'SUBSCRIBED') {
        await activeRoomChannel.track({
          id: userId,
          name: userName,
          avatar: userAvatar,
          isHost: playerInfo.isHost ?? (store ? store.getState().activeRoom?.isHost : false),
          joinedAt: Date.now(),
        }).catch((err) => console.warn('Realtime track notice:', err));
      }
    });

  return activeRoomChannel;
}

export function broadcastRoomAction(action, payload = {}) {
  if (activeRoomChannel) {
    try {
      activeRoomChannel.send({
        type: 'broadcast',
        event: 'BONDFIRE_ROOM_EVENT',
        payload: { action, ...payload, timestamp: Date.now() },
      });
      return true;
    } catch (err) {
      console.warn('Realtime broadcast notice:', err);
    }
  }
  return false;
}

