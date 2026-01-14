"use client";

import React, { useState } from "react";
import type {
  UseFormSetValue,
  UseFormWatch,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import { RefreshCw, ChevronRight } from "lucide-react";
import { Field, Label, Description } from "../atoms/fieldset";
import { Checkbox, CheckboxField } from "../atoms/checkbox";
import type {
  CharacterFormData,
  PersonalityOption,
  RelationshipOption,
  OccupationOption,
} from "../pages/CreateCharacterPage";
import { VOICE_OPTIONS } from "../pages/CreateCharacterPage";
import DialogCreateCharacterPersonality from "./DialogCreateCharacterPersonality";
import DialogCreateCharacterRelationship from "./DialogCreateCharacterRelationship";
import DialogCreateCharacterOccupation from "./DialogCreateCharacterOccupation";
import DialogCreateCharacterVoice from "./DialogCreateCharacterVoice";

type CreateCharacterStep5Props = {
  watch: UseFormWatch<CharacterFormData>;
  setValue: UseFormSetValue<CharacterFormData>;
  register: UseFormRegister<CharacterFormData>;
  errors: FieldErrors<CharacterFormData>;
  containerRef?: React.RefObject<HTMLElement | null>;
  personalities: PersonalityOption[];
  relationships: RelationshipOption[];
  occupations: OccupationOption[];
  loading: boolean;
};

const FIRST_NAMES = [
  "Emma",
  "Sofia",
  "Lily",
  "Ava",
  "Mia",
  "Isabella",
  "Charlotte",
  "Amelia",
  "Harper",
  "Evelyn",
  "Luna",
  "Aria",
  "Chloe",
  "Scarlett",
  "Grace",
  "Zoe",
  "Penelope",
  "Nora",
  "Riley",
  "Stella",
  "Olivia",
  "Ella",
  "Camila",
  "Gianna",
  "Aurora",
  "Ellie",
  "Hazel",
  "Ivy",
  "Layla",
  "Willow",
  "Violet",
  "Nova",
  "Emilia",
  "Elena",
  "Maya",
  "Naomi",
  "Alice",
  "Sadie",
  "Jade",
  "Ruby",
  "Bella",
  "Claire",
  "Skylar",
  "Lucy",
  "Savannah",
  "Anna",
  "Caroline",
  "Genesis",
  "Aaliyah",
  "Kennedy",
  "Kinsley",
  "Allison",
  "Gabriella",
  "Alice",
  "Cora",
  "Julia",
  "Madelyn",
  "Peyton",
  "Rylee",
  "Clara",
  "Vivian",
  "Raelynn",
  "Melanie",
  "Lydia",
  "Aubrey",
  "Natalie",
  "Hannah",
  "Hailey",
  "Addison",
  "Eliana",
  "Mackenzie",
  "Lila",
  "Serenity",
  "Autumn",
  "Nevaeh",
  "Brooklyn",
  "Paisley",
  "Leah",
  "Audrey",
  "Alexa",
];

const LAST_NAMES = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Wilson",
  "Anderson",
  "Thomas",
  "Taylor",
  "Moore",
  "Jackson",
  "Martin",
  "Lee",
  "Perez",
  "Thompson",
  "White",
  "Harris",
  "Sanchez",
  "Clark",
  "Ramirez",
  "Lewis",
  "Robinson",
  "Walker",
  "Young",
  "Allen",
  "King",
  "Wright",
  "Scott",
  "Torres",
  "Nguyen",
  "Hill",
  "Flores",
  "Green",
  "Adams",
  "Nelson",
  "Baker",
  "Hall",
  "Rivera",
  "Campbell",
  "Mitchell",
  "Carter",
  "Roberts",
  "Turner",
  "Phillips",
  "Evans",
  "Parker",
  "Collins",
  "Edwards",
  "Stewart",
  "Morris",
  "Murphy",
  "Cook",
  "Rogers",
  "Morgan",
  "Peterson",
  "Cooper",
  "Reed",
  "Bailey",
  "Bell",
  "Gomez",
  "Kelly",
  "Howard",
  "Ward",
  "Cox",
  "Diaz",
  "Richardson",
  "Wood",
  "Watson",
  "Brooks",
  "Bennett",
  "Gray",
];

