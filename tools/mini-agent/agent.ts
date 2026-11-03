// Mini coding agent on the Claude Agent SDK, billed to Console API credits.
// Run from the repo you want to work on:  npx tsx /path/to/agent.ts
import { query, type CanUseTool, type EffortLevel, type PermissionMode } from "@anthropic-ai/claude-agent-sdk";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

if (!process.env.ANTHROPIC_API_KEY) {
  console.error("Set ANTHROPIC_API_KEY first (Console key, not a claude.ai login).");
  process.exit(1);
}

const rl = createInterface({ input: stdin, output: stdout });
rl.on("close", () => process.exit(0)); // Ctrl+D or /exit

let model = process.env.AGENT_MODEL ?? "opus"; // "haiku" | "sonnet" | "opus"
// How hard the model thinks: higher = better on hard problems, but more tokens (more $).
const EFFORTS: EffortLevel[] = ["low", "medium", "high", "xhigh", "max"];
let effort = (process.env.AGENT_EFFORT ?? "high") as EffortLevel;
const budgetPerPrompt = Number(process.env.AGENT_BUDGET_USD ?? "2");
// "acceptEdits": edits auto-approved, other tools ask you.
// "auto": a classifier model approves/denies each tool call, asks you only when unsure.
//         Costs a little extra per tool call (the classifier runs on your API key too).
const MODES: PermissionMode[] = ["acceptEdits", "auto", "default", "plan"];
let mode = (process.env.AGENT_MODE ?? "acceptEdits") as PermissionMode;
let sessionId: string | undefined; // lets the next prompt continue the same conversation
let totalCost = 0;

// Reading and searching are safe, so they run without asking.
// Edits are auto-approved by permissionMode "acceptEdits" (review them with git diff).
// Anything else (Bash, WebFetch, ...) lands here and asks you first.
const askBeforeRunning: CanUseTool = async (toolName, input) => {
  const preview = toolName === "Bash" ? String(input.command) : JSON.stringify(input);
  const answer = await rl.question(`\n  allow ${toolName}: ${preview} ? [y/N] `);
  return answer.trim().toLowerCase() === "y"
    ? { behavior: "allow", updatedInput: input }
    : { behavior: "deny", message: "User denied this tool call." };
};

async function runPrompt(prompt: string) {
  const conversation = query({
    prompt,
    options: {
      model,
      effort,
      resume: sessionId,
      cwd: process.cwd(),
      systemPrompt: { type: "preset", preset: "claude_code" }, // same system prompt as Claude Code
      settingSources: ["project"], // loads the repo's CLAUDE.md
      permissionMode: mode,
      allowedTools: ["Read", "Glob", "Grep"],
      canUseTool: askBeforeRunning,
      maxBudgetUsd: budgetPerPrompt, // safety stop per prompt
    },
  });

  // query() is an async generator: each step of the agent loop arrives as a message.
  for await (const message of conversation) {
    if (message.type === "system" && message.subtype === "init") {
      sessionId = message.session_id;
      // Show the mode the engine actually started in (it falls back if "auto" is unavailable).
      if (message.permissionMode !== mode) console.log(`  (running in ${message.permissionMode} mode)`);
    } else if (message.type === "assistant") {
      for (const block of message.message.content) {
        if (block.type === "text") console.log(block.text);
        if (block.type === "tool_use") console.log(`  → ${block.name}`);
      }
    } else if (message.type === "result") {
      totalCost += message.total_cost_usd;
      const status = message.subtype === "success" ? "" : ` [stopped: ${message.subtype}]`;
      console.log(
        `\n  $${message.total_cost_usd.toFixed(4)} this prompt · $${totalCost.toFixed(4)} total · ${model} (${effort})${status}`,
      );
    }
  }
}

console.log(
  `mini-agent · model: ${model} · effort: ${effort} · mode: ${mode} · /model, /effort, /mode, /new, /exit`,
);
while (true) {
  const line = (await rl.question("\n> ")).trim();
  if (!line) continue;
  if (line === "/exit") rl.close();
  if (line === "/new") {
    sessionId = undefined;
    console.log("  new conversation");
    continue;
  }
  if (line.startsWith("/effort ")) {
    const next = line.slice(8).trim() as EffortLevel;
    if (EFFORTS.includes(next)) {
      effort = next;
      console.log(`  effort: ${effort}`);
    } else {
      console.log(`  efforts: ${EFFORTS.join(", ")}`);
    }
    continue;
  }
  if (line.startsWith("/mode ")) {
    const next = line.slice(6).trim() as PermissionMode;
    if (MODES.includes(next)) {
      mode = next;
      console.log(`  mode: ${mode}`);
    } else {
      console.log(`  modes: ${MODES.join(", ")}`);
    }
    continue;
  }
  if (line.startsWith("/model ")) {
    model = line.slice(7).trim();
    console.log(`  model: ${model}`);
    continue;
  }
  try {
    await runPrompt(line);
  } catch (err) {
    console.error("  error:", err instanceof Error ? err.message : err);
  }
}
