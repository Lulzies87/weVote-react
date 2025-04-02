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
    <Card className="relative md:w-1/2 md:h-[360px] h-[240px] flex flex-col items-center justify-center bg-white/90">
      <CardHeader className="absolute top-0 w-full text-center">
        <CardTitle>
          <h2>Your Vote</h2>
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full p-6 flex flex-col items-center justify-center flex-grow">
        {pollStatus === "Voted" || pollStatus === "Closed" ? (
          tenantVote === "yes" ? (
            <p className="text-2xl font-bold text-primary">
              {tenantVote.toUpperCase()}
            </p>
          ) : tenantVote === "no" ? (
            <p className="text-2xl font-bold text-destructive">
              {tenantVote.toUpperCase()}
            </p>
          ) : (
            <p className="text-2xl font-bold">DIDN'T VOTE</p>
          )
        ) : pollStatus === "Open" ? (
          <Form {...form}>
            <form
              className="relative w-full flex flex-col justify-center items-center flex-grow"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="submittedVote"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex gap-28 justify-center"
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
                className="absolute bottom-0"
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
