"use client";

import React, { useState } from "react";
import type {
  UseFormSetValue,
  UseFormWatch,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import { RefreshCw, ChevronRight } from "lucide-react";
import { Field } from "../atoms/fieldset";
import type { CharacterFormData } from "../pages/CreateCharacterPage";
import {
  PERSONALITY_OPTIONS,
  RELATIONSHIP_OPTIONS,
  OCCUPATION_OPTIONS,
  VOICE_OPTIONS,
  KINKS_LIST,
} from "../pages/CreateCharacterPage";
import DialogCreateCharacterPersonality from "./DialogCreateCharacterPersonality";
import DialogCreateCharacterRelationship from "./DialogCreateCharacterRelationship";
import DialogCreateCharacterOccupation from "./DialogCreateCharacterOccupation";
import DialogCreateCharacterKinks from "./DialogCreateCharacterKinks";
import DialogCreateCharacterVoice from "./DialogCreateCharacterVoice";

type CreateCharacterStep5Props = {
  watch: UseFormWatch<CharacterFormData>;
  setValue: UseFormSetValue<CharacterFormData>;
  register: UseFormRegister<CharacterFormData>;
  errors: FieldErrors<CharacterFormData>;
  containerRef?: React.RefObject<HTMLElement | null>;
};

const FIRST_NAMES = [
  "Emma", "Sofia", "Lily", "Ava", "Mia", "Isabella", "Charlotte", "Amelia",
  "Harper", "Evelyn", "Luna", "Aria", "Chloe", "Scarlett", "Grace", "Zoe",
  "Penelope", "Nora", "Riley", "Stella", "Olivia", "Ella", "Camila", "Gianna",
  "Aurora", "Ellie", "Hazel", "Ivy", "Layla", "Willow", "Violet", "Nova",
  "Emilia", "Elena", "Maya", "Naomi", "Alice", "Sadie", "Jade", "Ruby",
  "Bella", "Claire", "Skylar", "Lucy", "Savannah", "Anna", "Caroline", "Genesis",
  "Aaliyah", "Kennedy", "Kinsley", "Allison", "Gabriella", "Alice", "Cora", "Julia",
  "Madelyn", "Peyton", "Rylee", "Clara", "Vivian", "Raelynn", "Melanie", "Lydia",
  "Aubrey", "Natalie", "Hannah", "Hailey", "Addison", "Eliana", "Mackenzie", "Lila",
  "Serenity", "Autumn", "Nevaeh", "Brooklyn", "Paisley", "Leah", "Audrey", "Alexa",
];

const LAST_NAMES = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
  "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
  "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson",
  "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker",
  "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill",
  "Flores", "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell",
  "Mitchell", "Carter", "Roberts", "Turner", "Phillips", "Evans", "Parker", "Collins",
  "Edwards", "Stewart", "Morris", "Murphy", "Cook", "Rogers", "Morgan", "Peterson",
  "Cooper", "Reed", "Bailey", "Bell", "Gomez", "Kelly", "Howard", "Ward",
  "Cox", "Diaz", "Richardson", "Wood", "Watson", "Brooks", "Bennett", "Gray",
];

// Track recently generated names to avoid immediate repeats
const recentNames: string[] = [];

