import {
  Airplay,
  Armchair,
  Building2,
  Cigarette,
  Coffee,
  Laptop,
  Music,
  Plug,
  Sparkles,
  Trees,
  VolumeX,
  Wind,
} from "lucide-react";

export function getFacilityIcon(iconName: string) {
  switch (iconName) {
    case "music_note":
    case "Music":
      return <Music className="size-3" />;

    case "chair":
    case "chair_alt":
    case "Armchair":
      return <Armchair className="size-3" />;

    case "mode_fan":
      return <Airplay className="size-3" />;

    case "volume_off":
    case "VolumeX":
      return <VolumeX className="size-3" />;

    case "power":
    case "Plug":
      return <Plug className="size-3" />;

    case "yard":
    case "park":
      return <Trees className="size-3" />;

    case "smoking_rooms":
      return <Cigarette className="size-3" />;

    case "air":
      return <Wind className="size-3" />;

    case "coffee":
      return <Coffee className="size-3" />;

    case "laptop_mac":
      return <Laptop className="size-3" />;

    case "building-2":
      return <Building2 className="size-3" />;

    default:
      return <Sparkles className="size-3" />;
  }
}
