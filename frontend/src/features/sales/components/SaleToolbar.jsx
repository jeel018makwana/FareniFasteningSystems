import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Plus,
  RefreshCcw,
  Download,
} from "lucide-react";

export default function SaleToolbar({
  search,
  setSearch,
  onAdd,
  onRefresh,
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

      <Input
        placeholder="Search Invoice / Customer..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="max-w-sm"
      />

      <div className="flex gap-2">

        <Button onClick={onAdd} className="bg-[#F4510B] hover:bg-[#D94306] text-white">
          <Plus className="mr-2 h-4 w-4" />
          Create Sale
        </Button>

        <Button variant="outline" className="border-[#F4510B] text-[#F4510B] hover:bg-[#FFF1EB]">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>

        <Button
          variant="outline"
          onClick={onRefresh}
        >
          <RefreshCcw className="h-4 w-4" />
        </Button>

      </div>

    </div>
  );
}