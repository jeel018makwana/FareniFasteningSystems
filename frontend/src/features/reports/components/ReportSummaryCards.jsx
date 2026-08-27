import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";


export default function ReportSummaryCards({
    cards = [],
}) {

    return (

        <div className="
            grid
            gap-4
            md:grid-cols-2
            lg:grid-cols-3
        ">

            {cards.map((card, index) => (

                <Card key={index}>

                    <CardHeader>

                        <CardTitle className="text-sm text-muted-foreground">
                            {card.title}
                        </CardTitle>

                    </CardHeader>

                    <CardContent>

                        <div className="text-2xl font-bold">
                            {card.value}
                        </div>

                    </CardContent>

                </Card>

            ))}

        </div>

    );

}