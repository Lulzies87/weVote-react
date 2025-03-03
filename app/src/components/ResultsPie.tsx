"use client";
import * as React from "react";
import { Label, Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Poll } from "@/types/poll";

const chartConfig = {
  voters: {
    label: "Voters",
  },
  yes: {
    label: "Yes",
    color: "hsl(var(--chart-yes))",
  },
  no: {
    label: "No",
    color: "hsl(var(--chart-no))",
  },
} satisfies ChartConfig;

interface ResultsPieProps {
  poll: Poll;
}

export function ResultsPie({ poll }: ResultsPieProps) {
  const chartData = React.useMemo(() => {
    if (!poll || !poll.votes) return [];

    const voteCounts = poll.votes.reduce(
      (acc: Record<"yes" | "no", number>, curr) => {
        acc[curr.vote as "yes" | "no"] =
          (acc[curr.vote as "yes" | "no"] || 0) + 1;
        return acc;
      },
      { yes: 0, no: 0 } as { yes: number; no: number }
    );

    return [
      { vote: "Yes", voters: voteCounts.yes, fill: "var(--primary)" },
      { vote: "No", voters: voteCounts.no, fill: "var(--destructive)" },
    ];
  }, [poll]);

  const totalVoters = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.voters, 0);
  }, []);

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[250px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="voters"
          nameKey="vote"
          innerRadius={60}
          strokeWidth={5}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-3xl font-bold"
                    >
                      {totalVoters.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      Voters
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
