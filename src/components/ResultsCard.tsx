import { Poll } from "@/types/poll";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { ResultsPie } from "./ResultsPie";

type ResultsCardProps = {
  pollStatus: string;
  poll: Poll;
};

export function ResultsCard({ pollStatus, poll }: ResultsCardProps) {
  return (
    <Card className="h-[360px] w-1/2">
      <CardHeader className="text-center pb-0">
        <CardTitle>
          <h2>Results</h2>
        </CardTitle>
        <CardDescription>
          Will display here after the poll is closed
        </CardDescription>
      </CardHeader>
      <CardContent>
        {pollStatus === "Closed" ? <ResultsPie poll={poll} /> : null}
      </CardContent>
    </Card>
  );
}
