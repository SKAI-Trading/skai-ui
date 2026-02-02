import type { Meta, StoryObj } from "@storybook/react";
import {
  HStack,
  VStack,
  Grid,
  GridItem,
  Center,
  Container,
  Spacer,
  Divider,
  AspectRatio,
  Hide,
  Show,
} from "../lib/layout";
import { Card, CardContent } from "../components/card";

const meta: Meta = {
  title: "Layout/Primitives",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
Layout primitives for building flexible UI structures.

**Available Components:**
- \`Stack\` / \`HStack\` / \`VStack\` - Flexbox stacking
- \`Grid\` / \`GridItem\` - CSS Grid layout
- \`Center\` - Center content
- \`Container\` - Max-width container
- \`Spacer\` - Flexible space filler
- \`Divider\` - Visual separator
- \`AspectRatio\` - Maintain aspect ratio
- \`Hide\` / \`Show\` - Responsive visibility
        `,
      },
    },
  },
};

export default meta;

// Demo box for visibility
const Box = ({
  children,
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`p-4 bg-primary/20 border border-primary/30 rounded-lg text-center ${className}`}
  >
    {children}
  </div>
);

/* ============================================
 * Stack Stories
 * ============================================ */

export const VerticalStack: StoryObj = {
  render: () => (
    <VStack gap={4}>
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
    </VStack>
  ),
  parameters: {
    docs: {
      description: {
        story: "Vertical stack with consistent gap between items.",
      },
    },
  },
};

export const HorizontalStack: StoryObj = {
  render: () => (
    <HStack gap={4}>
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
    </HStack>
  ),
  parameters: {
    docs: {
      description: {
        story: "Horizontal stack with consistent gap between items.",
      },
    },
  },
};

export const StackAlignment: StoryObj = {
  render: () => (
    <VStack gap={8}>
      <div>
        <p className="text-sm text-muted-foreground mb-2">
          justify=&quot;between&quot;
        </p>
        <HStack justify="between" className="w-full p-4 bg-muted/30 rounded-lg">
          <Box>Left</Box>
          <Box>Right</Box>
        </HStack>
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-2">
          align=&quot;center&quot;
        </p>
        <HStack
          align="center"
          gap={4}
          className="h-24 p-4 bg-muted/30 rounded-lg"
        >
          <Box className="h-8">Short</Box>
          <Box className="h-16">Tall</Box>
          <Box className="h-12">Medium</Box>
        </HStack>
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-2">
          justify=&quot;center&quot; + align=&quot;center&quot;
        </p>
        <HStack
          justify="center"
          align="center"
          className="h-32 p-4 bg-muted/30 rounded-lg"
        >
          <Box>Centered</Box>
        </HStack>
      </div>
    </VStack>
  ),
};

export const StackWithWrap: StoryObj = {
  render: () => (
    <HStack gap={2} wrap className="max-w-md">
      {Array.from({ length: 10 }, (_, i) => (
        <Box key={i}>Item {i + 1}</Box>
      ))}
    </HStack>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Stack with wrap enabled - items flow to next line when space runs out.",
      },
    },
  },
};

/* ============================================
 * Grid Stories
 * ============================================ */

export const BasicGrid: StoryObj = {
  render: () => (
    <Grid cols={3} gap={4}>
      <Box>1</Box>
      <Box>2</Box>
      <Box>3</Box>
      <Box>4</Box>
      <Box>5</Box>
      <Box>6</Box>
    </Grid>
  ),
};

export const GridWithSpan: StoryObj = {
  render: () => (
    <Grid cols={4} gap={4}>
      <GridItem colSpan={2}>
        <Box>Spans 2 columns</Box>
      </GridItem>
      <Box>1</Box>
      <Box>2</Box>
      <GridItem colSpan={4}>
        <Box>Full width</Box>
      </GridItem>
      <Box>3</Box>
      <GridItem colSpan={3}>
        <Box>Spans 3 columns</Box>
      </GridItem>
    </Grid>
  ),
};

export const ResponsiveGrid: StoryObj = {
  render: () => (
    <div>
      <p className="text-sm text-muted-foreground mb-4">
        Resize window to see responsive behavior: 1 col → 2 cols → 3 cols → 4
        cols
      </p>
      <Grid cols={1} responsive={{ sm: 2, md: 3, lg: 4 }} gap={4}>
        {Array.from({ length: 8 }, (_, i) => (
          <Box key={i}>Item {i + 1}</Box>
        ))}
      </Grid>
    </div>
  ),
};

/* ============================================
 * Container & Center Stories
 * ============================================ */

export const ContainerSizes: StoryObj = {
  render: () => (
    <VStack gap={8}>
      {(["sm", "md", "lg", "xl", "2xl"] as const).map((size) => (
        <div key={size}>
          <p className="text-sm text-muted-foreground mb-2">
            size=&quot;{size}&quot;
          </p>
          <Container size={size} className="bg-muted/30 py-4 rounded-lg">
            <Box>Container {size}</Box>
          </Container>
        </div>
      ))}
    </VStack>
  ),
};

export const CenterContent: StoryObj = {
  render: () => (
    <Center className="h-64 bg-muted/30 rounded-lg">
      <Card>
        <CardContent className="pt-6">
          <p>Centered content</p>
        </CardContent>
      </Card>
    </Center>
  ),
};

/* ============================================
 * Spacer & Divider Stories
 * ============================================ */

