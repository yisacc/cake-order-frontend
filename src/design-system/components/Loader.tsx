import { twMerge } from "tailwind-merge";

const Loader = (parameters: { class?: string }) => {
  return (
    <div className={twMerge("rounded-2xl bg-gradient-to-r from-slate-400 to-slate-300 animate-pulse", parameters.class ?? "h-3 w-32")} />
  );
}
export default Loader;