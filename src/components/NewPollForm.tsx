import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { server } from "@/services/axiosInstance";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { Toaster } from "./ui/sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useState } from "react";

const FormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  deadline: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  cost: z.coerce.number().min(0, "Cost must be a positive number"),
  details: z.string().optional(),
});

export function NewPollForm() {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      cost: 0,
      details: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      await server.post("/polls", data);
      form.reset();

      toast(<h4>Poll created!</h4>, {
        description: (
          <>
            <strong>{data.title}</strong> - poll was created and is now open for
            votes!
          </>
        ),
        duration: 4000,
        position: "top-center",
        style: {
          fontSize: "inherit",
        },
      });

      setOpen(false);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast(<h4 className="destructive">Error {error.response.status}</h4>, {
          description: error.response.data.error,
          duration: 4000,
          position: "top-center",
          style: {
            fontSize: "inherit",
          },
        });
      } else {
        toast(<h4 className="destructive">Unknown Error</h4>, {
          description:
            "An unknown error occurred. Please contact an administrator.",
          duration: 4000,
          position: "top-center",
          style: {
            fontSize: "inherit",
          },
        });

        console.error(error);
      }
    }
  };

  return (
    <>
      <Toaster />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant={"outline"} size={"tiny"}>
            +
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Poll</DialogTitle>
            <DialogDescription>
              Please insert all poll details:
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Poll Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter poll title" {...field} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deadline</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormDescription>
                      The last day tenants can vote
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormDescription>
                      The cost for the whole building
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="details"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Details</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Optional poll details..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                className="block mx-auto"
                type="submit"
                disabled={!form.formState.isValid}
              >
                Create Poll
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
