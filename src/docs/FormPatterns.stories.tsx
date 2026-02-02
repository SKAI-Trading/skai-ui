import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "../components/core/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/core/card";
import { Input } from "../components/core/input";
import { Label } from "../components/core/label";
import { Checkbox } from "../components/forms/checkbox";
import { Progress } from "../components/feedback/progress";
import {
  AlertCircle,
  Check,
  ChevronRight,
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  User,
  Wallet,
} from "lucide-react";

const meta: Meta = {
  title: "Patterns/Forms",
  parameters: {
    layout: "centered",
  },
};

export default meta;

export const ValidationStates: StoryObj = {
  name: "Validation States",
  render: () => (
    <div className="w-[400px] space-y-6">
      <h2 className="text-2xl font-bold">Input Validation States</h2>

      {/* Default */}
      <div className="space-y-2">
        <Label>Default</Label>
        <Input placeholder="Enter value" />
        <p className="text-sm text-muted-foreground">Helper text goes here</p>
      </div>

      {/* Valid */}
      <div className="space-y-2">
        <Label>Valid</Label>
        <div className="relative">
          <Input
            defaultValue="valid@email.com"
            className="border-green-500 focus-visible:ring-green-500 pr-10"
          />
          <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
        </div>
        <p className="text-sm text-green-500">Email is valid</p>
      </div>

      {/* Error */}
      <div className="space-y-2">
        <Label>Error</Label>
        <div className="relative">
          <Input
            defaultValue="invalid-email"
            className="border-red-500 focus-visible:ring-red-500 pr-10"
          />
          <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />
        </div>
        <p className="text-sm text-red-500">
          Please enter a valid email address
        </p>
      </div>

      {/* Warning */}
      <div className="space-y-2">
        <Label>Warning</Label>
        <div className="relative">
          <Input
            defaultValue="100"
            className="border-yellow-500 focus-visible:ring-yellow-500 pr-10"
          />
          <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-yellow-500" />
        </div>
        <p className="text-sm text-yellow-500">
          High slippage may result in unfavorable trade
        </p>
      </div>

      {/* Disabled */}
      <div className="space-y-2">
        <Label className="text-muted-foreground">Disabled</Label>
        <Input disabled placeholder="Cannot edit" />
      </div>
    </div>
  ),
};

export const PasswordInput: StoryObj = {
  name: "Password Input",
  render: () => {
    const [show, setShow] = useState(false);
    const [password, setPassword] = useState("");

    const strength =
      password.length === 0
        ? 0
        : password.length < 6
          ? 25
          : password.length < 10
            ? 50
            : password.length < 14
              ? 75
              : 100;
    const strengthLabel =
      strength === 0
        ? ""
        : strength <= 25
          ? "Weak"
          : strength <= 50
            ? "Fair"
            : strength <= 75
              ? "Good"
              : "Strong";
    const strengthColor =
      strength <= 25
        ? "bg-red-500"
        : strength <= 50
          ? "bg-yellow-500"
          : strength <= 75
            ? "bg-blue-500"
            : "bg-green-500";

    return (
      <div className="w-[400px] space-y-4">
        <h2 className="text-2xl font-bold">Password Input</h2>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={show ? "text" : "password"}
              placeholder="Enter password"
              className="pl-10 pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {show ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {password && (
            <div className="space-y-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded ${i <= strength / 25 ? strengthColor : "bg-muted"}`}
                  />
                ))}
              </div>
              <p className={`text-sm ${strengthColor.replace("bg-", "text-")}`}>
                {strengthLabel}
              </p>
            </div>
          )}

          <ul className="text-sm text-muted-foreground space-y-1">
            <li className={password.length >= 8 ? "text-green-500" : ""}>
              {password.length >= 8 ? "✓" : "○"} At least 8 characters
            </li>
            <li className={/[A-Z]/.test(password) ? "text-green-500" : ""}>
              {/[A-Z]/.test(password) ? "✓" : "○"} One uppercase letter
            </li>
            <li className={/[0-9]/.test(password) ? "text-green-500" : ""}>
              {/[0-9]/.test(password) ? "✓" : "○"} One number
            </li>
          </ul>
        </div>
      </div>
    );
  },
};