// Track recently generated names to avoid immediate repeats
const recentNames: string[] = [];

const CreateCharacterStep5: React.FC<CreateCharacterStep5Props> = ({
  watch,
  setValue,
  register,
  errors,
  containerRef,
  personalities,
  relationships,
  occupations,
  loading,
}) => {
  const [showPersonalityDialog, setShowPersonalityDialog] = useState(false);
  const [showRelationshipDialog, setShowRelationshipDialog] = useState(false);
  const [showOccupationDialog, setShowOccupationDialog] = useState(false);
  const [showVoiceDialog, setShowVoiceDialog] = useState(false);

  const name = watch("name") ?? "";
  const personalityId = watch("personalityId");
  const relationshipId = watch("relationshipId");
  const occupationId = watch("occupationId");
  const voice = watch("voice");
  const isPublic = watch("isPublic") ?? false;

  const generateRandomName = () => {
    const maxAttempts = 10;
    let attempts = 0;
    let newName = "";

    // Try to generate a name that wasn't recently used
    do {
      const firstName =
        FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
      const lastName =
        LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
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
    if (loading) return "Loading...";
    const option = personalities.find((o) => o.id === personalityId);
    return option?.label ?? "Select...";
  };

  const getRelationshipLabel = () => {
    if (loading) return "Loading...";
    const option = relationships.find((o) => o.id === relationshipId);
    return option?.label ?? "Select...";
  };

  const getOccupationLabel = () => {
    if (loading) return "Loading...";
    const option = occupations.find((o) => o.id === occupationId);
    return option
      ? `${option.emoji ?? ""} ${option.label}`.trim()
      : "Select...";
  };

  const getVoiceLabel = () => {
    const option = VOICE_OPTIONS.find((o) => o.value === voice);
    return option?.label ?? "Select...";
  };

  return (
    <div className="flex w-full max-w-3xl flex-col items-center">
      {/* Name Section */}
      <h2 className="text-foreground mb-6 text-2xl font-bold">Choose a name</h2>

      <div className="mb-8 w-full">
        <Field>
          <div className="relative">
            <input
              type="text"
              placeholder="Enter name..."
              {...register("name")}
              maxLength={20}
              className="bg-muted text-foreground placeholder:text-muted-foreground w-full rounded-xl border border-transparent px-5 py-4 text-lg focus:outline-none"
            />
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-5 -translate-y-1/2 cursor-pointer transition-colors"
              onClick={generateRandomName}
              title="Generate random name"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
          <div className="text-muted-foreground mt-2 text-right text-sm">
            {name.length}/20
          </div>
          {errors.name && (
            <p className="text-destructive text-base/6 sm:text-sm/6">
              {errors.name.message}
            </p>
          )}
        </Field>
      </div>

      {/* Personality Section */}
      <h2 className="text-foreground mb-2 text-2xl font-bold">
        Choose Personality
      </h2>
      <p className="text-muted-foreground mb-6 text-sm">Click to change</p>

      <div className="mb-8 w-full">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Personality Button */}
          <div>
            <button
              type="button"
              onClick={() => setShowPersonalityDialog(true)}
              disabled={loading}
              className="bg-muted hover:bg-muted/80 relative flex w-full items-center justify-between overflow-hidden rounded-xl p-4 transition-colors disabled:opacity-50"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--color-primary)_0%,_transparent_70%)] opacity-15" />
              <div className="relative text-left">
                <p className="text-muted-foreground text-xs uppercase">
                  Choose Personality
                </p>
                <p className="text-foreground truncate font-semibold">
                  {getPersonalityLabel()}
                </p>
              </div>
              <ChevronRight className="text-muted-foreground relative h-5 w-5" />
            </button>
            {errors.personalityId && (
              <p className="text-destructive mt-1 text-base/6 sm:text-sm/6">
                {errors.personalityId.message}
              </p>
            )}
          </div>

          {/* Relationship Button */}
          <div>
            <button
              type="button"
              onClick={() => setShowRelationshipDialog(true)}
              disabled={loading}
              className="bg-muted hover:bg-muted/80 relative flex w-full items-center justify-between overflow-hidden rounded-xl p-4 transition-colors disabled:opacity-50"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--color-primary)_0%,_transparent_70%)] opacity-15" />
              <div className="relative text-left">
                <p className="text-muted-foreground text-xs uppercase">
                  Choose Relationship
                </p>
                <p className="text-foreground truncate font-semibold">
                  {getRelationshipLabel()}
                </p>
              </div>
              <ChevronRight className="text-muted-foreground relative h-5 w-5" />
            </button>
            {errors.relationshipId && (
              <p className="text-destructive mt-1 text-base/6 sm:text-sm/6">
                {errors.relationshipId.message}
              </p>
            )}
          </div>

          {/* Occupation Button */}
          <div>
            <button
              type="button"
              onClick={() => setShowOccupationDialog(true)}
              disabled={loading}
              className="bg-muted hover:bg-muted/80 relative flex w-full items-center justify-between overflow-hidden rounded-xl p-4 transition-colors disabled:opacity-50"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--color-primary)_0%,_transparent_70%)] opacity-15" />
              <div className="relative text-left">
                <p className="text-muted-foreground text-xs uppercase">
                  Choose Occupation
                </p>
                <p className="text-foreground truncate font-semibold">
                  {getOccupationLabel()}
                </p>
              </div>
              <ChevronRight className="text-muted-foreground relative h-5 w-5" />
            </button>
            {errors.occupationId && (
              <p className="text-destructive mt-1 text-base/6 sm:text-sm/6">
                {errors.occupationId.message}
              </p>
            )}
          </div>

          {/* Voice Button */}
          <div>
            <button
              type="button"
              onClick={() => setShowVoiceDialog(true)}
              className="bg-primary/10 hover:bg-primary/15 relative flex w-full items-center justify-between overflow-hidden rounded-xl p-4 transition-colors"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--color-primary)_0%,_transparent_70%)] opacity-20" />
              <div className="relative text-left">
                <p className="text-muted-foreground text-xs uppercase">
                  Choose Voice
                </p>
                <p className="text-foreground truncate font-semibold">
                  {getVoiceLabel()}
                </p>
              </div>
              <ChevronRight className="text-muted-foreground relative h-5 w-5" />
            </button>
            {errors.voice && (
              <p className="text-destructive mt-1 text-base/6 sm:text-sm/6">
                {errors.voice.message}
              </p>
            )}
          </div>

          {/* Public/Private Toggle - spans full width */}
          <div className="bg-muted rounded-xl p-4 sm:col-span-2">
            <CheckboxField>
              <Checkbox
                checked={isPublic}
                onChange={(checked) =>
                  setValue("isPublic", checked, { shouldValidate: true })
                }
              />
              <Label className="text-foreground font-semibold">
                Make character public
              </Label>
              <Description>
                Public characters will be visible to all users in the discover
                section. Private characters are only visible to you.
              </Description>
            </CheckboxField>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <DialogCreateCharacterPersonality
        open={showPersonalityDialog}
        onClose={() => setShowPersonalityDialog(false)}
        value={personalityId}
        onChange={(value) =>
          setValue("personalityId", value, { shouldValidate: true })
        }
        options={personalities}
        containerRef={containerRef}
      />

      <DialogCreateCharacterRelationship
        open={showRelationshipDialog}
        onClose={() => setShowRelationshipDialog(false)}
        value={relationshipId}
        onChange={(value) =>
          setValue("relationshipId", value, { shouldValidate: true })
        }
        options={relationships}
        containerRef={containerRef}
      />

      <DialogCreateCharacterOccupation
        open={showOccupationDialog}
        onClose={() => setShowOccupationDialog(false)}
        value={occupationId}
        onChange={(value) =>
          setValue("occupationId", value, { shouldValidate: true })
        }
        options={occupations}
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
