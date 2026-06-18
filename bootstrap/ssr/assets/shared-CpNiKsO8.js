const leaveTypes = [
  { id: "annual", name: "Annual Leave" },
  { id: "sick", name: "Sick Leave" },
  { id: "maternity", name: "Maternity Leave" },
  { id: "paternity", name: "Paternity Leave" },
  { id: "compassionate", name: "Compassionate Leave" },
  { id: "study", name: "Study Leave" },
  { id: "unpaid", name: "Unpaid Leave" },
  { id: "other", name: "Other" }
];
const typeLabel = (type) => leaveTypes.find((item) => item.id === type)?.name ?? type ?? "N/A";
const statusClass = (status) => {
  const classes = {
    pending: "border-amber-200 bg-amber-50 text-amber-700",
    approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
    rejected: "border-red-200 bg-red-50 text-red-700",
    cancelled: "border-zinc-200 bg-zinc-50 text-zinc-600"
  };
  return classes[status] ?? "border-slate-200 bg-slate-50 text-slate-600";
};
export {
  leaveTypes as l,
  statusClass as s,
  typeLabel as t
};
