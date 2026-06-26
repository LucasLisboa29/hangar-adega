"use client";

import * as React from "react";
import { Dialog } from "radix-ui";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

// Drawer lateral construído sobre o Dialog do radix (pacote unificado, mesmo
// padrão do Slot em button.tsx). Animações via tw-animate-css + data-state.

const Sheet = Dialog.Root;
const SheetTrigger = Dialog.Trigger;
const SheetClose = Dialog.Close;
const SheetPortal = Dialog.Portal;

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof Dialog.Overlay>) {
  return (
    <Dialog.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/60 backdrop-blur-[1px]",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
        className
      )}
      {...props}
    />
  );
}

function SheetContent({
  className,
  children,
  side = "right",
  ...props
}: React.ComponentProps<typeof Dialog.Content> & {
  side?: "right" | "left";
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <Dialog.Content
        data-slot="sheet-content"
        className={cn(
          "fixed z-50 flex h-full w-full max-w-md flex-col bg-card shadow-xl",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-200 data-[state=open]:duration-300",
          side === "right" &&
            "inset-y-0 right-0 border-l border-border data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
          side === "left" &&
            "inset-y-0 left-0 border-r border-border data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left",
          className
        )}
        {...props}
      >
        {children}
        <Dialog.Close
          className={cn(
            "absolute right-4 top-4 rounded-md p-1 text-muted-foreground transition-colors",
            "hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 outline-none"
          )}
        >
          <X className="size-5" />
          <span className="sr-only">Fechar</span>
        </Dialog.Close>
      </Dialog.Content>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("border-b border-border px-5 py-4", className)}
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto border-t border-border px-5 py-4", className)}
      {...props}
    />
  );
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof Dialog.Title>) {
  return (
    <Dialog.Title
      data-slot="sheet-title"
      className={cn(
        "font-heading text-lg font-semibold text-foreground",
        className
      )}
      {...props}
    />
  );
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof Dialog.Description>) {
  return (
    <Dialog.Description
      data-slot="sheet-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
