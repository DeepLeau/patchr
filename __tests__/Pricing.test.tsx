import { render, screen } from "@testing-library/react";
import { Pricing } from "@/components/sections/Pricing";

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
          ({ children, ...props }: any) =>
            React.createElement(tag, strip(props), children),
      }
    ),
  };
});

describe("Pricing", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render section title", () => {
    // Arrange & Act
    render(<Pricing />);

    // Assert
    expect(screen.getByRole("heading", { name: /simple pricing/i })).toBeInTheDocument();
  });

  it("should render both pricing plans", () => {
    // Arrange & Act
    render(<Pricing />);

    // Assert - 4 occurrences: description, plan name, and 2 buttons containing "free"
    expect(screen.getAllByText(/free/i)).toHaveLength(4);
    expect(screen.getByText(/pro/i)).toBeInTheDocument();
  });

  it("should render CTA buttons for each plan", () => {
    // Arrange & Act
    render(<Pricing />);

    // Assert
    expect(screen.getByRole("button", { name: /start free$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /start free trial/i })).toBeInTheDocument();
  });
});