export const MultiStepForm: StoryObj = {
  name: "Multi-Step Form",
  render: () => {
    const [step, setStep] = useState(1);
    const totalSteps = 3;

    return (
      <Card className="w-[450px]">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    s < step
                      ? "bg-green-500 text-white"
                      : s === step
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {s < step ? <Check className="h-4 w-4" /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-24 h-0.5 ${s < step ? "bg-green-500" : "bg-muted"}`}
                  />
                )}
              </div>
            ))}
          </div>
          <CardTitle>
            {step === 1 && "Account Details"}
            {step === 2 && "Verification"}
            {step === 3 && "Complete Setup"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    placeholder="Choose a username"
                    className="pl-10"
                  />
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="text-center py-4">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  We sent a verification code to your email
                </p>
              </div>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Input
                    key={i}
                    className="w-10 h-12 text-center text-lg font-mono"
                    maxLength={1}
                  />
                ))}
              </div>
              <p className="text-sm text-center text-muted-foreground">
                Didn't receive code?{" "}
                <button className="text-primary hover:underline">Resend</button>
              </p>
            </>
          )}

          {step === 3 && (
            <>
              <div className="text-center py-4">
                <div className="h-16 w-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="font-semibold text-lg">All Set!</h3>
                <p className="text-sm text-muted-foreground">
                  Your account has been created successfully
                </p>
              </div>
              <div className="space-y-3">
                <Button className="w-full gap-2" variant="outline">
                  <Wallet className="h-4 w-4" />
                  Connect Wallet
                </Button>
                <Button className="w-full">Start Trading</Button>
              </div>
            </>
          )}

          <div className="flex gap-2 pt-4">
            {step > 1 && step < 3 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}
            {step < 3 && (
              <Button className="flex-1" onClick={() => setStep(step + 1)}>
                {step === 2 ? "Verify" : "Continue"}
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>

          <Progress value={(step / totalSteps) * 100} className="mt-4" />
        </CardContent>
      </Card>
    );
  },
};

export const TokenAmountInput: StoryObj = {
  name: "Token Amount Input",
  render: () => {
    const [amount, setAmount] = useState("");
    const balance = 2.5;
    const price = 2145.32;

    return (
      <div className="w-[400px] space-y-4">
        <h2 className="text-2xl font-bold">Token Amount Input</h2>

        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">You pay</span>
              <span className="text-muted-foreground">
                Balance: <span className="font-mono">{balance} ETH</span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Input
                type="text"
                inputMode="decimal"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-2xl font-mono border-0 bg-transparent p-0 h-auto focus-visible:ring-0"
              />
              <Button variant="outline" className="shrink-0">
                <div className="h-5 w-5 rounded-full bg-blue-500 mr-2" />
                ETH
              </Button>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                ≈ $
                {amount
                  ? (parseFloat(amount) * price).toLocaleString()
                  : "0.00"}
              </span>
              <div className="flex gap-1">
                {[25, 50, 75, 100].map((pct) => (
                  <Button
                    key={pct}
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() =>
                      setAmount(((balance * pct) / 100).toString())
                    }
                  >
                    {pct === 100 ? "MAX" : `${pct}%`}
                  </Button>
                ))}
              </div>
            </div>

            {parseFloat(amount) > balance && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                Insufficient balance
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  },
};

export const FormWithSubmit: StoryObj = {
  name: "Form With Submit States",
  render: () => {
    const [state, setState] = useState<
      "idle" | "loading" | "success" | "error"
    >("idle");

    const handleSubmit = () => {
      setState("loading");
      setTimeout(() => {
        setState(Math.random() > 0.5 ? "success" : "error");
        setTimeout(() => setState("idle"), 2000);
      }, 1500);
    };

    return (
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Contact Form</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Your name"
              disabled={state === "loading"}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              disabled={state === "loading"}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <textarea
              id="message"
              className="w-full min-h-[100px] px-3 py-2 rounded-md border bg-background text-sm disabled:opacity-50"
              placeholder="Your message..."
              disabled={state === "loading"}
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="terms" disabled={state === "loading"} />
            <Label htmlFor="terms" className="text-sm text-muted-foreground">
              I agree to the terms and conditions
            </Label>
          </div>

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={state === "loading"}
          >
            {state === "idle" && "Submit"}
            {state === "loading" && (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            )}
            {state === "success" && (
              <>
                <Check className="h-4 w-4 mr-2" />
                Sent!
              </>
            )}
            {state === "error" && "Try Again"}
          </Button>

          {state === "success" && (
            <p className="text-sm text-green-500 text-center">
              Message sent successfully!
            </p>
          )}
          {state === "error" && (
            <p className="text-sm text-red-500 text-center">
              Something went wrong. Please try again.
            </p>
          )}
        </CardContent>
      </Card>
    );
  },
};
