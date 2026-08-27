import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Download,
  Printer,
} from "lucide-react";

export default function PurchaseRowActions({
  purchase,
  onView,
  onEdit,
  onDelete,
  onDownload,
  onPrint
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
          onClick={() => onView(purchase)}
        >
          <Eye className="mr-2 h-4 w-4" />
          View
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onEdit(purchase)}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onDownload(purchase)}
        >
          <Download className="mr-2 h-4 w-4" />
          Download Invoice
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onPrint(purchase)}
        >
          <Printer className="mr-2 h-4 w-4" />
          Print Invoice
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onDelete(purchase)}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
}