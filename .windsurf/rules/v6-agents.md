# v6 Multi-Agent Pipeline — MANDATORY RULES

These rules are **non-negotiable** and must be followed for ALL implementation work in this project.

## Core Rule
**NEVER write code directly. ALL code must be produced through the v6 agent pipeline.**

## Agent Pipeline
The exact transition order is:
1. **Orchestrator** — Plans phases, decomposes deliverables into PhaseN.json. NEVER writes code files.
2. **CodeSync** — The ONLY agent that writes code files. Implements deliverables one-by-one.
3. **PolishVerify** — Runs build (`next build`) + tests (`vitest run`). Reports pass/fail.
4. **AutoGuardian** — Validates completeness gate, branch naming, commit format. Merges to develop + UAT.

## Spin-Up Protocol (MUST RUN AT START OF EVERY SESSION)
1. Read `SpinUp_OnePrompt.md` at: `/Users/amays/Desktop/Work/Colab 2/starter_ai_prompt_structure_v5_final/prompts/spin_up/SpinUp_OnePrompt.md`
2. Run preflight: set PROMPT_HOME, check `runs/checkpoint.md`, verify `runs/state.json`
3. If checkpoint exists → resume from exact phase/sub-task noted in checkpoint
4. If no checkpoint → follow Steps 1-4 in SpinUp_OnePrompt.md

## Every Agent Turn MUST Include
1. **YAML compliance header**:
```yaml
---
current_agent: <AgentName>
workflow_state: Phase<P>
req_doc_id: 2
autoguardian_status: ok | repairing | retry_exhausted
next_agent: <AgentName>
should_transition: true | false
---
```

2. **Structured JSON action block**:
```json
{
  "actions": [],
  "files_to_write": [],
  "branch_ops": [],
  "notes": ""
}
```

## Git Discipline
- **Branch naming**: `ReqDoc<N>_phase<P>_v6`
- **Commit format**: `ReqDoc<N>_phase<P>_v6_Implementation<K>: <summary>`
- **Merge order**: feature → develop → UAT

## Completeness Gate (v6)
- AutoGuardian FAILS if any deliverable in PhaseP.json is still "pending" or "in_progress"
- If FAIL → REPAIR_PLAN → CodeSync (same phase)
- Phase does NOT advance until ALL deliverables are done/deferred

## State Files
- `runs/state.json` — Current phase, agent, subtask, progress
- `runs/checkpoint.md` — Cross-session resume point (update after every agent transition)
- `docs/requirements/ReqDoc02/Phases/PhaseN.json` — Deliverable tracking per phase

## What This Means In Practice
- Do NOT start writing code without first running the Orchestrator to decompose deliverables
- Do NOT skip PolishVerify (build + tests must pass)
- Do NOT skip AutoGuardian (completeness gate must pass before merge)
- Do NOT merge without proper commit messages and branch naming
- Do NOT advance to the next phase with incomplete deliverables
