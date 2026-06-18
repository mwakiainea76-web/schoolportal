import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { SearchIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const Command = React.forwardRef(({ className, ...props }, ref) => (
    <CommandPrimitive
        ref={ref}
        className={cn(
            "flex h-full w-full flex-col overflow-hidden rounded-xl bg-white text-slate-700",
            className,
        )}
        {...props}
    />
));
Command.displayName = CommandPrimitive.displayName;

const CommandInput = React.forwardRef(({ className, ...props }, ref) => (
    <div
        className="flex items-center border-b border-slate-100 px-3"
        cmdk-input-wrapper=""
    >
        <SearchIcon className="mr-2 h-4 w-4 shrink-0 text-slate-400" />
        <CommandPrimitive.Input
            ref={ref}
            className={cn(
                "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-50",
                className,
            )}
            {...props}
        />
    </div>
));
CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef(({ className, ...props }, ref) => (
    <CommandPrimitive.List
        ref={ref}
        className={cn("max-h-60 overflow-y-auto overflow-x-hidden", className)}
        {...props}
    />
));
CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef((props, ref) => (
    <CommandPrimitive.Empty
        ref={ref}
        className="py-3 text-center text-sm text-slate-400"
        {...props}
    />
));
CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef(({ className, ...props }, ref) => (
    <CommandPrimitive.Group
        ref={ref}
        className={cn("overflow-hidden p-1 text-slate-700", className)}
        {...props}
    />
));
CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandItem = React.forwardRef(({ className, ...props }, ref) => (
    <CommandPrimitive.Item
        ref={ref}
        className={cn(
            "relative flex cursor-default select-none items-center rounded-lg px-4 py-2.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-slate-100 data-[disabled=true]:opacity-50",
            className,
        )}
        {...props}
    />
));
CommandItem.displayName = CommandPrimitive.Item.displayName;

export {
    Command,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
};
