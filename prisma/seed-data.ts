import slugify from "slugify";
import { Prisma } from "@/generated/prisma/client";

export const formData: Prisma.FormCreateInput[] = [
  {
    name: "Capsules",
  },
  {
    name: "Chewable",
  },
  {
    name: "Coffe Beans",
  },
  {
    name: "Coffe Pods",
  },
  {
    name: "Cream",
  },
  {
    name: "Drops",
  },
  {
    name: "Ground Coffe",
  },
  {
    name: "Gummies",
  },
  {
    name: "Instant Coffe",
  },
  {
    name: "Liquid",
  },
  {
    name: "Oil",
  },
  {
    name: "Pastilles",
  },
  {
    name: "Pills",
  },
  {
    name: "Powders",
  },
  {
    name: "Scrub",
  },
  {
    name: "Serum",
  },
  {
    name: "Soap Bar",
  },
  {
    name: "Softgels",
  },
  {
    name: "Strips",
  },
  {
    name: "Wipes",
  },
];

export const effectData: Prisma.EffectCreateInput[] = [
  {
    name: "Beauty & Personal care",
    slug: slugify("Beauty & Personal care", { lower: true }),
    children: {
      create: [
        { name: "Anti-Aging", slug: slugify("Anti-Aging", { lower: true }) },
        {
          name: "Brightening & Even Skin Tone",
          slug: slugify("Brightening & Even Skin Tone", { lower: true }),
        },
        { name: "Cleansing", slug: slugify("Cleansing", { lower: true }) },
        {
          name: "Exfoliation & Renewal",
          slug: slugify("Exfoliation & Renewal", { lower: true }),
        },
        {
          name: "Frizz Control & Smoothing",
          slug: slugify("Frizz Control & Smoothing", { lower: true }),
        },
        {
          name: "Scalp Health",
          slug: slugify("Scalp Health", { lower: true }),
        },
        {
          name: "Hydration & Moisturizing",
          slug: slugify("Hydration & Moisturizing", { lower: true }),
        },
        {
          name: "Soothing & Calming",
          slug: slugify("Soothing & Calming", { lower: true }),
        },
        {
          name: "Volume & Thickness",
          slug: slugify("Volume & Thickness", { lower: true }),
        },
      ],
    },
  },
  {
    name: "Core health & Vitality",
    slug: slugify("Core health & Vitality", { lower: true }),
    children: {
      create: [
        { name: "Antioxidant", slug: slugify("Antioxidant", { lower: true }) },
        {
          name: "Athletic Performance",
          slug: slugify("Athletic Performance", { lower: true }),
        },
        {
          name: "Blood Flow & Circulation",
          slug: slugify("Blood Flow & Circulation", { lower: true }),
        },
        {
          name: "Cardiovascular Health",
          slug: slugify("Cardiovascular Health", { lower: true }),
        },
        {
          name: "Cholesterol Support",
          slug: slugify("Cholesterol Support", { lower: true }),
        },
        {
          name: "Digestive Health",
          slug: slugify("Digestive Health", { lower: true }),
        },
        {
          name: "Energy & Stamina",
          slug: slugify("Energy & Stamina", { lower: true }),
        },
        {
          name: "Eyesight & Hearing",
          slug: slugify("Eyesight & Hearing", { lower: true }),
        },
        {
          name: "Fertility & Libido",
          slug: slugify("Fertility & Libido", { lower: true }),
        },
        {
          name: "Hair, Skin & Nail Health",
          slug: slugify("Hair, Skin & Nail Health", { lower: true }),
        },
        {
          name: "Immune Support",
          slug: slugify("Immune Support", { lower: true }),
        },
        {
          name: "Joint & Bone Health",
          slug: slugify("Joint & Bone Health", { lower: true }),
        },
        {
          name: "Liver Health",
          slug: slugify("Liver Health", { lower: true }),
        },
        {
          name: "Metabolic Health & Weight Support",
          slug: slugify("Metabolic Health & Weight Support", { lower: true }),
        },
        {
          name: "Oral & Dental Health",
          slug: slugify("Oral & Dental Health", { lower: true }),
        },
        {
          name: "Respiratory Health",
          slug: slugify("Respiratory Health", { lower: true }),
        },
        {
          name: "Strength & Muscle Recovery",
          slug: slugify("Strength & Muscle Recovery", { lower: true }),
        },
      ],
    },
  },
  {
    name: "Cognitive & Emotional wellness",
    slug: slugify("Cognitive & Emotional wellness", { lower: true }),
    children: {
      create: [
        {
          name: "Memory, Focus & Cognitive Support",
          slug: slugify("Memory, Focus & Cognitive Support", { lower: true }),
        },
        {
          name: "Mood & Relaxation",
          slug: slugify("Mood & Relaxation", { lower: true }),
        },
        {
          name: "Sleep & Rest",
          slug: slugify("Sleep & Rest", { lower: true }),
        },
      ],
    },
  },
];

