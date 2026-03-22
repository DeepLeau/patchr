import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Hero } from "@/components/sections/Hero";

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

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("Hero", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render hero badge", () => {
    // Arrange & Act
    render(<Hero />);

    // Assert
    expect(screen.getByText(/now available/i)).toBeInTheDocument();
  });

  it("should render main headline text", () => {
    // Arrange & Act
    render(<Hero />);

    // Assert
    expect(screen.getByTestId("animated-text")).toBeInTheDocument();
  });

  it("should render description and CTA buttons", () => {
    // Arrange & Act
    render(<Hero />);

    // Assert
    expect(screen.getByText(/patchr automatically detects outdated dependencies/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /get started for free/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /how it works/i })).toBeInTheDocument();
    expect(screen.getByText(/trusted by 2,400\+ developers/i)).toBeInTheDocument();
  });

  it("should navigate to dashboard when clicking the primary CTA button", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<Hero />);
    const ctaButton = screen.getByRole("button", { name: /get started for free/i });

    // Act
    await user.click(ctaButton);

    // Assert
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith("/dashboard");
  });
});
