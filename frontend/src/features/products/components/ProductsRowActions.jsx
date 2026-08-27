import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

import {
  Eye,
  Pencil,
  Trash2,
  MoreHorizontal,
} from "lucide-react";

export default function ProductsRowActions({ row }) {
  const product = row.original;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-orange-500/10 hover:text-orange-500"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-36">

        {/* View */}
        <DropdownMenuItem
          onClick={() => product.onView(product)}
        >
          <Eye className="mr-2 h-4 w-4" />
          View
        </DropdownMenuItem>

        {/* Edit */}
        <DropdownMenuItem
          onClick={() => product.onEdit(product)}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>

        {/* Delete */}
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600"
          onClick={() => product.onDelete(product)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
}