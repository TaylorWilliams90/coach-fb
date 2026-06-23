import { Head, Link } from '@inertiajs/react';

export default function GamesShow({ team, game, summary, topCarriers, plays, opponentPlays }) {
    const completionPct = summary.total_passes > 0
        ? Math.round((summary.completions / summary.total_passes) * 100)
        : 0;

    const turnoverMargin = summary.turnovers_forced - summary.turnovers_given;

    return (
        <>
            <Head title={`vs ${game.opponent_name}`} />
            <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">

                {/* Back */}
                <Link
                    href={route('teams.games.index', team.id)}
                    className="text-sm text-gray-400 hover:text-gray-600"
                >
                    ← All Games
                </Link>

                {/* Game Header */}
                <div className="bg-white border rounded-lg shadow-sm p-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-gray-400 uppercase tracking-wide mb-1">
                                {game.date
                                    ? new Date(game.date).toLocaleDateString('en-US', {
                                        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
                                      })
                                    : 'Date TBD'
                                }
                                {' · '}
                                <span className="capitalize">{game.home_or_away}</span>
                                {' · '}
                                {game.field_length} yd field
                            </p>
                            <h1 className="text-3xl font-bold text-gray-900">
                                vs. {game.opponent_name}
                            </h1>
                        </div>
                        <Link
                            href={route('teams.games.edit', [team.id, game.id])}
                            className="border border-gray-300 text-gray-600 px-3 py-1.5 rounded hover:bg-gray-50 text-sm"
                        >
                            Edit Game
                        </Link>
                    </div>

                    {/* Scoreboard */}
                    <div className="mt-6 flex items-center justify-center gap-8">
                        <div className="text-center">
                            <p className="text-sm text-gray-400 mb-1">{team.name}</p>
                            <p className="text-5xl font-bold text-gray-900">{game.my_team_score}</p>
                        </div>
                        <div className="text-2xl text-gray-300 font-light">—</div>
                        <div className="text-center">
                            <p className="text-sm text-gray-400 mb-1">{game.opponent_name}</p>
                            <p className="text-5xl font-bold text-gray-900">{game.opponent_score}</p>
                        </div>
                    </div>

                    <div className="text-center mt-4">
                        <span className={`inline-block text-xs px-3 py-1 rounded-full font-semibold ${
                            game.is_finished ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-700'
                        }`}>
                            {game.is_finished ? 'Final' : 'In Progress'}
                        </span>
                    </div>
                </div>

                {/* Offensive Summary */}
                <div className="bg-white border rounded-lg shadow-sm">
                    <div className="flex items-center justify-between px-6 py-4 border-b">
                        <h2 className="font-semibold text-gray-800">Offensive Summary</h2>
                        <Link
                            href={route('teams.games.plays.index', [team.id, game.id])}
                            className="text-sm text-green-600 hover:underline font-medium"
                        >
                            + Log Play
                        </Link>
                    </div>

                    {summary.total_offensive_plays === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <p className="text-sm">No offensive plays logged yet.</p>
                            <Link
                                href={route('teams.games.plays.index', [team.id, game.id])}
                                className="text-green-600 text-sm hover:underline mt-1 inline-block"
                            >
                                Start logging plays →
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 border-b">
                            <StatBox label="Total Yards" value={summary.total_yards} />
                            <StatBox label="Plays" value={summary.total_offensive_plays} />
                            <StatBox label="Touchdowns" value={summary.touchdowns} />
                            <StatBox label="Turnovers" value={summary.turnovers_given} negative />
                        </div>
                    )}

                    {summary.total_passes > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x border-b">
                            <StatBox label="Runs" value={summary.total_runs} />
                            <StatBox label="Passes" value={summary.total_passes} />
                            <StatBox label="Completions" value={summary.completions} />
                            <StatBox label="Completion %" value={`${completionPct}%`} />
                        </div>
                    )}

                    {/* Top Carriers */}
                    {topCarriers.length > 0 && (
                        <div className="px-6 py-4">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                                Top Ball Carriers
                            </h3>
                            <div className="space-y-2">
                                {topCarriers.map((carrier, i) => (
                                    <div key={i} className="flex items-center justify-between text-sm">
                                        <span className="font-medium text-gray-800">
                                            {carrier.player?.name ?? 'Unknown'}
                                        </span>
                                        <div className="flex gap-4 text-gray-500">
                                            <span>{carrier.carries} carries</span>
                                            <span className="font-semibold text-gray-800">
                                                {carrier.yards} yds
                                            </span>
                                            {carrier.touchdowns > 0 && (
                                                <span className="text-green-600 font-semibold">
                                                    {carrier.touchdowns} TD
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Defensive Summary */}
                <div className="bg-white border rounded-lg shadow-sm">
                    <div className="flex items-center justify-between px-6 py-4 border-b">
                        <h2 className="font-semibold text-gray-800">Defensive Summary</h2>
                        <Link
                            href={route('teams.games.opponent-plays.index', [team.id, game.id])}
                            className="text-sm text-green-600 hover:underline font-medium"
                        >
                            + Log Opponent Play
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0">
                        <StatBox label="Tackles" value={summary.total_tackles} />
                        <StatBox label="Missed Tackles" value={summary.missed_tackles} negative />
                        <StatBox label="Interceptions" value={summary.interceptions} />
                        <StatBox
                            label="Turnover Margin"
                            value={turnoverMargin > 0 ? `+${turnoverMargin}` : turnoverMargin}
                            negative={turnoverMargin < 0}
                        />
                    </div>
                </div>

            </div>
        </>
    );
}

function StatBox({ label, value, negative = false }) {
    return (
        <div className="p-4 text-center">
            <p className={`text-2xl font-bold ${negative && value > 0 ? 'text-red-500' : 'text-gray-900'}`}>
                {value}
            </p>
            <p className="text-xs text-gray-400 uppercase tracking-wide mt-0.5">{label}</p>
        </div>
    );
}