"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LoginFormInput, LoginFormInputSchema } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderIcon, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { loginAction } from "../../lib/actions/login";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useToast } from "../ui/use-toast";

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const form = useForm<LoginFormInput>({
    resolver: zodResolver(LoginFormInputSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormInput) {
    setLoading(true);
    try {
      const loginProcess = await loginAction(values);
      if (loginProcess.success) {
        toast({
          description: loginProcess.message,
          title: "Login Success",
          variant: "default",
          duration: 3000,
        });

        setLoading(false);
        router.replace("/secure");
      } else {
        setLoading(false);
        toast({
          description: loginProcess.message,
          title: "Login Gagal",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (err: any) {
      setLoading(false);
      toast({
        description: err.message,
        title: "Login Gagal",
        variant: "destructive",
        duration: 3000,
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Login KDP PIC</CardTitle>
            <CardDescription>
              Silahkan Masukkan Username dan Password Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center">
                  <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                  Loading
                </span>
              ) : (
                <span className="flex items-center">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </span>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
