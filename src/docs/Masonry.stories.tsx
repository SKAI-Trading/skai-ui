import type { Meta, StoryObj } from "@storybook/react";
import { Masonry, MasonryItem } from "../components/data-display/masonry";
import { Card, CardContent, CardHeader, CardTitle } from "../components/core/card";

const meta: Meta<typeof Masonry> = {
  title: "Components/Masonry",
  component: Masonry,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A Pinterest-style masonry grid layout for displaying items of varying heights. Perfect for NFT galleries, token lists, and dashboards.",
      },
    },
  },
  tags: ["autodocs", "experimental"],
};

export default meta;
type Story = StoryObj<typeof Masonry>;

const items = [
  { id: 1, title: "ETH", price: "$3,200", change: "+5.2%", height: 120 },
  { id: 2, title: "BTC", price: "$65,432", change: "+2.1%", height: 180 },
  { id: 3, title: "SOL", price: "$142", change: "-1.3%", height: 100 },
  { id: 4, title: "ARB", price: "$1.23", change: "+8.7%", height: 160 },
  { id: 5, title: "OP", price: "$2.45", change: "+3.4%", height: 140 },
  { id: 6, title: "MATIC", price: "$0.89", change: "-0.5%", height: 110 },
  { id: 7, title: "AVAX", price: "$35.67", change: "+4.2%", height: 200 },
  { id: 8, title: "LINK", price: "$14.32", change: "+1.8%", height: 130 },
];

export const Default: Story = {
  render: () => (
    <Masonry columns={3} gap={16}>
      {items.map((item) => (
        <Card key={item.id} style={{ minHeight: item.height }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{item.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{item.price}</p>
            <p
              className={
                item.change.startsWith("+") ? "text-green-500" : "text-red-500"
              }
            >
              {item.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </Masonry>
  ),
};

export const TwoColumns: Story = {
  render: () => (
    <Masonry columns={2} gap={16}>
      {items.map((item) => (
        <Card key={item.id} style={{ minHeight: item.height }}>
          <CardHeader className="pb-2">
            <CardTitle>{item.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">{item.price}</p>
          </CardContent>
        </Card>
      ))}
    </Masonry>
  ),
};

export const FourColumns: Story = {
  render: () => (
    <Masonry columns={4} gap={12}>
      {items.map((item) => (
        <Card key={item.id} style={{ minHeight: item.height * 0.8 }}>
          <CardContent className="p-4">
            <p className="font-bold">{item.title}</p>
            <p className="text-sm">{item.price}</p>
          </CardContent>
        </Card>
      ))}
    </Masonry>
  ),
};

export const LargeGap: Story = {
  render: () => (
    <Masonry columns={3} gap={32}>
      {items.slice(0, 6).map((item) => (
        <Card key={item.id} style={{ minHeight: item.height }}>
          <CardContent className="p-6">
            <p className="text-xl font-bold">{item.title}</p>
            <p>{item.price}</p>
          </CardContent>
        </Card>
      ))}
    </Masonry>
  ),
};

export const WithAnimation: Story = {
  render: () => (
    <Masonry columns={3} gap={16}>
      {items.map((item, index) => (
        <MasonryItem key={item.id} index={index} animate>
          <Card style={{ minHeight: item.height }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{item.price}</p>
              <p
                className={
                  item.change.startsWith("+")
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {item.change}
              </p>
            </CardContent>
          </Card>
        </MasonryItem>
      ))}
    </Masonry>
  ),
};

export const NFTGallery: Story = {
  render: () => {
    const nfts = [
      { id: 1, name: "Bored Ape #1234", price: "45 ETH", height: 200 },
      { id: 2, name: "Punk #5678", price: "80 ETH", height: 150 },
      { id: 3, name: "Azuki #9012", price: "12 ETH", height: 180 },
      { id: 4, name: "Doodle #3456", price: "8 ETH", height: 160 },
      { id: 5, name: "Clone X #7890", price: "15 ETH", height: 220 },
      { id: 6, name: "Moonbird #1234", price: "6 ETH", height: 140 },
    ];

    return (
      <Masonry columns={3} gap={16}>
        {nfts.map((nft) => (
          <Card key={nft.id} className="overflow-hidden">
            <div
              className="bg-gradient-to-br from-purple-500 to-pink-500"
              style={{ height: nft.height }}
            />
            <CardContent className="p-4">
              <p className="font-semibold">{nft.name}</p>
              <p className="text-muted-foreground">{nft.price}</p>
            </CardContent>
          </Card>
        ))}
      </Masonry>
    );
  },
};
