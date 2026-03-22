import { Package, Settings, Bell, LogOut } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-[#0a0a0a] text-zinc-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[220px] h-screen flex flex-col bg-[#0a0a0a] border-r border-white/[0.06] px-3 py-4 shrink-0">
        <div className="flex items-center gap-2 px-2 mb-6">
          <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center">
            <Package size={14} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-semibold text-zinc-100 tracking-tight">
            Patchr
          </span>
        </div>

        <nav className="flex flex-col gap-0.5 flex-1">
          {[
            { label: "Overview", active: true },
            { label: "Repositories", active: false },
            { label: "Security", active: false },
            { label: "Settings", active: false },
          ].map(({ label, active }) => (
            <button
              key={label}
              className={`flex items-center gap-2.5 px-2 h-8 rounded-md text-sm transition-colors duration-150 ${
                active
                  ? "bg-white/[0.07] text-zinc-100 font-medium"
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03]"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2.5 px-2 py-2 rounded-md hover:bg-white/[0.04] cursor-pointer transition-colors border-t border-white/[0.05] pt-3">
          <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center text-[10px] text-zinc-300 font-medium">
            JD
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-medium text-zinc-200 truncate">
              John Doe
            </span>
            <span className="text-[11px] text-zinc-500 truncate">
              john@example.com
            </span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between h-14 px-6 border-b border-white/[0.06] shrink-0">
          <div>
            <h1 className="text-sm font-semibold text-zinc-100">Overview</h1>
            <p className="text-xs text-zinc-500">Dashboard</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-white/[0.04] text-zinc-500 hover:text-zinc-300 transition-colors">
              <Bell size={15} strokeWidth={1.5} />
            </button>
            <button className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-white/[0.04] text-zinc-500 hover:text-zinc-300 transition-colors">
              <Settings size={15} strokeWidth={1.5} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {/* Placeholder content */}
          <div className="flex flex-col items-center justify-center flex-1 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center mb-6">
              <Package size={28} className="text-zinc-500" strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-semibold text-zinc-200 mb-2">
              Dashboard coming soon
            </h2>
            <p className="text-sm text-zinc-500 max-w-sm">
              This page is a placeholder. Full dashboard functionality will be
              implemented soon with repository management, security scanning,
              and update tracking.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
