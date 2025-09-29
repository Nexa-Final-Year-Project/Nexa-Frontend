"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarImage } from "@/components/ui/avatar/avatar";
import { ReusableDropdownMenu } from "@/components/ui/dropdown/ReusableDropdownMenu";
import { CalendarDays, Clock, ChevronDown } from "lucide-react";
import { ColumnType, User } from "./types";
import { shortDateFormatter } from "./constants";

interface CreateTaskCardProps {
  column: ColumnType;
  users: User[];
  onCreate: (task: {
    name: string;
    ownerId: string;
    dateType: "due" | "start";
    date: string;
  }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const CreateTaskCard = ({
  column,
  users,
  onCreate,
  onCancel,
  isLoading = false,
}: CreateTaskCardProps) => {
  const [name, setName] = useState("");
  const [ownerId, setOwnerId] = useState(users[0].id);
  const [dateType, setDateType] = useState<"due" | "start">("due");
  const [date, setDate] = useState("");

  const handleCreate = async () => {
    await onCreate({ name, ownerId, dateType, date });
  };

  return (
    <div className="rounded-lg border border-gray-200 shadow-sm p-4 space-y-3">
      {/* Task Name */}
      <div className="relative">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="What needs to be done?"
          className="w-full text-sm font-medium border-none focus:outline-none focus:ring-0 px-0 py-1 placeholder-gray-400"
          autoFocus
        />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-blue-500 scale-x-0 origin-left transition-transform duration-300 focus-within:scale-x-100"></div>
      </div>

      {/* Task Details */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Assignee Dropdown */}
        {/* <div className="relative">
          <ReusableDropdownMenu
            trigger={
              <div className="flex items-center gap-2 cursor-pointer">
                <Avatar className="h-6 w-6 border border-gray-200">
                  <AvatarImage
                    src={
                      users.find((u) => u.id === ownerId)?.image ||
                      "/default-avatar.png"
                    }
                    alt={
                      users.find((u) => u.id === ownerId)?.name || "Assignee"
                    }
                  />
                </Avatar>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            }
            items={users.map((user) => ({
              label: (
                <div className="flex items-center gap-2 px-2 py-1 hover:bg-gray-50 rounded">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user.image} alt={user.name} />
                  </Avatar>
                  <span>{user.name}</span>
                </div>
              ),
              action: () => setOwnerId(user.id),
            }))}
            className="w-48"
          />
        </div> */}

        {/* Date Type & Date */}
        <div className="flex items-center gap-2 bg-gray-50 rounded-full px-3 py-1">
          <ReusableDropdownMenu
            trigger={
              <div className="flex items-center gap-1 cursor-pointer">
                {dateType === "due" ? (
                  <Clock className="h-4 w-4 text-orange-500" />
                ) : (
                  <CalendarDays className="h-4 w-4 text-blue-500" />
                )}
                <span className="text-xs font-medium">
                  {dateType === "due" ? "Due" : "Start"}
                </span>
                <ChevronDown className="h-3 w-3 text-gray-400" />
              </div>
            }
            items={[
              {
                label: (
                  <div className="flex items-center gap-2 px-2 py-1">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span>Due Date</span>
                  </div>
                ),
                action: () => setDateType("due"),
              },
              {
                label: (
                  <div className="flex items-center gap-2 px-2 py-1">
                    <CalendarDays className="h-4 w-4 text-blue-500" />
                    <span>Start Date</span>
                  </div>
                ),
                action: () => setDateType("start"),
              },
            ]}
          />

          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-1 text-xs font-medium text-gray-700 hover:text-gray-900">
                {date ? (
                  shortDateFormatter.format(new Date(date))
                ) : (
                  <span className="text-gray-400">Select date</span>
                )}
                <CalendarDays className="h-3 w-3 text-gray-400" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date ? new Date(date) : undefined}
                onSelect={(d) => setDate(d?.toISOString().split("T")[0] || "")}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-500 hover:text-gray-700"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          size="sm"
          className="bg-blue-600 hover:bg-blue-700"
          onClick={handleCreate}
          disabled={!name.trim() || isLoading}
        >
          {isLoading ? "Creating..." : "Create Task"}
        </Button>
      </div>
    </div>
  );
};
