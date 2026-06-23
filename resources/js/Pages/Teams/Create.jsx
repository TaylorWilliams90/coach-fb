import { Head, useForm } from '@inertiajs/react';

const GRADE_OPTIONS = [
    '6th Grade', '7th Grade', '8th Grade',
    'Freshman', 'JV', 'Varsity',
    'Rec League', 'Other',
];

export default function TeamsCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        season: '',
        location: '',
        grade: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('teams.store'));
    };

    return (
        <>
            <Head title="Create Team" />
            <div className="max-w-xl mx-auto py-10 px-4">
                <h1 className="text-2xl font-bold mb-6 text-gray-900">Create a Team</h1>

                <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-lg shadow-sm border">
                    <Field label="Team Name *" error={errors.name}>
                        <input
                            type="text"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            placeholder="e.g., Wildcats"
                            className="input"
                        />
                    </Field>

                    <Field label="Grade / Level" error={errors.grade}>
                        <select
                            value={data.grade}
                            onChange={e => setData('grade', e.target.value)}
                            className="input"
                        >
                            <option value="">— Select grade —</option>
                            {GRADE_OPTIONS.map(g => (
                                <option key={g} value={g}>{g}</option>
                            ))}
                        </select>
                    </Field>

                    <Field label="Season" error={errors.season}>
                        <input
                            type="text"
                            value={data.season}
                            onChange={e => setData('season', e.target.value)}
                            placeholder="e.g., 2025 Fall"
                            className="input"
                        />
                    </Field>

                    <Field label="Location" error={errors.location}>
                        <input
                            type="text"
                            value={data.location}
                            onChange={e => setData('location', e.target.value)}
                            placeholder="e.g., Springville, UT"
                            className="input"
                        />
                    </Field>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 font-medium disabled:opacity-50"
                    >
                        {processing ? 'Saving...' : 'Create Team'}
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