---
description: How to implement any feature using the v6 multi-agent pipeline
---

## Steps

1. **Read SpinUp_OnePrompt.md** at `/Users/amays/Desktop/Work/Colab 2/starter_ai_prompt_structure_v5_final/prompts/spin_up/SpinUp_OnePrompt.md`

2. **Check checkpoint** — Read `runs/checkpoint.md`. If it exists, resume from the exact phase/sub-task noted. Skip Steps 3-4 of SpinUp.

3. **Check state.json** — Read `runs/state.json` to verify current phase, agent, and remaining deliverables.

4. **Run Orchestrator** — Decompose deliverables into PhaseN.json. Output YAML header + JSON action block. NEVER write code.

5. **Transition to CodeSync** — Implement deliverables one-by-one on the feature branch (`ReqDoc<N>_phase<P>_v6`). Output YAML header + JSON action block on every turn.

6. **Transition to PolishVerify** — Run:
// turbo
```bash
cd /Users/amays/Desktop/Work/Colab\ 2/creator-community-platform && npx next build 2>&1 | tail -30
```
// turbo
```bash
cd /Users/amays/Desktop/Work/Colab\ 2/creator-community-platform && npx vitest run 2>&1 | tail -15
```

7. **Transition to AutoGuardian** — Validate completeness gate (all deliverables in PhaseP.json must be "done"). If PASS:
```bash
cd /Users/amays/Desktop/Work/Colab\ 2/creator-community-platform && git add -A && git commit -m "ReqDoc2_phase<P>_v6_Implementation<K>: <summary>"
```
Then merge: feature → develop → UAT.

8. **Update checkpoint.md and state.json** after every agent transition.

9. **Repeat steps 4-8** for the next phase until all phases are complete.
