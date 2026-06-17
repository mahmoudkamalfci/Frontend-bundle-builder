# Design: ESLint Run on Save

This design outlines the configuration required to run ESLint automatically on save within VS Code/Cursor.

## Selected Approach

We are implementing **VS Code ESLint Extension Integration** by adding workspace-level settings. When files are saved, the editor will automatically execute ESLint's auto-fixable rules.

## Proposed Changes

### `.vscode/settings.json`

Create a new file containing the configuration to:
1. Enable `source.fixAll.eslint` inside `editor.codeActionsOnSave` to trigger auto-fixing on save.
2. Define languages for validation.

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ]
}
```

## Verification

To verify:
1. Open a TypeScript/React file.
2. Introduce a lint warning/error that is autofixable (e.g., extra trailing spaces or double quotes if single quotes are configured).
3. Save the file and observe that it is auto-fixed.
