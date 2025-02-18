import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
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
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { server } from "@/services/axiosInstance";
import { useTenant } from "@/context/TenantContext";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
});

export function LoginPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: "",
    },
  });
  const { setTenant } = useTenant();
  const navigate = useNavigate();

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const res = await server.post("/login", data);

      setTenant(res.data.tenant);
      localStorage.setItem("token", res.data.token);

      navigate("/");
    } catch (error) {
      console.error("Failed to fetch tenant data", error);
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Login</CardTitle>
          <CardDescription>
            Enter your phone number below to login
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              className="flex flex-col gap-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Phone number" {...field} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="mx-auto w-full">
                Login
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
