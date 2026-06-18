import { jsx, jsxs } from "react/jsx-runtime";
import * as React from "react";
import { Command as Command$1 } from "cmdk";
import { SearchIcon } from "lucide-react";
import { c as cn } from "../app.js";
import * as PopoverPrimitive from "@radix-ui/react-popover";
const Command = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  Command$1,
  {
    ref,
    className: cn(
      "flex h-full w-full flex-col overflow-hidden rounded-xl bg-white text-slate-700",
      className
    ),
    ...props
  }
));
Command.displayName = Command$1.displayName;
const CommandInput = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxs(
  "div",
  {
    className: "flex items-center border-b border-slate-100 px-3",
    "cmdk-input-wrapper": "",
    children: [
      /* @__PURE__ */ jsx(SearchIcon, { className: "mr-2 h-4 w-4 shrink-0 text-slate-400" }),
      /* @__PURE__ */ jsx(
        Command$1.Input,
        {
          ref,
          className: cn(
            "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-50",
            className
          ),
          ...props
        }
      )
    ]
  }
));
CommandInput.displayName = Command$1.Input.displayName;
const CommandList = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  Command$1.List,
  {
    ref,
    className: cn("max-h-60 overflow-y-auto overflow-x-hidden", className),
    ...props
  }
));
CommandList.displayName = Command$1.List.displayName;
const CommandEmpty = React.forwardRef((props, ref) => /* @__PURE__ */ jsx(
  Command$1.Empty,
  {
    ref,
    className: "py-3 text-center text-sm text-slate-400",
    ...props
  }
));
CommandEmpty.displayName = Command$1.Empty.displayName;
const CommandGroup = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  Command$1.Group,
  {
    ref,
    className: cn("overflow-hidden p-1 text-slate-700", className),
    ...props
  }
));
CommandGroup.displayName = Command$1.Group.displayName;
const CommandItem = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  Command$1.Item,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-lg px-4 py-2.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-slate-100 data-[disabled=true]:opacity-50",
      className
    ),
    ...props
  }
));
CommandItem.displayName = Command$1.Item.displayName;
const Popover = PopoverPrimitive.Root;
const PopoverAnchor = PopoverPrimitive.Anchor;
const PopoverContent = React.forwardRef(
  ({ className, align = "start", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(PopoverPrimitive.Portal, { children: /* @__PURE__ */ jsx(
    PopoverPrimitive.Content,
    {
      ref,
      align,
      sideOffset,
      className: cn(
        "z-50 w-full rounded-xl border border-slate-200 bg-white p-0 text-slate-700 shadow-lg outline-none",
        className
      ),
      ...props
    }
  ) })
);
PopoverContent.displayName = PopoverPrimitive.Content.displayName;
export {
  Command as C,
  Popover as P,
  PopoverAnchor as a,
  PopoverContent as b,
  CommandInput as c,
  CommandList as d,
  CommandEmpty as e,
  CommandGroup as f,
  CommandItem as g
};
