import type { Meta, StoryObj } from "@storybook/react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../forms/select";
import { Label } from "../core/label";

const meta: Meta<typeof Select> = {
  title: "Components/Select",
  component: Select,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "A customizable select dropdown component.",
      },
    },
  },
  tags: ["autodocs", "stable"],
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select option" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2">Option 2</SelectItem>
        <SelectItem value="option3">Option 3</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2 w-[200px]">
      <Label htmlFor="framework">Framework</Label>
      <Select>
        <SelectTrigger id="framework">
          <SelectValue placeholder="Select framework" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="react">React</SelectItem>
          <SelectItem value="vue">Vue</SelectItem>
          <SelectItem value="angular">Angular</SelectItem>
          <SelectItem value="svelte">Svelte</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const WithGroups: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[250px]">
        <SelectValue placeholder="Select timezone" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>North America</SelectLabel>
          <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
          <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
          <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Europe</SelectLabel>
          <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
          <SelectItem value="cet">Central European Time (CET)</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Asia</SelectLabel>
          <SelectItem value="jst">Japan Standard Time (JST)</SelectItem>
          <SelectItem value="ist">India Standard Time (IST)</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

// Trading-specific selects
export const TokenSelect: Story = {
  render: () => (
    <Select defaultValue="eth">
      <SelectTrigger className="w-[150px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Popular Tokens</SelectLabel>
          <SelectItem value="eth">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-blue-500" />
              <span>ETH</span>
            </div>
          </SelectItem>
          <SelectItem value="usdc">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-blue-400" />
              <span>USDC</span>
            </div>
          </SelectItem>
          <SelectItem value="btc">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-orange-500" />
              <span>BTC</span>
            </div>
          </SelectItem>
          <SelectItem value="sol">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-purple-500" />
              <span>SOL</span>
            </div>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

export const NetworkSelect: Story = {
  render: () => (
    <div className="space-y-2">
      <Label>Network</Label>
      <Select defaultValue="base">
        <SelectTrigger className="w-[200px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="base">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-blue-500" />
              Base
            </div>
          </SelectItem>
          <SelectItem value="ethereum">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-purple-500" />
              Ethereum
            </div>
          </SelectItem>
          <SelectItem value="polygon">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-purple-400" />
              Polygon
            </div>
          </SelectItem>
          <SelectItem value="arbitrum">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-blue-400" />
              Arbitrum
            </div>
          </SelectItem>
          <SelectItem value="optimism">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-red-500" />
              Optimism
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const SlippageSelect: Story = {
  render: () => (
    <div className="space-y-2">
      <Label>Slippage Tolerance</Label>
      <Select defaultValue="0.5">
        <SelectTrigger className="w-[150px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="0.1">0.1%</SelectItem>
          <SelectItem value="0.5">0.5%</SelectItem>
          <SelectItem value="1.0">1.0%</SelectItem>
          <SelectItem value="2.0">2.0%</SelectItem>
          <SelectItem value="5.0">5.0%</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const OrderTypeSelect: Story = {
  render: () => (
    <div className="space-y-2">
      <Label>Order Type</Label>
      <Select defaultValue="market">
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="market">Market Order</SelectItem>
          <SelectItem value="limit">Limit Order</SelectItem>
          <SelectItem value="stop-loss">Stop Loss</SelectItem>
          <SelectItem value="take-profit">Take Profit</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const TimeframeSelect: Story = {
  render: () => (
    <Select defaultValue="24h">
      <SelectTrigger className="w-[100px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="1h">1H</SelectItem>
        <SelectItem value="4h">4H</SelectItem>
        <SelectItem value="24h">24H</SelectItem>
        <SelectItem value="7d">7D</SelectItem>
        <SelectItem value="30d">30D</SelectItem>
        <SelectItem value="1y">1Y</SelectItem>
        <SelectItem value="all">All</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const CurrencySelect: Story = {
  render: () => (
    <Select defaultValue="usd">
      <SelectTrigger className="w-[120px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fiat</SelectLabel>
          <SelectItem value="usd">USD ($)</SelectItem>
          <SelectItem value="eur">EUR (€)</SelectItem>
          <SelectItem value="gbp">GBP (£)</SelectItem>
          <SelectItem value="jpy">JPY (¥)</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Crypto</SelectLabel>
          <SelectItem value="btc">BTC (₿)</SelectItem>
          <SelectItem value="eth">ETH (Ξ)</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};
