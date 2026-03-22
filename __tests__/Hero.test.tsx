import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Hero } from "@/components/sections/Hero";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
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
    motion: new Proxy(
      {},
      {
        get: (_t: any, tag: string) =>
          ({ children, ...props }: any) =>
            React.createElement(tag, strip(props), children),
      }
    ),
    useScroll: () => ({ scrollY: { onChange: jest.fn() } }),
    useTransform: () => 0,
    AnimatePresence: ({ children }: any) => children,
  };
});

jest.mock("@/components/ui/UnicornBackground", () => ({
  UnicornBackground: ({ className }: { className?: string }) => (
    <div data-testid="unicorn-background" className={className} />
  ),
}));

jest.mock("@/components/ui/AnimatedTextGenerate", () => ({
  AnimatedTextGenerate: () => <div data-testid="animated-text" />,
}));

import { useRouter } from "next/navigation";

describe("Hero", () => {
  let pushMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    pushMock = (useRouter() as ReturnType<typeof useRouter>).push;
  });

  it("should navigate to dashboard when clicking Get started for free button", async () => {
    // Arrange
    render(<Hero />);
    const button = screen.getByRole("button", {
      name: /get started for free/i,
    });

    // Act
    await userEvent.click(button);

    // Assert
    expect(pushMock).toHaveBeenCalledWith("/dashboard");
  });
});
