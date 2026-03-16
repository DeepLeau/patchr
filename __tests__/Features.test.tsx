import { render, screen } from "@testing-library/react";
import { Features } from "@/components/sections/Features";

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
    motion: new Proxy({}, {
      get: (_t: any, tag: string) =>
        ({ children, ...props }: any) =>
          React.createElement(tag, strip(props), children),
    }),
  };
});

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

describe("Features", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render section heading", () => {
    // Arrange & Act
    render(<Features />);

    // Assert
    expect(screen.getByRole("heading", { name: /built different/i })).toBeInTheDocument();
    expect(screen.getByText(/everything you need to ship secure code/i)).toBeInTheDocument();
  });

  it("should render feature cards", () => {
    // Arrange & Act
    render(<Features />);

    // Assert - verify feature titles are rendered
    expect(screen.getByText(/automatic dependency scanning/i)).toBeInTheDocument();
    expect(screen.getByText(/security vulnerability detection/i)).toBeInTheDocument();
    expect(screen.getByText(/smart auto-prs/i)).toBeInTheDocument();
    expect(screen.getByText(/multi-language support/i)).toBeInTheDocument();
    expect(screen.getByText(/zero config setup/i)).toBeInTheDocument();
  });

  it("should render bento grid cards with content", () => {
    // Arrange & Act
    render(<Features />);

    // Assert
    const bentoCards = screen.getAllByTestId("bento-card");
    expect(bentoCards.length).toBeGreaterThan(0);
  });
});
