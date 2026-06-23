import { Head, Link, router } from '@inertiajs/react';

export default function TeamsIndex({ teams }) {
    const handleDelete = (id) => {
        if (confirm('Delete this team?')) {
            router.delete(route('teams.destroy', id));
        }
    };

    return (
        <>
            <Head title="My Teams" />
            <div className="max-w-4xl mx-auto py-10 px-4">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">My Teams</h1>
                    {teams.length > 0 && (
                        <Link
                            href={route('teams.create')}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm font-medium"
                        >
                            + New Team
                        </Link>
                    )}
                </div>

                {teams.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        {/* Football icon */}
                        <div className="text-6xl mb-4">🏈</div>

                        <h2 className="text-xl font-semibold text-gray-700 mb-2">
                            No teams yet
                        </h2>
                        <p className="text-gray-400 text-sm mb-6 max-w-sm">
                            You haven't created any teams. Get started by creating your first team — you'll be able to track games, players, and stats from there.
                        </p>

                        <Link
                            href={route('teams.create')}
                            className="bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 font-medium text-sm"
                        >
                            Create Your First Team
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {teams.map((team) => (
                            <div
                                key={team.id}
                                className="bg-white border rounded-lg p-4 flex items-center justify-between shadow-sm"
                            >
                                <div>
                                    <h2 className="font-semibold text-gray-800 text-lg">{team.name}</h2>
                                    <p className="text-sm text-gray-500">
                                        {[team.grade, team.season, team.location]
                                            .filter(Boolean)
                                            .join(' · ')}
                                    </p>
                                </div>
                                <div className="flex gap-3 text-sm">
                                    <Link
                                        href={route('teams.show', team.id)}
                                        className="text-blue-600 hover:underline"
                                    >
                                        View
                                    </Link>
                                    <Link
                                        href={route('teams.edit', team.id)}
                                        className="text-gray-600 hover:underline"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(team.id)}
                                        className="text-red-500 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}