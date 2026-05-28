import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { usePage, Head, useForm, Link } from "@inertiajs/react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-Cmi-8zkq.js";
import { M as Modal } from "./Modal-DzNit_Do.js";
import { f as formatDate } from "./date-CQXYOX-2.js";
import { Wallet, CreditCard, GraduationCap, ShieldCheck, BookMarked, CalendarDays } from "lucide-react";
import "react-toastify";
import "@headlessui/react";
function Checkbox({ className = "", ...props }) {
  return /* @__PURE__ */ jsx(
    "input",
    {
      ...props,
      type: "checkbox",
      className: "rounded border-gray-300 text-emerald-600 shadow-sm focus:ring-emerald-600 " + className
    }
  );
}
const currency = (amount) => `Ksh ${new Intl.NumberFormat("en-KE", {
  style: "decimal",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
}).format(Number(amount || 0))}`;
function StudentDashboard({ dashboard, fullName }) {
  const moduleUnitIds = (dashboard.module_units ?? []).map(
    (unit) => String(unit.id)
  );
  const cards = [
    {
      label: "Outstanding Balance",
      value: currency(dashboard.finance.outstanding_balance),
      helper: dashboard.finance.next_invoice_due_date ? `Next due ${formatDate(dashboard.finance.next_invoice_due_date)}` : "No invoice due date available",
      icon: Wallet,
      tone: "from-emerald-500 to-emerald-600"
    },
    {
      label: "Total Paid",
      value: currency(dashboard.finance.total_paid),
      helper: "Payments recorded on your account",
      icon: CreditCard,
      tone: "from-slate-700 to-slate-800"
    },
    {
      label: "Current Module",
      value: dashboard.student?.current_module ?? "-",
      helper: dashboard.latest_session?.session ?? "No active session yet",
      icon: GraduationCap,
      tone: "from-sky-500 to-cyan-500"
    },
    {
      label: "Fee Discount",
      value: `${dashboard.student?.fee_discount_percentage ?? 0}%`,
      helper: "Current approved discount",
      icon: ShieldCheck,
      tone: "from-amber-500 to-orange-500"
    }
  ];
  const [showSessionRegistrationModal, setShowSessionRegistrationModal] = useState(false);
  const {
    post,
    processing,
    errors,
    clearErrors
  } = useForm({});
  const {
    data: unitRegistrationData,
    setData: setUnitRegistrationData,
    post: postUnitRegistration,
    processing: unitRegistrationProcessing,
    errors: unitRegistrationErrors,
    clearErrors: clearUnitRegistrationErrors
  } = useForm({
    program_version_unit_ids: (dashboard.module_units ?? []).filter((unit) => unit.is_registered).map((unit) => String(unit.id))
  });
  useEffect(() => {
    if (errors.session_registration) {
      setShowSessionRegistrationModal(true);
    }
  }, [errors.session_registration]);
  useEffect(() => {
    setUnitRegistrationData(
      "program_version_unit_ids",
      (dashboard.module_units ?? []).filter((unit) => unit.is_registered).map((unit) => String(unit.id))
    );
  }, [dashboard.module_units, setUnitRegistrationData]);
  const submitSessionRegistration = (e) => {
    e.preventDefault();
    post(route("student.dashboard.register-session"), {
      preserveScroll: true,
      onBefore: () => clearErrors(),
      onSuccess: () => {
        clearErrors();
        setShowSessionRegistrationModal(false);
      },
      onError: () => setShowSessionRegistrationModal(true)
    });
  };
  const toggleUnitSelection = (unitId) => {
    const value = String(unitId);
    setUnitRegistrationData(
      "program_version_unit_ids",
      unitRegistrationData.program_version_unit_ids.includes(value) ? unitRegistrationData.program_version_unit_ids.filter(
        (id) => id !== value
      ) : [...unitRegistrationData.program_version_unit_ids, value]
    );
  };
  const submitUnitRegistration = (e) => {
    e.preventDefault();
    postUnitRegistration(route("student.dashboard.register-units"), {
      preserveScroll: true,
      onBefore: () => clearUnitRegistrationErrors()
    });
  };
  const selectedUnitCount = unitRegistrationData.program_version_unit_ids.length;
  const allModuleUnitsSelected = moduleUnitIds.length > 0 && selectedUnitCount === moduleUnitIds.length;
  return /* @__PURE__ */ jsxs("div", { className: "animate-in fade-in slide-in-from-bottom-2 duration-700", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden rounded-[2rem] bg-[#1b263b] px-8 py-10 text-white shadow-xl", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.25),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.08),_transparent_25%)]" }),
      /* @__PURE__ */ jsxs("div", { className: "relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "max-w-2xl", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300", children: "Student Portal" }),
          /* @__PURE__ */ jsxs("h1", { className: "mt-3 text-4xl font-bold tracking-tight", children: [
            "Welcome back, ",
            fullName,
            "."
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mt-3 max-w-xl text-sm text-slate-300", children: "Keep track of your program progress, current session, billing status, and learning units from one place." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 sm:grid-cols-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-wide text-slate-300", children: "Program" }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm font-semibold", children: dashboard.program?.name ?? "Not assigned" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-wide text-slate-300", children: "Version" }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm font-semibold", children: dashboard.program?.version ?? "Not assigned" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-wide text-slate-300", children: "Reg. No" }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm font-semibold", children: dashboard.student?.registration_number ?? "-" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-wide text-slate-300", children: "Status" }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm font-semibold capitalize", children: dashboard.student?.status ?? "-" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4", children: cards.map((card) => {
      const Icon = card.icon;
      return /* @__PURE__ */ jsxs(
        "div",
        {
          className: "rounded-[1.75rem] border border-zinc-100 bg-white p-6 shadow-sm",
          children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: `inline-flex rounded-2xl bg-gradient-to-br ${card.tone} p-3 text-white shadow-lg`,
                children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" })
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "mt-5 text-sm font-medium text-zinc-500", children: card.label }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-2xl font-bold tracking-tight text-zinc-900", children: card.value }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-zinc-400", children: card.helper })
          ]
        },
        card.label
      );
    }) }),
    /* @__PURE__ */ jsxs("div", { className: "mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr,0.9fr]", children: [
      /* @__PURE__ */ jsxs("div", { className: "rounded-[1.75rem] border border-zinc-100 bg-white p-7 shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-zinc-900", children: "This Module's Units" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-zinc-500", children: "Units assigned to your current module." })
          ] }),
          /* @__PURE__ */ jsx(
            Link,
            {
              href: route("student.program-units.index"),
              className: "text-sm font-medium text-emerald-700 transition hover:text-emerald-800",
              children: "View all units"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-6", children: [
          !dashboard.latest_session && dashboard.unit_registration?.blocker ? /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm", children: [
            /* @__PURE__ */ jsx("p", { className: "font-semibold text-amber-900", children: "📋 Register Your Session First" }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-amber-800", children: "You must register for the current active session before you can register units. Once session registration is complete, you'll be able to select your units here." })
          ] }) : null,
          dashboard.module_units?.length ? /* @__PURE__ */ jsxs(
            "form",
            {
              onSubmit: submitUnitRegistration,
              className: `space-y-4 ${!dashboard.latest_session ? "mt-4" : ""}`,
              children: [
                /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-2xl border border-zinc-100", children: [
                  /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[0.5fr,0.9fr,1.8fr] gap-4 bg-zinc-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500", children: [
                    /* @__PURE__ */ jsx("p", { children: "Select" }),
                    /* @__PURE__ */ jsx("p", { children: "Code" }),
                    /* @__PURE__ */ jsx("p", { children: "Unit" })
                  ] }),
                  dashboard.module_units.map((unit) => /* @__PURE__ */ jsxs(
                    "label",
                    {
                      className: "grid cursor-pointer grid-cols-[0.5fr,0.9fr,1.8fr] gap-4 border-t border-zinc-100 bg-white px-4 py-3 text-sm text-zinc-700",
                      children: [
                        /* @__PURE__ */ jsx("div", { className: "flex items-center", children: /* @__PURE__ */ jsx(
                          Checkbox,
                          {
                            checked: unitRegistrationData.program_version_unit_ids.includes(
                              String(unit.id)
                            ),
                            onChange: () => toggleUnitSelection(
                              unit.id
                            ),
                            disabled: dashboard.unit_registration?.is_complete || !dashboard.latest_session,
                            className: "h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-600"
                          }
                        ) }),
                        /* @__PURE__ */ jsx("p", { className: "font-semibold text-emerald-700", children: unit.code ?? "-" }),
                        /* @__PURE__ */ jsxs("div", { children: [
                          /* @__PURE__ */ jsx("p", { className: "font-semibold text-zinc-900", children: unit.name }),
                          /* @__PURE__ */ jsxs("div", { className: "mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-500", children: [
                            /* @__PURE__ */ jsxs("span", { children: [
                              "Credit Factor:",
                              " ",
                              unit.credit_factor ?? "-"
                            ] }),
                            unit.is_registered ? /* @__PURE__ */ jsx("span", { className: "rounded-full bg-emerald-100 px-2 py-0.5 font-semibold text-emerald-700", children: "Registered" }) : null
                          ] })
                        ] })
                      ]
                    },
                    unit.id
                  ))
                ] }),
                unitRegistrationErrors.unit_registration ? /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600", children: unitRegistrationErrors.unit_registration }) : null,
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 rounded-2xl bg-zinc-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between", children: [
                  /* @__PURE__ */ jsx("div", { className: "text-sm text-zinc-600", children: dashboard.unit_registration?.is_complete ? "Units registered" : "Register all units" }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "submit",
                      disabled: unitRegistrationProcessing || !dashboard.unit_registration?.can_register || !allModuleUnitsSelected || !dashboard.latest_session,
                      className: "inline-flex rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50",
                      children: unitRegistrationProcessing ? "Registering..." : "Register Units"
                    }
                  )
                ] })
              ]
            }
          ) : /* @__PURE__ */ jsx("div", { className: "rounded-2xl bg-[#F8F9FA] px-4 py-4 text-sm text-zinc-500", children: "No units have been assigned to this module yet." }),
          /* @__PURE__ */ jsx("div", { className: "mt-3 rounded-2xl bg-[#F8F9FA] px-4 py-3 text-xs text-zinc-500", children: dashboard.all_units_count ? `${dashboard.all_units_count} total unit(s) are mapped to your program version.` : "Your full unit list will appear once units are mapped to your program version." })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxs("div", { className: "rounded-[1.75rem] border border-zinc-100 bg-white p-7 shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-zinc-900", children: "Study Snapshot" }),
          /* @__PURE__ */ jsx("div", { className: "rounded-2xl bg-sky-50 p-3 text-sky-600", children: /* @__PURE__ */ jsx(BookMarked, { className: "h-5 w-5" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-6 space-y-4 text-sm", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-zinc-50 px-4 py-3", children: [
            /* @__PURE__ */ jsx("p", { className: "text-zinc-500", children: "Program Version" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 font-semibold text-zinc-900", children: dashboard.program?.version ?? "Not assigned" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-zinc-50 px-4 py-3", children: [
            /* @__PURE__ */ jsx("p", { className: "text-zinc-500", children: "Current Session" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 font-semibold text-zinc-900", children: dashboard.latest_session?.session ?? "No session enrollment yet" }),
            !dashboard.latest_session ? /* @__PURE__ */ jsxs(Fragment, { children: [
              dashboard.session_registration?.blocker ? /* @__PURE__ */ jsx("p", { className: "mt-3 text-xs text-amber-700", children: dashboard.session_registration.blocker }) : null,
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setShowSessionRegistrationModal(
                    true
                  ),
                  disabled: !dashboard.session_registration?.can_register,
                  className: "mt-3 inline-flex rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50",
                  children: "Register current active session"
                }
              )
            ] }) : null
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-zinc-50 px-4 py-3", children: [
            /* @__PURE__ */ jsx("p", { className: "text-zinc-500", children: "Year of Study" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 font-semibold text-zinc-900", children: dashboard.latest_session?.year_of_study ? `Year ${dashboard.latest_session.year_of_study}` : "-" })
          ] })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(
      Modal,
      {
        show: showSessionRegistrationModal,
        onClose: () => setShowSessionRegistrationModal(false),
        maxWidth: "lg",
        children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "border-b border-zinc-100 pb-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-zinc-900", children: "Register Current Session" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-zinc-500", children: "Register yourself for the active academic session." })
          ] }),
          /* @__PURE__ */ jsxs(
            "form",
            {
              onSubmit: submitSessionRegistration,
              className: "space-y-5 pt-5",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-zinc-50 px-4 py-3", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-xs font-medium uppercase tracking-wide text-zinc-500", children: "Registration Number" }),
                  /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm font-semibold text-zinc-900", children: dashboard.student?.registration_number ?? "-" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-zinc-50 px-4 py-3", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-xs font-medium uppercase tracking-wide text-zinc-500", children: "Active Session" }),
                  /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm font-semibold text-zinc-900", children: dashboard.active_session ?? "No active session available" })
                ] }),
                errors.session_registration ? /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600", children: errors.session_registration }) : null,
                /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3 pt-2", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setShowSessionRegistrationModal(false),
                      className: "rounded-xl bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-300",
                      children: "Cancel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "submit",
                      disabled: processing || !dashboard.active_session || !dashboard.session_registration?.can_register,
                      className: "rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50",
                      children: processing ? "Registering..." : "Register Session"
                    }
                  )
                ] })
              ]
            }
          )
        ] })
      }
    )
  ] });
}
function StaffDashboard({ dashboard }) {
  const analytics = dashboard.analytics ?? {};
  const executive = analytics.executive ?? {};
  const finance = analytics.finance ?? {};
  const academic = analytics.academic ?? {};
  const admissions = analytics.admissions ?? {};
  const hostel = analytics.hostel ?? {};
  const dataQuality = analytics.data_quality ?? {};
  const snapshotTrends = analytics.snapshot_trends ?? {};
  const cards = [
    {
      label: "Programs",
      value: dashboard.stats?.[0]?.value ?? 0,
      icon: BookMarked,
      tone: "bg-emerald-50 text-emerald-600"
    },
    {
      label: "Program Versions",
      value: dashboard.stats?.[1]?.value ?? 0,
      icon: GraduationCap,
      tone: "bg-sky-50 text-sky-600"
    },
    {
      label: "Departments",
      value: dashboard.stats?.[2]?.value ?? 0,
      icon: ShieldCheck,
      tone: "bg-amber-50 text-amber-600"
    },
    {
      label: "Academic Years",
      value: dashboard.stats?.[3]?.value ?? 0,
      icon: CalendarDays,
      tone: "bg-slate-100 text-slate-700"
    }
  ];
  const executiveCards = [
    {
      label: "Total Students",
      value: executive.metrics?.total_students ?? 0
    },
    {
      label: "Active Students",
      value: executive.metrics?.active_students ?? 0
    },
    {
      label: "Registered In Session",
      value: executive.metrics?.students_registered_in_active_session ?? 0,
      helper: `${executive.metrics?.session_registration_rate ?? 0}% registration`
    },
    {
      label: "Outstanding Balance",
      value: currency(executive.metrics?.outstanding_balance ?? 0)
    }
  ];
  const financeCards = [
    {
      label: "Collection Rate",
      value: `${finance.metrics?.collection_rate ?? 0}%`
    },
    {
      label: "Overdue Balance",
      value: currency(finance.metrics?.overdue_balance ?? 0)
    },
    {
      label: "Approval Backlog",
      value: finance.metrics?.approval_backlog_count ?? 0
    },
    {
      label: "Credit Balance Students",
      value: finance.metrics?.credit_balance_students ?? 0
    }
  ];
  const academicCards = [
    {
      label: "Registration Rate",
      value: `${academic.metrics?.session_registration_rate ?? 0}%`
    },
    {
      label: "Students Not Registered",
      value: academic.metrics?.students_not_registered_count ?? 0
    },
    {
      label: "Timetable Completion",
      value: `${academic.metrics?.timetable_completion_rate ?? 0}%`
    },
    {
      label: "Lecturer Clashes",
      value: academic.metrics?.lecturer_clash_count ?? 0
    }
  ];
  const admissionsCards = [
    {
      label: "Admissions In Range",
      value: admissions.metrics?.new_admissions_in_range ?? 0
    },
    {
      label: "Inactive Accounts",
      value: admissions.metrics?.inactive_accounts ?? 0
    },
    {
      label: "Missing Program Enrollment",
      value: admissions.metrics?.students_missing_program_enrollment_count ?? 0
    },
    {
      label: "Duplicate Contacts",
      value: admissions.metrics?.duplicate_contact_risk_count ?? 0
    }
  ];
  const hostelCards = [
    {
      label: "Occupancy Rate",
      value: `${hostel.metrics?.occupancy_rate ?? 0}%`
    },
    {
      label: "Available Beds",
      value: hostel.metrics?.available_beds ?? 0
    },
    {
      label: "Revenue Collected",
      value: currency(hostel.metrics?.hostel_revenue_collected ?? 0)
    },
    {
      label: "Allocated Not Billed",
      value: hostel.metrics?.allocated_but_not_billed_count ?? 0
    }
  ];
  const qualityCards = [
    {
      label: "Missing Relationships",
      value: dataQuality.metrics?.records_missing_required_relationships ?? 0
    },
    {
      label: "Orphaned Financial Records",
      value: dataQuality.metrics?.orphaned_financial_records ?? 0
    },
    {
      label: "Slow Queries",
      value: dataQuality.metrics?.slow_query_count ?? 0
    },
    {
      label: "Failed Jobs",
      value: dataQuality.metrics?.failed_job_count ?? 0
    }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "animate-in fade-in slide-in-from-bottom-2 duration-700", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold tracking-tight text-zinc-900", children: "Academic Overview" }),
    /* @__PURE__ */ jsx("p", { className: "mt-1 text-zinc-500", children: "Manage programs, program versions, and institutional scheduling from one place." }),
    /* @__PURE__ */ jsx("div", { className: "mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4", children: cards.map((card) => {
      const Icon = card.icon;
      return /* @__PURE__ */ jsxs(
        "div",
        {
          className: "rounded-[1.75rem] border border-zinc-100 bg-white p-6 shadow-sm",
          children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: `inline-flex rounded-2xl p-3 ${card.tone}`,
                children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" })
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "mt-5 text-sm font-medium text-zinc-500", children: card.label }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-3xl font-bold tracking-tight text-zinc-900", children: card.value })
          ]
        },
        card.label
      );
    }) }),
    /* @__PURE__ */ jsxs("div", { className: "mt-10 space-y-8", children: [
      /* @__PURE__ */ jsx(
        DashboardSection,
        {
          title: "Executive Analytics",
          description: `Active session: ${executive.active_session?.label ?? "No active session"}`,
          cards: executiveCards
        }
      ),
      /* @__PURE__ */ jsx(
        DashboardSection,
        {
          title: "Finance Analytics",
          description: "Billing health, debt exposure, and finance exception signals.",
          cards: financeCards
        }
      ),
      /* @__PURE__ */ jsx(
        DashboardSection,
        {
          title: "Academic Analytics",
          description: "Session registration, timetable coverage, and academic operational signals.",
          cards: academicCards
        }
      ),
      /* @__PURE__ */ jsx(
        DashboardSection,
        {
          title: "Admissions Analytics",
          description: "Intake quality, onboarding completeness, and admissions risk indicators.",
          cards: admissionsCards
        }
      ),
      /* @__PURE__ */ jsx(
        DashboardSection,
        {
          title: "Hostel Analytics",
          description: "Occupancy, billing linkage, and accommodation exception indicators.",
          cards: hostelCards
        }
      ),
      /* @__PURE__ */ jsx(
        DashboardSection,
        {
          title: "Data Quality Signals",
          description: "Cross-system data integrity and operational health indicators.",
          cards: qualityCards
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 xl:grid-cols-3", children: [
        /* @__PURE__ */ jsx(
          DashboardListCard,
          {
            title: "Students Not Registered",
            items: academic.exceptions?.students_not_registered ?? [],
            emptyText: "No unregistered active students in the current sample.",
            renderItem: (item) => ({
              key: item.student_id,
              title: item.student_name,
              subtitle: item.registration_number,
              meta: `Module ${item.current_module}`
            })
          }
        ),
        /* @__PURE__ */ jsx(
          DashboardListCard,
          {
            title: "Admissions Exceptions",
            items: admissions.exceptions?.students_missing_program_enrollment ?? [],
            emptyText: "No missing program-enrollment cases found.",
            renderItem: (item) => ({
              key: item.student_id,
              title: item.student_name,
              subtitle: item.registration_number,
              meta: item.admission_date ?? ""
            })
          }
        ),
        /* @__PURE__ */ jsx(
          DashboardListCard,
          {
            title: "Hostel Billing Gaps",
            items: hostel.exceptions?.allocated_but_not_billed ?? [],
            emptyText: "No hostel allocation billing gaps found.",
            renderItem: (item) => ({
              key: item.allocation_id,
              title: item.student_name,
              subtitle: item.registration_number,
              meta: item.hostel_name
            })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 xl:grid-cols-3", children: [
        /* @__PURE__ */ jsx(
          SnapshotTrendCard,
          {
            title: "Collections",
            points: snapshotTrends.finance?.total_collected ?? [],
            formatter: currency
          }
        ),
        /* @__PURE__ */ jsx(
          SnapshotTrendCard,
          {
            title: "Outstanding Balance",
            points: snapshotTrends.finance?.outstanding_balance ?? [],
            formatter: currency
          }
        ),
        /* @__PURE__ */ jsx(
          SnapshotTrendCard,
          {
            title: "Registration Rate",
            points: snapshotTrends.academic?.session_registration_rate ?? [],
            suffix: "%"
          }
        )
      ] })
    ] })
  ] });
}
function DashboardSection({ title, description, cards }) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-[1.75rem] border border-zinc-100 bg-white p-7 shadow-sm", children: [
    /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-zinc-900", children: title }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: description })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4", children: cards.map((card) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "rounded-2xl border border-zinc-100 bg-zinc-50 px-5 py-4",
        children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-zinc-500", children: card.label }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-2xl font-bold tracking-tight text-zinc-900", children: card.value }),
          card.helper ? /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-zinc-500", children: card.helper }) : null
        ]
      },
      card.label
    )) })
  ] });
}
function DashboardListCard({ title, items, emptyText, renderItem }) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-[1.75rem] border border-zinc-100 bg-white p-7 shadow-sm", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-zinc-900", children: title }),
    /* @__PURE__ */ jsx("div", { className: "mt-5 space-y-4", children: items.length ? items.map((item) => {
      const row = renderItem(item);
      return /* @__PURE__ */ jsxs(
        "div",
        {
          className: "rounded-2xl border border-zinc-100 bg-zinc-50 px-4 py-3",
          children: [
            /* @__PURE__ */ jsx("p", { className: "font-medium text-zinc-800", children: row.title }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-zinc-500", children: row.subtitle }),
            row.meta ? /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-zinc-500", children: row.meta }) : null
          ]
        },
        row.key
      );
    }) : /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: emptyText }) })
  ] });
}
function SnapshotTrendCard({
  title,
  points,
  formatter = (value) => value,
  suffix = ""
}) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-[1.75rem] border border-zinc-100 bg-white p-7 shadow-sm", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-zinc-900", children: title }),
    /* @__PURE__ */ jsx("div", { className: "mt-5 space-y-3", children: points.length ? points.slice(-7).map((point) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "flex items-center justify-between rounded-2xl bg-zinc-50 px-4 py-3 text-sm",
        children: [
          /* @__PURE__ */ jsx("span", { className: "text-zinc-500", children: point.date }),
          /* @__PURE__ */ jsxs("span", { className: "font-medium text-zinc-900", children: [
            formatter(point.value),
            suffix
          ] })
        ]
      },
      `${title}-${point.date}`
    )) : /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500", children: "No snapshot trend data available yet." }) })
  ] });
}
function Dashboard({ dashboard }) {
  const { auth } = usePage().props;
  const fullName = [auth?.user?.first_name, auth?.user?.last_name].filter(Boolean).join(" ").trim() || "Student";
  if (dashboard?.type === "student") {
    return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
      /* @__PURE__ */ jsx(Head, { title: "Dashboard" }),
      /* @__PURE__ */ jsx(StudentDashboard, { dashboard, fullName })
    ] });
  }
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Dashboard" }),
    /* @__PURE__ */ jsx(StaffDashboard, { dashboard })
  ] });
}
export {
  Dashboard as default
};
