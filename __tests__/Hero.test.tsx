import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Hero } from "@/components/sections/Hero";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
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
    pushMock = (useRouter as jest.Mock).mock.results[0].value.push;
  });

  it("should navigate to /dashboard when CTA button is clicked", async () => {
    // Arrange
    render(<Hero />);
    const ctaButton = screen.getByRole("button", { name: /get started for free/i });

    // Act
    await userEvent.click(ctaButton);

    // Assert
    expect(pushMock).toHaveBeenCalledWith("/dashboard");
  });

  it("should show loading spinner and disable button while navigating", async () => {
    // Arrange
    render(<Hero />);
    const ctaButton = screen.getByRole("button", { name: /get started for free/i });

    // Act
    await userEvent.click(ctaButton);

    // Assert — button is disabled and spinner is visible
    expect(ctaButton).toBeDisabled();
    expect(ctaButton.querySelector(".animate-spin")).toBeInTheDocument();
  });
});
