import { z } from "zod";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
  SubmitHandler,
  UseFormReturn,
} from "node_modules/react-hook-form/dist/types/form";
import { FormSchema } from "./PollFormSchema";

type VoteCardProps = {
  pollStatus: string;
  tenantVote?: string;
  form: UseFormReturn<z.infer<typeof FormSchema>>;
  onSubmit: SubmitHandler<z.infer<typeof FormSchema>>;
};

export function VoteCard({
  pollStatus,
  tenantVote,
  form,
  onSubmit,
}: VoteCardProps) {
  return (
    <Card className="text-center w-1/2">
      <CardHeader className="pb-0">
        <CardTitle>
          <h2>Your Vote</h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {pollStatus === "Voted" || pollStatus === "Closed" ? (
          <p>
            {tenantVote
              ? `You voted ${tenantVote} for this poll`
              : "You didn't vote for this poll"}
          </p>
        ) : pollStatus === "Open" ? (
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
                        {["yes", "no"].map((option) => (
                          <FormItem
                            key={option}
                            className="flex items-center gap-1"
                          >
                            <FormControl>
                              <RadioGroupItem
                                className="size-4 rounded-full m-0 border-2 bg-muted data-[state=checked]:bg-primary"
                                value={option}
                              />
                            </FormControl>
                            <FormLabel className="font-normal text-md">
                              {option.charAt(0).toUpperCase() + option.slice(1)}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                variant="default"
                type="submit"
                disabled={!form.formState.isValid}
              >
                Submit
              </Button>
            </form>
          </Form>
        ) : null}
      </CardContent>
    </Card>
  );
}
