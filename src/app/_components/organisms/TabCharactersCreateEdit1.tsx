"use client";

import React from "react";
import clsx from "clsx";
import { TabPanel } from "@headlessui/react";
import { useFormContext, Controller } from "react-hook-form";
import HeaderUserCharacter from "./HeaderUserCharacter";
import CardMediaUpload from "../molecules/CardMediaUpload";
import { Input } from "../atoms/input";
import { Textarea } from "../atoms/textarea";
import { Field, Label, ErrorMessage } from "../atoms/fieldset";
import { Listbox, ListboxOption, ListboxLabel } from "../atoms/listbox";

export type SelectOption = {
  value: string;
  label: string;
};

export type TabCharactersCreateEdit1Props = {
  className?: string;
  // Header props
  name: string;
  avatarSrc?: string | null;
  role?: string;
  joinedDate?: string;
  bannerSrc?: string;
  // Default media (for edit mode)
  defaultPosterImage?: string;
  defaultPosterVideo?: string;
  // Dropdown options (passed from parent)
  genderOptions: SelectOption[];
  styleOptions: SelectOption[];
  ethnicityOptions: SelectOption[];
  personalityOptions: SelectOption[];
  hairStyleOptions: SelectOption[];
  hairColorOptions: SelectOption[];
  eyeColorOptions: SelectOption[];
  bodyTypeOptions: SelectOption[];
  breastSizeOptions: SelectOption[];
  occupationOptions: SelectOption[];
  relationshipOptions: SelectOption[];
};

