import { render, screen } from "@testing-library/react";
import { SocialProof } from "@/components/sections/SocialProof";

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

describe("SocialProof", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render section title", () => {
    // Arrange & Act
    render(<SocialProof />);

    // Assert
    expect(screen.getByText(/trusted by developers at/i)).toBeInTheDocument();
  });

  it("should render all company logos", () => {
    // Arrange & Act
    render(<SocialProof />);

    // Assert
    expect(screen.getByText("Vercel")).toBeInTheDocument();
    expect(screen.getByText("Linear")).toBeInTheDocument();
    expect(screen.getByText("Resend")).toBeInTheDocument();
    expect(screen.getByText("Raycast")).toBeInTheDocument();
    expect(screen.getByText("Supabase")).toBeInTheDocument();
    expect(screen.getByText("Turso")).toBeInTheDocument();
  });
});
