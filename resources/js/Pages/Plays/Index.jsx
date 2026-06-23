import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

const PLAY_TYPES   = ['run', 'pass', 'punt', 'kickoff', 'extra_point', 'penalty'];
const OPP_TYPES    = ['middle_run', 'toss', 'screen', 'pass', 'punt', 'kickoff'];
const DOWNS        = [1, 2, 3, 4];
const QUARTERS     = [1, 2, 3, 4];
const DEF_LOOKS    = ['4-3', '3-4', 'Zone', 'Man', 'Blitz', 'Cover 2', 'Cover 3', 'Other'];
const PENALTIES    = [
    'Holding', 'False Start', 'Offsides', 'Pass Interference',
    'Illegal Block', 'Unsportsmanlike', 'Encroachment', 'Other'
];

export default function PlaysIndex({
    team, game, plays, players,
    nextDown, nextDistance, lastQuarter, flash
}) {
    const [tab, setTab] = useState('offense');

    // ── Offense Form ─────────────────────────────────────────
    const offenseForm = useForm({
        side:             'offense',
        quarter:          lastQuarter,
        down:             nextDown,
        distance:         nextDistance,
        yard_line:        20,
        formation:        '',
        play_name:        '',
        play_type:        'run',
        ball_carrier_id:  '',
        yards_gained:     0,
        is_complete:      false,
        is_touchdown:     false,
        is_turnover:      false,
        penalty_type:     '',
        penalty_yards:    '',
        notes:            '',
    });

    // ── Defense Form ─────────────────────────────────────────
    const defenseForm = useForm({
        side:                     'defense',
        quarter:                  lastQuarter,
        down:                     nextDown,
        distance:                 nextDistance,
        yard_line:                20,
        defensive_look:           '',
        tackler_id:               '',
        missed_tackler_id:        '',
        coverage_miss_player_id:  '',
        interception_player_id:   '',
        blocked_by_player_id:     '',
        turnover_forced:          false,
        notes:                    '',
    });

    // ── Opponent Form ─────────────────────────────────────────
    const opponentForm = useForm({
        quarter:           lastQuarter,
        down:              1,
        distance:          10,
        yard_line:         20,
        play_type:         'middle_run',
        yards_gained:      0,
        miss_tackle:       false,
        miss_coverage:     false,
        interception:      false,
        blocked:           false,
        touchdown_allowed: false,
        notes:             '',
    });

    const submitOffense = (e) => {
        e.preventDefault();
        offenseForm.post(
            route('teams.games.plays.store', [team.id, game.id]),
            { onSuccess: () => offenseForm.reset() }
        );
    };

    const submitDefense = (e) => {
        e.preventDefault();
        defenseForm.post(
            route('teams.games.plays.store', [team.id, game.id]),
            { onSuccess: () => defenseForm.reset() }
        );
    };

    const submitOpponent = (e) => {
        e.preventDefault();
        opponentForm.post(
            route('teams.games.opponent-plays.store', [team.id, game.id]),
            { onSuccess: () => opponentForm.reset() }
        );
    };

    const deletePlay = (playId) => {
        if (confirm('Delete this play?')) {
            router.delete(route('teams.games.plays.destroy', [team.id, game.id, playId]));
        }
    };

    const offensivePlays  = plays.filter(p => p.side === 'offense');
    const defensivePlays  = plays.filter(p => p.side === 'defense');

    return (
        <>
            <Head title={`Log Plays — vs ${game.opponent_name}`} />
            <div className="max-w-5xl mx-auto py-8 px-4">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <Link
                            href={route('teams.games.show', [team.id, game.id])}
                            className="text-sm text-gray-400 hover:text-gray-600"
                        >
                            ← vs {game.opponent_name}
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900 mt-1">
                            Log Plays
                        </h1>
                    </div>
                    <div className="text-right text-sm text-gray-400">
                        <div className="font-semibold text-gray-700 text-lg">
                            {team.name} {game.my_team_score} — {game.opponent_score} {game.opponent_name}
                        </div>
                        <div>{game.field_length} yd field</div>
                    </div>
                </div>

                {flash?.success && (
                    <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded text-sm">
                        {flash.success}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* LEFT — Log Form */}
                    <div>
                        {/* Tab Switcher */}
                        <div className="flex rounded-lg border overflow-hidden mb-4 bg-white">
                            {['offense', 'defense', 'opponent'].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTab(t)}
                                    className={`flex-1 py-2.5 text-sm font-medium capitalize transition-colors ${
                                        tab === t
                                            ? t === 'offense'
                                                ? 'bg-green-600 text-white'
                                                : t === 'defense'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-red-500 text-white'
                                            : 'text-gray-500 hover:bg-gray-50'
                                    }`}
                                >
                                    {t === 'opponent' ? 'Opponent' : t.charAt(0).toUpperCase() + t.slice(1)}
                                </button>
                            ))}
                        </div>

                        {/* ── OFFENSE FORM ── */}
                        {tab === 'offense' && (
                            <form onSubmit={submitOffense} className="bg-white border rounded-lg p-5 space-y-4">
                                <h2 className="font-semibold text-green-700 text-sm uppercase tracking-wide">
                                    Offensive Play
                                </h2>

                                {/* Situation */}
                                <div className="grid grid-cols-4 gap-2">
                                    <Field label="Qtr">
                                        <select value={offenseForm.data.quarter} onChange={e => offenseForm.setData('quarter', +e.target.value)} className="input">
                                            {QUARTERS.map(q => <option key={q} value={q}>Q{q}</option>)}
                                        </select>
                                    </Field>
                                    <Field label="Down">
                                        <select value={offenseForm.data.down} onChange={e => offenseForm.setData('down', +e.target.value)} className="input">
                                            {DOWNS.map(d => <option key={d} value={d}>{d}{ordinal(d)}</option>)}
                                        </select>
                                    </Field>
                                    <Field label="Distance">
                                        <input type="number" min="0" value={offenseForm.data.distance} onChange={e => offenseForm.setData('distance', +e.target.value)} className="input" />
                                    </Field>
                                    <Field label="Yard Line">
                                        <input type="number" min="0" max={game.field_length} value={offenseForm.data.yard_line} onChange={e => offenseForm.setData('yard_line', +e.target.value)} className="input" />
                                    </Field>
                                </div>

                                {/* Play Info */}
                                <div className="grid grid-cols-2 gap-3">
                                    <Field label="Formation">
                                        <input type="text" placeholder="e.g., I-Form, Shotgun" value={offenseForm.data.formation} onChange={e => offenseForm.setData('formation', e.target.value)} className="input" />
                                    </Field>
                                    <Field label="Play Name">
                                        <input type="text" placeholder="e.g., Power Right" value={offenseForm.data.play_name} onChange={e => offenseForm.setData('play_name', e.target.value)} className="input" />
                                    </Field>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <Field label="Play Type">
                                        <select value={offenseForm.data.play_type} onChange={e => offenseForm.setData('play_type', e.target.value)} className="input">
                                            {PLAY_TYPES.map(t => (
                                                <option key={t} value={t}>{t.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
                                            ))}
                                        </select>
                                    </Field>
                                    <Field label="Ball Carrier">
                                        <select value={offenseForm.data.ball_carrier_id} onChange={e => offenseForm.setData('ball_carrier_id', e.target.value)} className="input">
                                            <option value="">— Select player —</option>
                                            {players.map(p => (
                                                <option key={p.id} value={p.id}>#{p.jersey_number} {p.name}</option>
                                            ))}
                                        </select>
                                    </Field>
                                </div>

                                <Field label="Yards Gained">
                                    <input type="number" value={offenseForm.data.yards_gained} onChange={e => offenseForm.setData('yards_gained', +e.target.value)} className="input" />
                                </Field>

                                {/* Pass specific */}
                                {offenseForm.data.play_type === 'pass' && (
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" id="is_complete" checked={offenseForm.data.is_complete} onChange={e => offenseForm.setData('is_complete', e.target.checked)} className="w-4 h-4 accent-green-600" />
                                        <label htmlFor="is_complete" className="text-sm text-gray-600">Completion</label>
                                    </div>
                                )}

                                {/* Penalty specific */}
                                {offenseForm.data.play_type === 'penalty' && (
                                    <div className="grid grid-cols-2 gap-3">
                                        <Field label="Penalty Type">
                                            <select value={offenseForm.data.penalty_type} onChange={e => offenseForm.setData('penalty_type', e.target.value)} className="input">
                                                <option value="">— Select —</option>
                                                {PENALTIES.map(p => <option key={p} value={p}>{p}</option>)}
                                            </select>
                                        </Field>
                                        <Field label="Penalty Yards">
                                            <input type="number" value={offenseForm.data.penalty_yards} onChange={e => offenseForm.setData('penalty_yards', +e.target.value)} className="input" />
                                        </Field>
                                    </div>
                                )}

                                {/* Toggles */}
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                        <input type="checkbox" checked={offenseForm.data.is_touchdown} onChange={e => offenseForm.setData('is_touchdown', e.target.checked)} className="w-4 h-4 accent-green-600" />
                                        Touchdown
                                    </label>
                                    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                        <input type="checkbox" checked={offenseForm.data.is_turnover} onChange={e => offenseForm.setData('is_turnover', e.target.checked)} className="w-4 h-4 accent-red-500" />
                                        Turnover
                                    </label>
                                </div>

                                <Field label="Notes">
                                    <input type="text" placeholder="Optional notes..." value={offenseForm.data.notes} onChange={e => offenseForm.setData('notes', e.target.value)} className="input" />
                                </Field>

                                <button type="submit" disabled={offenseForm.processing} className="w-full bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 font-medium disabled:opacity-50">
                                    {offenseForm.processing ? 'Saving...' : 'Log Offensive Play'}
                                </button>
                            </form>
                        )}

                        {/* ── DEFENSE FORM ── */}
                        {tab === 'defense' && (
                            <form onSubmit={submitDefense} className="bg-white border rounded-lg p-5 space-y-4">
                                <h2 className="font-semibold text-blue-700 text-sm uppercase tracking-wide">
                                    Defensive Play
                                </h2>

                                {/* Situation */}
                                <div className="grid grid-cols-4 gap-2">
                                    <Field label="Qtr">
                                        <select value={defenseForm.data.quarter} onChange={e => defenseForm.setData('quarter', +e.target.value)} className="input">
                                            {QUARTERS.map(q => <option key={q} value={q}>Q{q}</option>)}
                                        </select>
                                    </Field>
                                    <Field label="Down">
                                        <select value={defenseForm.data.down} onChange={e => defenseForm.setData('down', +e.target.value)} className="input">
                                            {DOWNS.map(d => <option key={d} value={d}>{d}{ordinal(d)}</option>)}
                                        </select>
                                    </Field>
                                    <Field label="Distance">
                                        <input type="number" min="0" value={defenseForm.data.distance} onChange={e => defenseForm.setData('distance', +e.target.value)} className="input" />
                                    </Field>
                                    <Field label="Yard Line">
                                        <input type="number" min="0" max={game.field_length} value={defenseForm.data.yard_line} onChange={e => defenseForm.setData('yard_line', +e.target.value)} className="input" />
                                    </Field>
                                </div>

                                <Field label="Defensive Look">
                                    <select value={defenseForm.data.defensive_look} onChange={e => defenseForm.setData('defensive_look', e.target.value)} className="input">
                                        <option value="">— Select look —</option>
                                        {DEF_LOOKS.map(l => <option key={l} value={l}>{l}</option>)}
                                    </select>
                                </Field>

                                <div className="grid grid-cols-2 gap-3">
                                    <Field label="Tackler">
                                        <select value={defenseForm.data.tackler_id} onChange={e => defenseForm.setData('tackler_id', e.target.value)} className="input">
                                            <option value="">— Select player —</option>
                                            {players.map(p => (
                                                <option key={p.id} value={p.id}>#{p.jersey_number} {p.name}</option>
                                            ))}
                                        </select>
                                    </Field>
                                    <Field label="Missed Tackle">
                                        <select value={defenseForm.data.missed_tackler_id} onChange={e => defenseForm.setData('missed_tackler_id', e.target.value)} className="input">
                                            <option value="">— Select player —</option>
                                            {players.map(p => (
                                                <option key={p.id} value={p.id}>#{p.jersey_number} {p.name}</option>
                                            ))}
                                        </select>
                                    </Field>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <Field label="Coverage Miss">
                                        <select value={defenseForm.data.coverage_miss_player_id} onChange={e => defenseForm.setData('coverage_miss_player_id', e.target.value)} className="input">
                                            <option value="">— Select player —</option>
                                            {players.map(p => (
                                                <option key={p.id} value={p.id}>#{p.jersey_number} {p.name}</option>
                                            ))}
                                        </select>
                                    </Field>
                                    <Field label="Interception By">
                                        <select value={defenseForm.data.interception_player_id} onChange={e => defenseForm.setData('interception_player_id', e.target.value)} className="input">
                                            <option value="">— Select player —</option>
                                            {players.map(p => (
                                                <option key={p.id} value={p.id}>#{p.jersey_number} {p.name}</option>
                                            ))}
                                        </select>
                                    </Field>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input type="checkbox" id="turnover_forced" checked={defenseForm.data.turnover_forced} onChange={e => defenseForm.setData('turnover_forced', e.target.checked)} className="w-4 h-4 accent-blue-600" />
                                    <label htmlFor="turnover_forced" className="text-sm text-gray-600">Forced Turnover</label>
                                </div>

                                <Field label="Notes">
                                    <input type="text" placeholder="Optional notes..." value={defenseForm.data.notes} onChange={e => defenseForm.setData('notes', e.target.value)} className="input" />
                                </Field>

                                <button type="submit" disabled={defenseForm.processing} className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50">
                                    {defenseForm.processing ? 'Saving...' : 'Log Defensive Play'}
                                </button>
                            </form>
                        )}

                        {/* ── OPPONENT FORM ── */}
                        {tab === 'opponent' && (
                            <form onSubmit={submitOpponent} className="bg-white border rounded-lg p-5 space-y-4">
                                <h2 className="font-semibold text-red-600 text-sm uppercase tracking-wide">
                                    Opponent Play
                                </h2>

                                <div className="grid grid-cols-4 gap-2">
                                    <Field label="Qtr">
                                        <select value={opponentForm.data.quarter} onChange={e => opponentForm.setData('quarter', +e.target.value)} className="input">
                                            {QUARTERS.map(q => <option key={q} value={q}>Q{q}</option>)}
                                        </select>
                                    </Field>
                                    <Field label="Down">
                                        <select value={opponentForm.data.down} onChange={e => opponentForm.setData('down', +e.target.value)} className="input">
                                            {DOWNS.map(d => <option key={d} value={d}>{d}{ordinal(d)}</option>)}
                                        </select>
                                    </Field>
                                    <Field label="Distance">
                                        <input type="number" min="0" value={opponentForm.data.distance} onChange={e => opponentForm.setData('distance', +e.target.value)} className="input" />
                                    </Field>
                                    <Field label="Yard Line">
                                        <input type="number" min="0" max={game.field_length} value={opponentForm.data.yard_line} onChange={e => opponentForm.setData('yard_line', +e.target.value)} className="input" />
                                    </Field>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <Field label="Play Type">
                                        <select value={opponentForm.data.play_type} onChange={e => opponentForm.setData('play_type', e.target.value)} className="input">
                                            {OPP_TYPES.map(t => (
                                                <option key={t} value={t}>{t.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
                                            ))}
                                        </select>
                                    </Field>
                                    <Field label="Yards Gained">
                                        <input type="number" value={opponentForm.data.yards_gained} onChange={e => opponentForm.setData('yards_gained', +e.target.value)} className="input" />
                                    </Field>
                                </div>

                                {/* Defensive performance checkboxes */}
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        ['miss_tackle',       'Miss Tackle'],
                                        ['miss_coverage',     'Miss Coverage'],
                                        ['interception',      'Interception'],
                                        ['blocked',           'Blocked'],
                                        ['touchdown_allowed', 'TD Allowed'],
                                    ].map(([key, label]) => (
                                        <label key={key} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={opponentForm.data[key]}
                                                onChange={e => opponentForm.setData(key, e.target.checked)}
                                                className="w-4 h-4 accent-red-500"
                                            />
                                            {label}
                                        </label>
                                    ))}
                                </div>

                                <Field label="Notes">
                                    <input type="text" placeholder="Optional notes..." value={opponentForm.data.notes} onChange={e => opponentForm.setData('notes', e.target.value)} className="input" />
                                </Field>

                                <button type="submit" disabled={opponentForm.processing} className="w-full bg-red-500 text-white py-2.5 rounded-lg hover:bg-red-600 font-medium disabled:opacity-50">
                                    {opponentForm.processing ? 'Saving...' : 'Log Opponent Play'}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* RIGHT — Play Log */}
                    <div>
                        <h2 className="font-semibold text-gray-700 mb-3">
                            Play Log
                            <span className="ml-2 text-gray-400 font-normal text-sm">
                                ({plays.length} plays)
                            </span>
                        </h2>

                        {plays.length === 0 ? (
                            <div className="bg-white border rounded-lg p-8 text-center text-gray-400 text-sm">
                                No plays logged yet. Use the form to start tracking.
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
                                {[...plays].reverse().map((play) => (
                                    <PlayLogRow
                                        key={play.id}
                                        play={play}
                                        onDelete={() => deletePlay(play.id)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

function PlayLogRow({ play, onDelete }) {
    const isOffense = play.side === 'offense';
    const isDefense = play.side === 'defense';

    return (
        <div className={`bg-white border rounded-lg p-3 text-sm border-l-4 ${
            isOffense ? 'border-l-green-500' : isDefense ? 'border-l-blue-500' : 'border-l-red-400'
        }`}>
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                    {/* Situation line */}
                    <div className="text-xs text-gray-400 mb-1">
                        Q{play.quarter} · {play.down}{ordinal(play.down)} & {play.distance} · Yd {play.yard_line}
                    </div>

                    {/* Main line */}
                    <div className="font-medium text-gray-800">
                        {isOffense && (
                            <>
                                {play.play_name || play.play_type || 'Play'}
                                {play.formation && <span className="text-gray-400"> ({play.formation})</span>}
                                {play.ball_carrier && (
                                    <span className="text-gray-500"> · #{play.ball_carrier.jersey_number} {play.ball_carrier.name}</span>
                                )}
                            </>
                        )}
                        {isDefense && (
                            <>
                                {play.defensive_look || 'Defense'}
                                {play.tackler && (
                                    <span className="text-gray-500"> · Tackle: #{play.tackler.jersey_number} {play.tackler.name}</span>
                                )}
                            </>
                        )}
                    </div>

                    {/* Result */}
                    {isOffense && (
                        <div className="mt-1 flex gap-2 flex-wrap">
                            <span className={`font-semibold ${play.yards_gained > 0 ? 'text-green-600' : play.yards_gained < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                                {play.yards_gained > 0 ? '+' : ''}{play.yards_gained} yds
                            </span>
                            {play.is_touchdown && <Badge color="green">TD</Badge>}
                            {play.is_turnover && <Badge color="red">TO</Badge>}
                            {play.play_type === 'pass' && (
                                <Badge color={play.is_complete ? 'green' : 'gray'}>
                                    {play.is_complete ? 'Complete' : 'Incomplete'}
                                </Badge>
                            )}
                        </div>
                    )}
                    {isDefense && play.turnover_forced && (
                        <Badge color="blue">Forced TO</Badge>
                    )}
                </div>

                <button
                    onClick={onDelete}
                    className="text-gray-300 hover:text-red-400 text-xs shrink-0"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}

function Badge({ color, children }) {
    const colors = {
        green: 'bg-green-100 text-green-700',
        red:   'bg-red-100 text-red-700',
        blue:  'bg-blue-100 text-blue-700',
        gray:  'bg-gray-100 text-gray-500',
    };
    return (
        <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${colors[color]}`}>
            {children}
        </span>
    );
}

function Field({ label, error, children }) {
    return (
        <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
            {children}
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}

function ordinal(n) {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
}