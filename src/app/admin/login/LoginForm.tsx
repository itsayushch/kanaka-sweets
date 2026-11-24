"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/admin/actions";

const inputClass = (bad: boolean) =>
  `w-full rounded-xl border px-4 min-h-[48px] text-base bg-white focus:outline-none focus:ring-2 focus:ring-[#871a45]/30 ${bad ? "border-rose-500" : "border-stone-300"}`;

export function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(loginAction, {});

  return (
    <form action={formAction} noValidate className="space-y-4">
      {state.error && (
        <p role="alert" className="rounded-xl border border-rose-300 bg-rose-50 p-3 text-sm font-semibold text-rose-800">
          {state.error}
        </p>
      )}
      <div className="space-y-1.5">
        <label htmlFor="email" className="block text-sm font-bold text-[#002c3f]">Email</label>
        <input id="email" name="email" type="email" autoComplete="username" defaultValue={state.email}
          aria-invalid={!!state.fieldErrors?.email} className={inputClass(!!state.fieldErrors?.email)} />
        {state.fieldErrors?.email && <p role="alert" className="text-sm font-semibold text-rose-700">{state.fieldErrors.email}</p>}
      </div>
      <div className="space-y-1.5">
        <label htmlFor="password" className="block text-sm font-bold text-[#002c3f]">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password"
          aria-invalid={!!state.fieldErrors?.password} className={inputClass(!!state.fieldErrors?.password)} />
        {state.fieldErrors?.password && <p role="alert" className="text-sm font-semibold text-rose-700">{state.fieldErrors.password}</p>}
      </div>
      <button type="submit" disabled={pending}
        className="w-full bg-[#871a45] hover:bg-[#691436] disabled:opacity-60 text-white py-3.5 rounded-xl font-bold text-sm min-h-[52px]">
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
