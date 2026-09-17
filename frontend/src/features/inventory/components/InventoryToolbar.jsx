import {
  Search,
  Plus,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function InventoryToolbar({
  search,
  setSearch,
  transactionType,
  setTransactionType,
  onAdd,
  onRefresh,
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

      {/* Search */}
      <div className="relative w-full md:max-w-sm">
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
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search product or reference..."
          className="pl-9"
        />
      </div>

      <Select
        value={transactionType || "ALL"}
        onValueChange={(value) =>
          setTransactionType(
            value === "ALL" ? "" : value
          )
        }
      >
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Transaction Type" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="ALL">
            ALL
          </SelectItem>

          <SelectItem value="STOCK_IN">
            STOCK IN
          </SelectItem>

          <SelectItem value="STOCK_OUT">
            STOCK OUT
          </SelectItem>

          <SelectItem value="PURCHASE">
            PURCHASE
          </SelectItem>

          <SelectItem value="SALE">
            SALE
          </SelectItem>
        </SelectContent>
      </Select>

      {/* Actions */}
      <div className="flex gap-2">

        <Button
          type="button"
          variant="outline"
          onClick={onRefresh}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>

        <Button
          type="button"
          onClick={onAdd}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>

      </div>
    </div>
  );
}