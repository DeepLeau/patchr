import "@testing-library/jest-dom";
import { render, screen, within, act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SecurityAlerts } from "@/components/dashboard/SecurityAlerts";
import type { Alert } from "@/lib/data";

jest.mock('framer-motion', () => {
  const React = require('react');
  const strip = ({ animate, initial, exit, transition, whileInView, whileHover, whileTap, variants, viewport, layout, ...p }: any) => p;
  return {
    motion: new Proxy({}, {
      get: (_t: any, tag: string) => ({ children, ...props }: any) => React.createElement(tag, strip(props), children)
    }),
    AnimatePresence: ({ children }: any) => children,
  };
}, { virtual: true });

const mockAlerts: Alert[] = [
  {
    id: "alert-1",
    title: "SQL Injection in express",
    description: "CVE-2024-1234 - High severity SQL injection vulnerability",
    severity: "critical",
    package: "express@4.18.2",
    repository: "acme/api-gateway",
    detectedAt: "2h ago",
    actionRequired: true,
  },
  {
    id: "alert-2",
    title: "XSS vulnerability in lodash",
    description: "DOM-based XSS found in template rendering",
    severity: "critical",
    package: "lodash@4.17.20",
    repository: "acme/web-app",
    detectedAt: "1d ago",
    actionRequired: true,
  },
  {
    id: "alert-3",
    title: "Outdated axios version",
    description: "Consider upgrading to latest stable",
    severity: "low",
    package: "axios@0.27.0",
    repository: "acme/dashboard",
    detectedAt: "3d ago",
    actionRequired: false,
  },
];

describe("SecurityAlerts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render alert count in header", () => {
    render(<SecurityAlerts alerts={mockAlerts} />);
    const badge = screen.getByText("3");
    expect(badge).toBeInTheDocument();
  });

  it("should filter to critical alerts only when clicking critical button", async () => {
    const user = userEvent.setup();
    render(<SecurityAlerts alerts={mockAlerts} />);

    await act(async () => {
      await user.click(screen.getByRole("button", { name: /critical/i }));
    });

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /sql injection/i })).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /xss vulnerability/i })).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.queryByText(/outdated axios/i)).not.toBeInTheDocument();
    });
  });

  it("should filter to action-required alerts only when clicking action button", async () => {
    const user = userEvent.setup();
    render(<SecurityAlerts alerts={mockAlerts} />);

    await act(async () => {
      await user.click(screen.getByRole("button", { name: /action/i }));
    });

    await waitFor(() => {
      const alerts = screen.getAllByRole("listitem").length;
      expect(alerts).toBeGreaterThan(0);
    });
    await waitFor(() => {
      expect(screen.queryByText(/outdated axios/i)).not.toBeInTheDocument();
    });
  });

  it("should dismiss an alert when clicking X button", async () => {
    const user = userEvent.setup();
    render(<SecurityAlerts alerts={mockAlerts} />);

    const firstAlert = screen.getByTestId("alert-item-alert-1");
    const dismissBtn = within(firstAlert).getByRole("button", { name: /close/i });
    
    await act(async () => {
      await user.click(dismissBtn);
    });

    await waitFor(() => {
      expect(screen.queryByRole("heading", { name: /sql injection/i })).not.toBeInTheDocument();
    });
    const badge = screen.getByText("2");
    expect(badge).toBeInTheDocument();
  });

  it("should show empty state when all alerts are dismissed", async () => {
    const user = userEvent.setup();
    render(<SecurityAlerts alerts={mockAlerts} />);

    // Dismiss alerts one by one, waiting for each to complete
    for (let i = 0; i < 3; i++) {
      const dismissBtns = screen.queryAllByRole("button", { name: /close/i });
      if (dismissBtns.length > 0) {
        await act(async () => {
          await user.click(dismissBtns[0]);
        });
      }
    }

    await waitFor(() => {
      expect(screen.getByText(/all clear/i)).toBeInTheDocument();
    });
  });

  it("should render loading skeleton when loading prop is true", () => {
    render(<SecurityAlerts alerts={[]} loading />);
    expect(screen.getByTestId("alert-skeleton")).toBeInTheDocument();
  });
});