export const ingredientData: Prisma.IngredientCreateInput[] = [
  {
    name: "Dietary Restrictions",
    slug: slugify("Dietary Restrictions", { lower: true }),
    children: {
      create: [
        {
          name: "Allergen-Free",
          slug: slugify("Allergen-Free", { lower: true }),
        },
        { name: "Corn-Free", slug: slugify("Corn-Free", { lower: true }) },
        { name: "Gluten-Free", slug: slugify("Gluten-Free", { lower: true }) },
        {
          name: "Hormone-Free",
          slug: slugify("Hormone-Free", { lower: true }),
        },
        {
          name: "Lactose-Free",
          slug: slugify("Lactose-Free", { lower: true }),
        },
      ],
    },
  },
  {
    name: "Formulation Features",
    slug: slugify("Formulation Features", { lower: true }),
    children: {
      create: [
        {
          name: "Alcohol-Free",
          slug: slugify("Alcohol-Free", { lower: true }),
        },
        {
          name: "Fragrance-Free",
          slug: slugify("Fragrance-Free", { lower: true }),
        },
        {
          name: "Mineral Oil-Free",
          slug: slugify("Mineral Oil-Free", { lower: true }),
        },
        { name: "No Fillers", slug: slugify("No Fillers", { lower: true }) },
        {
          name: "Paraben-Free",
          slug: slugify("Paraben-Free", { lower: true }),
        },
        {
          name: "Phthalate-Free",
          slug: slugify("Phthalate-Free", { lower: true }),
        },
        {
          name: "Silicone-Free",
          slug: slugify("Silicone-Free", { lower: true }),
        },
        {
          name: "Sulfate-Free",
          slug: slugify("Sulfate-Free", { lower: true }),
        },
      ],
    },
  },
  {
    name: "Lifestyle Choices",
    slug: slugify("Lifestyle Choices", { lower: true }),
    children: {
      create: [
        { name: "All-Natural", slug: slugify("All-Natural", { lower: true }) },
        { name: "Kosher", slug: slugify("Kosher", { lower: true }) },
        {
          name: "Antibiotic-Free",
          slug: slugify("Antibiotic-Free", { lower: true }),
        },
        {
          name: "Cruelty-Free",
          slug: slugify("Cruelty-Free", { lower: true }),
        },
        { name: "Halal", slug: slugify("Halal", { lower: true }) },
        { name: "Non-GMO", slug: slugify("Non-GMO", { lower: true }) },
        { name: "Vegan", slug: slugify("Vegan", { lower: true }) },
        { name: "Vegetarian", slug: slugify("Vegetarian", { lower: true }) },
      ],
    },
  },
];

export const audienceData: Prisma.AudienceCreateInput[] = [
  {
    name: "Adults",
  },
  {
    name: "Men",
  },
  {
    name: "Women",
  },
];
