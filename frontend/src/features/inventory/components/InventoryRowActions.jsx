import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

import {
  Eye,
  Pencil,
  Trash2,
  MoreHorizontal,
} from "lucide-react";

export default function InventoryRowActions({
  row,
}) {
  return (
    <DropdownMenu>

      <DropdownMenuTrigger asChild>

        <Button
          variant="ghost"
          size="icon"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>

      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">

        <DropdownMenuItem
          onClick={() =>
            row.original.onView(row.original)
          }
        >
          <Eye className="mr-2 h-4 w-4" />
          View
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() =>
            row.original.onEdit(row.original)
          }
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>

        <DropdownMenuItem
          className="text-red-600"
          onClick={() =>
            row.original.onDelete(row.original)
          }
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>

      </DropdownMenuContent>

    </DropdownMenu>
  );
}