import "@testing-library/jest-dom";
import { render, screen, within, act } from "@testing-library/react";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import type { ActivityItem } from "@/lib/data";

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

const mockInitialItems: ActivityItem[] = [
  { id: "init-1", type: "scan", message: "Scan completed for api-gateway", repository: "acme/api-gateway", timestamp: "5m ago" },
  { id: "init-2", type: "fix", message: "Patched lodash to 4.17.21", repository: "acme/web-app", timestamp: "15m ago" },
  { id: "init-3", type: "pr", message: "PR merged: Update react", repository: "acme/dashboard", timestamp: "30m ago" },
];

describe("ActivityFeed", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should render initial items on mount", () => {
    render(<ActivityFeed initialItems={mockInitialItems} />);
    expect(screen.getByText(/scan completed/i)).toBeInTheDocument();
    expect(screen.getByText(/patched lodash/i)).toBeInTheDocument();
    expect(screen.getByText(/pr merged/i)).toBeInTheDocument();
  });

  it("should add new item after interval when using fake timers", async () => {
    jest.useFakeTimers();
    render(<ActivityFeed initialItems={mockInitialItems} />);

    expect(screen.getAllByTestId("activity-item")).toHaveLength(3);

    act(() => {
      jest.advanceTimersByTime(4000);
    });

    const items = screen.getAllByTestId("activity-item");
    expect(items.length).toBe(4);
  });

  it("should limit items to 5 after multiple intervals", async () => {
    jest.useFakeTimers();
    render(<ActivityFeed initialItems={mockInitialItems} />);

    act(() => {
      jest.advanceTimersByTime(16000);
    });

    const items = screen.getAllByTestId("activity-item");
    expect(items.length).toBeLessThanOrEqual(5);
  });

  it("should render live indicator in header", () => {
    render(<ActivityFeed initialItems={mockInitialItems} />);
    expect(screen.getByText(/live/i)).toBeInTheDocument();
  });
});
