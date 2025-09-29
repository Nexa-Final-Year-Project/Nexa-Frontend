import { Stepper, Button, Group } from "@mantine/core";
import { Form } from "./Form";
import { useState } from "react";
import { FormStepperProps } from "@/types/form";
import { useForm } from "@mantine/form";

export const FormStepper = ({ steps, onSubmit, initialValues }: FormStepperProps) => {
  const [active, setActive] = useState(0);
  const [formValues, setFormValues] = useState(initialValues);

  const handleNext = (values: any) => {
    setFormValues({ ...formValues, ...values });
    setActive((current) => (current < steps.length - 1 ? current + 1 : current));
  };

  const handlePrev = () => setActive((current) => (current > 0 ? current - 1 : current));

  return (
    <Stepper active={active}>
      {steps.map((step, index) => (
        <Stepper.Step key={step.title} label={step.title}>
          <Form
            fields={step.fields}
            onSubmit={
              index === steps.length - 1
                ? async (values) => await onSubmit({ ...formValues, ...values })
                : async (values) => { handleNext(values); }
            }
            initialValues={formValues}
          />
          {index > 0 && (
            <Group justify="center" mt="md">
              <Button variant="default" onClick={handlePrev}>
                Back
              </Button>
            </Group>
          )}
        </Stepper.Step>
      ))}
    </Stepper>
  );
};