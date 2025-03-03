import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { server } from "../services/axiosInstance";
import { useTenant } from "@/context/TenantContext";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Vote } from "@/types/vote";
import { Poll } from "@/types/poll";
import { toast, Toaster } from "sonner";
import { getPollStatus, getTenantVote } from "@/functions/functions";
import { FormSchema } from "./PollFormSchema";
import { VoteCard } from "./VoteCard";
import { CancelledPollMessage } from "./CancelledPollMessage";
import { ResultsCard } from "./ResultsCard";
import { Button } from "./ui/button";

export function PollPage() {
  const { id } = useParams();
  const { tenant } = useTenant();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [errorData, setErrorData] = useState<{
    status: number;
    message: string;
  } | null>(null);
  const [totalApartments, setTotalApartments] = useState(0);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPoll() {
      try {
        const res = await server.get(`/polls/${id}`);
        setPoll(res.data.poll);
        setTotalApartments(res.data.totalApartments);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          setErrorData({
            status: error.response.status,
            message: error.response.data.error,
          });
        } else {
          setErrorData({
            status: 0,
            message:
              "An unknown error occured, please contact an administrator.",
          });

          console.error(error);
        }
      }
    }

    if (id) fetchPoll();
  }, [id]);

  if (errorData) {
    return (
      <div className="text-center">
        <h1>
          {errorData.status === 0
            ? `Unknown Error`
            : `Error ${errorData.status}`}
        </h1>
        <p>{errorData.message}</p>
      </div>
    );
  }

  if (!poll) return <h1>Loading poll data...</h1>;

  let pollStatus = getPollStatus(poll, tenant).status;
  const tenantVote = getTenantVote(poll, tenant!.apartment);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (!id || !tenant) throw Error("Couldn't find poll ID / tenant data.");

    const vote: Vote = {
      pollID: Number(id),
      apartment: tenant.apartment,
      vote: data.submittedVote,
    };

    try {
      await server.post(`/polls/${id}/votes`, vote);

      toast(<h4>Vote registered!</h4>, {
        description: (
          <>
            You voted <strong>{vote.vote.toLocaleUpperCase()}</strong> for{" "}
            {poll.title}
          </>
        ),
        duration: 1800,
        position: "top-center",
        style: {
          fontSize: "inherit",
        },
      });

      setTimeout(() => {
        navigate("/");
      }, 2100);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        console.error("Vote already registered.");
        toast(<h4 className="destructive">Error</h4>, {
          description: "You have already voted in this poll.",
          duration: 4000,
          position: "top-center",
          style: {
            fontSize: "inherit",
          },
        });
      } else {
        toast(<h4 className="destructive">Error</h4>, {
          description: "Failed to submit vote. Please try again later.",
          duration: 4000,
          position: "top-center",
          style: {
            fontSize: "inherit",
          },
        });

        console.error("Failed to save the vote.", error);
      }
      return;
    }
  };

  return (
    <>
      <Toaster />
      <Button variant="secondary" type="button" onClick={() => navigate("/")}>
        Home
      </Button>
      <Card className="my-4 bg-white/90">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-center text-primary">
            {poll.title}
          </CardTitle>
          <div className="flex justify-between">
            <CardDescription>Cost: {poll.cost}</CardDescription>
            <CardDescription>
              Votes: {poll.votes?.length} / {totalApartments}
            </CardDescription>
            <CardDescription>
              Deadline: {new Date(poll.deadline).toLocaleDateString("en-GB")}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p>{poll.details}</p>
        </CardContent>
      </Card>

      {pollStatus === "Cancelled" ? (
        <CancelledPollMessage />
      ) : (
        <div className="flex justify-between gap-4 my-4">
          <VoteCard
            pollStatus={pollStatus}
            tenantVote={tenantVote}
            form={form}
            onSubmit={onSubmit}
          />
          <ResultsCard pollStatus={pollStatus} poll={poll} />
        </div>
      )}
    </>
  );
}
