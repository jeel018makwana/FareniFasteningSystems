import { Button } from "@/components/ui/button";

export default function DataTablePagination({
  page,
  setPage,
  count,
  pageSize = 10,
  label="records",
}) {
  const totalPages = Math.max(1, Math.ceil(count / pageSize));

  const start = count === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, count);

  return (
    <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <p className="text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-medium text-foreground">
          {start}-{end}
        </span>{" "}
        of{" "}
        <span className="font-medium text-foreground">
          {count}
        </span>{" "}
        {label}
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </Button>

        <span className="text-sm text-muted-foreground px-2">
          Page <strong>{page}</strong> of{" "}
          <strong>{totalPages}</strong>
        </span>

        <Button
          variant="outline"
          size="sm"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}