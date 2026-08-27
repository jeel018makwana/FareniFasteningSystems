import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


export default function PaymentToolbar({
    search,
    setSearch,
    onAdd,
    onRefresh,
}) {

    return (

        <div className="flex items-center justify-between gap-4">

            <Input
                placeholder="Search payments..."
                value={search}
                onChange={(e)=>
                    setSearch(e.target.value)
                }
                className="max-w-sm"
            />


            <div className="flex gap-2">

                <Button
                    variant="outline"
                    onClick={onRefresh}
                >
                    Refresh
                </Button>


                <Button
                    onClick={onAdd}
                >
                    Add Payment
                </Button>

            </div>

        </div>

    );
}