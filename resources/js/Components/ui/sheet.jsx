import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;
const SheetPortal = DialogPrimitive.Portal;

const SheetOverlay = React.forwardRef(({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
        ref={ref}
        className={cn("fixed inset-0 z-40 bg-black/40", className)}
        {...props}
    />
));
SheetOverlay.displayName = DialogPrimitive.Overlay.displayName;

const sheetVariants = {
    left: "inset-y-0 left-0 h-full",
    right: "inset-y-0 right-0 h-full",
    top: "inset-x-0 top-0",
    bottom: "inset-x-0 bottom-0",
};

const SheetContent = React.forwardRef(
    (
        {
            className,
            children,
            side = "right",
            hideClose = false,
            ...props
        },
        ref,
    ) => (
        <SheetPortal>
            <SheetOverlay />
            <DialogPrimitive.Content
                ref={ref}
                className={cn(
                    "fixed z-50 flex flex-col bg-background shadow-lg outline-none",
                    sheetVariants[side],
                    className,
                )}
                {...props}
            >
                {!hideClose ? (
                    <DialogPrimitive.Close className="absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none">
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </DialogPrimitive.Close>
                ) : null}
                {children}
            </DialogPrimitive.Content>
        </SheetPortal>
    ),
);
SheetContent.displayName = DialogPrimitive.Content.displayName;

export {
    Sheet,
    SheetTrigger,
    SheetClose,
    SheetContent,
    SheetOverlay,
    SheetPortal,
};
