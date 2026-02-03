import type { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/forms/form";
import { Input } from "../components/core/input";
import { Button } from "../components/core/button";
import { Checkbox } from "../components/forms/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/forms/select";
import { Switch } from "../components/forms/switch";
import { Slider } from "../components/forms/slider";

const meta: Meta<typeof Form> = {
  title: "Components/Form",
  component: Form,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Form components built on React Hook Form with Zod validation. Provides consistent form handling with built-in error states.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Form>;

// Simple login form schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  remember: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginFormExample = () => {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    console.log("Form submitted:", data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-[350px]">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" {...field} />
              </FormControl>
              <FormDescription>Enter your email address</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormDescription>Minimum 8 characters</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="remember"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Remember me</FormLabel>
                <FormDescription>Keep me signed in</FormDescription>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Sign In
        </Button>
      </form>
    </Form>
  );
};

export const LoginForm: Story = {
  name: "Login Form",
  render: () => <LoginFormExample />,
};

// Trading settings schema
const tradingSchema = z.object({
  slippage: z.number().min(0.1).max(50),
  deadline: z.string(),
  expertMode: z.boolean(),
  gasPreset: z.enum(["slow", "standard", "fast"]),
});

type TradingFormValues = z.infer<typeof tradingSchema>;

const TradingSettingsExample = () => {
  const form = useForm<TradingFormValues>({
    resolver: zodResolver(tradingSchema),
    defaultValues: {
      slippage: 0.5,
      deadline: "30",
      expertMode: false,
      gasPreset: "standard",
    },
  });

  const onSubmit = (data: TradingFormValues) => {
    console.log("Settings saved:", data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-[350px]">
        <FormField
          control={form.control}
          name="slippage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slippage Tolerance</FormLabel>
              <FormControl>
                <div className="flex items-center gap-4">
                  <Slider
                    min={0.1}
                    max={5}
                    step={0.1}
                    value={[field.value]}
                    onValueChange={(v) => field.onChange(v[0])}
                    className="flex-1"
                  />
                  <span className="text-sm font-mono w-12">{field.value}%</span>
                </div>
              </FormControl>
              <FormDescription>
                Higher slippage allows more price variation
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transaction Deadline</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select deadline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 minutes</SelectItem>
                    <SelectItem value="20">20 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                Transaction will revert if pending longer
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gasPreset"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gas Price</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gas preset" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slow">🐢 Slow (~5 min)</SelectItem>
                    <SelectItem value="standard">⚡ Standard (~2 min)</SelectItem>
                    <SelectItem value="fast">🚀 Fast (~30 sec)</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expertMode"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Expert Mode</FormLabel>
                <FormDescription>
                  Disable confirmation prompts
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Save Settings
        </Button>
      </form>
    </Form>
  );
};

export const TradingSettings: Story = {
  name: "Trading Settings",
  render: () => <TradingSettingsExample />,
};

// Error states example
const ErrorFormExample = () => {
  const form = useForm({
    defaultValues: {
      email: "invalid-email",
      amount: "",
    },
  });

  // Manually set errors for demo
  form.setError("email", { message: "Invalid email address" });
  form.setError("amount", { message: "Amount is required" });

  return (
    <Form {...form}>
      <form className="space-y-6 w-[350px]">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} className="border-destructive" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input {...field} placeholder="0.00" className="border-destructive" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export const WithErrors: Story = {
  name: "Error States",
  render: () => <ErrorFormExample />,
};
