"use client";

import { useState, useActionState } from "react";
import { loginAction, type LoginState } from "@/app/admin/actions";

const inputClass = (bad: boolean) =>
  `w-full rounded-xl border px-4 min-h-[48px] text-base bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#871a45]/25 focus:border-[#871a45] transition-colors ${
    bad ? "border-rose-500 bg-rose-50/30" : "border-stone-300"
  }`;

export function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(loginAction, {});
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} noValidate className="space-y-4">
      {state.error && (
        <div
          role="alert"
          className="rounded-xl border border-rose-300 bg-rose-50 p-3.5 text-sm font-semibold text-rose-800"
        >
          {state.error}
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="email" className="block text-sm font-bold text-[#002c3f]">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          placeholder="admin@kanakasweets.example"
          defaultValue={state.email}
          aria-invalid={!!state.fieldErrors?.email}
          className={inputClass(!!state.fieldErrors?.email)}
        />
        {state.fieldErrors?.email && (
          <p role="alert" className="text-xs font-semibold text-rose-700">
            {state.fieldErrors.email}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className="block text-sm font-bold text-[#002c3f]">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            aria-invalid={!!state.fieldErrors?.password}
            className={`${inputClass(!!state.fieldErrors?.password)} pr-16`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 min-h-[40px] rounded-lg text-xs font-bold text-stone-600 hover:text-[#871a45] hover:bg-stone-100 cursor-pointer"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {state.fieldErrors?.password && (
          <p role="alert" className="text-xs font-semibold text-rose-700">
            {state.fieldErrors.password}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-[#871a45] hover:bg-[#691436] disabled:opacity-65 text-white py-3.5 rounded-xl font-bold text-sm min-h-[52px] shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
      >
        {pending && (
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-85" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
          </svg>
        )}
        <span>{pending ? "Signing in..." : "Sign in to Admin"}</span>
      </button>
    </form>
  );
}
