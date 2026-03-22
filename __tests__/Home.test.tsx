import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

jest.mock("framer-motion", () => {
  const React = require("react");
  const strip = ({
    animate,
    initial,
    exit,
    transition,
    whileInView,
    whileHover,
    whileTap,
    variants,
    viewport,
    ...p
  }: any) => p;
  return {
    motion: new Proxy(
      {},
      {
        get: (_t: any, tag: string) =>
          ({ children, props }: any) =>
            React.createElement(tag, props ? strip(props) : {}, children),
      }
    ),
  };
});

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("@/components/ui/AnimatedTextGenerate", () => ({
  AnimatedTextGenerate: ({ text }: { text: string }) => (
    <div data-testid="animated-text">{text}</div>
  ),
}));

jest.mock("@/components/ui/UnicornBackground", () => ({
  UnicornBackground: () => <div data-testid="unicorn-background" />,
}));

jest.mock("@/components/ui/BentoGrid", () => ({
  BentoCard: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="bento-card">{children}</div>
  ),
  CounterFeature: () => <div data-testid="counter-feature" />,
  MetricsFeature: () => <div data-testid="metrics-feature" />,
  TimelineFeature: () => <div data-testid="timeline-feature" />,
  TypingFeature: () => <div data-testid="typing-feature" />,
  SpotlightFeature: () => <div data-testid="spotlight-feature" />,
  staggerContainer: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
}));

jest.mock("@/components/ui/AnimatedCanopy", () => ({
  AnimatedCanopy: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="animated-canopy">{children}</div>
  ),
}));

describe("Home Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window, "scrollY", { value: 0, writable: true });
  });

  it("should render all main sections", () => {
    // Arrange & Act
    render(<Home />);

    // Assert
    expect(screen.getAllByText("Patchr")).toHaveLength(2);
    expect(screen.getByTestId("animated-text")).toBeInTheDocument();
    expect(screen.getByText(/trusted by developers at/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /built different/i })).toBeInTheDocument();
    expect(screen.getByText(/testimonials/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /simple pricing/i })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /ready to secure your dependencies/i })
    ).toBeInTheDocument();
  });

  it("should render navbar with navigation links", () => {
    // Arrange & Act
    render(<Home />);

    // Assert
    expect(screen.getByRole("link", { name: /features/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /pricing/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /docs/i })).toBeInTheDocument();
  });

  it("should render footer with copyright", () => {
    // Arrange & Act
    render(<Home />);

    // Assert
    expect(screen.getByText(/© 2025 patchr inc/i)).toBeInTheDocument();
  });
});
