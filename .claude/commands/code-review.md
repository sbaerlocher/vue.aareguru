---
description: Code review of a file or directory
---

Perform a code review of **$ARGUMENTS**:

1. **Read the code:**
   - If $ARGUMENTS is a directory: All TypeScript/Vue files
   - If $ARGUMENTS is a file: This file

2. **Check for:**
   - **Vue Best Practices:**
     - Composition API with `<script setup>` used
     - Props correctly typed
     - Emits declared
     - Reactive state correctly used (`ref`, `reactive`, `computed`)

   - **Error Handling:**
     - Try/catch for async operations
     - Errors shown to user
     - No silent errors

   - **TypeScript:**
     - No `any` types
     - All functions have return types
     - Interfaces for complex types
     - Strict null checks

   - **Performance:**
     - No unnecessary re-renders
     - `computed` instead of methods for derived values
     - Lazy loading where appropriate

   - **Best Practices:**
     - Short functions (< 50 lines)
     - Meaningful variable names
     - Comments only where necessary
     - No duplicated code

3. **Output Format:**

   ```
   ## Code Review: [Filename]

   ### Good
   - [List what is good]

   ### Improvement Suggestions
   - [Problem 1] (Line X)
     Suggestion: [Concrete improvement suggestion]

   ### Bugs/Issues
   - [Critical problem] (Line X)
     Fix: [How to fix]

   ### Summary
   Score: X/10
   Status: [Production Ready / Needs Changes / Major Issues]
   ```

4. **No Auto-Fixes:** Only make suggestions, do not automatically change!
