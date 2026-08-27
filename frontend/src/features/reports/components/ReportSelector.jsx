import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";


export default function ReportSelector({
    value,
    onChange,
}) {

    return (

        <Select
            value={value}
            onValueChange={onChange}
        >

            <SelectTrigger className="w-[220px]">

                <SelectValue placeholder="Select Report" />

            </SelectTrigger>


            <SelectContent>

                <SelectItem value="sales">
                    Sales Report
                </SelectItem>

                <SelectItem value="purchase">
                    Purchase Report
                </SelectItem>

                <SelectItem value="inventory">
                    Inventory Report
                </SelectItem>

                <SelectItem value="payment">
                    Payment Report
                </SelectItem>

                <SelectItem value="profit">
                    Profit Report
                </SelectItem>

                <SelectItem value="low-stock">
                    Low Stock Report
                </SelectItem>

            </SelectContent>

        </Select>

    );
}