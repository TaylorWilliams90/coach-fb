import { Head, Link, useForm } from '@inertiajs/react';

export default function GamesEdit({ team, game }) {
    const { data, setData, put, processing, errors } = useForm({
        opponent_name:  game.opponent_name,
        date:           game.date ?? '',
        home_or_away:   game.home_or_away,
        my_team_score:  game.my_team_score,
        opponent_score: game.opponent_score,
        is_finished:    game.is_finished,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('teams.games.update', [team.id, game.id]));
    };

    return (
        <>
            <Head title={`Edit Game — vs ${game.opponent_name}`} />
            <div className="max-w-xl mx-auto py-10 px-4">
                <Link
                    href={route('teams.games.show', [team.id, game.id])}
                    className="text-sm text-gray-400 hover:text-gray-600"
                >
                    ← Back to Game
                </Link>

                <h1 className="text-2xl font-bold text-gray-900 mt-2 mb-6">
                    Edit vs {game.opponent_name}
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <section className="bg-white border rounded-lg p-5 shadow-sm space-y-4">
                        <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
                            Game Info
                        </h2>

                        <Field label="Opponent Name *" error={errors.opponent_name}>
                            <input
                                type="text"
                                value={data.opponent_name}
                                onChange={e => setData('opponent_name', e.target.value)}
                                className="input"
                            />
                        </Field>

                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Date" error={errors.date}>
                                <input
                                    type="date"
                                    value={data.date}
                                    onChange={e => setData('date', e.target.value)}
                                    className="input"
                                />
                            </Field>

                            <Field label="Location" error={errors.home_or_away}>
                                <select
                                    value={data.home_or_away}
                                    onChange={e => setData('home_or_away', e.target.value)}
                                    className="input"
                                >
                                    <option value="home">Home</option>
                                    <option value="away">Away</option>
                                    <option value="neutral">Neutral</option>
                                </select>
                            </Field>
                        </div>
                    </section>

                    <section className="bg-white border rounded-lg p-5 shadow-sm space-y-4">
                        <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
                            Score
                        </h2>

                        <div className="grid grid-cols-2 gap-4">
                            <Field label={team.name} error={errors.my_team_score}>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.my_team_score}
                                    onChange={e => setData('my_team_score', parseInt(e.target.value))}
                                    className="input"
                                />
                            </Field>

                            <Field label={data.opponent_name || 'Opponent'} error={errors.opponent_score}>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.opponent_score}
                                    onChange={e => setData('opponent_score', parseInt(e.target.value))}
                                    className="input"
                                />
                            </Field>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_finished"
                                checked={data.is_finished}
                                onChange={e => setData('is_finished', e.target.checked)}
                                className="w-4 h-4 accent-green-600"
                            />
                            <label htmlFor="is_finished" className="text-sm text-gray-600">
                                Mark game as finished
                            </label>
                        </div>
                    </section>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 font-medium disabled:opacity-50"
                    >
                        {processing ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </>
    );
}

function Field({ label, error, children }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            {children}
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}