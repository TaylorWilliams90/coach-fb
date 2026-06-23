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

export default function PlayersIndex({ team, players, flash }) {
    const handleDelete = (playerId) => {
        if (confirm('Remove this player from the roster?')) {
            router.delete(route('teams.players.destroy', [team.id, playerId]));
        }
    };

    return (
        <>
            <Head title={`${team.name} — Roster`} />
            <div className="max-w-4xl mx-auto py-10 px-4">

                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <Link
                            href={route('teams.show', team.id)}
                            className="text-sm text-gray-400 hover:text-gray-600"
                        >
                            ← {team.name}
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900 mt-1">Roster</h1>
                    </div>
                    <div className="flex gap-2">
                        <label className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 text-sm font-medium cursor-pointer">
                            Import CSV
                            <input
                                type="file"
                                accept=".csv"
                                className="hidden"
                                onChange={(e) => handleCsvUpload(e, team.id)}
                            />
                        </label>
                        <Link
                            href={route('teams.players.create', team.id)}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm font-medium"
                        >
                            + Add Player
                        </Link>
                    </div>
                </div>

                {/* Flash messages */}
                {flash?.success && (
                    <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded text-sm">
                        {flash.success}
                    </div>
                )}
                {flash?.importErrors?.length > 0 && (
                    <div className="mb-4 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded text-sm">
                        <p className="font-medium mb-1">Some rows were skipped:</p>
                        <ul className="list-disc list-inside space-y-0.5">
                            {flash.importErrors.map((err, i) => <li key={i}>{err}</li>)}
                        </ul>
                    </div>
                )}

                {/* Empty state */}
                {players.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="text-5xl mb-4">👕</div>
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">No players yet</h2>
                        <p className="text-gray-400 text-sm mb-6 max-w-sm">
                            Add players one at a time or import your whole roster from a CSV file.
                        </p>
                        <div className="flex gap-3">
                            <label className="border border-gray-300 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium cursor-pointer">
                                Import CSV
                                <input
                                    type="file"
                                    accept=".csv"
                                    className="hidden"
                                    onChange={(e) => handleCsvUpload(e, team.id)}
                                />
                            </label>
                            <Link
                                href={route('teams.players.create', team.id)}
                                className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 text-sm font-medium"
                            >
                                Add First Player
                            </Link>
                        </div>
                    </div>
                ) : (
                    <>
                        <p className="text-sm text-gray-400 mb-4">{players.length} players</p>
                        <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 border-b text-gray-500 uppercase text-xs tracking-wide">
                                    <tr>
                                        <th className="px-4 py-3 text-left w-12">#</th>
                                        <th className="px-4 py-3 text-left">Name</th>
                                        <th className="px-4 py-3 text-left">Position</th>
                                        <th className="px-4 py-3 text-left">Grade</th>
                                        <th className="px-4 py-3 text-left">Parent</th>
                                        <th className="px-4 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {players.map((player) => (
                                        <tr key={player.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 font-bold text-gray-700">
                                                {player.jersey_number}
                                            </td>
                                            <td className="px-4 py-3 font-medium text-gray-900">
                                                {player.name}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${POSITION_COLORS[player.position] ?? 'bg-gray-100 text-gray-600'}`}>
                                                    {player.position}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-gray-500">
                                                {player.grade ? `Grade ${player.grade}` : '—'}
                                            </td>
                                            <td className="px-4 py-3 text-gray-500">
                                                {player.parent_name ?? '—'}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-3">
                                                    <Link
                                                        href={route('teams.players.edit', [team.id, player.id])}
                                                        className="text-gray-500 hover:text-gray-800"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(player.id)}
                                                        className="text-red-400 hover:text-red-600"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

function handleCsvUpload(e, teamId) {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('csv_file', file);

    router.post(route('teams.players.import', teamId), formData, {
        forceFormData: true,
    });
}