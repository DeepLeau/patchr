import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RecentScans } from "@/components/dashboard/RecentScans";
import type { Scan } from "@/lib/data";

jest.mock('framer-motion', () => {
  const React = require('react');
  const strip = ({ animate, initial, exit, transition, whileInView, whileHover, whileTap, variants, viewport, layout, ...p }: any) => p;
  return {
    motion: new Proxy({}, {
      get: (_t: any, tag: string) => ({ children, ...props }: any) => React.createElement(tag, strip(props), children)
    }),
  };
}, { virtual: true });

const mockScans: Scan[] = [
  { id: "scan-1", repository: "acme/api-gateway", status: "completed", vulnerabilities: 3, date: "Jan 15", commit: "a1b2c3d", duration: "12s" },
  { id: "scan-2", repository: "acme/web-app", status: "failed", vulnerabilities: 1, date: "Jan 14", commit: "e4f5g6h", duration: "8s" },
  { id: "scan-3", repository: "acme/dashboard", status: "running", vulnerabilities: 0, date: "Jan 13", commit: "i7j8k9l", duration: "5s" },
  { id: "scan-4", repository: "acme/core-lib", status: "completed", vulnerabilities: 2, date: "Jan 12", commit: "m0n1o2p", duration: "15s" },
];

describe("RecentScans", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render all scan rows", () => {
    render(<RecentScans scans={mockScans} />);
    expect(screen.getAllByRole("row")).toHaveLength(5);
  });

  it("should sort by vulnerabilities descending by default", () => {
    render(<RecentScans scans={mockScans} />);
    const rows = screen.getAllByRole("row").slice(1);
    const vulnCells = rows.map((row) => {
      const cell = within(row).getByText(/^\d+$/).textContent;
      return parseInt(cell || "0", 10);
    });
    expect(vulnCells[0]).toBeGreaterThanOrEqual(vulnCells[1]);
  });

  it("should sort ascending when clicking vulnerabilities header", async () => {
    const user = userEvent.setup();
    render(<RecentScans scans={mockScans} />);

    const vulnHeader = screen.getByRole("columnheader", { name: /vulns/i });
    await user.click(vulnHeader);

    const rows = screen.getAllByRole("row").slice(1);
    const vulnCells = rows.map((row) => {
      const cell = within(row).getByText(/^\d+$/).textContent;
      return parseInt(cell || "0", 10);
    });
    expect(vulnCells).toEqual([3, 2, 1, 0]);
  });

  it("should sort descending when clicking vulnerabilities header twice", async () => {
    const user = userEvent.setup();
    render(<RecentScans scans={mockScans} />);

    const vulnHeader = screen.getByRole("columnheader", { name: /vulns/i });
    await user.click(vulnHeader);
    await user.click(vulnHeader);

    const rows = screen.getAllByRole("row").slice(1);
    const vulnCells = rows.map((row) => {
      const cell = within(row).getByText(/^\d+$/).textContent;
      return parseInt(cell || "0", 10);
    });
    expect(vulnCells).toEqual([3, 2, 1, 0]);
  });

  it("should sort by repository when clicking repository header", async () => {
    const user = userEvent.setup();
    render(<RecentScans scans={mockScans} />);

    const repoHeader = screen.getByRole("columnheader", { name: /repository/i });
    await user.click(repoHeader);

    const rows = screen.getAllByRole("row").slice(1);
    const repoNames = rows.map((row) => within(row).getByText(/^acme\//).textContent);
    const sorted = [...repoNames].sort((a, b) => b.localeCompare(a));
    expect(repoNames).toEqual(sorted);
  });

  it("should render loading skeleton when loading prop is true", () => {
    render(<RecentScans scans={[]} loading />);
    expect(screen.getByTestId("scans-skeleton")).toBeInTheDocument();
  });
});
