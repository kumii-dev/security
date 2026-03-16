# Lovable Prompt — MSAL Auth Gate for Audit Logs

The iframe at `https://security-xi-eight.vercel.app` now sends
`window.parent.postMessage({ type: "MSAL_AUTH_SUCCESS" }, "https://kumii.africa")`
immediately after successful Microsoft authentication. The iframe navigates to `/auth-success`
which fires the message and shows an "Identity Verified" confirmation screen.

---

## 1. Update `SecurityDashboard.tsx`

Add a `useEffect` that listens for `message` events on `window`:

- Only accept messages where `e.origin === "https://security-xi-eight.vercel.app"`
- When `e.data.type === "MSAL_AUTH_SUCCESS"`:
  - Call `sessionStorage.setItem("kumii_msal_verified", Date.now().toString())`
  - Then immediately navigate to `/admin/audit-logs` using the router

```ts
useEffect(() => {
  const handler = (e: MessageEvent) => {
    if (e.origin !== 'https://security-xi-eight.vercel.app') return;
    if (e.data?.type === 'MSAL_AUTH_SUCCESS') {
      sessionStorage.setItem('kumii_msal_verified', Date.now().toString());
      navigate('/admin/audit-logs');
    }
  };
  window.addEventListener('message', handler);
  return () => window.removeEventListener('message', handler);
}, [navigate]);
```

---

## 2. Update `AuditLogs.tsx`

After the existing admin/auditor role check passes, add a second check:

```ts
const verified = sessionStorage.getItem('kumii_msal_verified');
const isVerified = verified && (Date.now() - Number(verified)) < 8 * 60 * 60 * 1000;

if (!isVerified) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center p-8">
      <ShieldCheckIcon className="w-12 h-12 text-[#7a8567]" />
      <h2 className="text-xl font-semibold text-[#2D2D2D]">Identity Verification Required</h2>
      <p className="text-[#666666] max-w-sm">
        Audit log access requires Microsoft identity verification via the Security Dashboard.
      </p>
      <a
        href="/admin/security-dashboard"
        className="px-5 py-2.5 bg-[#7a8567] text-white rounded-lg text-sm font-medium hover:bg-[#6a7558] transition-colors"
      >
        Verify via Security Dashboard
      </a>
    </div>
  );
}
```

---

## Notes

- No database changes required
- No Edge Functions required
- The `sessionStorage` flag is tab-scoped and expires after 8 hours
- The gate UI renders in-place — the user is **not** redirected, they see clear instructions
