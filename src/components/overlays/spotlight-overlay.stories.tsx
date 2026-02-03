import type { Meta, StoryObj } from "@storybook/react";
import { SpotlightOverlay, type SpotlightQuest, type SpotlightPosition } from "./spotlight-overlay";
import { useState } from "react";

const meta: Meta<typeof SpotlightOverlay> = {
  title: "Overlays/SpotlightOverlay",
  component: SpotlightOverlay,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
A comprehensive spotlight overlay for tutorials, onboarding, and feature introductions.

Features:
- Full-screen overlay with spotlight cutout effect
- Animated pointing arrows
- Progress tracking with step dots
- Multiple arrow directions based on element position
- Preview mode support
- Smooth animations and transitions

Perfect for:
- Tutorial walkthroughs
- Feature onboarding
- Guided product tours
- Admin preview modes
        `,
      },
    },
  },
  argTypes: {
    isActive: {
      control: "boolean",
      description: "Whether the spotlight overlay is currently active",
    },
    isPreviewMode: {
      control: "boolean",
      description: "Whether the overlay is in preview/admin mode",
    },
    arrowDirection: {
      control: "select",
      options: ["up", "down", "left", "right"],
      description: "Override the automatic arrow direction",
    },
  },
};

export default meta;
type Story = StoryObj<typeof SpotlightOverlay>;

// Demo quest data
const demoQuest: SpotlightQuest = {
  id: "welcome-tour",
  title: "Welcome to SKAI",
  icon: "🚀",
  points_reward: 100,
  steps: [
    {
      id: "step-1",
      title: "Welcome to Trading",
      description: "This is the main trading interface where you can buy and sell tokens with leverage.",
      targetSelector: "#trading-button",
      action: "click",
    },
    {
      id: "step-2",
      title: "Check Your Balance",
      description: "Your SKAI token balance is displayed here. You'll need SKAI to start trading.",
      targetSelector: "#balance-display",
      action: "observe",
    },
    {
      id: "step-3",
      title: "Place Your First Trade",
      description: "Click here to open the trading panel and place your first trade.",
      targetSelector: "#trade-panel",
      action: "click",
    },
  ],
};

const demoPosition: SpotlightPosition = {
  top: 100,
  left: 150,
  width: 200,
  height: 50,
};

// Interactive demo component
function SpotlightDemo({ isPreviewMode = false }: { isPreviewMode?: boolean }) {
  const [isActive, setIsActive] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < demoQuest.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsActive(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    setIsActive(false);
  };

  const handleClose = () => {
    setIsActive(false);
  };

  const restart = () => {
    setIsActive(true);
    setCurrentStep(0);
  };

  return (
    <div className="relative h-[600px] w-full bg-gray-900 rounded-lg overflow-hidden">
      {/* Demo page content */}
      <div className="p-8 text-white">
        <h1 className="text-2xl font-bold mb-4">SKAI Trading Dashboard</h1>
        <div className="grid grid-cols-3 gap-4">
          <div 
            id="trading-button"
            className="bg-blue-600 p-4 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
          >
            <h3 className="font-semibold">Trading</h3>
            <p className="text-sm opacity-80">Start trading with leverage</p>
          </div>
          <div 
            id="balance-display"
            className="bg-green-600 p-4 rounded-lg"
          >
            <h3 className="font-semibold">Balance</h3>
            <p className="text-lg">1,000 SKAI</p>
          </div>
          <div 
            id="trade-panel"
            className="bg-purple-600 p-4 rounded-lg cursor-pointer hover:bg-purple-700 transition-colors"
          >
            <h3 className="font-semibold">Trade Panel</h3>
            <p className="text-sm opacity-80">Quick trade access</p>
          </div>
        </div>

        {!isActive && (
          <div className="mt-8">
            <button
              onClick={restart}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Restart Tutorial
            </button>
          </div>
        )}
      </div>

      <SpotlightOverlay
        isActive={isActive}
        quest={demoQuest}
        currentStepIndex={currentStep}
        position={demoPosition}
        isPreviewMode={isPreviewMode}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSkip={handleSkip}
        onClose={handleClose}
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <SpotlightDemo />,
  parameters: {
    docs: {
      description: {
        story: "A basic spotlight overlay with tutorial content and navigation controls.",
      },
    },
  },
};

export const PreviewMode: Story = {
  render: () => <SpotlightDemo isPreviewMode={true} />,
  parameters: {
    docs: {
      description: {
        story: "Spotlight overlay in preview/admin mode with special styling and indicators.",
      },
    },
  },
};

export const DifferentArrowDirections: Story = {
  render: () => {
    const positions = {
      down: { top: 50, left: 150, width: 200, height: 50 },
      up: { top: 450, left: 150, width: 200, height: 50 },
      right: { top: 250, left: 50, width: 200, height: 50 },
      left: { top: 250, left: 450, width: 200, height: 50 },
    };

    return (
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(positions).map(([direction, position]) => (
          <div key={direction} className="relative h-[300px] bg-gray-900 rounded-lg overflow-hidden">
            <div className="p-4 text-white">
              <h3 className="font-bold mb-2">Arrow Direction: {direction}</h3>
              <div 
                className="bg-blue-600 p-2 rounded"
                style={{
                  position: "absolute",
                  top: position.top,
                  left: position.left,
                  width: position.width,
                  height: position.height,
                }}
              >
                Target Element
              </div>
            </div>
            <SpotlightOverlay
              isActive={true}
              quest={{
                ...demoQuest,
                steps: [demoQuest.steps[0]], // Single step
              }}
              currentStepIndex={0}
              position={position}
              arrowDirection={direction as any}
              onNext={() => {}}
            />
          </div>
        ))}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Showcase different arrow directions based on element positioning.",
      },
    },
  },
};