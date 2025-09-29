"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form/Form";
import type { FormField as FormFieldType } from "@/types/form";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar/avatar";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ImageUploader } from "@/components/ui/image/ImageUploader";

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
    <Card className="!shadow-none !border-0">
      <CardContent className="space-y-8">
        {/* Profile Information */}
        <div className="text-left">
          <h2 className="text-2xl font-bold">Profile Information</h2>
          <p className="text-sm text-muted-foreground my-3">
            Update your personal information
          </p>

          {/* Profile Avatar */}
          <div className="text-left my-4">
            <ImageUploader
              shape="circle"
              aspectRatio={1}
              initialImage={user?.photoURL}
              onChange={(file, url) => console.log("Avatar updated", file, url)}
            />

            {/* <div className="flex items-center gap-6">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.photoURL} />
                <AvatarFallback className="text-xl">
                  {user.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div> */}
          </div>
          <Form
            fields={generalFields}
            onSubmit={onSubmit}
            initialValues={initialValues}
            submitText="Save Changes"
          />
        </div>
      </CardContent>
    </Card>
  );
};
