import { render, screen, fireEvent } from "@testing-library/react";
import { Navbar } from "@/components/sections/Navbar";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
  usePathname: () => "/mock-path",
  useSearchParams: () => new URLSearchParams(),
}));

jest.mock("lucide-react", () => ({
  Package: () => <div data-testid="package-icon" />,
}));

describe("Navbar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window, "scrollY", { value: 0, writable: true });
  });

  it("should render logo and brand name", () => {
    // Arrange & Act
    render(<Navbar />);

    // Assert
    expect(screen.getByTestId("package-icon")).toBeInTheDocument();
    expect(screen.getByText("Patchr")).toBeInTheDocument();
  });

  it("should render navigation links", () => {
    // Arrange & Act
    render(<Navbar />);

    // Assert
    expect(screen.getByRole("link", { name: /features/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /pricing/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /docs/i })).toBeInTheDocument();
  });

  it("should render login link and CTA button", () => {
    // Arrange & Act
    render(<Navbar />);

    // Assert
    expect(screen.getByRole("link", { name: /log in/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /get started/i })).toBeInTheDocument();
  });
});
