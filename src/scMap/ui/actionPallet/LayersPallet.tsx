import { ArrowBigLeft } from "lucide-react";
import { backButtonStyles, backIconStyles } from "./utils";

const LayersPallet = ({ goBack }: { goBack: () => void }) => {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] gap-4 px-2 h-full">
      <div className="text-(--text)/80 capitalize lg:text-sm xl:text-base">Layers</div>
      <div className="flex justify-end items-end">
        <button className={backButtonStyles} onClick={goBack}>
          <ArrowBigLeft className={backIconStyles} />
        </button>
      </div>
    </div>
  );
};

export default LayersPallet;
