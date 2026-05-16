import { cn } from "@/lib/utils";
import { Edit, Plane, Ship, ArrowBigLeft, Layers } from "lucide-react";

const ActionPallet = () => {
  const palletWrapperStyles = cn([
    "flex flex-col justify-between bg-zinc-800 border-l border-t border-white/10 rounded-tl-3xl shadow-2xl backdrop-blur-md",
    "lg:p-3 xl:p-5 h-45 w-80 lg:h-55 lg:w-80 xl:h-75 xl:w-100",
  ]);
  const buttonStyles = cn([
    "flex items-center justify-center rounded-xl bg-slate-700/60 border border-white/10 hover:bg-slate-600/80 hover:border-cyan-400/40",
    "p-2",
  ]);

  const iconStyles = "text-zinc-200 lg:size-8 xl:size-10";
  return (
    <div className={palletWrapperStyles}>
      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
          <button className={buttonStyles}>
            <Edit className={iconStyles} />
          </button>
          <button className={buttonStyles}>
            <Ship className={iconStyles} />
          </button>
          <button className={buttonStyles}>
            <Plane className={iconStyles} />
          </button>
          <button className={buttonStyles}>
            <Layers className={iconStyles} />
          </button>
        </div>
        {/* <div className="flex gap-3">
          <button className={buttonStyles}>
            <Edit className={iconStyles} />
          </button>
          <button className={buttonStyles}>
            <Ship className={iconStyles} />
          </button>
          <button className={buttonStyles}>
            <Plane className={iconStyles} />
          </button>
        </div> */}
      </div>
      <div className="flex flex-row-reverse gap-3">
        <button className={buttonStyles}>
          <ArrowBigLeft className={iconStyles} />
        </button>
      </div>
    </div>
  );
};

export default ActionPallet;
