import {
    Search,
    RefreshCw,
    RotateCcw,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


export default function ReportToolbar({

    search,
    setSearch,

    startDate,
    setStartDate,

    endDate,
    setEndDate,

    onRefresh,
    onReset,

}) {

    return (

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


            <div className="flex flex-col gap-3 sm:flex-row">


                <div className="relative">


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

                        placeholder="Search..."

                        value={search}

                        onChange={(e) =>
                            setSearch(e.target.value)
                        }

                        className="pl-10"

                    />


                </div>



                <Input

                    type="date"

                    value={startDate}

                    onChange={(e) =>
                        setStartDate(e.target.value)
                    }

                />



                <Input

                    type="date"

                    value={endDate}

                    onChange={(e) =>
                        setEndDate(e.target.value)
                    }

                />


            </div>



            <div className="flex gap-2">


                <Button

                    variant="outline"

                    onClick={onRefresh}

                >

                    <RefreshCw className="mr-2 h-4 w-4" />

                    Refresh

                </Button>



                <Button

                    variant="outline"

                    onClick={onReset}

                >

                    <RotateCcw className="mr-2 h-4 w-4" />

                    Reset

                </Button>


            </div>


        </div>

    );

}