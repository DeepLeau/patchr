"use client";

const LustreText = ({
  text,
  speed = 5,
  mode = "dark",
  className = "",
}: {
  text: string;
  speed?: number;
  mode?: "dark" | "light";
  className?: string;
}) => (
  <span
    className={`animate-shine ${
      mode === "light" ? "lustre-on-white" : "lustre-dark"
    } ${className}`}
    style={{
      animationDuration: `${speed}s`,
      animationTimingFunction: "linear",
      animationIterationCount: "infinite",
    }}
  >
    {text}
  </span>
);

export { LustreText };
