import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Calendar } from "../components/data-display/calendar";
import { addDays, format } from "date-fns";

const meta: Meta<typeof Calendar> = {
  title: "Components/Calendar",
  component: Calendar,
  tags: ["autodocs", "beta"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A date picker calendar component built on react-day-picker. Supports single date, range, and multiple date selection.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return (
      <div className="rounded-md border">
        <Calendar mode="single" selected={date} onSelect={setDate} />
      </div>
    );
  },
};

export const WithSelectedDate: Story = {
  name: "With Selected Date",
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return (
      <div className="space-y-4">
        <div className="rounded-md border">
          <Calendar mode="single" selected={date} onSelect={setDate} />
        </div>
        <p className="text-sm text-muted-foreground">
          Selected: {date ? format(date, "PPP") : "None"}
        </p>
      </div>
    );
  },
};

export const DateRange: Story = {
  name: "Date Range",
  render: () => {
    const [range, setRange] = useState<{ from: Date; to?: Date }>({
      from: new Date(),
      to: addDays(new Date(), 7),
    });
    return (
      <div className="space-y-4">
        <div className="rounded-md border">
          <Calendar
            mode="range"
            selected={range}
            onSelect={(r) => r && setRange(r as { from: Date; to?: Date })}
            numberOfMonths={2}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Range: {range?.from ? format(range.from, "PP") : ""} -{" "}
          {range?.to ? format(range.to, "PP") : "Select end date"}
        </p>
      </div>
    );
  },
};

export const MultipleDates: Story = {
  name: "Multiple Dates",
  render: () => {
    const [dates, setDates] = useState<Date[] | undefined>([
      new Date(),
      addDays(new Date(), 2),
      addDays(new Date(), 5),
    ]);
    return (
      <div className="space-y-4">
        <div className="rounded-md border">
          <Calendar mode="multiple" selected={dates} onSelect={setDates} />
        </div>
        <p className="text-sm text-muted-foreground">
          Selected: {dates?.map((d) => format(d, "MM/dd")).join(", ") || "None"}
        </p>
      </div>
    );
  },
};

export const DisabledDates: Story = {
  name: "Disabled Dates",
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    // Disable weekends and past dates
    const disabledDays = [
      { dayOfWeek: [0, 6] }, // Weekends
      { before: new Date() }, // Past dates
    ];
    return (
      <div className="space-y-4">
        <div className="rounded-md border">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            disabled={disabledDays}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Weekends and past dates are disabled
        </p>
      </div>
    );
  },
};

export const TwoMonths: Story = {
  name: "Two Months View",
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return (
      <div className="rounded-md border">
        <Calendar mode="single" selected={date} onSelect={setDate} numberOfMonths={2} />
      </div>
    );
  },
};

export const WithFooter: Story = {
  name: "With Footer",
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return (
      <div className="rounded-md border p-4">
        <Calendar mode="single" selected={date} onSelect={setDate} />
        <div className="mt-4 flex items-center justify-between border-t pt-4">
          <button
            onClick={() => setDate(new Date())}
            className="text-sm text-primary hover:underline"
          >
            Today
          </button>
          <button
            onClick={() => setDate(undefined)}
            className="text-sm text-muted-foreground hover:underline"
          >
            Clear
          </button>
        </div>
      </div>
    );
  },
};

export const TradingContext: Story = {
  name: "Trading Context",
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return (
      <div className="w-fit space-y-4 rounded-lg border bg-card p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Order Expiration</h3>
          <span className="text-xs text-muted-foreground">Optional</span>
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={{ before: new Date() }}
          className="rounded-md border"
        />
        {date && (
          <div className="text-sm">
            Order expires: <span className="font-medium">{format(date, "PPP")}</span>
          </div>
        )}
      </div>
    );
  },
};
