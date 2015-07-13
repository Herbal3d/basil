---
layout: default
navigation: architecture
---

# Pseudo Code
Noodling about the control flow.

## Session Manager

  smHandle = ConnectionToSessionManager()

  ReadApplicationConfiguration()

  cpHandle = CreateSessionControlPlane()
  iHandle = CreateInputManager(cpHandle)
  rHandle = CreateRenderer(cpHandle, iHandle)



<!-- vim: ts=2 sw=2 ai et spell
-->
