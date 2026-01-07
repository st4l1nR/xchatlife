"use client";

import React, { useState } from "react";
import type {
  UseFormSetValue,
  UseFormWatch,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import { RefreshCw, ChevronRight } from "lucide-react";
import { Input, InputGroup } from "../../atoms/input";
import { Field, Label, ErrorMessage } from "../../atoms/fieldset";
import type { CharacterFormData } from "./types";
import {
  PERSONALITY_OPTIONS,
  RELATIONSHIP_OPTIONS,
  OCCUPATION_OPTIONS,
  VOICE_OPTIONS,
} from "./types";
import DialogPersonality from "./DialogPersonality";
import DialogRelationship from "./DialogRelationship";
import DialogOccupation from "./DialogOccupation";
import DialogKinks from "./DialogKinks";
import DialogVoice from "./DialogVoice";

type StepPersonalityProps = {
  watch: UseFormWatch<CharacterFormData>;
  setValue: UseFormSetValue<CharacterFormData>;
  register: UseFormRegister<CharacterFormData>;
  errors: FieldErrors<CharacterFormData>;
};

const RANDOM_NAMES = [
  "Emma Watson",
  "Sofia Martinez",
  "Lily Chen",
  "Ava Johnson",
  "Mia Anderson",
  "Isabella Garcia",
  "Charlotte Brown",
  "Amelia Davis",
  "Harper Wilson",
  "Evelyn Taylor",
  "Luna Rodriguez",
  "Aria Thomas",
  "Chloe Jackson",
  "Scarlett White",
  "Grace Harris",
  "Zoe Martin",
  "Penelope Lee",
  "Nora Walker",
  "Riley Scott",
  "Stella Young",
];

const StepPersonality: React.FC<StepPersonalityProps> = ({
  watch,
  setValue,
  register,
  errors,
}) => {
  const [showPersonalityDialog, setShowPersonalityDialog] = useState(false);
  const [showRelationshipDialog, setShowRelationshipDialog] = useState(false);
  const [showOccupationDialog, setShowOccupationDialog] = useState(false);
  const [showKinksDialog, setShowKinksDialog] = useState(false);
  const [showVoiceDialog, setShowVoiceDialog] = useState(false);

  const name = watch("name") ?? "";
  const personality = watch("personality");
  const relationship = watch("relationship");
  const occupation = watch("occupation");
  const kinks = watch("kinks") ?? [];
  const voice = watch("voice");

  const generateRandomName = () => {
    const randomIndex = Math.floor(Math.random() * RANDOM_NAMES.length);
    const randomName = RANDOM_NAMES[randomIndex];
    if (randomName) {
      setValue("name", randomName, { shouldValidate: true });
    }
  };

  const getPersonalityLabel = () => {
    const option = PERSONALITY_OPTIONS.find((o) => o.value === personality);
    return option?.label ?? "Select...";
  };

  const getRelationshipLabel = () => {
    const option = RELATIONSHIP_OPTIONS.find((o) => o.value === relationship);
    return option?.label ?? "Select...";
  };

  const getOccupationLabel = () => {
    const option = OCCUPATION_OPTIONS.find((o) => o.value === occupation);
    return option ? `${option.emoji} ${option.label}` : "Select...";
  };

  const getKinksLabel = () => {
    if (kinks.length === 0) return "Select...";
    return kinks.join(", ");
  };

  const getVoiceLabel = () => {
    const option = VOICE_OPTIONS.find((o) => o.value === voice);
    return option?.label ?? "Select...";
  };

  return (
    <div className="flex flex-col items-center">
      {/* Name Section */}
      <h2 className="mb-6 text-2xl font-bold text-foreground">Choose a name</h2>

      <div className="mb-4 w-full max-w-md">
        <Field>
          <div className="relative">
            <InputGroup>
              <Input
                type="text"
                placeholder="Enter name..."
                {...register("name")}
                maxLength={20}
              />
              <button
                type="button"
                data-slot="icon"
                className="cursor-pointer text-muted-foreground hover:text-foreground"
                onClick={generateRandomName}
                title="Generate random name"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </InputGroup>
          </div>
          <div className="mt-1 text-right text-sm text-muted-foreground">
            {name.length}/20
          </div>
          {errors.name && (
            <ErrorMessage>{errors.name.message}</ErrorMessage>
          )}
        </Field>
      </div>

      {/* Personality Section */}
      <h2 className="mb-2 text-2xl font-bold text-foreground">
        Choose Personality
      </h2>
      <p className="mb-6 text-sm text-muted-foreground">Click to change</p>

      <div className="mb-8 w-full max-w-2xl space-y-3">
        {/* Personality Button */}
        <button
          type="button"
          onClick={() => setShowPersonalityDialog(true)}
          className="flex w-full items-center justify-between rounded-xl bg-muted p-4 transition-colors hover:bg-muted/80"
        >
          <div className="text-left">
            <p className="text-xs uppercase text-muted-foreground">
              Choose Personality
            </p>
            <p className="font-semibold text-foreground">{getPersonalityLabel()}</p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>

        {errors.personality && (
          <ErrorMessage>{errors.personality.message}</ErrorMessage>
        )}

        {/* Relationship Button */}
        <button
          type="button"
          onClick={() => setShowRelationshipDialog(true)}
          className="flex w-full items-center justify-between rounded-xl bg-muted p-4 transition-colors hover:bg-muted/80"
        >
          <div className="text-left">
            <p className="text-xs uppercase text-muted-foreground">
              Choose Relationship
            </p>
            <p className="font-semibold text-foreground">{getRelationshipLabel()}</p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>

        {errors.relationship && (
          <ErrorMessage>{errors.relationship.message}</ErrorMessage>
        )}

        {/* Occupation Button */}
        <button
          type="button"
          onClick={() => setShowOccupationDialog(true)}
          className="flex w-full items-center justify-between rounded-xl bg-muted p-4 transition-colors hover:bg-muted/80"
        >
          <div className="text-left">
            <p className="text-xs uppercase text-muted-foreground">
              Choose Occupation
            </p>
            <p className="font-semibold text-foreground">{getOccupationLabel()}</p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>

        {errors.occupation && (
          <ErrorMessage>{errors.occupation.message}</ErrorMessage>
        )}

        {/* Kinks Button */}
        <button
          type="button"
          onClick={() => setShowKinksDialog(true)}
          className="flex w-full items-center justify-between rounded-xl bg-muted p-4 transition-colors hover:bg-muted/80"
        >
          <div className="text-left">
            <p className="text-xs uppercase text-muted-foreground">
              What kinks are they into? (Max. 3)
            </p>
            <p className="font-semibold text-foreground">{getKinksLabel()}</p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>

        {errors.kinks && (
          <ErrorMessage>{errors.kinks.message}</ErrorMessage>
        )}

        {/* Voice Button */}
        <button
          type="button"
          onClick={() => setShowVoiceDialog(true)}
          className="flex w-full items-center justify-between rounded-xl bg-gradient-to-r from-purple-900/50 to-pink-900/50 p-4 transition-colors hover:from-purple-900/60 hover:to-pink-900/60"
        >
          <div className="text-left">
            <p className="text-xs uppercase text-muted-foreground">
              Choose Voice
            </p>
            <p className="font-semibold text-foreground">{getVoiceLabel()}</p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>

        {errors.voice && (
          <ErrorMessage>{errors.voice.message}</ErrorMessage>
        )}
      </div>

      {/* Dialogs */}
      <DialogPersonality
        open={showPersonalityDialog}
        onClose={() => setShowPersonalityDialog(false)}
        value={personality}
        onChange={(value) => setValue("personality", value, { shouldValidate: true })}
      />

      <DialogRelationship
        open={showRelationshipDialog}
        onClose={() => setShowRelationshipDialog(false)}
        value={relationship}
        onChange={(value) => setValue("relationship", value, { shouldValidate: true })}
      />

      <DialogOccupation
        open={showOccupationDialog}
        onClose={() => setShowOccupationDialog(false)}
        value={occupation}
        onChange={(value) => setValue("occupation", value, { shouldValidate: true })}
      />

      <DialogKinks
        open={showKinksDialog}
        onClose={() => setShowKinksDialog(false)}
        value={kinks}
        onChange={(value) => setValue("kinks", value, { shouldValidate: true })}
      />

      <DialogVoice
        open={showVoiceDialog}
        onClose={() => setShowVoiceDialog(false)}
        value={voice}
        onChange={(value) => setValue("voice", value, { shouldValidate: true })}
      />
    </div>
  );
};

export default StepPersonality;
