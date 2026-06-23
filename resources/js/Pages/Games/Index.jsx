import { Head, Link, router } from '@inertiajs/react';

export default function GamesIndex({ team, games, flash }) {
    const handleDelete = (gameId) => {
        if (confirm('Delete this game and all its plays?')) {
            router.delete(route('teams.games.destroy', [team.id, gameId]));
        }
    };

    return (
        <>
            <Head title={`${team.name} — Games`} />
            <div className="max-w-4xl mx-auto py-10 px-4">

                <div className="flex items-center justify-between mb-6">
                    <div>
                        <Link
                            href={route('teams.show', team.id)}
                            className="text-sm text-gray-400 hover:text-gray-600"
                        >
                            ← {team.name}
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900 mt-1">Games</h1>
                    </div>
                    <Link
                        href={route('teams.games.create', team.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm font-medium"
                    >
                        + Add Game
                    </Link>
                </div>

                {flash?.success && (
                    <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded text-sm">
                        {flash.success}
                    </div>
                )}

                {games.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="text-5xl mb-4">📋</div>
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">No games yet</h2>
                        <p className="text-gray-400 text-sm mb-6 max-w-sm">
                            Add your first game to start tracking plays and performance.
                        </p>
                        <Link
                            href={route('teams.games.create', team.id)}
                            className="bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 font-medium text-sm"
                        >
                            Add First Game
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {games.map((game) => (
                            <div
                                key={game.id}
                                className="bg-white border rounded-lg p-4 shadow-sm"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        {/* Score */}
                                        <div className="text-center min-w-[80px]">
                                            <div className="text-2xl font-bold text-gray-900">
                                                {game.my_team_score} – {game.opponent_score}
                                            </div>
                                            <div className={`text-xs font-semibold mt-0.5 ${
                                                game.my_team_score > game.opponent_score
                                                    ? 'text-green-600'
                                                    : game.my_team_score < game.opponent_score
                                                    ? 'text-red-500'
                                                    : 'text-gray-400'
                                            }`}>
                                                {game.my_team_score > game.opponent_score ? 'WIN'
                                                    : game.my_team_score < game.opponent_score ? 'LOSS'
                                                    : game.is_finished ? 'TIE' : 'IN PROGRESS'}
                                            </div>
                                        </div>

                                        {/* Game info */}
                                        <div>
                                            <div className="font-semibold text-gray-800">
                                                vs. {game.opponent_name}
                                            </div>
                                            <div className="text-sm text-gray-400 mt-0.5">
                                                {game.date
                                                    ? new Date(game.date).toLocaleDateString('en-US', {
                                                        month: 'short', day: 'numeric', year: 'numeric'
                                                      })
                                                    : 'No date set'
                                                }
                                                {' · '}
                                                <span className="capitalize">{game.home_or_away}</span>
                                                {' · '}
                                                {game.field_length} yd field
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status + Actions */}
                                    <div className="flex items-center gap-4">
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                            game.is_finished
                                                ? 'bg-gray-100 text-gray-500'
                                                : 'bg-green-100 text-green-700'
                                        }`}>
                                            {game.is_finished ? 'Final' : 'Active'}
                                        </span>
                                        <div className="flex gap-3 text-sm">
                                            <Link
                                                href={route('teams.games.show', [team.id, game.id])}
                                                className="text-blue-600 hover:underline"
                                            >
                                                View
                                            </Link>
                                            <Link
                                                href={route('teams.games.edit', [team.id, game.id])}
                                                className="text-gray-500 hover:underline"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(game.id)}
                                                className="text-red-400 hover:text-red-600"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}