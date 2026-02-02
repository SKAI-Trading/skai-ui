import type { Meta, StoryObj } from "@storybook/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
} from "../components/data-display/carousel";
import { Card, CardContent } from "../components/core/card";

const meta: Meta<typeof Carousel> = {
  title: "Components/Carousel",
  component: Carousel,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A carousel component built on Embla Carousel for smooth, accessible sliding content.",
      },
    },
  },
  tags: ["autodocs", "beta"],
};

export default meta;
type Story = StoryObj<typeof Carousel>;

const items = [
  { id: 1, title: "ETH", value: "$3,200.45" },
  { id: 2, title: "BTC", value: "$65,432.10" },
  { id: 3, title: "SOL", value: "$142.87" },
  { id: 4, title: "ARB", value: "$1.23" },
  { id: 5, title: "OP", value: "$2.45" },
];

export const Default: Story = {
  render: () => (
    <div className="mx-auto w-full max-w-sm">
      <Carousel className="w-full">
        <CarouselContent>
          {items.map((item) => (
            <CarouselItem key={item.id}>
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <span className="text-2xl font-bold">{item.title}</span>
                  <span className="text-muted-foreground">{item.value}</span>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  ),
};

export const WithDots: Story = {
  render: () => (
    <div className="mx-auto w-full max-w-sm">
      <Carousel className="w-full">
        <CarouselContent>
          {items.map((item) => (
            <CarouselItem key={item.id}>
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <span className="text-2xl font-bold">{item.title}</span>
                  <span className="text-muted-foreground">{item.value}</span>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselDots />
      </Carousel>
    </div>
  ),
};

export const MultipleItems: Story = {
  render: () => (
    <div className="mx-auto w-full max-w-lg">
      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {items.map((item) => (
            <CarouselItem key={item.id} className="basis-1/3 pl-2 md:pl-4">
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-4">
                  <span className="text-lg font-bold">{item.title}</span>
                  <span className="text-xs text-muted-foreground">{item.value}</span>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="mx-auto h-80">
      <Carousel orientation="vertical" className="h-full w-full max-w-xs">
        <CarouselContent className="-mt-4 h-full">
          {items.map((item) => (
            <CarouselItem key={item.id} className="basis-1/2 pt-4">
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <span className="text-xl font-bold">{item.title}</span>
                  <span className="text-muted-foreground">{item.value}</span>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  ),
};

export const AutoLoop: Story = {
  render: () => (
    <div className="mx-auto w-full max-w-sm">
      <Carousel opts={{ loop: true }} className="w-full">
        <CarouselContent>
          {items.map((item) => (
            <CarouselItem key={item.id}>
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <span className="text-2xl font-bold">{item.title}</span>
                  <span className="text-muted-foreground">{item.value}</span>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
        <CarouselDots />
      </Carousel>
    </div>
  ),
};
