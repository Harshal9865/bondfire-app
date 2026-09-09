-- ==============================================================================
-- BONDFIRE SEED DATA (Production Mock & Test Seed)
-- Demonstrating Solo, Couple, and Squad Pod Data with Full Relational Integrity
-- ==============================================================================

-- 1. SEED USERS
INSERT INTO users (id, email, display_name, avatar_url, is_verified, role)
VALUES
    ('a0000000-0000-0000-0000-000000000001', 'maya@bondfire.app', 'Maya', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', true, 'SUPERADMIN'),
    ('a0000000-0000-0000-0000-000000000002', 'arjun@bondfire.app', 'Arjun', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', true, 'MEMBER'),
    ('a0000000-0000-0000-0000-000000000003', 'liam@bondfire.app', 'Liam', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', true, 'MEMBER'),
    ('a0000000-0000-0000-0000-000000000004', 'sarah@bondfire.app', 'Sarah', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', true, 'MEMBER'),
    ('a0000000-0000-0000-0000-000000000005', 'alex@bondfire.app', 'Alex', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', true, 'MEMBER'),
    ('a0000000-0000-0000-0000-000000000006', 'rohan@bondfire.app', 'Rohan', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', true, 'MEMBER')
ON CONFLICT (id) DO NOTHING;

-- 2. SEED AUTH IDENTITIES (Google OAuth)
INSERT INTO auth_identities (user_id, provider, provider_user_id)
VALUES
    ('a0000000-0000-0000-0000-000000000001', 'google', 'google-oauth2|109283748291029384756'),
    ('a0000000-0000-0000-0000-000000000002', 'google', 'google-oauth2|209283748291029384757')
ON CONFLICT DO NOTHING;

-- 3. SEED PODS (Solo, Couple, Squad)
INSERT INTO pods (id, name, type, room_code, is_pro, encryption_key_id, created_by)
VALUES
    -- Squad Pod (Flagship multiplayer)
    ('b0000000-0000-0000-0000-000000000001', 'The Goa Trip Crew 🏖️', 'SQUAD', 'FIRE', true, 'kms_key_squad_goa_01', 'a0000000-0000-0000-0000-000000000001'),
    -- Couple Pod (Maya & Arjun)
    ('b0000000-0000-0000-0000-000000000002', 'Maya & Arjun 💑', 'COUPLE', 'LOVE', true, 'kms_key_couple_arjun_02', 'a0000000-0000-0000-0000-000000000001'),
    -- Solo Capsule (Maya Private)
    ('b0000000-0000-0000-0000-000000000003', 'Maya’s Time Capsule ⏳', 'SOLO', 'MAYA', false, 'kms_key_solo_maya_03', 'a0000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- 4. SEED POD MEMBERSHIPS
INSERT INTO pod_memberships (pod_id, user_id, role, score_all_time)
VALUES
    -- Goa Crew Squad
    ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'HOST', 2450),
    ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 'PLAYER', 2100),
    ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003', 'PLAYER', 1850),
    ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000004', 'PLAYER', 2300),
    ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000005', 'PLAYER', 2900),
    ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000006', 'PLAYER', 1400),
    -- Couple Pod
    ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'HOST', 3400),
    ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 'PLAYER', 3350),
    -- Solo Pod
    ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'HOST', 1200)
ON CONFLICT DO NOTHING;

-- 5. SEED MEMORIES (The Vault)
INSERT INTO memories (id, pod_id, created_by, title, raw_text, ocr_extracted_text, event_timestamp, is_playable)
VALUES
    ('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003',
     'The 2 AM Samosa Breakdown', 
     'If I eat one more samosa I am legally changing my name to potato and moving into the fridge.', 
     'Liam (2:43 AM): If I eat one more samosa I am legally changing my name to potato and moving into the fridge.',
     '2019-10-14 02:43:00+00', true),

    ('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000005',
     'Lost in Anjuna Forest', 
     'Guys the Google Maps lady is crying. She has no idea where we are.',
     'Alex (11:15 PM): Guys the Google Maps lady is crying. She has no idea where we are. Just follow the bassline.',
     '2022-08-18 23:15:00+00', true),

    ('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001',
     'First Coffee Date Debate', 
     'Arjun claimed he never drinks iced coffee. 5 minutes later he drank half of my caramel macchiato.',
     'Maya: He literally swore he was a black coffee purist. The betrayal was immediate.',
     '2021-07-22 16:30:00+00', true)
ON CONFLICT (id) DO NOTHING;

-- 6. SEED GAME SESSION (Active Game in Goa Squad)
INSERT INTO game_sessions (id, pod_id, host_user_id, mode, status, total_rounds, current_round_index, started_at)
VALUES
    ('d0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001',
     'WHO_SAID_THIS', 'IN_PROGRESS', 5, 2, NOW())
ON CONFLICT (id) DO NOTHING;

-- 7. SEED GAME ROUNDS
INSERT INTO game_rounds (id, game_session_id, memory_id, round_number, question_prompt, correct_answer, options, time_limit_seconds, started_at)
VALUES
    ('e0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001',
     1, 'Who sent this message at 2:43 AM without any prior context?', 'Liam',
     '["Maya", "Liam", "Sarah", "Alex"]'::jsonb, 20, NOW() - INTERVAL '1 minute'),

    ('e0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002',
     2, 'Who claimed the Google Maps GPS navigation lady was actively crying?', 'Alex',
     '["Rohan", "Alex", "Liam", "Arjun"]'::jsonb, 20, NOW())
ON CONFLICT (id) DO NOTHING;

-- 8. SEED YEARBOOK
INSERT INTO yearbooks (id, pod_id, season_name, total_pages)
VALUES
    ('f0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Official Goa Squad Yearbook · 2026 Edition', 48)
ON CONFLICT (id) DO NOTHING;

-- 9. SEED YEARBOOK PAGES
INSERT INTO yearbook_pages (yearbook_id, page_number, template_type, content_payload)
VALUES
    ('f0000000-0000-0000-0000-000000000001', 1, 'QUOTE_SPREAD', '{
        "chapter": "Chapter 1: 3:00 AM Philosophy",
        "headline": "The Samosa Manifesto",
        "quote": "If I eat one more samosa I am legally changing my name to potato and moving into the fridge.",
        "author": "Liam",
        "context": "Sent during final exams week, October 2019",
        "vote_accuracy": "84% guessed correctly"
    }'::jsonb),
    ('f0000000-0000-0000-0000-000000000001', 2, 'AWARD_ROAST', '{
        "chapter": "Superlatives & Pod Awards",
        "awards": [
            {"title": "Most Likely to Survive a Horror Movie", "winner": "Maya", "votes": 5},
            {"title": "Most Likely to Get Adopted by Street Dogs", "winner": "Rohan", "votes": 6},
            {"title": "Chief Chaos Coordinator", "winner": "Alex", "votes": 4}
        ]
    }'::jsonb)
ON CONFLICT DO NOTHING;
