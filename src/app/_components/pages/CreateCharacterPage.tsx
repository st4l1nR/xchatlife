"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../atoms/button";
import StepStyle from "../organisms/create-character/StepStyle";
import StepEthnicityAge from "../organisms/create-character/StepEthnicityAge";
import StepAppearance from "../organisms/create-character/StepAppearance";
import StepBody from "../organisms/create-character/StepBody";
import StepPersonality from "../organisms/create-character/StepPersonality";
import {
  characterFormSchema,
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  step5Schema,
  type CharacterFormData,
} from "../organisms/create-character/types";

type Step = 1 | 2 | 3 | 4 | 5;

const stepSchemas = {
  1: step1Schema,
  2: step2Schema,
  3: step3Schema,
  4: step4Schema,
  5: step5Schema,
};

const CreateCharacterPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<CharacterFormData>({
    resolver: zodResolver(characterFormSchema),
    defaultValues: {
      age: 21,
      kinks: [],
    },
    mode: "onChange",
  });

  const validateCurrentStep = async (): Promise<boolean> => {
    const schema = stepSchemas[currentStep];

    // Get only the fields for the current step
    const stepFields = Object.keys(schema.shape) as (keyof CharacterFormData)[];

    // Trigger validation for current step fields
    const results = await Promise.all(
      stepFields.map((field) => trigger(field)),
    );

    return results.every((result) => result === true);
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();

    if (isValid) {
      if (currentStep < 5) {
        setCurrentStep((prev) => (prev + 1) as Step);
      }
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
    }
  };

  const onSubmit = async (data: CharacterFormData) => {
    setIsSubmitting(true);

    try {
      // For now, just log the data and show success toast
      console.log("Character Form Data:", data);
      toast.success("Character created successfully!");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepStyle watch={watch} setValue={setValue} errors={errors} />;
      case 2:
        return (
          <StepEthnicityAge watch={watch} setValue={setValue} errors={errors} />
        );
      case 3:
        return (
          <StepAppearance watch={watch} setValue={setValue} errors={errors} />
        );
      case 4:
        return <StepBody watch={watch} setValue={setValue} errors={errors} />;
      case 5:
        return (
          <StepPersonality
            watch={watch}
            setValue={setValue}
            register={register}
            errors={errors}
          />
        );
      default:
        return null;
    }
  };

  const isLastStep = currentStep === 5;

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Step Content */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-8">{renderStep()}</div>

          {/* Navigation */}
          <div className="flex justify-center gap-4">
            {currentStep > 1 && (
              <Button type="button" plain onClick={handleBack}>
                Back
              </Button>
            )}

            {isLastStep ? (
              <Button type="submit" loading={isSubmitting} className="min-w-48">
                Create Character
                <ArrowRight data-slot="icon" className="ml-2" />
              </Button>
            ) : (
              <Button type="button" onClick={handleNext} className="min-w-48">
                NEXT
                <ArrowRight data-slot="icon" className="ml-2" />
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCharacterPage;
