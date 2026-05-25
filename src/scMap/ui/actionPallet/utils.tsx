import { cn } from "@/lib/utils";

export type actionPanel = "draw" | "vessels" | "aircraft" | "layers";

export const palletWrapperStyles = cn([
  "flex flex-col justify-between bg-zinc-800/90 border-t-1 border-l-1 border-emerald-400/30 md:rounded-tl-3xl shadow-2xl backdrop-blur-md",
  "p-2 xl:p-4 h-42 w-1/2 md:w-80 md:h-55 lg:w-80 xl:h-75 xl:w-100",
]);
export const buttonStyles = cn([
  "group flex flex-col gap-px items-center justify-center rounded-xl",
  "bg-slate-700/60 border border-emerald-400/10 hover:bg-slate-700/90 group-hover:border-emerald-400/40",
  "w-16 h-16 lg:w-16 lg:h-16 xl:w-20 xl:h-20",
]);
export const buttonTextStyles = "text-(--text)/70 text-xs xl:text-base group-hover:text-emerald-400/70";
export const iconStyles = "text-(--text)/70 lg:size-6 xl:size-10 group-hover:text-emerald-400/70";

export const backButtonStyles = cn([
  "flex flex-col gap-px items-center justify-center rounded-xl bg-slate-700/60 border border-emerald-400/10 hover:bg-slate-700/90 hover:border-emerald-400/40",
  "group w-6 h-3 lg:w-10 lg:h-6 p-px",
]);
export const backButtonTextStyles = "text-(--text)/70 lg:text-xs xl:text-base group-hover:text-emerald-400/70";
export const backIconStyles = "text-(--text)/70 lg:size-3 xl:size-6 group-hover:text-emerald-400/70";
