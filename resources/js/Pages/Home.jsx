export default function Home({ appName }) {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100">
            <div className="mx-auto max-w-4xl px-6 py-16">
                <h1 className="text-4xl font-bold tracking-tight">
                    {appName} + Inertia + React SSR
                </h1>
                <p className="mt-4 text-lg text-zinc-300">
                    You are server-side rendering a React page with Inertia.
                </p>
                <div className="mt-10 rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
                    <p className="font-mono text-sm text-zinc-300">
                        Try disabling JavaScript in your browser — this page
                        should still render.
                    </p>
                </div>
            </div>
        </div>
    );
}
