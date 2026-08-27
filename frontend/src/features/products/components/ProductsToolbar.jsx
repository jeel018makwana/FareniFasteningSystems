import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Plus,
  RefreshCcw,
  Search,
} from "lucide-react";

export default function ProductsToolbar({
  search,
  setSearch,
  onAdd,
  onRefresh,
}) {
  return (
    <div
      className="
        flex
        flex-col
        gap-3
        rounded-xl
        border
        bg-card
        p-4
        shadow-sm
        md:flex-row
        md:items-center
        md:justify-between
      "
    >
      {/* Search */}
      <div className="relative w-full md:max-w-md">

        <Search
          className="
            absolute
            left-3
            top-1/2
            h-4
            w-4
            -translate-y-1/2
            text-muted-foreground
          "
        />

        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            h-10
            pl-9
            focus-visible:ring-[#F45A00]
            focus-visible:ring-offset-0
          "
        />

      </div>

      {/* Actions */}
      <div className="flex w-full gap-2 md:w-auto">

        <Button
          type="button"
          variant="outline"
          onClick={onRefresh}
          className="
            flex-1
            md:flex-none
            hover:border-[#F45A00]/40
            hover:bg-[#F45A00]/5
            hover:text-[#F45A00]
          "
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Refresh
        </Button>

        <Button
          type="button"
          onClick={onAdd}
          className="
            flex-1
            bg-[#F45A00]
            text-white
            hover:bg-[#D94F00]
            md:flex-none
          "
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>

      </div>
    </div>
  );
}