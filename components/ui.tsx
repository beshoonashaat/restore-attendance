import * as React from 'react';import { clsx } from 'clsx';export const cn=(...x:any[])=>clsx(x);
export function Button({className,...p}:React.ButtonHTMLAttributes<HTMLButtonElement>){return <button className={cn('rounded-xl bg-restore-ink px-4 py-2 font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50',className)} {...p}/>}
export function Input(p:React.InputHTMLAttributes<HTMLInputElement>){return <input className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none ring-restore-ink/20 focus:ring-4" {...p}/>}
export function CardBox({className,...p}:React.HTMLAttributes<HTMLDivElement>){return <div className={cn('rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-premium backdrop-blur',className)} {...p}/>}
