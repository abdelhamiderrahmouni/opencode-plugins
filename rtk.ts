export const Rtk = async (ctx) => {
  const RTK_PATTERNS = [
    /^ls(\s|$)/,
    /^tree(\s|$)/,
    /^cat(\s|$)/,
    /^read(\s|$)/,
    /^grep(\s|$)/,
    /^rg(\s|$)/,
    /^git\s+status(\s|$)/,
    /^git\s+diff(\s|$)/,
    /^git\s+log(\s|$)/,
    /^git\s+add(\s|$)/,
    /^git\s+commit(\s|$)/,
    /^git\s+push(\s|$)/,
    /^cargo\s+test(\s|$)/,
    /^npm\s+test(\s|$)/,
    /^ruff\s+check(\s|$)/,
    /^pytest(\s|$)/,
    /^go\s+test(\s|$)/,
    /^docker\s+ps(\s|$)/,
  ];

  function shouldPrefix(cmd: string): boolean {
    const trimmed = cmd.trim();
    return RTK_PATTERNS.some((pattern) => pattern.test(trimmed));
  }

  function processCommand(command: string): string {
    // Split on && to handle composed commands
    const parts = command.split("&&");
    const processed = parts.map((part) => {
      const trimmed = part.trim();
      if (shouldPrefix(trimmed) && !trimmed.startsWith("rtk ")) {
        return `rtk ${trimmed}`;
      }
      return trimmed;
    });
    return processed.join(" && ");
  }

  return {
    "tool.execute.before": async (input, output) => {
      if (input.tool === "bash" || tool === "shell") {
        output.args.command = processCommand(output.args.command);
      }
    },
  };
};
