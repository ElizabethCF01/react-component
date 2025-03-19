"use client";

import React from "react";
import "./tabs.css";

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
}

interface TabsContextProps {
  value?: string;
}

type TabChildProps = TabsContextProps & {
  children?: React.ReactNode;
};

export const Tabs: React.FC<TabsProps> = ({
  value,
  children,
  className = "",
  ...props
}) => {
  return (
    <div className={`tabs ${className}`} {...props}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(
            child as React.ReactElement<TabChildProps>,
            {
              value,
            },
          );
        }
        return child;
      })}
    </div>
  );
};

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const TabsList: React.FC<TabsListProps> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <div className={`tabs-list gap-2 ${className}`} {...props}>
      {children}
    </div>
  );
};

interface TabsTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  children: React.ReactNode;
}

export const TabsTrigger: React.FC<
  TabsTriggerProps & {
    onValueChange?: (value: string) => void;
    value?: string;
  }
> = ({
  value: triggerValue,
  children,
  className = "",
  onValueChange,
  value: selectedValue,
  ...props
}) => {
  const isSelected = selectedValue === triggerValue;

  return (
    <button
      className={`tabs-trigger ${isSelected ? "tabs-trigger-active" : ""} ${className}`}
      onClick={() => onValueChange?.(triggerValue)}
      {...props}
    >
      {children}
    </button>
  );
};

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
}

export const TabsContent: React.FC<TabsContentProps & TabsContextProps> = ({
  value: contentValue,
  children,
  className = "",
  value: selectedValue,
  ...props
}) => {
  const isSelected = selectedValue === contentValue;

  if (!isSelected) return null;

  return (
    <div className={`tabs-content ${className}`} {...props}>
      {children}
    </div>
  );
};