const TabCharactersCreateEdit1: React.FC<TabCharactersCreateEdit1Props> = ({
  className,
  // Header props
  name,
  avatarSrc,
  role,
  joinedDate,
  bannerSrc,
  // Default media
  defaultPosterImage,
  defaultPosterVideo,
  // Dropdown options
  genderOptions,
  styleOptions,
  ethnicityOptions,
  personalityOptions,
  hairStyleOptions,
  hairColorOptions,
  eyeColorOptions,
  bodyTypeOptions,
  breastSizeOptions,
  occupationOptions,
  relationshipOptions,
}) => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <TabPanel className={clsx("space-y-6", className)}>
      {/* Header - reuse HeaderUserCharacter */}
      <HeaderUserCharacter
        name={name}
        avatarSrc={avatarSrc}
        role={role}
        joinedDate={joinedDate}
        bannerSrc={bannerSrc}
      />

      {/* Media Upload Section */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="bg-card rounded-2xl p-6">
          <Controller
            name="posterImage"
            control={control}
            render={({ field, fieldState }) => (
              <CardMediaUpload
                label="Poster image"
                aspectRatio="3:4"
                accept={{
                  "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
                }}
                defaultMedia={defaultPosterImage}
                defaultMediaType="image"
                onChange={(file) => field.onChange(file)}
                error={fieldState.error?.message}
              />
            )}
          />
        </div>
        <div className="bg-card rounded-2xl p-6">
          <Controller
            name="posterVideo"
            control={control}
            render={({ field, fieldState }) => (
              <CardMediaUpload
                label="Poster video"
                aspectRatio="3:4"
                accept={{ "video/*": [".mp4", ".webm", ".mov"] }}
                defaultMedia={defaultPosterVideo}
                defaultMediaType="video"
                onChange={(file) => field.onChange(file)}
                error={fieldState.error?.message}
              />
            )}
          />
        </div>
      </div>

      {/* Profile Section */}
      <div className="bg-card rounded-2xl p-6">
        <h3 className="text-foreground mb-4 text-lg font-semibold">Profile</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field>
            <Label>First Name</Label>
            <Input
              type="text"
              placeholder="Enter first name"
              {...register("firstName")}
              data-invalid={errors.firstName ? true : undefined}
            />
            {errors.firstName && (
              <ErrorMessage>{errors.firstName.message as string}</ErrorMessage>
            )}
          </Field>

          <Field>
            <Label>Last Name</Label>
            <Input
              type="text"
              placeholder="Enter last name"
              {...register("lastName")}
              data-invalid={errors.lastName ? true : undefined}
            />
            {errors.lastName && (
              <ErrorMessage>{errors.lastName.message as string}</ErrorMessage>
            )}
          </Field>

          <Field>
            <Label>Age</Label>
            <Input
              type="number"
              placeholder="Enter age"
              {...register("age")}
              data-invalid={errors.age ? true : undefined}
            />
            {errors.age && (
              <ErrorMessage>{errors.age.message as string}</ErrorMessage>
            )}
          </Field>

          <Field>
            <Label>Gender</Label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Listbox
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="Select gender"
                >
                  {genderOptions.map((option) => (
                    <ListboxOption key={option.value} value={option.value}>
                      <ListboxLabel>{option.label}</ListboxLabel>
                    </ListboxOption>
                  ))}
                </Listbox>
              )}
            />
            {errors.gender && (
              <ErrorMessage>{errors.gender.message as string}</ErrorMessage>
            )}
          </Field>
        </div>

        <div className="mt-4">
          <Field>
            <Label>Description</Label>
            <Textarea
              placeholder="Enter description"
              rows={4}
              {...register("description")}
              data-invalid={errors.description ? true : undefined}
            />
            {errors.description && (
              <ErrorMessage>
                {errors.description.message as string}
              </ErrorMessage>
            )}
          </Field>
        </div>
      </div>

      {/* Attributes Section */}
      <div className="bg-card rounded-2xl p-6">
        <h3 className="text-foreground mb-4 text-lg font-semibold">
          Attributes
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Style */}
          <Field>
            <Label>Style</Label>
            <Controller
              name="style"
              control={control}
              render={({ field }) => (
                <Listbox
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="Select style"
                >
                  {styleOptions.map((option) => (
                    <ListboxOption key={option.value} value={option.value}>
                      <ListboxLabel>{option.label}</ListboxLabel>
                    </ListboxOption>
                  ))}
                </Listbox>
              )}
            />
            {errors.style && (
              <ErrorMessage>{errors.style.message as string}</ErrorMessage>
            )}
          </Field>

          {/* Ethnicity */}
          <Field>
            <Label>Ethnicity</Label>
            <Controller
              name="ethnicity"
              control={control}
              render={({ field }) => (
                <Listbox
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="Select ethnicity"
                >
                  {ethnicityOptions.map((option) => (
                    <ListboxOption key={option.value} value={option.value}>
                      <ListboxLabel>{option.label}</ListboxLabel>
                    </ListboxOption>
                  ))}
                </Listbox>
              )}
            />
            {errors.ethnicity && (
              <ErrorMessage>{errors.ethnicity.message as string}</ErrorMessage>
            )}
          </Field>

          {/* Personality */}
          <Field>
            <Label>Personality</Label>
            <Controller
              name="personality"
              control={control}
              render={({ field }) => (
                <Listbox
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="Select personality"
                >
                  {personalityOptions.map((option) => (
                    <ListboxOption key={option.value} value={option.value}>
                      <ListboxLabel>{option.label}</ListboxLabel>
                    </ListboxOption>
                  ))}
                </Listbox>
              )}
            />
            {errors.personality && (
              <ErrorMessage>
                {errors.personality.message as string}
              </ErrorMessage>
            )}
          </Field>

          {/* Hair Style */}
          <Field>
            <Label>Hair style</Label>
            <Controller
              name="hairStyle"
              control={control}
              render={({ field }) => (
                <Listbox
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="Select hair style"
                >
                  {hairStyleOptions.map((option) => (
                    <ListboxOption key={option.value} value={option.value}>
                      <ListboxLabel>{option.label}</ListboxLabel>
                    </ListboxOption>
                  ))}
                </Listbox>
              )}
            />
            {errors.hairStyle && (
              <ErrorMessage>{errors.hairStyle.message as string}</ErrorMessage>
            )}
          </Field>

          {/* Hair Color */}
          <Field>
            <Label>Hair color</Label>
            <Controller
              name="hairColor"
              control={control}
              render={({ field }) => (
                <Listbox
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="Select hair color"
                >
                  {hairColorOptions.map((option) => (
                    <ListboxOption key={option.value} value={option.value}>
                      <ListboxLabel>{option.label}</ListboxLabel>
                    </ListboxOption>
                  ))}
                </Listbox>
              )}
            />
            {errors.hairColor && (
              <ErrorMessage>{errors.hairColor.message as string}</ErrorMessage>
            )}
          </Field>

          {/* Eye Color */}
          <Field>
            <Label>Eye color</Label>
            <Controller
              name="eyeColor"
              control={control}
              render={({ field }) => (
                <Listbox
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="Select eye color"
                >
                  {eyeColorOptions.map((option) => (
                    <ListboxOption key={option.value} value={option.value}>
                      <ListboxLabel>{option.label}</ListboxLabel>
                    </ListboxOption>
                  ))}
                </Listbox>
              )}
            />
            {errors.eyeColor && (
              <ErrorMessage>{errors.eyeColor.message as string}</ErrorMessage>
            )}
          </Field>

          {/* Body Type */}
          <Field>
            <Label>Body type</Label>
            <Controller
              name="bodyType"
              control={control}
              render={({ field }) => (
                <Listbox
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="Select body type"
                >
                  {bodyTypeOptions.map((option) => (
                    <ListboxOption key={option.value} value={option.value}>
                      <ListboxLabel>{option.label}</ListboxLabel>
                    </ListboxOption>
                  ))}
                </Listbox>
              )}
            />
            {errors.bodyType && (
              <ErrorMessage>{errors.bodyType.message as string}</ErrorMessage>
            )}
          </Field>

          {/* Breast Size */}
          <Field>
            <Label>Breast size</Label>
            <Controller
              name="breastSize"
              control={control}
              render={({ field }) => (
                <Listbox
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="Select breast size"
                >
                  {breastSizeOptions.map((option) => (
                    <ListboxOption key={option.value} value={option.value}>
                      <ListboxLabel>{option.label}</ListboxLabel>
                    </ListboxOption>
                  ))}
                </Listbox>
              )}
            />
            {errors.breastSize && (
              <ErrorMessage>{errors.breastSize.message as string}</ErrorMessage>
            )}
          </Field>

          {/* Occupation */}
          <Field>
            <Label>Occupation</Label>
            <Controller
              name="occupation"
              control={control}
              render={({ field }) => (
                <Listbox
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="Select occupation"
                >
                  {occupationOptions.map((option) => (
                    <ListboxOption key={option.value} value={option.value}>
                      <ListboxLabel>{option.label}</ListboxLabel>
                    </ListboxOption>
                  ))}
                </Listbox>
              )}
            />
            {errors.occupation && (
              <ErrorMessage>{errors.occupation.message as string}</ErrorMessage>
            )}
          </Field>

          {/* Relationship */}
          <Field>
            <Label>Relationship</Label>
            <Controller
              name="relationship"
              control={control}
              render={({ field }) => (
                <Listbox
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="Select relationship"
                >
                  {relationshipOptions.map((option) => (
                    <ListboxOption key={option.value} value={option.value}>
                      <ListboxLabel>{option.label}</ListboxLabel>
                    </ListboxOption>
                  ))}
                </Listbox>
              )}
            />
            {errors.relationship && (
              <ErrorMessage>
                {errors.relationship.message as string}
              </ErrorMessage>
            )}
          </Field>
        </div>
      </div>
    </TabPanel>
  );
};

export default TabCharactersCreateEdit1;
