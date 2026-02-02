import type { Meta, StoryObj } from "@storybook/react";
import { DatePicker } from "../components/forms/date-picker";
import { useState } from "react";

const meta: Meta<typeof DatePicker> = {
  title: "Components/DatePicker",
  component: DatePicker,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The DatePicker component provides a calendar popup for selecting dates.

## Features
- Calendar popup with month navigation
- Manual input option
- Min/max date constraints
- Custom date disabling
- Clearable
- Error states
- Multiple sizes
        `,
      },
    },
  },
  tags: ["autodocs", "beta"],
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  render: () => {
    const [date, setDate] = useState<Date>();
    return (
      <div className="w-[300px]">
        <DatePicker value={date} onChange={setDate} />
      </div>
    );
  },
};

export const WithValue: Story = {
  args: {
    value: new Date(2026, 1, 15),
  },
};

export const CustomPlaceholder: Story = {
  args: {
    placeholder: "Choose a date...",
  },
};

export const Sizes: Story = {
  render: () => {
    const [date1, setDate1] = useState<Date>();
    const [date2, setDate2] = useState<Date>();
    const [date3, setDate3] = useState<Date>();

    return (
      <div className="space-y-4 w-[300px]">
        <DatePicker
          value={date1}
          onChange={setDate1}
          size="sm"
          placeholder="Small"
        />
        <DatePicker
          value={date2}
          onChange={setDate2}
          size="default"
          placeholder="Default"
        />
        <DatePicker
          value={date3}
          onChange={setDate3}
          size="lg"
          placeholder="Large"
        />
      </div>
    );
  },
};

export const WithConstraints: Story = {
  render: () => {
    const [date, setDate] = useState<Date>();
    const minDate = new Date();
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);

    return (
      <div className="space-y-2 w-[300px]">
        <p className="text-sm text-muted-foreground">
          Only dates from today to 3 months from now are selectable
        </p>
        <DatePicker
          value={date}
          onChange={setDate}
          minDate={minDate}
          maxDate={maxDate}
          placeholder="Select a future date"
        />
      </div>
    );
  },
};

export const DisableWeekends: Story = {
  render: () => {
    const [date, setDate] = useState<Date>();
    const isWeekend = (date: Date) =>
      date.getDay() === 0 || date.getDay() === 6;

    return (
      <div className="space-y-2 w-[300px]">
        <p className="text-sm text-muted-foreground">Weekends are disabled</p>
        <DatePicker
          value={date}
          onChange={setDate}
          disabled={isWeekend}
          placeholder="Select a weekday"
        />
      </div>
    );
  },
};

export const WithManualInput: Story = {
  render: () => {
    const [date, setDate] = useState<Date>();

    return (
      <div className="space-y-2 w-[300px]">
        <p className="text-sm text-muted-foreground">
          You can type a date or use the calendar
        </p>
        <DatePicker
          value={date}
          onChange={setDate}
          allowInput={true}
          dateFormat="yyyy-MM-dd"
          placeholder="YYYY-MM-DD"
        />
      </div>
    );
  },
};

export const ErrorState: Story = {
  args: {
    error: true,
    errorMessage: "Please select a valid date",
    placeholder: "Select date",
  },
};

export const NotClearable: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());

    return (
      <div className="w-[300px]">
        <DatePicker value={date} onChange={setDate} clearable={false} />
      </div>
    );
  },
};

export const Disabled: Story = {
  args: {
    value: new Date(),
    inputDisabled: true,
  },
};
