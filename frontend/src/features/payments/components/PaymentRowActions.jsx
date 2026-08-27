import {
    MoreHorizontal,
    Pencil,
    Trash2,
} from "lucide-react";

import {
    Button
} from "@/components/ui/button";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


export default function PaymentRowActions({
    payment,
    onEdit,
    onDelete,
}) {


    return (

        <DropdownMenu>

            <DropdownMenuTrigger asChild>

                <Button
                    variant="ghost"
                    size="icon"
                >
                    <MoreHorizontal />
                </Button>

            </DropdownMenuTrigger>


            <DropdownMenuContent
                align="end"
            >

                <DropdownMenuItem
                    onClick={() =>
                        onEdit(payment)
                    }
                >
                    <Pencil className="mr-2 h-4 w-4"/>
                    Edit
                </DropdownMenuItem>


                <DropdownMenuItem
                    onClick={() =>
                        onDelete(payment)
                    }
                    className="text-red-500"
                >
                    <Trash2 className="mr-2 h-4 w-4"/>
                    Delete
                </DropdownMenuItem>


            </DropdownMenuContent>


        </DropdownMenu>

    );
}