import { Head, Link, useForm } from '@inertiajs/react';

const POSITIONS = ['QB', 'RB', 'WR', 'TE', 'OL', 'DL', 'LB', 'DB', 'K', 'P'];

export default function PlayersCreate({ team }) {
    const { data, setData, post, processing, errors } = useForm({
        name:          '',
        jersey_number: '',
        position:      '',
        grade:         '',
        parent_name:   '',
        parent_phone:  '',
        parent_email:  '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('teams.players.store', team.id));
    };

    return (
        <>
            <Head title={`Add Player — ${team.name}`} />
            <div className="max-w-xl mx-auto py-10 px-4">
                <Link
                    href={route('teams.players.index', team.id)}
                    className="text-sm text-gray-400 hover:text-gray-600"
                >
                    ← Back to Roster
                </Link>

                <h1 className="text-2xl font-bold text-gray-900 mt-2 mb-6">Add Player</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Player Info */}
                    <section className="bg-white border rounded-lg p-5 shadow-sm space-y-4">
                        <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
                            Player Info
                        </h2>

                        <Field label="Full Name *" error={errors.name}>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                placeholder="e.g., Jake Williams"
                                className="input"
                            />
                        </Field>

                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Jersey Number *" error={errors.jersey_number}>
                                <input
                                    type="number"
                                    min="0"
                                    max="99"
                                    value={data.jersey_number}
                                    onChange={e => setData('jersey_number', e.target.value)}
                                    placeholder="e.g., 12"
                                    className="input"
                                />
                            </Field>

                            <Field label="Position *" error={errors.position}>
                                <select
                                    value={data.position}
                                    onChange={e => setData('position', e.target.value)}
                                    className="input"
                                >
                                    <option value="">— Select —</option>
                                    {POSITIONS.map(p => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                            </Field>
                        </div>

                        <Field label="Grade" error={errors.grade}>
                            <input
                                type="number"
                                min="1"
                                max="12"
                                value={data.grade}
                                onChange={e => setData('grade', e.target.value)}
                                placeholder="e.g., 8"
                                className="input"
                            />
                        </Field>
                    </section>

                    {/* Parent / Guardian Info */}
                    <section className="bg-white border rounded-lg p-5 shadow-sm space-y-4">
                        <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
                            Parent / Guardian <span className="text-gray-400 font-normal normal-case">(optional)</span>
                        </h2>

                        <Field label="Parent Name" error={errors.parent_name}>
                            <input
                                type="text"
                                value={data.parent_name}
                                onChange={e => setData('parent_name', e.target.value)}
                                placeholder="e.g., Sarah Williams"
                                className="input"
                            />
                        </Field>

                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Phone" error={errors.parent_phone}>
                                <input
                                    type="tel"
                                    value={data.parent_phone}
                                    onChange={e => setData('parent_phone', e.target.value)}
                                    placeholder="e.g., 801-555-0123"
                                    className="input"
                                />
                            </Field>

                            <Field label="Email" error={errors.parent_email}>
                                <input
                                    type="email"
                                    value={data.parent_email}
                                    onChange={e => setData('parent_email', e.target.value)}
                                    placeholder="e.g., sarah@email.com"
                                    className="input"
                                />
                            </Field>
                        </div>
                    </section>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 font-medium disabled:opacity-50"
                    >
                        {processing ? 'Adding...' : 'Add Player'}
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