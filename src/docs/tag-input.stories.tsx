import type { Meta, StoryObj } from "@storybook/react";
import { TagInput, Tag } from "../components/tag-input";
import { useState } from "react";

const meta: Meta<typeof TagInput> = {
  title: "Forms/TagInput",
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
    const [tags, setTags] = useState<Tag[]>([
      { id: "1", value: "react" },
      { id: "2", value: "typescript" },
    ]);
    return (
      <div className="w-[350px]">
        <TagInput
          tags={tags}
          onTagsChange={setTags}
          placeholder="Add a tag..."
        />
      </div>
    );
  },
};

export const Empty: Story = {
  render: () => {
    const [tags, setTags] = useState<Tag[]>([]);
    return (
      <div className="w-[350px]">
        <TagInput
          tags={tags}
          onTagsChange={setTags}
          placeholder="Type and press Enter..."
        />
      </div>
    );
  },
};

export const WithMaxTags: Story = {
  render: () => {
    const [tags, setTags] = useState<Tag[]>([
      { id: "1", value: "tag1" },
      { id: "2", value: "tag2" },
    ]);
    return (
      <div className="space-y-2 w-[350px]">
        <p className="text-sm text-muted-foreground">Maximum 5 tags allowed</p>
        <TagInput
          tags={tags}
          onTagsChange={setTags}
          maxTags={5}
          placeholder="Add up to 5 tags..."
        />
      </div>
    );
  },
};

export const WithValidation: Story = {
  render: () => {
    const [tags, setTags] = useState<Tag[]>([]);

    const validate = (value: string) => {
      if (value.length < 2) return "Tag must be at least 2 characters";
      if (value.length > 20) return "Tag must be less than 20 characters";
      if (!/^[a-zA-Z0-9-]+$/.test(value))
        return "Only alphanumeric and hyphens allowed";
      return true;
    };

    return (
      <div className="w-[350px]">
        <TagInput
          tags={tags}
          onTagsChange={setTags}
          validate={validate}
          placeholder="Enter valid tags..."
        />
      </div>
    );
  },
};

export const NoDuplicates: Story = {
  render: () => {
    const [tags, setTags] = useState<Tag[]>([{ id: "1", value: "unique" }]);
    return (
      <div className="space-y-2 w-[350px]">
        <p className="text-sm text-muted-foreground">
          Try adding "unique" again
        </p>
        <TagInput
          tags={tags}
          onTagsChange={setTags}
          allowDuplicates={false}
          placeholder="Add unique tags..."
        />
      </div>
    );
  },
};

export const Sizes: Story = {
  render: () => {
    const [t1, setT1] = useState<Tag[]>([{ id: "1", value: "small" }]);
    const [t2, setT2] = useState<Tag[]>([{ id: "1", value: "default" }]);
    const [t3, setT3] = useState<Tag[]>([{ id: "1", value: "large" }]);

    return (
      <div className="space-y-4 w-[350px]">
        <TagInput tags={t1} onTagsChange={setT1} size="sm" />
        <TagInput tags={t2} onTagsChange={setT2} size="default" />
        <TagInput tags={t3} onTagsChange={setT3} size="lg" />
      </div>
    );
  },
};

export const Disabled: Story = {
  args: {
    tags: [
      { id: "1", value: "locked" },
      { id: "2", value: "readonly" },
    ],
    disabled: true,
  },
};

export const CryptoWallets: Story = {
  render: () => {
    const [tags, setTags] = useState<Tag[]>([
      { id: "1", value: "0x1234...5678" },
    ]);
    return (
      <div className="space-y-2 w-[400px]">
        <p className="text-sm text-muted-foreground">Add wallet addresses</p>
        <TagInput
          tags={tags}
          onTagsChange={setTags}
          placeholder="Paste wallet address..."
          maxTags={10}
        />
      </div>
    );
  },
};
