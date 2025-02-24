import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { server } from "../services/axiosInstance";
import { useTenant } from "@/context/TenantContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useForm } from "react-hook-form";
import { RadioGroup } from "./ui/radio-group";
import { RadioGroupItem } from "@radix-ui/react-radio-group";
import { Button } from "./ui/button";
import { Vote } from "@/types/vote";
import { Poll } from "@/types/poll";
import { toast, Toaster } from "sonner";

const FormSchema = z.object({
  submittedVote: z.enum(["yes", "no"], {
    required_error: "You need to select Yes or No.",
  }),
});

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
      <Card>
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-center text-primary">
            {poll.title}
          </CardTitle>
          <div className="flex justify-between">
            <CardDescription>Cost: {poll.cost}</CardDescription>
            <CardDescription>
              Votes: {poll.votedApartments?.length} / {totalApartments}
            </CardDescription>
            <CardDescription>
              Deadline: {new Date(poll.deadline).toLocaleDateString("en-GB")}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p>{poll.details}</p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="submittedVote"
                render={({ field }) => (
                  <FormItem className="my-6">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex justify-center gap-20"
                      >
                        <FormItem className="flex items-center gap-1">
                          <FormControl>
                            <RadioGroupItem
                              className="size-4 rounded-full m-0 border-2 bg-muted data-[state=checked]:bg-primary"
                              value="yes"
                            />
                          </FormControl>
                          <FormLabel className="font-normal text-md">
                            Vote Yes
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center gap-1">
                          <FormControl>
                            <RadioGroupItem
                              className="size-4 rounded-full m-0 border-2 bg-muted data-[state=checked]:bg-primary"
                              value="no"
                            />
                          </FormControl>
                          <FormLabel className="font-normal text-md">
                            Vote No
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-around">
                <Button
                  variant={"destructive"}
                  type="button"
                  onClick={() => navigate("/")}
                >
                  Back
                </Button>
                <Button
                  variant={"default"}
                  type="submit"
                  disabled={!form.formState.isValid}
                >
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
