# PMOVEStokensim Integration Workspace

This directory mirrors the upstream PMOVES.AI integration workspace, providing local
clones of the PMOVES-DoX and PMOVES-Firefly-iii submodules within this repository.

Both submodules are pinned to the same commits as the originals under
`home/pmoves/PMOVES.AI/integrations-workspace/`. Use whichever workspace best fits your
workflow—each can be updated independently while keeping commits aligned.

```bash
# initialise the submodules
git submodule update --init --recursive --depth 1 integrations/PMOVES-DoX integrations/PMOVES-Firefly-iii

# pull the latest from upstream when needed
cd integrations/PMOVES-DoX
git fetch origin
# ... etc.
```