export const SpacerUsage: StoryObj = {
  render: () => (
    <VStack gap={4}>
      <div>
        <p className="text-sm text-muted-foreground mb-2">
          Spacer pushes items apart
        </p>
        <HStack className="w-full p-4 bg-muted/30 rounded-lg">
          <Box>Logo</Box>
          <Spacer flex />
          <Box>Navigation</Box>
        </HStack>
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-2">Fixed size spacer</p>
        <HStack className="p-4 bg-muted/30 rounded-lg">
          <Box>Item 1</Box>
          <Spacer size={8} />
          <Box>Item 2</Box>
        </HStack>
      </div>
    </VStack>
  ),
};

export const DividerVariants: StoryObj = {
  render: () => (
    <VStack gap={8}>
      <div>
        <p className="text-sm text-muted-foreground mb-4">Horizontal divider</p>
        <VStack gap={4}>
          <Box>Above</Box>
          <Divider />
          <Box>Below</Box>
        </VStack>
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-4">Divider with label</p>
        <VStack gap={4}>
          <Box>Above</Box>
          <Divider label="OR" />
          <Box>Below</Box>
        </VStack>
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-4">Vertical divider</p>
        <HStack gap={4} className="h-24">
          <Box>Left</Box>
          <Divider orientation="vertical" />
          <Box>Right</Box>
        </HStack>
      </div>
    </VStack>
  ),
};

/* ============================================
 * AspectRatio Stories
 * ============================================ */

export const AspectRatioVariants: StoryObj = {
  render: () => (
    <Grid cols={3} gap={4}>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Square (1:1)</p>
        <AspectRatio ratio="square" className="bg-muted/30 rounded-lg">
          <Center className="h-full">Square</Center>
        </AspectRatio>
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-2">Video (16:9)</p>
        <AspectRatio ratio="video" className="bg-muted/30 rounded-lg">
          <Center className="h-full">16:9</Center>
        </AspectRatio>
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-2">Wide (21:9)</p>
        <AspectRatio ratio="wide" className="bg-muted/30 rounded-lg">
          <Center className="h-full">21:9</Center>
        </AspectRatio>
      </div>
    </Grid>
  ),
};

/* ============================================
 * Responsive Visibility Stories
 * ============================================ */

export const ResponsiveVisibility: StoryObj = {
  render: () => (
    <VStack gap={4}>
      <p className="text-sm text-muted-foreground">
        Resize the window to see elements appear/disappear
      </p>

      <HStack gap={4} wrap>
        <Hide below="sm">
          <Box className="bg-red-500/20 border-red-500/30">Hidden below sm</Box>
        </Hide>

        <Hide below="md">
          <Box className="bg-yellow-500/20 border-yellow-500/30">
            Hidden below md
          </Box>
        </Hide>

        <Hide below="lg">
          <Box className="bg-green-500/20 border-green-500/30">
            Hidden below lg
          </Box>
        </Hide>

        <Show below="md">
          <Box className="bg-blue-500/20 border-blue-500/30">
            Only on mobile
          </Box>
        </Show>

        <Show above="lg">
          <Box className="bg-purple-500/20 border-purple-500/30">
            Only on desktop
          </Box>
        </Show>
      </HStack>
    </VStack>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Use `Hide` and `Show` components to control visibility at different breakpoints.",
      },
    },
  },
};

/* ============================================
 * Real-World Layout Examples
 * ============================================ */

export const HeaderLayout: StoryObj = {
  render: () => (
    <HStack
      justify="between"
      align="center"
      className="p-4 bg-card border-b border-border"
    >
      <HStack gap={4} align="center">
        <div className="w-8 h-8 bg-primary rounded-lg" />
        <span className="font-semibold">SKAI</span>
      </HStack>

      <HStack gap={6}>
        <Hide below="md">
          <HStack gap={4}>
            <span className="text-sm">Trade</span>
            <span className="text-sm">Portfolio</span>
            <span className="text-sm">Play</span>
          </HStack>
        </Hide>
        <Box className="!p-2">Connect</Box>
      </HStack>
    </HStack>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Example header layout using Stack components with responsive navigation.",
      },
    },
  },
};

export const DashboardLayout: StoryObj = {
  render: () => (
    <Grid cols={1} responsive={{ lg: 4 }} gap={4}>
      <GridItem colSpan={1}>
        <Card>
          <CardContent className="pt-6">
            <VStack gap={2}>
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-2xl font-bold">$12,345.67</p>
            </VStack>
          </CardContent>
        </Card>
      </GridItem>

      <GridItem colSpan={1}>
        <Card>
          <CardContent className="pt-6">
            <VStack gap={2}>
              <p className="text-sm text-muted-foreground">24h Change</p>
              <p className="text-2xl font-bold text-green-500">+5.23%</p>
            </VStack>
          </CardContent>
        </Card>
      </GridItem>

      <GridItem colSpan={1}>
        <Card>
          <CardContent className="pt-6">
            <VStack gap={2}>
              <p className="text-sm text-muted-foreground">Holdings</p>
              <p className="text-2xl font-bold">12</p>
            </VStack>
          </CardContent>
        </Card>
      </GridItem>

      <GridItem colSpan={1}>
        <Card>
          <CardContent className="pt-6">
            <VStack gap={2}>
              <p className="text-sm text-muted-foreground">Win Rate</p>
              <p className="text-2xl font-bold">68%</p>
            </VStack>
          </CardContent>
        </Card>
      </GridItem>
    </Grid>
  ),
  parameters: {
    docs: {
      description: {
        story: "Dashboard stats layout with responsive grid.",
      },
    },
  },
};
