import type { Meta, StoryObj } from "@storybook/react";
import {
  ErrorBoundary,
  DefaultErrorFallback,
} from "../components/feedback/error-boundary";
import { Button } from "../components/core/button";
import { useState } from "react";

const meta: Meta<typeof ErrorBoundary> = {
  title: "Components/ErrorBoundary",
  component: ErrorBoundary,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof ErrorBoundary>;

// Component that throws an error
const BuggyComponent = ({ shouldError }: { shouldError: boolean }) => {
  if (shouldError) {
    throw new Error("This is a simulated error for testing purposes!");
  }
  return (
    <div className="p-4 border rounded-lg">
      <p>This component is working correctly.</p>
    </div>
  );
};

// Component that throws on click
const ThrowOnClick = () => {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error("User triggered error!");
  }

  return (
    <Button variant="destructive" onClick={() => setShouldThrow(true)}>
      Click to Trigger Error
    </Button>
  );
};

export const WithError: Story = {
  render: () => (
    <div className="w-80">
      <ErrorBoundary>
        <BuggyComponent shouldError={true} />
      </ErrorBoundary>
    </div>
  ),
};

export const NoError: Story = {
  render: () => (
    <div className="w-80">
      <ErrorBoundary>
        <BuggyComponent shouldError={false} />
      </ErrorBoundary>
    </div>
  ),
};

export const CustomFallback: Story = {
  render: () => {
    const CustomFallbackComponent = ({
      error,
      resetErrorBoundary,
    }: {
      error: Error;
      resetErrorBoundary: () => void;
    }) => (
      <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-center">
        <h3 className="text-red-600 dark:text-red-400 font-bold mb-2">
          Custom Error UI
        </h3>
        <p className="text-sm text-red-500 mb-4">{error.message}</p>
        <Button variant="outline" size="sm" onClick={resetErrorBoundary}>
          Try Again
        </Button>
      </div>
    );

    return (
      <div className="w-80">
        <ErrorBoundary FallbackComponent={CustomFallbackComponent}>
          <BuggyComponent shouldError={true} />
        </ErrorBoundary>
      </div>
    );
  },
};

export const WithOnError: Story = {
  render: () => (
    <div className="w-80">
      <ErrorBoundary
        onError={(error, errorInfo) => {
          console.log("Error caught:", error.message);
          console.log("Error info:", errorInfo);
          // In real app: send to error tracking service
        }}
      >
        <BuggyComponent shouldError={true} />
      </ErrorBoundary>
    </div>
  ),
};

export const InteractiveError: Story = {
  render: function InteractiveErrorStory() {
    const [key, setKey] = useState(0);

    return (
      <div className="w-80 space-y-4">
        <p className="text-sm text-muted-foreground">
          Click the button below to trigger an error. Then use the reset button
          in the error UI to recover.
        </p>
        <ErrorBoundary key={key}>
          <ThrowOnClick />
        </ErrorBoundary>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setKey((k) => k + 1)}
        >
          Reset from Outside
        </Button>
      </div>
    );
  },
};

export const NestedErrorBoundaries: Story = {
  render: () => {
    const OuterFallback = ({
      resetErrorBoundary,
    }: {
      error: Error;
      resetErrorBoundary: () => void;
    }) => (
      <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
        <p className="text-destructive font-bold">
          Outer Boundary Caught Error
        </p>
        <Button
          size="sm"
          variant="outline"
          onClick={resetErrorBoundary}
          className="mt-2"
        >
          Reset Outer
        </Button>
      </div>
    );

    return (
      <div className="w-96 space-y-4">
        <p className="text-sm text-muted-foreground mb-4">
          Nested error boundaries allow granular error isolation.
        </p>
        <ErrorBoundary FallbackComponent={OuterFallback}>
          <div className="grid grid-cols-2 gap-4">
            <ErrorBoundary>
              <div className="p-4 border rounded-lg">
                <p className="text-sm mb-2">Widget A (OK)</p>
                <BuggyComponent shouldError={false} />
              </div>
            </ErrorBoundary>
            <ErrorBoundary>
              <div className="p-4 border rounded-lg">
                <p className="text-sm mb-2">Widget B (Error)</p>
                <BuggyComponent shouldError={true} />
              </div>
            </ErrorBoundary>
          </div>
        </ErrorBoundary>
      </div>
    );
  },
};

export const DefaultFallbackComponent: Story = {
  render: () => (
    <div className="w-80">
      <DefaultErrorFallback
        error={new Error("Something went wrong while loading the data.")}
        resetErrorBoundary={() => alert("Reset clicked")}
      />
    </div>
  ),
};
