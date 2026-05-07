import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";
import type { ILayer } from "@/store/slices/mapSlice";

interface Props {
  layer: ILayer;
  setLayer: (layer: ILayer) => void;
}
const layers = ["esriSat", "osm", "satellite", "carto-light", "carto-dark", "carto-voyager"];
const LayerSwitcher = ({ layer, setLayer }: Props) => {
  return (
    <SelectGroup>
      <SelectLabel>Base Layer</SelectLabel>
      <Select value={layer} onValueChange={(val) => setLayer(val as ILayer)}>
        <SelectTrigger className="w-30">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {layers.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </SelectGroup>
  );
};

export default LayerSwitcher;
