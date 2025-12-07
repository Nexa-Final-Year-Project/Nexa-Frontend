"use client";

import { useState } from "react";
import { EyeIcon, EyeOffIcon, PlusIcon, XIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

import { cn } from "@/lib/utils";
import type { FormField as FormFieldType } from "@/types/form";
import { Label } from "../label";
import { PopoverPortal } from "@radix-ui/react-popover";

export const FormField = ({
  field,
  form,
}: {
  field: FormFieldType;
  form: any;
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [showPassword, setShowPassword] = useState(false);
  const [newItem, setNewItem] = useState("");

  // list input helpers
  const handleAddItem = () => {
    if (newItem.trim() && !form.values[field.name]?.includes(newItem.trim())) {
      const currentItems = form.values[field.name] || [];
      form.setFieldValue(field.name, [...currentItems, newItem.trim()]);
      setNewItem("");
    }
  };
  const handleRemoveItem = (i: number) => {
    form.setFieldValue(
      field.name,
      form.values[field.name].filter((_: string, idx: number) => idx !== i)
    );
  };

  switch (field.type) {
    case "text":
    case "email":
      return (
        <div className="space-y-1">
          <Label
            className={`text-sm font-medium ${
              isDark ? "text-white" : "text-neutral-900"
            }`}
          >
            {field.label}
          </Label>
          <Input
            type={field.type}
            placeholder={field.placeholder}
            disabled={field.disabled}
            required={field.required}
            {...form.getInputProps(field.name)}
          />
        </div>
      );

    case "textarea":
      return (
        <div className="space-y-1">
          <Label
            className={`text-sm font-medium ${
              isDark ? "text-white" : "text-neutral-900"
            }`}
          >
            {field.label}
          </Label>
          <Textarea
            placeholder={field.placeholder}
            disabled={field.disabled}
            {...form.getInputProps(field.name)}
          />
        </div>
      );

    case "password":
      return (
        <div className="space-y-1 relative">
          <Label
            className={`text-sm font-medium ${
              isDark ? "text-white" : "text-neutral-900"
            }`}
          >
            {field.label}
          </Label>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder={field.placeholder}
            {...form.getInputProps(field.name)}
          />
          <button
            type="button"
            className={`absolute right-3 top-8 ${
              isDark ? "text-gray-500" : "text-gray-400 hover:text-gray-600"
            }`}
            onClick={() => setShowPassword((p) => !p)}
          >
            {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
          </button>
        </div>
      );

    case "select":
      return (
        <div className="space-y-1">
          <Label
            className={`text-sm font-medium ${
              isDark ? "text-white" : "text-neutral-900"
            }`}
          >
            {field.label}
          </Label>
          <Select
            value={form.values[field.name]}
            onValueChange={(val) => form.setFieldValue(field.name, val)}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent className="min-w-full">
              {field.options?.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  className="min-w-full"
                >
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );

    case "date":
      return (
        <div className="space-y-1">
          <Label
            className={`text-sm font-medium ${
              isDark ? "text-white" : "text-neutral-900"
            }`}
          >
            {field.label}
          </Label>
          <Input type="date" {...form.getInputProps(field.name)} />
        </div>
      );

    case "checkbox":
      return (
        <div className="flex items-center gap-2">
          <Checkbox
            checked={form.values[field.name]}
            onCheckedChange={(val) => form.setFieldValue(field.name, val)}
          />
          <label
            className={`text-sm ${isDark ? "text-white" : "text-neutral-900"}`}
          >
            {field.label}
          </label>
        </div>
      );

    case "list": {
      const items = form.values[field.name] || [];
      return (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder={field.placeholder || `Add ${field.label}`}
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), handleAddItem())
              }
            />
            <Button type="button" variant="outline" onClick={handleAddItem}>
              <PlusIcon size={16} className="mr-1" /> Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {items.map((item: string, i: number) => (
              <Badge
                key={i}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {item}
                <button type="button" onClick={() => handleRemoveItem(i)}>
                  <XIcon size={14} />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      );
    }

    default:
      return null;
  }
};
