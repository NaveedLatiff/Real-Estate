import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/one.png",
  iconUrl: "/two.png",
  shadowUrl: "/three.png",
});