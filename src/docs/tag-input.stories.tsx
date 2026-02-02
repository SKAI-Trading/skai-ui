import type { Meta, StoryObj } from "@storybook/react";
import { TagInput } from "../components/forms/tag-input";
import { useState } from "react";

const meta: Meta<typeof TagInput> = {
  title: "Components/TagInput",
  component: TagInput,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The TagInput component allows users to input multiple values as tags.

## Features
- Add tags by typing and pressing Enter
- Remove tags with backspace or X button
- Paste multiple values (comma/space separated)
- Duplicate prevention
- Max tags limit
- Custom tag rendering
- Validation support
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TagInput>;

export const Default: Story = {
  render: () => {
    const [tags, setTags] = useState<string[]>(["react", "typescript"]);
    return (
      <div className="w-[350px]">
        <TagInput
          value={tags}
          onValueChange={setTags}
          placeholder="Add a tag..."
        />
      </div>
    );
  },
};

export const Empty: Story = {
  render: () => {
    const [tags, setTags] = useState<string[]>([]);
    return (
      <div className="w-[350px]">
        <TagInput
          value={tags}
          onValueChange={setTags}
          placeholder="Type and press Enter..."
        />
      </div>
    );
  },
};

export const WithMaxTags: Story = {
  render: () => {
    const [tags, setTags] = useState<string[]>(["tag1", "tag2"]);
    return (
      <div className="space-y-2 w-[350px]">
        <p className="text-sm text-muted-foreground">Maximum 5 tags allowed</p>
        <TagInput
          value={tags}
          onValueChange={setTags}
          maxTags={5}
          placeholder="Add up to 5 tags..."
        />
      </div>
    );
  },
};

export const WithValidation: Story = {
  render: () => {
    const [tags, setTags] = useState<string[]>([]);

    const validate = (value: string) => {
      if (value.length < 2) return false;
      if (value.length > 20) return false;
      if (!/^[a-zA-Z0-9-]+$/.test(value)) return false;
      return true;
    };

    return (
      <div className="w-[350px]">
        <TagInput
          value={tags}
          onValueChange={setTags}
          validateTag={validate}
          placeholder="Enter valid tags..."
        />
      </div>
    );
  },
};

export const NoDuplicates: Story = {
  render: () => {
    const [tags, setTags] = useState<string[]>(["unique"]);
    return (
      <div className="space-y-2 w-[350px]">
        <p className="text-sm text-muted-foreground">
          Try adding "unique" again
        </p>
        <TagInput
          value={tags}
          onValueChange={setTags}
          allowDuplicates={false}
          placeholder="Add unique tags..."
        />
      </div>
    );
  },
};

export const Sizes: Story = {
  render: () => {
    const [t1, setT1] = useState<string[]>(["small"]);
    const [t2, setT2] = useState<string[]>(["default"]);
    const [t3, setT3] = useState<string[]>(["large"]);

    return (
      <div className="space-y-4 w-[350px]">
        <TagInput value={t1} onValueChange={setT1} />
        <TagInput value={t2} onValueChange={setT2} />
        <TagInput value={t3} onValueChange={setT3} />
      </div>
    );
  },
};

export const Disabled: Story = {
  args: {
    value: ["locked", "readonly"],
    disabled: true,
  },
};

export const CryptoWallets: Story = {
  render: () => {
    const [tags, setTags] = useState<string[]>(["0x1234...5678"]);
    return (
      <div className="space-y-2 w-[400px]">
        <p className="text-sm text-muted-foreground">Add wallet addresses</p>
        <TagInput
          value={tags}
          onValueChange={setTags}
          placeholder="Paste wallet address..."
          maxTags={10}
        />
      </div>
    );
  },
};
