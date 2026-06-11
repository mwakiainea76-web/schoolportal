const EXTENSIONS = {
    pdf: "pdf",
    csv: "csv",
    excel: "xls",
};

export function downloadExport(resource, format = "pdf", params = {}) {
    const extension = EXTENSIONS[format] || EXTENSIONS.pdf;
    const href = route("export.resource", {
        resource,
        _query: Object.fromEntries(
            Object.entries({ ...params, format }).filter(
                ([, value]) => value !== undefined && value !== null && value !== "",
            ),
        ),
    });

    const link = document.createElement("a");
    link.href = href;
    link.download = `${resource}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
