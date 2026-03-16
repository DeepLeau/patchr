import { render, screen } from "@testing-library/react";
import { Testimonials } from "@/components/sections/Testimonials";

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
            React.createElement(tag, strip(props), children),
      }
    ),
  };
});

jest.mock("@/components/ui/AnimatedCanopy", () => ({
  AnimatedCanopy: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="animated-canopy">{children}</div>
  ),
}));

describe("Testimonials", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render section title and badge", () => {
    // Arrange & Act
    render(<Testimonials />);

    // Assert
    expect(screen.getByText(/testimonials/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /loved by developers/i })).toBeInTheDocument();
  });

  it("should render testimonial cards with quotes and authors", () => {
    // Arrange & Act
    render(<Testimonials />);

    // Assert - use getAllByText since AnimatedCanopy duplicates content 3 times
    expect(screen.getAllByText(/alex k\./i)).toHaveLength(3);
    expect(screen.getAllByText(/sara m\./i)).toHaveLength(3);
    expect(screen.getAllByText(/tom r\./i)).toHaveLength(3);
  });
});
