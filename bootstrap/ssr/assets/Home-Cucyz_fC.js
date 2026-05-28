import { jsx, jsxs } from "react/jsx-runtime";
function Home({ appName }) {
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-zinc-950 text-zinc-100", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-4xl px-6 py-16", children: [
    /* @__PURE__ */ jsxs("h1", { className: "text-4xl font-bold tracking-tight", children: [
      appName,
      " + Inertia + React SSR"
    ] }),
    /* @__PURE__ */ jsx("p", { className: "mt-4 text-lg text-zinc-300", children: "You are server-side rendering a React page with Inertia." }),
    /* @__PURE__ */ jsx("div", { className: "mt-10 rounded-xl border border-zinc-800 bg-zinc-900/60 p-6", children: /* @__PURE__ */ jsx("p", { className: "font-mono text-sm text-zinc-300", children: "Try disabling JavaScript in your browser — this page should still render." }) })
  ] }) });
}
export {
  Home as default
};
