import { ArrowBigLeft } from "lucide-react";
import { buttonStyles, iconStyles } from "./utils";

const DrawPallet = ({ goBack }: { goBack: () => void }) => {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] gap-4 px-2 h-full">
      <div className="text-(--text)/80 capitalize lg:text-sm xl:text-base">Draw</div>
      <div className="flex justify-end items-end">
        <button className={buttonStyles} onClick={goBack}>
          <ArrowBigLeft className={iconStyles} />
        </button>
      </div>
    </div>
  );
};

export default DrawPallet;
