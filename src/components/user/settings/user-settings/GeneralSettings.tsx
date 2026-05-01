"use client";

import { useRef, useState } from "react";
import { Form } from "@/components/ui/form/Form";
import type { FormField as FormFieldType } from "@/types/form";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar/avatar";
import { ImageIcon, Upload, User as UserIcon } from "lucide-react";
import { useTheme } from "next-themes";

interface UserGeneralSettingsProps {
  user: any;
  onSubmit: (values: Record<string, any>) => Promise<void>;
  initialValues: Record<string, any>;
}

export const UserGeneralSettings = ({
  user,
  onSubmit,
  initialValues,
}: UserGeneralSettingsProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user?.photoURL || null,
  );
  const generalFields: FormFieldType[] = [
    {
      name: "name",
      label: "Full Name",
      type: "text",
      placeholder: "Enter your name",
      validation: (value) => (!value ? "Name is required" : null),
      span: 12,
    },
    {
      name: "email",
      label: "Email Address",
      type: "email",
      placeholder: "Enter your email",
      validation: (value) =>
        !value
          ? "Email is required"
          : !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)
            ? "Invalid email format"
            : null,
      span: 12,
    },
    {
      name: "bio",
      label: "Bio",
      type: "textarea",
      placeholder: "Tell us a little about yourself",
      span: 12,
    },
  ];

  return (
    <div className="p-6 sm:p-8 space-y-10">
      {/* Profile Avatar Section */}
      <div className="text-left">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-blue-400 to-blue-600" />
          <h2
            className={`text-xl font-bold ${
              isDark ? "text-white" : "text-neutral-900"
            }`}
          >
            Profile Photo
          </h2>
        </div>
        <p
          className={`text-sm ml-4 mb-6 ${
            isDark ? "text-white/40" : "text-neutral-500"
          }`}
        >
          This is your public avatar
        </p>

        <div
          className={`rounded-xl border p-5 sm:p-6 ${
            isDark
              ? "bg-white/[0.02] border-white/[0.06]"
              : "bg-neutral-50 border-neutral-200"
          }`}
        >
          <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
            {/* Avatar Display */}
            <div className="relative group">
              <Avatar
                className={`h-24 w-24 rounded-2xl border-2 shadow-lg ${
                  isDark ? "border-white/[0.08]" : "border-neutral-300"
                }`}
              >
                <AvatarImage
                  src={avatarPreview || user?.photoURL}
                  className="rounded-2xl"
                />
                <AvatarFallback
                  className={`text-3xl rounded-2xl font-semibold ${
                    isDark
                      ? "bg-gradient-to-br from-neutral-800 to-neutral-900 text-white/80"
                      : "bg-gradient-to-br from-neutral-200 to-neutral-300 text-neutral-700"
                  }`}
                >
                  {user?.name?.charAt(0).toUpperCase() || (
                    <UserIcon className="w-10 h-10" />
                  )}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="absolute inset-0 rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
              >
                <Upload className="w-6 h-6 text-white/80" />
              </button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;

                  const reader = new FileReader();
                  reader.onload = () => {
                    const url =
                      typeof reader.result === "string" ? reader.result : null;
                    setAvatarPreview(url);
                    if (url) {
                      void onSubmit({ photoURL: url });
                    }
                  };
                  reader.readAsDataURL(file);
                }}
              />
            </div>

            {/* Upload Info */}
            <div className="flex-1 space-y-4 w-full min-w-0">
              <div>
                <h3
                  className={`text-sm font-medium mb-1 ${
                    isDark ? "text-white" : "text-neutral-900"
                  }`}
                >
                  Upload a new photo
                </h3>
                <p
                  className={`text-xs ${
                    isDark ? "text-white/40" : "text-neutral-500"
                  }`}
                >
                  Recommended: Square image, at least 256x256px
                </p>
              </div>

              <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3">
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-xl border
                  text-sm font-medium transition-all duration-200 cursor-pointer
                  ${
                    isDark
                      ? "bg-white/[0.06] border-white/[0.08] text-white/80 hover:bg-white/[0.1] hover:border-white/[0.12]"
                      : "bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-400"
                  }
                `}
                >
                  <ImageIcon className="w-4 h-4" />
                  Choose File
                </button>
                <span
                  className={`text-xs max-w-xs leading-5 ${
                    isDark ? "text-white/40" : "text-neutral-500"
                  }`}
                >
                  JPG, PNG or GIF • Max 5MB
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div
        className={`h-px bg-gradient-to-r from-transparent to-transparent ${
          isDark ? "via-white/[0.08]" : "via-neutral-200"
        }`}
      />

      {/* Profile Information Section */}
      <div className="text-left">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600" />
          <h2
            className={`text-xl font-bold ${
              isDark ? "text-white" : "text-neutral-900"
            }`}
          >
            Profile Information
          </h2>
        </div>
        <p
          className={`text-sm ml-4 mb-6 ${
            isDark ? "text-white/40" : "text-neutral-500"
          }`}
        >
          Update your personal information
        </p>

        <div
          className={`rounded-xl border p-6 ${
            isDark
              ? "bg-white/[0.02] border-white/[0.06]"
              : "bg-neutral-50 border-neutral-200"
          }`}
        >
          <Form
            fields={generalFields}
            onSubmit={onSubmit}
            initialValues={initialValues}
            submitButtonText="Save Changes"
          />
        </div>
      </div>
    </div>
  );
};
