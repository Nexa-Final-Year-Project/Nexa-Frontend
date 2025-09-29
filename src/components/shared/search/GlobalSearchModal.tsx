import { Modal } from "@/components/ui/modal/Modal";
import React from "react";
import GlobalSearch from "./GlobalSearch";

const GlobalSearchModal = ({
  isOpen,
  onOpenChange,
  title = "Search",
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
}) => {
  return (
    <Modal
      open={isOpen}
      onOpenChange={onOpenChange}
      title={title}
      hideTrigger
      size="xl"
    >
      <div className="w-full">
        <GlobalSearch />
      </div>
    </Modal>
  );
};

export default GlobalSearchModal;
