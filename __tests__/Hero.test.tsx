import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Hero } from "@/components/sections/Hero";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
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
    motion: new Proxy({}, {
      get: (_t: any, tag: string) =>
        ({ children, ...props }: any) =>
          React.createElement(tag, strip(props), children),
    }),
    useScroll: () => ({ scrollY: { onChange: jest.fn() } }),
    useTransform: () => 0,
    AnimatePresence: ({ children }: any) => children,
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
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render hero section with badge, headline, and description", () => {
    // Arrange & Act
    render(<Hero />);

    // Assert
    expect(screen.getByText(/now available/i)).toBeInTheDocument();
    expect(screen.getByTestId("animated-text")).toBeInTheDocument();
    expect(
      screen.getByText(/patchr automatically detects outdated dependencies/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/trusted by 2,400\+ developers/i)
    ).toBeInTheDocument();
  });

  it("should render both CTA buttons", () => {
    // Arrange & Act
    render(<Hero />);

    // Assert
    expect(
      screen.getByRole("button", { name: /get started for free/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /how it works/i })
    ).toBeInTheDocument();
  });

  it("should navigate to dashboard when clicking get started button", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<Hero />);
    const button = screen.getByRole("button", { name: /get started for free/i });

    // Act
    await user.click(button);

    // Assert
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith("/dashboard");
  });
});
