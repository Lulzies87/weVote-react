import { Card, CardHeader, CardTitle } from "./ui/card";

export function CancelledPollMessage() {
  return (
    <Card className="my-4">
      <CardHeader>
        <CardTitle>
          <h2 className="text-center text-destructive">
            This poll was cancelled
          </h2>
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
