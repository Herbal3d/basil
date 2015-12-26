---
layout: default
navigation: architecture
---

# Pseudo Code
Noodling about the messages in the session

## Initialization and setup
  A Pesto instance is started

  Pesto: reads configuration file on initial setup

  Pesto: Start a Basil instance
    Basil is passed a handle back to Pesto
  Basil: fetch Basil specific configuration parameters from Pesto

  Pesto: Start a user configuration UI: PestoGreen
    PestoGreen is passed a handle to Pesto and Basil

  PestoGreen: communicates Pesto to get session template information links
  PestoGreen: reads session template information (grids, login servers, ...)
  PestoGreen: communicates with Basil to display user controls and selection
  PestoGreen: interacts with the user to select session template
  PestoGreen: interacts with the user to accept authentication information
  PestoGreen: sends authentication information (bearer certificates) to Pesto
  PestoGreen: updates template selection to Pesto

  Pesto: uses session template to create space managers
  Pesto: start an instance of Ragu
    Ragu is passed handles to Basil and Pesto






## Session Manager

  smHandle = ConnectionToSessionManager()

  ReadApplicationConfiguration()

  cpHandle = CreateSessionControlPlane()
  iHandle = CreateInputManager(cpHandle)
  rHandle = CreateRenderer(cpHandle, iHandle)



<!-- vim: ts=2 sw=2 ai et
-->
