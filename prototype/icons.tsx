import * as L from "lucide-react";
import { Icon as LegacyIcon } from "../src/components/Icon";
import type { ComponentProps } from "react";
export type { IconName } from "../src/components/Icon";
const icons: Record<string, L.LucideIcon> = {
  library: L.Library,
  book: L.BookOpen,
  cards: L.Layers,
  bigcards: L.LayoutGrid,
  smallcards: L.Grid3X3,
  rows: L.List,
  chart: L.ChartNoAxesCombined,
  settings: L.Settings2,
  plus: L.Plus,
  import: L.Import,
  search: L.Search,
  play: L.Play,
  pause: L.Pause,
  back: L.ArrowLeft,
  forward: L.ArrowRight,
  left: L.ChevronLeft,
  right: L.ChevronRight,
  close: L.X,
  check: L.Check,
  read: L.CircleCheck,
  unread: L.Circle,
  repeat: L.Repeat,
  speaker: L.Volume2,
  moon: L.Moon,
  sun: L.Sun,
  more: L.Ellipsis,
  trash: L.Trash2,
  edit: L.Pencil,
  text: L.AlignLeft,
  link: L.Link2,
  file: L.FileText,
  wave: L.AudioLines,
  video: L.Video,
  sidebar: L.PanelLeft,
  panel: L.PanelRight,
  pageturn: L.BookOpenCheck,
  pagestay: L.BookOpen,
  expand: L.Maximize2,
  shrink: L.Minimize2,
  sparkle: L.Sparkles,
  chunks: L.ListTree,
  rewind: L.Rewind,
  ffwd: L.FastForward,
  back5: L.RotateCcw,
  fwd5: L.RotateCw,
  chevron: L.ChevronDown,
  up: L.ArrowUp,
  download: L.Download,
  cpu: L.Cpu,
  globe: L.Globe2,
  type: L.Type,
  layers: L.Layers,
  flame: L.Flame,
  clock: L.Clock3,
  eye: L.Eye,
  ban: L.Ban,
  podcast: L.Podcast,
  music: L.Music2,
  youtube: L.Youtube,
  export: L.Upload,
  external: L.ArrowUpRight,
  image: L.Image,
  chat: L.MessageCircle,
  debate: L.MessagesSquare,
  send: L.ArrowUp,
  stop: L.Square,
  bulb: L.Lightbulb,
  attach: L.Paperclip,
  laptop: L.Laptop,
  phone: L.Smartphone,
  playlist: L.ListMusic,
  grip: L.GripVertical,
  user: L.UserRound,
  refresh: L.RotateCw,
  help: L.CircleHelp,
  info: L.Info,
  folder: L.Folder,
  copy: L.Copy,
  shield: L.Shield,
  lock: L.LockKeyhole,
  archive: L.Archive,
  checkcircle: L.CircleCheck,
  warning: L.TriangleAlert,
};
export function Icon({
  name,
  size = 18,
  stroke = 1.7,
  ...rest
}: ComponentProps<typeof LegacyIcon>) {
  const Glyph = icons[name];
  return Glyph ? (
    <Glyph
      className="icon"
      size={size}
      strokeWidth={stroke}
      aria-hidden="true"
      {...rest}
    />
  ) : (
    <LegacyIcon name={name} size={size} stroke={stroke} {...rest} />
  );
}
