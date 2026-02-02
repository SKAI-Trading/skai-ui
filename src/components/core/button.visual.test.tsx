/**
 * Button Visual Regression Tests
 *
 * Tests visual consistency of Button and SkaiButton components
 * against Figma design tokens.
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Button, SkaiButton } from './button';

describe('Button Visual Regression', () => {
  describe('Standard Button variants', () => {
    it('renders default variant correctly', () => {
      const { container } = render(<Button variant="default">Default</Button>);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders destructive variant correctly', () => {
      const { container } = render(<Button variant="destructive">Destructive</Button>);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders outline variant correctly', () => {
      const { container } = render(<Button variant="outline">Outline</Button>);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders secondary variant correctly', () => {
      const { container } = render(<Button variant="secondary">Secondary</Button>);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders ghost variant correctly', () => {
      const { container } = render(<Button variant="ghost">Ghost</Button>);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders link variant correctly', () => {
      const { container } = render(<Button variant="link">Link</Button>);
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('Standard Button sizes', () => {
    it('renders default size correctly', () => {
      const { container } = render(<Button size="default">Default Size</Button>);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders sm size correctly', () => {
      const { container } = render(<Button size="sm">Small</Button>);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders lg size correctly', () => {
      const { container } = render(<Button size="lg">Large</Button>);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders icon size correctly', () => {
      const { container } = render(<Button size="icon">+</Button>);
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('SkaiButton types (Figma tokens)', () => {
    it('renders primary type with correct Sky Blue (#56C7F3)', () => {
      const { container } = render(<SkaiButton skaiType="primary">Primary</SkaiButton>);
      const button = container.firstChild as HTMLElement;
      expect(button.className).toContain('bg-[#56C7F3]');
      expect(button.className).toContain('text-[#001615]');
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders secondary type with correct border', () => {
      const { container } = render(<SkaiButton skaiType="secondary">Secondary</SkaiButton>);
      const button = container.firstChild as HTMLElement;
      expect(button.className).toContain('border-[#56C7F3]');
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders tertiary type with white text', () => {
      const { container } = render(<SkaiButton skaiType="tertiary">Tertiary</SkaiButton>);
      const button = container.firstChild as HTMLElement;
      expect(button.className).toContain('text-white');
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders link type with Alien Green (#17F9B4)', () => {
      const { container } = render(<SkaiButton skaiType="link">Link</SkaiButton>);
      const button = container.firstChild as HTMLElement;
      expect(button.className).toContain('text-[#17F9B4]');
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('SkaiButton sizes (Figma tokens)', () => {
    it('renders massive size with 72px height', () => {
      const { container } = render(<SkaiButton skaiSize="massive">Massive</SkaiButton>);
      const button = container.firstChild as HTMLElement;
      expect(button.className).toContain('h-[72px]');
      expect(button.className).toContain('rounded-[16px]');
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders large size with 64px height', () => {
      const { container } = render(<SkaiButton skaiSize="large">Large</SkaiButton>);
      const button = container.firstChild as HTMLElement;
      expect(button.className).toContain('h-16');
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders medium size with 50px height', () => {
      const { container } = render(<SkaiButton skaiSize="medium">Medium</SkaiButton>);
      const button = container.firstChild as HTMLElement;
      expect(button.className).toContain('h-[50px]');
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders small size with 46px height', () => {
      const { container } = render(<SkaiButton skaiSize="small">Small</SkaiButton>);
      const button = container.firstChild as HTMLElement;
      expect(button.className).toContain('h-[46px]');
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('SkaiButton typography', () => {
    it('uses Manrope font family', () => {
      const { container } = render(<SkaiButton>Font Test</SkaiButton>);
      const button = container.firstChild as HTMLElement;
      expect(button.className).toContain("font-['Manrope']");
    });

    it('uses -4% letter spacing', () => {
      const { container } = render(<SkaiButton>Tracking Test</SkaiButton>);
      const button = container.firstChild as HTMLElement;
      expect(button.className).toContain('tracking-[-0.04em]');
    });
  });

  describe('SkaiButton states', () => {
    it('renders disabled state correctly', () => {
      const { container } = render(<SkaiButton disabled>Disabled</SkaiButton>);
      const button = container.firstChild as HTMLElement;
      expect(button.className).toContain('disabled:opacity-50');
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
