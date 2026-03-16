import { render, screen } from "@testing-library/react";
import { Footer } from "@/components/sections/Footer";

jest.mock("lucide-react", () => ({
  Package: () => <div data-testid="package-icon" />,
}));

describe("Footer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render brand name and tagline", () => {
    // Arrange & Act
    render(<Footer />);

    // Assert
    expect(screen.getByText("Patchr")).toBeInTheDocument();
    expect(screen.getByText(/automatic dependency and security detection/i)).toBeInTheDocument();
  });

  it("should render navigation links by category", () => {
    // Arrange & Act
    render(<Footer />);

    // Assert - Product links
    expect(screen.getByRole("link", { name: /features/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /pricing/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /changelog/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /roadmap/i })).toBeInTheDocument();

    // Assert - Developers links
    expect(screen.getByRole("link", { name: /docs/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /api reference/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /cli/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /status/i })).toBeInTheDocument();

    // Assert - Company links
    expect(screen.getByRole("link", { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /blog/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /careers/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /contact/i })).toBeInTheDocument();
  });

  it("should render copyright and legal links", () => {
    // Arrange & Act
    render(<Footer />);

    // Assert
    expect(screen.getByText(/© 2025 patchr inc/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /privacy/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /terms/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /cookies/i })).toBeInTheDocument();
  });
});
