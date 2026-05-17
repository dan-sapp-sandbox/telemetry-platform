import { cn } from "@/lib/utils";

export type actionPanel = "draw" | "vessels" | "aircraft" | "layers";

export const palletWrapperStyles = cn([
  "flex flex-col justify-between bg-zinc-800 border-t-1 border-l-1 border-emerald-400/30 md:rounded-tl-3xl shadow-2xl backdrop-blur-md",
  "p-2 xl:p-4 h-42 w-80 md:h-55 lg:w-80 xl:h-75 xl:w-100",
]);
export const buttonStyles = cn([
  "group flex flex-col gap-px items-center justify-center rounded-xl",
  "bg-slate-700/60 border border-emerald-400/10 hover:bg-slate-700/90 hover:border-emerald-400/40",
  "w-12 h-12 md:w-16 md:h-16 xl:w-20 xl:h-20",
]);
export const buttonTextStyles = "text-(--text)/70 text-xs xl:text-base group-hover:text-emerald-400/70";
export const iconStyles = "text-(--text)/70 lg:size-6 xl:size-10 group-hover:text-emerald-400/70";

export const backButtonStyles = cn([
  "flex flex-col gap-px items-center justify-center rounded-xl bg-slate-700/60 border border-white/10 hover:bg-slate-600/80 hover:border-cyan-400/40",
  "w-10 h-10 lg:w-12 lg:h-10 xl:w-20 xl:h-20",
]);
export const backButtonTextStyles = "text-(--text)/70 lg:text-xs xl:text-base";
export const backIconStyles = "text-(--text)/70 lg:size-6 xl:size-10";
