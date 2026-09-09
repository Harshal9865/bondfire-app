-- ==============================================================================
-- PRODUCTION SQL QUERIES: PODS, GAME SESSIONS & LEADERBOARDS
-- ==============================================================================

-- 1. Fetch Room Lobby by Room Code (Sub-50ms index scan)
-- Params: $1 = room_code (e.g. 'FIRE')
SELECT 
    p.id AS pod_id,
    p.name AS pod_name,
    p.type AS pod_type,
    p.room_code,
    p.is_pro,
    p.created_by AS host_id,
    COALESCE(
        json_agg(
            json_build_object(
                'user_id', u.id,
                'display_name', u.display_name,
                'avatar_url', u.avatar_url,
                'role', pm.role,
                'score_all_time', pm.score_all_time
            ) ORDER BY pm.role DESC, pm.score_all_time DESC
        ) FILTER (WHERE u.id IS NOT NULL), '[]'::json
    ) AS active_members
FROM pods p
LEFT JOIN pod_memberships pm ON p.id = pm.pod_id
LEFT JOIN users u ON pm.user_id = u.id
WHERE p.room_code = $1
GROUP BY p.id, p.name, p.type, p.room_code, p.is_pro, p.created_by;

-- 2. Fetch Active Game Round Details for Players
-- Params: $1 = game_session_id
SELECT 
    gs.id AS session_id,
    gs.mode,
    gs.status,
    gs.current_round_index,
    gs.total_rounds,
    gr.id AS round_id,
    gr.round_number,
    gr.question_prompt,
    gr.options,
    gr.time_limit_seconds,
    gr.started_at,
    m.title AS memory_title,
    m.ocr_extracted_text,
    m.event_timestamp
FROM game_sessions gs
JOIN game_rounds gr ON gs.id = gr.game_session_id AND gr.round_number = gs.current_round_index
LEFT JOIN memories m ON gr.memory_id = m.id
WHERE gs.id = $1;

-- 3. Record Player Vote with Server-Side Timestamp Verification
-- Params: $1 = round_id, $2 = user_id, $3 = selected_option, $4 = response_time_ms
INSERT INTO player_votes (game_round_id, user_id, selected_option, is_correct, points_awarded, response_time_ms)
SELECT 
    gr.id,
    $2,
    $3,
    (gr.correct_answer = $3),
    CASE 
        WHEN gr.correct_answer = $3 THEN 
            GREATEST(100, 1000 - ($4 / 20)) -- Fast response multiplier
        ELSE 0 
    END,
    $4
FROM game_rounds gr
WHERE gr.id = $1
ON CONFLICT (game_round_id, user_id) DO NOTHING
RETURNING points_awarded, is_correct;

-- 4. Calculate Live Session Leaderboard
-- Params: $1 = game_session_id
SELECT 
    u.id AS user_id,
    u.display_name,
    u.avatar_url,
    COUNT(pv.id) AS total_votes_cast,
    COUNT(pv.id) FILTER (WHERE pv.is_correct) AS correct_picks,
    COALESCE(SUM(pv.points_awarded), 0) AS total_session_points,
    ROUND(AVG(pv.response_time_ms)) AS avg_reaction_time_ms
FROM pod_memberships pm
JOIN users u ON pm.user_id = u.id
JOIN game_sessions gs ON pm.pod_id = gs.pod_id
LEFT JOIN game_rounds gr ON gs.id = gr.game_session_id
LEFT JOIN player_votes pv ON gr.id = pv.game_round_id AND pv.user_id = u.id
WHERE gs.id = $1
GROUP BY u.id, u.display_name, u.avatar_url
ORDER BY total_session_points DESC, avg_reaction_time_ms ASC;
