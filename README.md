# Private Workspace

This repository is a shared working space for collaborating with ChatGPT on code and file-based tasks.

## Workflow

1. Upload or commit the relevant files to this repository.
2. Tell ChatGPT what you want to change, inspect, generate, or debug.
3. ChatGPT reads the repository contents and works from the current files.
4. When requested, ChatGPT writes the resulting files back to the repository.

## Working Rules

- Treat the repository as the source of truth for project files.
- Before modifying an existing file, read its current contents first.
- Keep changes focused on the requested task.
- Preserve existing conventions, structure, and configuration unless the task explicitly asks for a change.
- Prefer small, understandable commits with descriptive commit messages.
- Do not commit secrets, passwords, access tokens, private keys, or other sensitive credentials.
- When a task involves multiple files, inspect the relevant project structure before editing.
- If requirements are ambiguous or a change could be destructive, ask before making it.

## ChatGPT Collaboration

ChatGPT may use the connected GitHub repository to:

- read source files and project documentation;
- inspect commits, branches, issues, and pull requests when relevant;
- create or update files when explicitly requested;
- create focused commits, branches, or pull requests when appropriate.

This README describes the collaboration workflow; individual project files and explicit user instructions take precedence.
