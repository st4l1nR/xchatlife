import {
  PrismaClient,
  CharacterGender,
  CharacterStyle,
  Ethnicity,
  HairStyle,
  HairColor,
  EyeColor,
  BodyType,
  BreastSize,
  Personality,
  Relationship,
  Occupation,
  Kink,
  MediaType,
} from "../generated/prisma";
import { uploadToR2 } from "../src/lib/r2";
import * as path from "path";
import * as crypto from "crypto";

// Password hashing function compatible with Better Auth (uses scrypt)
async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex");
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(`${salt}:${derivedKey.toString("hex")}`);
    });
  });
}

const prisma = new PrismaClient();

// Target user email
const TARGET_USER_EMAIL = "stalinramosbw@gmail.com";

// Total characters to create
const TOTAL_CHARACTERS = 21;
const LIVE_CHARACTERS = 5;

// Helper to get random item from array
function getRandomItem<T>(array: T[]): T {
  const index = Math.floor(Math.random() * array.length);
  const item = array[index];
  if (item === undefined) {
    throw new Error("Array is empty or index out of bounds");
  }
  return item;
}

// Helper to get random items from array (for kinks)
function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Convert enum object to array of values
function enumValues<T extends object>(enumObj: T): T[keyof T][] {
  return Object.values(enumObj) as T[keyof T][];
}

// Character name generator
const firstNames = [
  "Luna",
  "Aria",
  "Mia",
  "Sophia",
  "Emma",
  "Olivia",
  "Ava",
  "Isabella",
  "Chloe",
  "Lily",
  "Zoe",
  "Emily",
  "Scarlett",
  "Madison",
  "Layla",
  "Victoria",
  "Penelope",
  "Riley",
  "Nora",
  "Stella",
  "Hazel",
];

function generateCharacterName(): string {
  return getRandomItem(firstNames);
}

// Voice options
const voiceOptions = [
  "soft",
  "sultry",
  "playful",
  "confident",
  "shy",
  "cheerful",
  "mysterious",
];

