import { render, screen } from "@testing-library/react";
import { Hero } from "@/components/sections/Hero";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

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

jest.mock("@/components/ui/AnimatedTextGenerate", () => ({
  AnimatedTextGenerate: ({ text }: { text: string }) => (
    <div data-testid="animated-text">{text}</div>
  ),
}));

jest.mock("@/components/ui/UnicornBackground", () => ({
  UnicornBackground: () => <div data-testid="unicorn-background" />,
}));

describe("Hero", () => {
  let pushMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
  });

  it("should render hero badge and headline", () => {
    // Arrange & Act
    render(<Hero />);

    // Assert
    expect(screen.getByText(/now available/i)).toBeInTheDocument();
    expect(screen.getByTestId("animated-text")).toBeInTheDocument();
  });

  it("should render description, CTA buttons and social proof", () => {
    // Arrange & Act
    render(<Hero />);

    // Assert
    expect(screen.getByText(/patchr automatically detects outdated dependencies/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /get started for free/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /how it works/i })).toBeInTheDocument();
    expect(screen.getByText(/trusted by 2,400\+ developers/i)).toBeInTheDocument();
  });

  it("should navigate to /dashboard when Get started button is clicked", () => {
    // Arrange
    render(<Hero />);
    const ctaButton = screen.getByRole("button", { name: /get started for free/i });

    // Act
    ctaButton.click();

    // Assert
    expect(pushMock).toHaveBeenCalledWith("/dashboard");
  });
});
