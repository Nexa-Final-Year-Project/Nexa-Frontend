// modals/ModalRenderer.tsx
"use client";

import { Modal } from "@/components/ui/modal/Modal";
import { useModalStore } from "@/store/modal/modalStore";
import { useModalConfigs } from "./configMap";

export function ModalRenderer() {
  const { stack, closeModal } = useModalStore();
  const configs = useModalConfigs(closeModal);

  return (
    <>
      {stack.map((modal, index) => {
        const configOrFn = configs[modal.type];
        if (!configOrFn) return null;

        const config =
          typeof configOrFn === "function"
            ? configOrFn(modal.data)
            : configOrFn;

        const ModalComponent = config.component;
        const modalProps = config.props;

        if (ModalComponent) {
          return (
            <ModalComponent
              key={index}
              {...config.props}
              isOpen={!!modal}
              onOpenChange={(isOpen: boolean) => !isOpen && closeModal()}
            />
          );
        }

        return (
          <Modal
            key={index}
            open={true}
            onOpenChange={(isOpen) => !isOpen && closeModal()}
            {...config}
          />
        );
      })}
    </>
  );
}