async function main() {
  console.log("Starting character seed script...");

  // Step 1: Find or create target user
  console.log(`Looking for user with email: ${TARGET_USER_EMAIL}`);
  let user = await prisma.user.findUnique({
    where: { email: TARGET_USER_EMAIL },
  });

  if (!user) {
    console.log(`User not found. Creating new user...`);
    const userId = crypto.randomUUID();
    const password = "12345690";
    const hashedPassword = await hashPassword(password);

    user = await prisma.user.create({
      data: {
        id: userId,
        name: "Seed User",
        email: TARGET_USER_EMAIL,
        emailVerified: true,
      },
    });

    // Create credential account with password
    await prisma.account.create({
      data: {
        id: crypto.randomUUID(),
        accountId: userId,
        providerId: "credential",
        userId: userId,
        password: hashedPassword,
        updatedAt: new Date(),
      },
    });

    console.log(
      `Created user: ${user.name} (${user.id}) with password: ${password}`,
    );
  } else {
    console.log(`Found existing user: ${user.name} (${user.id})`);
  }

  // Step 2: Upload media files to R2
  console.log("Uploading media files to R2...");

  const projectRoot = process.cwd();
  const posterPath = path.join(
    projectRoot,
    "public",
    "images",
    "girl-poster.webp",
  );
  const videoPath = path.join(
    projectRoot,
    "public",
    "videos",
    "girl-video.mp4",
  );

  // Generate unique keys with timestamps to avoid collisions
  const timestamp = Date.now();
  const posterKey = `seed/characters/poster-${timestamp}.webp`;
  const videoKey = `seed/characters/video-${timestamp}.mp4`;

  console.log("Uploading poster image...");
  const posterUpload = await uploadToR2(posterPath, posterKey);
  console.log(`Poster uploaded: ${posterUpload.url}`);

  console.log("Uploading video...");
  const videoUpload = await uploadToR2(videoPath, videoKey);
  console.log(`Video uploaded: ${videoUpload.url}`);

  // Step 3: Create Media records in database
  console.log("Creating Media records in database...");

  const posterMedia = await prisma.media.create({
    data: {
      type: MediaType.image,
      key: posterUpload.key,
      url: posterUpload.url,
      mimeType: posterUpload.mimeType,
      size: posterUpload.size,
    },
  });
  console.log(`Poster Media created: ${posterMedia.id}`);

  const videoMedia = await prisma.media.create({
    data: {
      type: MediaType.video,
      key: videoUpload.key,
      url: videoUpload.url,
      mimeType: videoUpload.mimeType,
      size: videoUpload.size,
    },
  });
  console.log(`Video Media created: ${videoMedia.id}`);

  // Step 4: Generate and create characters
  console.log(`Creating ${TOTAL_CHARACTERS} characters...`);

  const genderValues = enumValues(CharacterGender);
  const styleValues = enumValues(CharacterStyle);
  const ethnicityValues = enumValues(Ethnicity);
  const hairStyleValues = enumValues(HairStyle);
  const hairColorValues = enumValues(HairColor);
  const eyeColorValues = enumValues(EyeColor);
  const bodyTypeValues = enumValues(BodyType);
  const breastSizeValues = enumValues(BreastSize);
  const personalityValues = enumValues(Personality);
  const relationshipValues = enumValues(Relationship);
  const occupationValues = enumValues(Occupation);
  const kinkValues = enumValues(Kink);

  const characters = [];

  for (let i = 0; i < TOTAL_CHARACTERS; i++) {
    const isLive = i < LIVE_CHARACTERS;
    const name = generateCharacterName();

    // Generate random age between 18 and 35
    const age = Math.floor(Math.random() * (35 - 18 + 1)) + 18;

    // Generate random kinks (2-5 kinks per character)
    const numKinks = Math.floor(Math.random() * 4) + 2;
    const selectedKinks = getRandomItems(kinkValues, numKinks);

    const characterData = {
      name,
      posterId: posterMedia.id,
      videoId: videoMedia.id,
      gender: getRandomItem(genderValues),
      style: getRandomItem(styleValues),
      ethnicity: getRandomItem(ethnicityValues),
      age,
      hairStyle: getRandomItem(hairStyleValues),
      hairColor: getRandomItem(hairColorValues),
      eyeColor: getRandomItem(eyeColorValues),
      bodyType: getRandomItem(bodyTypeValues),
      breastSize: getRandomItem(breastSizeValues),
      personality: getRandomItem(personalityValues),
      relationship: getRandomItem(relationshipValues),
      occupation: getRandomItem(occupationValues),
      voice: getRandomItem(voiceOptions),
      isPublic: true,
      isActive: true,
      isLive,
      createdById: user.id,
      kinks: {
        create: selectedKinks.map((kink) => ({ kink })),
      },
    };

    const character = await prisma.character.create({
      data: characterData,
      include: { kinks: true },
    });

    characters.push(character);
    console.log(
      `Created character ${i + 1}/${TOTAL_CHARACTERS}: ${character.name} (isLive: ${character.isLive})`,
    );
  }

  // Step 5: Create Stories for each character
  console.log("Creating stories for characters...");
  let totalStories = 0;

  for (const character of characters) {
    const numStories = Math.floor(Math.random() * 3) + 1; // 1-3 stories
    for (let j = 0; j < numStories; j++) {
      await prisma.story.create({
        data: {
          characterId: character.id,
          mediaId: posterMedia.id,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
          isActive: true,
        },
      });
      totalStories++;
    }
  }
  console.log(`Created ${totalStories} stories`);

  // Step 6: Create Reels for each character
  console.log("Creating reels for characters...");
  let totalReels = 0;

  const reelTitles = [
    "Watch me dance",
    "Good morning",
    "Feeling cute",
    "Behind the scenes",
    "Just vibing",
    "New look",
    "Day in my life",
  ];

  const reelDescriptions = [
    "Hope you enjoy!",
    "Let me know what you think",
    "More coming soon...",
    "Just for you",
    "Had so much fun making this",
  ];

  for (const character of characters) {
    const numReels = Math.floor(Math.random() * 2) + 1; // 1-2 reels
    for (let j = 0; j < numReels; j++) {
      await prisma.reel.create({
        data: {
          characterId: character.id,
          videoId: videoMedia.id,
          thumbnailId: posterMedia.id,
          title: getRandomItem(reelTitles),
          description: getRandomItem(reelDescriptions),
          viewCount: Math.floor(Math.random() * 9900) + 100, // 100-10000
          isActive: true,
        },
      });
      totalReels++;
    }
  }
  console.log(`Created ${totalReels} reels`);

  // Summary
  console.log("\n=== Seed Summary ===");
  console.log(`Total characters created: ${characters.length}`);
  console.log(`Live characters: ${characters.filter((c) => c.isLive).length}`);
  console.log(
    `Not live characters: ${characters.filter((c) => !c.isLive).length}`,
  );
  console.log(`Total stories created: ${totalStories}`);
  console.log(`Total reels created: ${totalReels}`);
  console.log(`Poster Media ID: ${posterMedia.id}`);
  console.log(`Video Media ID: ${videoMedia.id}`);
  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
