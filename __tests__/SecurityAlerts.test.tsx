import "@testing-library/jest-dom";
import { render, screen, within, act } from "@testing-library/react";
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
    title: "Remote Code Execution in json5",
    description: "Prototype pollution vulnerability allowing RCE via '__proto__' property",
    severity: "critical",
    package: "json5@1.0.1",
    repository: "acme/api-service",
    detectedAt: "2 hours ago",
    actionRequired: true,
  },
  {
    id: "alert-2",
    title: "Prototype Pollution in lodash",
    description: "Allows attackers to inject properties via crafted __proto__ payloads",
    severity: "high",
    package: "lodash@4.17.20",
    repository: "acme/web-frontend",
    detectedAt: "5 hours ago",
    actionRequired: true,
  },
  {
    id: "alert-3",
    title: "Open Redirect in follow-redirects",
    description: "Unintended behavior when handling empty hostname",
    severity: "medium",
    package: "follow-redirects@1.15.0",
    repository: "acme/api-service",
    detectedAt: "1 day ago",
    actionRequired: false,
  },
  {
    id: "alert-4",
    title: "ReDoS in moment",
    description: "Regular expression denial of service via parseFormat",
    severity: "high",
    package: "moment@2.29.1",
    repository: "acme/ml-pipeline",
    detectedAt: "2 days ago",
    actionRequired: true,
  },
];

describe("SecurityAlerts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render alert count in header", () => {
    render(<SecurityAlerts alerts={mockAlerts} />);
    const badge = screen.getByText("4");
    expect(badge).toBeInTheDocument();
  });

  it("should filter to critical alerts only when clicking critical button", async () => {
    const user = userEvent.setup();
    render(<SecurityAlerts alerts={mockAlerts} />);

    await user.click(screen.getByRole("button", { name: /critical/i }));

    expect(screen.getByText(/remote code execution/i)).toBeInTheDocument();
    expect(screen.queryByText(/open redirect/i)).not.toBeInTheDocument();
  });

  it("should filter to action-required alerts only when clicking action button", async () => {
    const user = userEvent.setup();
    render(<SecurityAlerts alerts={mockAlerts} />);

    await user.click(screen.getByRole("button", { name: /action/i }));

    const alerts = screen.getAllByRole("listitem").length;
    expect(alerts).toBeGreaterThan(0);
    expect(screen.queryByText(/open redirect/i)).not.toBeInTheDocument();
  });

  it("should dismiss an alert when clicking X button", async () => {
    const user = userEvent.setup();
    render(<SecurityAlerts alerts={mockAlerts} />);

    const firstAlert = screen.getByTestId("alert-item-alert-1");
    const dismissBtn = within(firstAlert).getByRole("button", { name: /close/i });
    await user.click(dismissBtn);

    expect(screen.queryByText(/remote code execution/i)).not.toBeInTheDocument();
    const badge = screen.getByText("3");
    expect(badge).toBeInTheDocument();
  });

  it("should show empty state when all alerts are dismissed", async () => {
    const user = userEvent.setup();
    render(<SecurityAlerts alerts={mockAlerts} />);

    const dismissBtns = screen.getAllByRole("button", { name: /close/i });
    for (const btn of dismissBtns) {
      await user.click(btn);
    }

    expect(screen.getByText(/no alerts/i)).toBeInTheDocument();
  });

  it("should render loading skeleton when loading prop is true", () => {
    render(<SecurityAlerts alerts={[]} loading />);
    expect(screen.getByTestId("alert-skeleton")).toBeInTheDocument();
  });
});
