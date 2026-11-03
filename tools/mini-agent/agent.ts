// Mini coding agent on the Claude Agent SDK, billed to Console API credits.
// Run from the repo you want to work on:  npx tsx /path/to/agent.ts
import { query, type CanUseTool, type EffortLevel, type PermissionMode } from "@anthropic-ai/claude-agent-sdk";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
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
// "acceptEdits": edits auto-approved, other tools ask you.
// "auto": a classifier model approves/denies each tool call, asks you only when unsure.
//         Costs a little extra per tool call (the classifier runs on your API key too).
const MODES: PermissionMode[] = ["acceptEdits", "auto", "default", "plan"];
let mode = (process.env.AGENT_MODE ?? "auto") as PermissionMode;
let sessionId: string | undefined; // lets the next prompt continue the same conversation
let sessionCost = 0; // running total the SDK reports for the current conversation

// Total spend across all runs, saved next to this file. Delete .spend.json to reset.
// Optional cap: AGENT_LIMIT_USD=20 stops the agent once the total reaches $20.
const SPEND_FILE = new URL(".spend.json", import.meta.url);
const limit = process.env.AGENT_LIMIT_USD ? Number(process.env.AGENT_LIMIT_USD) : undefined;
let spent: number = existsSync(SPEND_FILE) ? JSON.parse(readFileSync(SPEND_FILE, "utf8")).spent : 0;
const saveSpent = () => writeFileSync(SPEND_FILE, JSON.stringify({ spent }));
const spendLine = () => `$${spent.toFixed(2)} spent` + (limit === undefined ? "" : ` of $${limit} limit`);

// Reading and searching always run without asking.
// Any other tool call the permission mode doesn't settle lands here and asks you first
// (in "auto" mode: only when the classifier can't decide).
const askBeforeRunning: CanUseTool = async (toolName, input) => {
  const preview = toolName === "Bash" ? String(input.command) : JSON.stringify(input);
  const answer = await rl.question(`\n  allow ${toolName}: ${preview} ? [y/N] `);
  return answer.trim().toLowerCase() === "y"
    ? { behavior: "allow", updatedInput: input }
    : { behavior: "deny", message: "User denied this tool call." };
};

async function runPrompt(prompt: string) {
  const remaining = limit === undefined ? undefined : limit - spent;
  if (remaining !== undefined && remaining <= 0) {
    console.log(`  limit reached (${spendLine()}). Raise AGENT_LIMIT_USD or delete .spend.json.`);
    return;
  }
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
      maxBudgetUsd: remaining, // stops mid-task if this prompt would go past the limit
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
      // total_cost_usd is the running total of the whole (resumed) conversation,
      // so this prompt's cost is the difference from the last result.
      const total = message.total_cost_usd;
      const promptCost = total >= sessionCost ? total - sessionCost : total;
      sessionCost = total;
      spent += promptCost;
      saveSpent();
      const status = message.subtype === "success" ? "" : ` [stopped: ${message.subtype}]`;
      console.log(`\n  $${promptCost.toFixed(4)} this prompt · ${spendLine()} · ${model} (${effort})${status}`);
    }
  }
}

console.log(`mini-agent · ${model} (${effort}) · mode: ${mode} · ${spendLine()}`);
console.log("commands: /model, /effort, /mode, /cost, /new, /exit");
while (true) {
  const line = (await rl.question("\n> ")).trim();
  if (!line) continue;
  if (line === "/exit") rl.close();
  if (line === "/new") {
    sessionId = undefined;
    sessionCost = 0;
    console.log("  new conversation");
    continue;
  }
  if (line === "/cost") {
    console.log(`  ${spendLine()} (estimate; Console Billing is the real number)`);
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
