"use client";

import React, { useState } from "react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import GenerateImageStep1 from "../organisms/GenerateImageStep1";
import GenerateImageStep2 from "../organisms/GenerateImageStep2";
import type { SelectedCharacter } from "../organisms/GenerateImageStep1";

type Step = 1 | 2;

export type GenerateImagePageProps = {
  className?: string;
};

const GenerateImagePage: React.FC<GenerateImagePageProps> = ({ className }) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [selectedCharacter, setSelectedCharacter] =
    useState<SelectedCharacter | null>(null);

  const handleBack = () => {
    if (currentStep === 1) {
      router.back();
    } else {
      setCurrentStep(1);
    }
  };

  const handleSelectCharacter = (character: SelectedCharacter) => {
    setSelectedCharacter(character);
    setCurrentStep(2);
  };

  return (
    <div className={clsx("bg-background min-h-screen", className)}>
      {currentStep === 1 && (
        <GenerateImageStep1
          onBack={handleBack}
          onSelectCharacter={handleSelectCharacter}
        />
      )}

      {currentStep === 2 && selectedCharacter && (
        <GenerateImageStep2 character={selectedCharacter} onBack={handleBack} />
      )}
    </div>
  );
};

export default GenerateImagePage;
