import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TagInput } from "../components/tag-input";

describe("TagInput", () => {
  describe("Rendering", () => {
    it("should render with placeholder", () => {
      render(<TagInput placeholder="Add tags..." />);
      expect(screen.getByPlaceholderText("Add tags...")).toBeInTheDocument();
    });

    it("should render existing tags", () => {
      render(<TagInput value={["tag1", "tag2", "tag3"]} />);
      expect(screen.getByText("tag1")).toBeInTheDocument();
      expect(screen.getByText("tag2")).toBeInTheDocument();
      expect(screen.getByText("tag3")).toBeInTheDocument();
    });

    it("should render empty when no value", () => {
      render(<TagInput />);
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("should apply custom className", () => {
      const { container } = render(<TagInput className="custom-class" />);
      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("should be disabled when disabled prop is true", () => {
      render(<TagInput disabled placeholder="Disabled" />);
      expect(screen.getByPlaceholderText("Disabled")).toBeDisabled();
    });
  });

  describe("Adding tags", () => {
    it("should add tag on Enter key", () => {
      const handleValueChange = vi.fn();
      render(
        <TagInput
          value={[]}
          onValueChange={handleValueChange}
          placeholder="Add tag"
        />,
      );

      const input = screen.getByPlaceholderText("Add tag");
      fireEvent.change(input, { target: { value: "newtag" } });
      fireEvent.keyDown(input, { key: "Enter" });

      expect(handleValueChange).toHaveBeenCalledWith(["newtag"]);
    });

    it("should add tag on comma key", () => {
      const handleValueChange = vi.fn();
      render(
        <TagInput
          value={[]}
          onValueChange={handleValueChange}
          placeholder="Add tag"
        />,
      );

      const input = screen.getByPlaceholderText("Add tag");
      fireEvent.change(input, { target: { value: "tag1," } });

      expect(handleValueChange).toHaveBeenCalledWith(["tag1"]);
    });

    it("should not add empty tags", () => {
      const handleValueChange = vi.fn();
      render(
        <TagInput
          value={[]}
          onValueChange={handleValueChange}
          placeholder="Add tag"
        />,
      );

      const input = screen.getByPlaceholderText("Add tag");
      fireEvent.change(input, { target: { value: "   " } });
      fireEvent.keyDown(input, { key: "Enter" });

      expect(handleValueChange).not.toHaveBeenCalled();
    });

    it("should trim whitespace from tags", () => {
      const handleValueChange = vi.fn();
      render(
        <TagInput
          value={[]}
          onValueChange={handleValueChange}
          placeholder="Add tag"
        />,
      );

      const input = screen.getByPlaceholderText("Add tag");
      fireEvent.change(input, { target: { value: "  newtag  " } });
      fireEvent.keyDown(input, { key: "Enter" });

      expect(handleValueChange).toHaveBeenCalledWith(["newtag"]);
    });

    it("should clear input after adding tag", () => {
      render(
        <TagInput value={[]} onValueChange={() => {}} placeholder="Add tag" />,
      );

      const input = screen.getByPlaceholderText("Add tag") as HTMLInputElement;
      fireEvent.change(input, { target: { value: "newtag" } });
      fireEvent.keyDown(input, { key: "Enter" });

      expect(input.value).toBe("");
    });
  });

  describe("Removing tags", () => {
    it("should remove tag on X button click", () => {
      const handleValueChange = vi.fn();
      render(
        <TagInput value={["tag1", "tag2"]} onValueChange={handleValueChange} />,
      );

      const removeButtons = screen.getAllByRole("button", { name: /remove/i });
      fireEvent.click(removeButtons[0]);

      expect(handleValueChange).toHaveBeenCalledWith(["tag2"]);
    });

    it("should remove last tag on Backspace when input is empty", () => {
      const handleValueChange = vi.fn();
      render(
        <TagInput
          value={["tag1", "tag2"]}
          onValueChange={handleValueChange}
          placeholder="Add tag"
        />,
      );

      const input = screen.getByPlaceholderText("Add tag");
      fireEvent.keyDown(input, { key: "Backspace" });

      expect(handleValueChange).toHaveBeenCalledWith(["tag1"]);
    });

    it("should not remove tag on Backspace when input has value", () => {
      const handleValueChange = vi.fn();
      render(
        <TagInput
          value={["tag1"]}
          onValueChange={handleValueChange}
          placeholder="Add tag"
        />,
      );

      const input = screen.getByPlaceholderText("Add tag");
      fireEvent.change(input, { target: { value: "typing" } });
      fireEvent.keyDown(input, { key: "Backspace" });

      expect(handleValueChange).not.toHaveBeenCalled();
    });

    it("should not allow removing tags when disabled", () => {
      const handleValueChange = vi.fn();
      render(
        <TagInput
          value={["tag1"]}
          onValueChange={handleValueChange}
          disabled
        />,
      );

      // Remove buttons should not be present when disabled
      expect(
        screen.queryByRole("button", { name: /remove/i }),
      ).not.toBeInTheDocument();
    });
  });

  describe("Validation", () => {
    it("should prevent duplicates by default", () => {
      const handleValueChange = vi.fn();
      render(
        <TagInput
          value={["existing"]}
          onValueChange={handleValueChange}
          placeholder="Add tag"
        />,
      );

      const input = screen.getByPlaceholderText("Add tag");
      fireEvent.change(input, { target: { value: "existing" } });
      fireEvent.keyDown(input, { key: "Enter" });

      expect(handleValueChange).not.toHaveBeenCalled();
    });

    it("should allow duplicates when allowDuplicates is true", () => {
      const handleValueChange = vi.fn();
      render(
        <TagInput
          value={["existing"]}
          onValueChange={handleValueChange}
          allowDuplicates
          placeholder="Add tag"
        />,
      );

      const input = screen.getByPlaceholderText("Add tag");
      fireEvent.change(input, { target: { value: "existing" } });
      fireEvent.keyDown(input, { key: "Enter" });

      expect(handleValueChange).toHaveBeenCalledWith(["existing", "existing"]);
    });

    it("should enforce maxTags limit", () => {
      const handleValueChange = vi.fn();
      render(
        <TagInput
          value={["tag1", "tag2"]}
          onValueChange={handleValueChange}
          maxTags={2}
          placeholder="Add tag"
        />,
      );

      const input = screen.getByPlaceholderText("") as HTMLInputElement;
      expect(input).toBeDisabled();
    });

    it("should enforce minLength", () => {
      const handleValueChange = vi.fn();
      render(
        <TagInput
          value={[]}
          onValueChange={handleValueChange}
          minLength={3}
          placeholder="Add tag"
        />,
      );

      const input = screen.getByPlaceholderText("Add tag");
      fireEvent.change(input, { target: { value: "ab" } });
      fireEvent.keyDown(input, { key: "Enter" });

      expect(handleValueChange).not.toHaveBeenCalled();
    });

    it("should enforce maxLength", () => {
      const handleValueChange = vi.fn();
      render(
        <TagInput
          value={[]}
          onValueChange={handleValueChange}
          maxLength={5}
          placeholder="Add tag"
        />,
      );

      const input = screen.getByPlaceholderText("Add tag");
      fireEvent.change(input, { target: { value: "toolongtag" } });
      fireEvent.keyDown(input, { key: "Enter" });

      expect(handleValueChange).not.toHaveBeenCalled();
    });

    it("should use custom validateTag function", () => {
      const handleValueChange = vi.fn();
      const validateTag = vi.fn().mockReturnValue(false);

      render(
        <TagInput
          value={[]}
          onValueChange={handleValueChange}
          validateTag={validateTag}
          placeholder="Add tag"
        />,
      );

      const input = screen.getByPlaceholderText("Add tag");
      fireEvent.change(input, { target: { value: "invalid" } });
      fireEvent.keyDown(input, { key: "Enter" });

      expect(validateTag).toHaveBeenCalledWith("invalid");
      expect(handleValueChange).not.toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("should have proper aria-label on input", () => {
      render(<TagInput />);
      expect(screen.getByLabelText("Add new tag")).toBeInTheDocument();
    });

    it("should have proper aria-label on remove buttons", () => {
      render(<TagInput value={["mytag"]} />);
      expect(screen.getByLabelText("Remove mytag")).toBeInTheDocument();
    });

    it("should have role group on container", () => {
      render(<TagInput />);
      expect(screen.getByRole("group")).toBeInTheDocument();
    });
  });

  describe("Custom rendering", () => {
    it("should support custom tag variant", () => {
      render(<TagInput value={["tag"]} tagVariant="destructive" />);
      // Tag is rendered and variant is passed (we check the tag exists with remove button)
      expect(screen.getByText("tag")).toBeInTheDocument();
      expect(screen.getByLabelText("Remove tag")).toBeInTheDocument();
    });

    it("should support custom tagClassName", () => {
      render(<TagInput value={["tag"]} tagClassName="custom-tag-class" />);
      // Custom class is applied to the tag wrapper
      const tag = screen.getByText("tag").closest(".custom-tag-class");
      expect(tag).toBeInTheDocument();
    });

    it("should support custom renderTag function", () => {
      const renderTag = (tag: string, onRemove: () => void) => (
        <div data-testid="custom-tag" onClick={onRemove}>
          Custom: {tag}
        </div>
      );

      render(<TagInput value={["tag"]} renderTag={renderTag} />);
      expect(screen.getByTestId("custom-tag")).toHaveTextContent("Custom: tag");
    });
  });
});
