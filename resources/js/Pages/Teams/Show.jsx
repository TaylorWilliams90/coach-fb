import { Head, Link, router } from '@inertiajs/react';

const POSITION_COLORS = {
    QB: 'bg-red-100 text-red-700',
    RB: 'bg-orange-100 text-orange-700',
    WR: 'bg-yellow-100 text-yellow-700',
    TE: 'bg-green-100 text-green-700',
    OL: 'bg-blue-100 text-blue-700',
    DL: 'bg-purple-100 text-purple-700',
    LB: 'bg-pink-100 text-pink-700',
    DB: 'bg-indigo-100 text-indigo-700',
    K:  'bg-gray-100 text-gray-700',
    P:  'bg-gray-100 text-gray-700',
};



export default function TeamsShow({ team, players, recentGames }) {

    // Group players by position for the summary
    const byPosition = players.reduce((acc, player) => {
        if (!acc[player.position]) acc[player.position] = [];
        acc[player.position].push(player);
        return acc;
    }, {});

    return (
        <>
            <Head title={team.name} />
            <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">

                {/* Back link */}
                <Link
                    href={route('teams.index')}
                    className="text-sm text-gray-400 hover:text-gray-600"
                >
                    ← All Teams
                </Link>

                {/* Team Header Card */}
                <div className="bg-white border rounded-lg shadow-sm p-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <span className="text-3xl">🏈</span>
                                <h1 className="text-3xl font-bold text-gray-900">{team.name}</h1>
                            </div>
                            <p className="text-gray-500 text-sm mt-1">
                                {[team.grade, team.season, team.location]
                                    .filter(Boolean)
                                    .join(' · ')}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Link
                                href={route('teams.edit', team.id)}
                                className="border border-gray-300 text-gray-600 px-3 py-1.5 rounded hover:bg-gray-50 text-sm"
                            >
                                Edit Team
                            </Link>
                        </div>
                    </div>

                    {/* Quick Stats Row */}
                    <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
                        <StatBox
                            label="Players"
                            value={players.length}
                        />
                        <StatBox
                            label="Positions"
                            value={Object.keys(byPosition).length}
                        />
                        <StatBox
                            label="Season"
                            value={team.season ?? '—'}
                        />
                    </div>
                </div>

                {/* Roster Summary Card */}
                <div className="bg-white border rounded-lg shadow-sm">
                    <div className="flex items-center justify-between px-6 py-4 border-b">
                        <h2 className="font-semibold text-gray-800">Roster</h2>
                        <Link
                            href={route('teams.players.index', team.id)}
                            className="text-sm text-green-600 hover:underline font-medium"
                        >
                            Manage Roster →
                        </Link>
                    </div>

                    {players.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                            <div className="text-4xl mb-3">👕</div>
                            <h3 className="font-semibold text-gray-700 mb-1">No players yet</h3>
                            <p className="text-gray-400 text-sm mb-4">
                                Add players to your roster to get started.
                            </p>
                            <Link
                                href={route('teams.players.index', team.id)}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-medium"
                            >
                                Add Players
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* Position Group Summary */}
                            <div className="px-6 py-4 border-b">
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(byPosition).map(([pos, posPlayers]) => (
                                        <div
                                            key={pos}
                                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${POSITION_COLORS[pos] ?? 'bg-gray-100 text-gray-600'}`}
                                        >
                                            {pos}
                                            <span className="bg-white bg-opacity-60 rounded-full px-1.5 py-0.5">
                                                {posPlayers.length}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Player List — show first 10, then link to full roster */}
                            <div className="divide-y divide-gray-50">
                                {players.slice(0, 10).map((player) => (
                                    <div
                                        key={player.id}
                                        className="flex items-center px-6 py-3 hover:bg-gray-50"
                                    >
                                        <span className="w-8 text-sm font-bold text-gray-400">
                                            #{player.jersey_number}
                                        </span>
                                        <span className="flex-1 text-sm font-medium text-gray-800">
                                            {player.name}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${POSITION_COLORS[player.position] ?? 'bg-gray-100 text-gray-600'}`}>
                                            {player.position}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Show more link if roster > 10 */}
                            {players.length > 10 && (
                                <div className="px-6 py-3 border-t text-center">
                                    <Link
                                        href={route('teams.players.index', team.id)}
                                        className="text-sm text-green-600 hover:underline"
                                    >
                                        View all {players.length} players →
                                    </Link>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="bg-white border rounded-lg shadow-sm">
                    <div className="flex items-center justify-between px-6 py-4 border-b">
                        <h2 className="font-semibold text-gray-800">Games</h2>
                        <div className="flex items-center gap-3">
                            <Link
                                href={route('teams.games.create', team.id)}
                                className="bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 text-sm font-medium"
                            >
                                + Add Game
                            </Link>
                            <Link
                                href={route('teams.games.index', team.id)}
                                className="text-sm text-green-600 hover:underline font-medium"
                            >
                                View All →
                            </Link>
                        </div>
                    </div>

                    {recentGames.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                            <div className="text-4xl mb-3">📋</div>
                            <h3 className="font-semibold text-gray-700 mb-1">No games yet</h3>
                            <p className="text-gray-400 text-sm mb-4">
                                Once you add games, they'll appear here.
                            </p>
                            <Link
                                href={route('teams.games.create', team.id)}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-medium"
                            >
                                Add First Game
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {recentGames.map((game) => (
                                <Link
                                    key={game.id}
                                    href={route('teams.games.show', [team.id, game.id])}
                                    className="flex items-center justify-between px-6 py-4 hover:bg-gray-50"
                                >
                                    <div>
                                        <div className="font-medium text-gray-800">
                                            vs. {game.opponent_name}
                                        </div>
                                        <div className="text-xs text-gray-400 mt-0.5">
                                            {game.date
                                                ? new Date(game.date).toLocaleDateString('en-US', {
                                                    month: 'short', day: 'numeric', year: 'numeric'
                                                })
                                                : 'No date'
                                            }
                                            {' · '}
                                            <span className="capitalize">{game.home_or_away}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-gray-900">
                                            {game.my_team_score} – {game.opponent_score}
                                        </span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                            game.is_finished
                                                ? game.my_team_score > game.opponent_score
                                                    ? 'bg-green-100 text-green-700'
                                                    : game.my_team_score < game.opponent_score
                                                    ? 'bg-red-100 text-red-600'
                                                    : 'bg-gray-100 text-gray-500'
                                                : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {game.is_finished
                                                ? game.my_team_score > game.opponent_score ? 'W'
                                                    : game.my_team_score < game.opponent_score ? 'L'
                                                    : 'T'
                                                : 'Live'
                                            }
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

function StatBox({ label, value }) {
    return (
        <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-400 uppercase tracking-wide mt-0.5">{label}</p>
        </div>
    );
}