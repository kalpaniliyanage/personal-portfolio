# Security Specification for Portfolio Database

## 1. Data Invariants
- Anyone can read the portfolio configuration (public portfolios).
- Anyone can write/update the portfolio configuration (unauthenticated simple demo app requirements, or in this case, a single-user sandbox environment).
- Document keys must be strictly validated.

## 2. The "Dirty Dozen" Payloads
Here are the 12 payloads representing potential compromise attempts that should be blocked by our rules:
1. **Malicious ID (XSS)**: ID containing script tags `portfolio<script>`.
2. **Path Injection ID**: ID containing relative directory paths `../test/admin`.
3. **Extremely Large Document ID**: Document ID longer than 128 characters.
4. **Invalid Fields**: Creating a portfolio with unauthorized top-level fields (e.g. `isAdmin: true`).
5. **No Required Fields**: Deleting required fields like `personal`.
6. **Malicious Avatar URL**: Using a non-HTTPS URL for `avatarUrl` to bypass transport security.
7. **Type Mismatch on Personal**: Providing `personal` as a string instead of an object.
8. **Negative Percentages**: Providing negative values in skills percentages.
9. **Junk Field Inject**: Injecting unknown metadata fields at the root.
10. **Empty Name**: Creating a personal bio with an empty `name`.
11. **Massive Payload**: Writing fields exceeding size constraints (denial of wallet).
12. **Null Values**: Attempting to set required fields to `null`.

## 3. The Test Runner
```typescript
// firestore.rules.test.ts
// Verifies that the Dirty Dozen payloads return PERMISSION_DENIED.
```