const CreateCharacterStep5: React.FC<CreateCharacterStep5Props> = ({
  watch,
  setValue,
  register,
  errors,
  containerRef,
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
    const maxAttempts = 10;
    let attempts = 0;
    let newName = "";

    // Try to generate a name that wasn't recently used
    do {
      const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
      const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
      newName = `${firstName} ${lastName}`;
      attempts++;
    } while (recentNames.includes(newName) && attempts < maxAttempts);

    // Keep track of recent names (last 20)
    recentNames.push(newName);
    if (recentNames.length > 20) {
      recentNames.shift();
    }

    setValue("name", newName, { shouldValidate: true });
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
    <div className="flex w-full max-w-3xl flex-col items-center">
      {/* Name Section */}
      <h2 className="mb-6 text-2xl font-bold text-foreground">Choose a name</h2>

      <div className="mb-8 w-full">
        <Field>
          <div className="relative">
            <input
              type="text"
              placeholder="Enter name..."
              {...register("name")}
              maxLength={20}
              className="w-full rounded-xl border border-transparent bg-muted px-5 py-4 text-lg text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <button
              type="button"
              className="absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
              onClick={generateRandomName}
              title="Generate random name"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-2 text-right text-sm text-muted-foreground">
            {name.length}/20
          </div>
          {errors.name && (
            <p className="text-base/6 text-destructive sm:text-sm/6">{errors.name.message}</p>
          )}
        </Field>
      </div>

      {/* Personality Section */}
      <h2 className="mb-2 text-2xl font-bold text-foreground">
        Choose Personality
      </h2>
      <p className="mb-6 text-sm text-muted-foreground">Click to change</p>

      <div className="mb-8 w-full">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Personality Button */}
          <div>
            <button
              type="button"
              onClick={() => setShowPersonalityDialog(true)}
              className="relative flex w-full items-center justify-between overflow-hidden rounded-xl bg-muted p-4 transition-colors hover:bg-muted/80"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--color-primary)_0%,_transparent_70%)] opacity-15" />
              <div className="relative text-left">
                <p className="text-xs uppercase text-muted-foreground">
                  Choose Personality
                </p>
                <p className="truncate font-semibold text-foreground">{getPersonalityLabel()}</p>
              </div>
              <ChevronRight className="relative h-5 w-5 text-muted-foreground" />
            </button>
            {errors.personality && (
              <p className="mt-1 text-base/6 text-destructive sm:text-sm/6">{errors.personality.message}</p>
            )}
          </div>

          {/* Relationship Button */}
          <div>
            <button
              type="button"
              onClick={() => setShowRelationshipDialog(true)}
              className="relative flex w-full items-center justify-between overflow-hidden rounded-xl bg-muted p-4 transition-colors hover:bg-muted/80"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--color-primary)_0%,_transparent_70%)] opacity-15" />
              <div className="relative text-left">
                <p className="text-xs uppercase text-muted-foreground">
                  Choose Relationship
                </p>
                <p className="truncate font-semibold text-foreground">{getRelationshipLabel()}</p>
              </div>
              <ChevronRight className="relative h-5 w-5 text-muted-foreground" />
            </button>
            {errors.relationship && (
              <p className="mt-1 text-base/6 text-destructive sm:text-sm/6">{errors.relationship.message}</p>
            )}
          </div>

          {/* Occupation Button */}
          <div>
            <button
              type="button"
              onClick={() => setShowOccupationDialog(true)}
              className="relative flex w-full items-center justify-between overflow-hidden rounded-xl bg-muted p-4 transition-colors hover:bg-muted/80"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--color-primary)_0%,_transparent_70%)] opacity-15" />
              <div className="relative text-left">
                <p className="text-xs uppercase text-muted-foreground">
                  Choose Occupation
                </p>
                <p className="truncate font-semibold text-foreground">{getOccupationLabel()}</p>
              </div>
              <ChevronRight className="relative h-5 w-5 text-muted-foreground" />
            </button>
            {errors.occupation && (
              <p className="mt-1 text-base/6 text-destructive sm:text-sm/6">{errors.occupation.message}</p>
            )}
          </div>

          {/* Kinks Button */}
          <div>
            <button
              type="button"
              onClick={() => setShowKinksDialog(true)}
              className="relative flex w-full items-center justify-between overflow-hidden rounded-xl bg-muted p-4 transition-colors hover:bg-muted/80"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--color-primary)_0%,_transparent_70%)] opacity-15" />
              <div className="relative text-left">
                <p className="text-xs uppercase text-muted-foreground">
                  What kinks are they into? (Max. 3)
                </p>
                <p className="truncate font-semibold text-foreground">{getKinksLabel()}</p>
              </div>
              <ChevronRight className="relative h-5 w-5 text-muted-foreground" />
            </button>
            {errors.kinks && (
              <p className="mt-1 text-base/6 text-destructive sm:text-sm/6">{errors.kinks.message}</p>
            )}
          </div>

          {/* Voice Button - spans full width */}
          <div className="sm:col-span-2">
            <button
              type="button"
              onClick={() => setShowVoiceDialog(true)}
              className="relative flex w-full items-center justify-between overflow-hidden rounded-xl bg-primary/10 p-4 transition-colors hover:bg-primary/15"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--color-primary)_0%,_transparent_70%)] opacity-20" />
              <div className="relative text-left">
                <p className="text-xs uppercase text-muted-foreground">
                  Choose Voice
                </p>
                <p className="truncate font-semibold text-foreground">{getVoiceLabel()}</p>
              </div>
              <ChevronRight className="relative h-5 w-5 text-muted-foreground" />
            </button>
            {errors.voice && (
              <p className="mt-1 text-base/6 text-destructive sm:text-sm/6">{errors.voice.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <DialogCreateCharacterPersonality
        open={showPersonalityDialog}
        onClose={() => setShowPersonalityDialog(false)}
        value={personality}
        onChange={(value) => setValue("personality", value, { shouldValidate: true })}
        options={PERSONALITY_OPTIONS}
        containerRef={containerRef}
      />

      <DialogCreateCharacterRelationship
        open={showRelationshipDialog}
        onClose={() => setShowRelationshipDialog(false)}
        value={relationship}
        onChange={(value) => setValue("relationship", value, { shouldValidate: true })}
        options={RELATIONSHIP_OPTIONS}
        containerRef={containerRef}
      />

      <DialogCreateCharacterOccupation
        open={showOccupationDialog}
        onClose={() => setShowOccupationDialog(false)}
        value={occupation}
        onChange={(value) => setValue("occupation", value, { shouldValidate: true })}
        options={OCCUPATION_OPTIONS}
        containerRef={containerRef}
      />

      <DialogCreateCharacterKinks
        open={showKinksDialog}
        onClose={() => setShowKinksDialog(false)}
        value={kinks as string[]}
        onChange={(value) => setValue("kinks", value as CharacterFormData["kinks"], { shouldValidate: true })}
        kinksList={KINKS_LIST}
        containerRef={containerRef}
      />

      <DialogCreateCharacterVoice
        open={showVoiceDialog}
        onClose={() => setShowVoiceDialog(false)}
        value={voice}
        onChange={(value) => setValue("voice", value, { shouldValidate: true })}
        options={VOICE_OPTIONS}
        containerRef={containerRef}
      />
    </div>
  );
};

export default CreateCharacterStep5;
