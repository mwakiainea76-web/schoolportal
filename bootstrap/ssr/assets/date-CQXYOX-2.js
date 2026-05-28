const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date)) return "-";
  return date.toLocaleDateString(void 0, {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
};
export {
  formatDate as f
};
