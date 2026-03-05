# AI Coding Instructions

Project: Personal Blog

This repository powers a personal blog and a set of interactive evaluation tools.
Code should prioritize simplicity, clarity, and maintainability.

---

Architecture

- Use Next.js App Router.
- Prefer Server Components unless state or browser APIs are required.
- Client Components must include `"use client"`.

Folder structure:

/app
Pages and routes.

/components
Reusable UI components.

/components/tools
Tool-specific UI components.

/lib
Business logic, schemas, scoring engines, utilities.

/styles
Global styling if required.

Do not place logic inside page components unless trivial.

---

Design Principles

- Prefer simple predictable code over clever abstractions.
- Favor clarity over brevity.
- Prefer explicit logic over hidden magic.
- Write code that a future reader can understand quickly.
- Avoid premature generalization.
- Duplicate small amounts of code instead of introducing unnecessary abstraction.

---

Styling

- Use Tailwind CSS for all styling.
- Avoid custom CSS unless Tailwind cannot achieve the result.
- Prefer simple utility classes over complex class logic.
- Maintain visual consistency with existing components.

---

TypeScript

- Code must compile with strict TypeScript.
- Avoid `any`.
- Prefer explicit types for public interfaces.
- Extract reusable types into `/lib`.

---

Dependencies

- Do not introduce new libraries unless explicitly requested.
- Prefer native browser APIs and existing project utilities.
- Keep the dependency footprint minimal.

---

Accessibility

All UI must be keyboard accessible and follow native HTML behavior.

Rules:

- Use native elements (`button`, `input`, `label`, `fieldset`) before ARIA roles.
- Inputs must have associated labels.
- Radio groups must share a `name` attribute and support arrow-key navigation.
- Do not break default keyboard interactions.
- Provide visible focus states using `:focus-visible`.
- Do not remove focus outlines unless replaced with an accessible alternative.
- Use `aria-describedby` for helper or validation text.
- Ensure hover interactions also work with keyboard navigation.

---

UI Patterns

Reuse existing UI patterns when possible.

Examples:

- QuestionCard for radio-style questions
- ResultsPanel for evaluation output
- Wizard-style step flows

Do not duplicate similar UI components.

---

State Management

- Prefer local component state.
- Avoid global state unless absolutely necessary.
- URL state is preferred for tool workflows (shareable results).

---

Code Quality

- Prefer simple predictable code over clever abstractions.
- Keep components small and focused.
- Prefer deterministic logic over complex abstractions.
- Avoid deeply nested conditionals.
- Extract reusable helpers to /lib.

---

Performance

- Avoid unnecessary client components.
- Avoid expensive re-renders.
- Use memoization (`useMemo`) only when necessary.

---

Comments

Add comments for:

- Non-obvious logic
- Scoring or evaluation rules
- Complex UI behaviors

Do not add comments that simply restate the code.

---

When modifying existing code

- Preserve existing architecture patterns.
- Do not refactor unrelated parts of the code.
- Minimize changes to the smallest necessary scope.
