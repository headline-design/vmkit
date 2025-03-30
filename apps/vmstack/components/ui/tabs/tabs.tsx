"use client"

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

export const Tabs = TabsPrimitive.Root;

interface TabsListProps {
  className?: string;
  children?: React.ReactNode;
}

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, children, ...props }, ref) => (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        "inline-flex h-10 items-center justify-center border-shadow rounded-md bg-inherit p-1 text-ds-gray-1000 ",
        className,
      )}
      {...props}
    >
      {children}
    </TabsPrimitive.List>
  ),
);
TabsList.displayName = TabsPrimitive.List.displayName;

interface TabsTriggerProps {
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  value?: string;
}

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, children, value, disabled, onClick, ...props }, ref) => (
    <TabsPrimitive.Trigger
      value={value as any}
      ref={ref}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-accent-muted data-[state=active]:text-primary   ",
        className,
      )}
      {...props}
    >
      {children}
    </TabsPrimitive.Trigger>
  ),
);
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

interface TabsContentProps {
  className?: string;
  value?: string;
  children?: React.ReactNode;
}

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, children, value, ...props }, ref) => (
    <TabsPrimitive.Content
      value={value as any}
      ref={ref}
      className={cn(
        "mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300",
        className,
      )}
      {...props}
    >
      {children}
    </TabsPrimitive.Content>
  ),
);
TabsContent.displayName = TabsPrimitive.Content.displayName;
