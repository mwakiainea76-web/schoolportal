import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Head, Link } from "@inertiajs/react";
const errorMeta = {
  403: {
    title: "Access denied",
    message: "You do not have permission to view this page."
  },
  404: {
    title: "Page not found",
    message: "The page you are looking for could not be found."
  },
  500: {
    title: "Server error",
    message: "Something went wrong on our side. You can try signing in again and continue from there."
  },
  503: {
    title: "Service unavailable",
    message: "The app is temporarily unavailable. Please try again in a moment."
  }
};
function Error({ status }) {
  const details = errorMeta[status] ?? errorMeta[500];
  const showLoginAgain = Number(status) >= 500;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: details.title }),
    /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_35%),linear-gradient(180deg,_#09090b_0%,_#111827_100%)] px-4 py-10 text-white sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx("div", { className: "mx-auto flex min-h-[calc(100vh-5rem)] max-w-4xl items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/8 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-0 lg:grid-cols-[0.9fr,1.1fr]", children: [
      /* @__PURE__ */ jsxs("div", { className: "border-b border-white/10 bg-white/5 px-8 py-10 lg:border-b-0 lg:border-r", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.32em] text-emerald-300", children: "School Portal" }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-200", children: [
          "Error ",
          status
        ] }),
        /* @__PURE__ */ jsx("h1", { className: "mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl", children: details.title }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 max-w-md text-sm leading-7 text-slate-300 sm:text-base", children: details.message })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "px-8 py-10", children: /* @__PURE__ */ jsxs("div", { className: "rounded-[1.5rem] border border-white/10 bg-black/20 p-6", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold uppercase tracking-[0.24em] text-slate-400", children: "Next step" }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm leading-7 text-slate-300", children: "If this happened after your session changed or expired, signing in again is the quickest way to continue safely." }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-col gap-3 sm:flex-row", children: [
          showLoginAgain && /* @__PURE__ */ jsx(
            Link,
            {
              href: "/login",
              className: "inline-flex items-center justify-center rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400",
              children: "Login again"
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              href: "/",
              className: "inline-flex items-center justify-center rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/25 hover:bg-white/5",
              children: "Return home"
            }
          )
        ] })
      ] }) })
    ] }) }) }) })
  ] });
}
export {
  Error as default
};
