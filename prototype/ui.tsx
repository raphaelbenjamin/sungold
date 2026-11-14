// shadcn/ui-style primitives adapted to Sungold CSS. MIT attribution in THIRD_PARTY.md.
import type { ComponentProps, ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Toggle from "@radix-ui/react-toggle-group";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import * as Tooltip from "@radix-ui/react-tooltip";
import { X } from "lucide-react";
export {
  Orb,
  Toasts,
  useGlow,
  Menu,
  CountUp,
  Duration,
  ScrollTop,
} from "../src/components/ui";
export function IconButton({
  label,
  children,
  ...props
}: ComponentProps<"button"> & { label: string }) {
  return (
    <Tooltip.Provider delayDuration={250}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            type="button"
            className="ui-icon-button"
            aria-label={label}
            {...props}
          >
            {children}
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className="ui-tooltip" sideOffset={8}>
            {label}
            <Tooltip.Arrow />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
export function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
  id,
}: {
  value: T;
  options: { value: T; label: ReactNode; title?: string }[];
  onChange(v: T): void;
  label?: string;
  id: string;
}) {
  return (
    <Toggle.Root
      type="single"
      className="ui-segments"
      value={value}
      onValueChange={(v) => v && onChange(v as T)}
      aria-label={label || id}
    >
      {options.map((o) => (
        <Toggle.Item
          key={o.value}
          value={o.value}
          title={o.title}
          aria-label={o.title}
        >
          {o.label}
        </Toggle.Item>
      ))}
    </Toggle.Root>
  );
}
export function Switch({
  on,
  onChange,
  label,
}: {
  on: boolean;
  onChange(v: boolean): void;
  label: string;
}) {
  return (
    <SwitchPrimitive.Root
      className="ui-switch"
      checked={on}
      onCheckedChange={onChange}
      aria-label={label}
    >
      <SwitchPrimitive.Thumb className="ui-switch-thumb" />
    </SwitchPrimitive.Root>
  );
}
export function Sheet({
  open,
  onClose,
  title,
  children,
  footer,
  width,
}: {
  open: boolean;
  onClose(): void;
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  width?: number;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="ui-sheet-overlay" />
        <Dialog.Content
          className="ui-sheet"
          style={width ? { width: `min(${width}px,95vw)` } : undefined}
          aria-describedby={undefined}
        >
          <header className="ui-sheet-header">
            <Dialog.Title>{title}</Dialog.Title>
            <Dialog.Close asChild>
              <IconButton label="Close">
                <X size={18} />
              </IconButton>
            </Dialog.Close>
          </header>
          <div className="ui-sheet-body">{children}</div>
          {footer && <footer className="ui-sheet-footer">{footer}</footer>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
export function PageHeading({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <header className="ui-page-heading">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children}
    </header>
  );
}
