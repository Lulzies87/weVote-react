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
import { Toaster } from "./ui/sonner";
import { toast } from "sonner";
import axios from "axios";

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
        toast(<h4 className="destructive">Unkonown Error</h4>, {
          description:
            "An unknown error occurred. Please contact an administrator.",
          duration: 4000,
          position: "top-center",
          style: {
            fontSize: "inherit",
          },
        });
      }

      console.error(error);
    }
  }

  async function randomConnect() {
    const res = await server.get("/tenants/random");
    const randomPhone = res.data;
    form.setValue("phone", randomPhone);
    onSubmit({ phone: randomPhone });
  }

  return (
    <div>
      <Toaster />
      <Card className="max-w-sm mx-auto bg-white/90">
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
              <Button type="submit">Login</Button>
              <Button variant="secondary" type="button" onClick={randomConnect}>
                DEMO (Connect as a random tenant)
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
