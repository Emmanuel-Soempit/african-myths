/*
|--------------------------------------------------------------------------
| Prompt templates for the AI population pipeline.
| Bump PROMPT_VERSION whenever a prompt materially changes — it is stored on
| every generation_jobs row for auditing.
|--------------------------------------------------------------------------
*/

export const PROMPT_VERSION = '1.0.0'

const EXPERT_SYSTEM = `You are an expert ethnographer and historian specialising in African peoples.
You write accurate, well-sourced encyclopedic content. You never invent facts: when uncertain,
you say less rather than guess. You always respond with valid JSON matching the exact schema requested.`

export function groupListPrompt(countryName: string) {
  return {
    system: EXPERT_SYSTEM,
    user: `List the major ethnic groups of ${countryName} (Africa). Include the most significant groups by population and cultural importance, typically 5 to 25. Do not include tiny subgroups — only recognised top-level ethnic groups.

Respond with JSON matching exactly:
{
  "groups": [
    {
      "canonicalName": "the widely accepted English name",
      "alternateNames": ["other common names and spellings"],
      "primaryLanguageName": "the main language spoken by the group",
      "estimatedPopulation": "e.g. 'about 10 million'"
    }
  ]
}`,
  }
}

export function groupEnrichPrompt(options: {
  canonicalName: string
  countries: string[]
  existingAliases: string[]
}) {
  return {
    system: EXPERT_SYSTEM,
    user: `Write an encyclopedic profile of the ${options.canonicalName} ethnic group of Africa.
Known present-day countries: ${options.countries.join(', ') || 'unknown'}.
Already recorded alternate names: ${options.existingAliases.join(', ') || 'none'}.

Respond with JSON matching exactly:
{
  "description": "2-4 factual paragraphs on origin, location, language family, society and notable traditions. Plain text, no markdown.",
  "alternateNames": ["alternate names and spellings not already recorded"],
  "primaryLanguageName": "the main language spoken",
  "countries": [
    {
      "isoAlpha2": "2-letter ISO code of each country where the group is present",
      "populationEstimate": "e.g. 'about 2 million'",
      "isPrimaryHome": true
    }
  ],
  "subGroups": [
    {
      "canonicalName": "name of a major sub-group or clan confederation",
      "description": "one sentence",
      "countries": ["isoAlpha2 codes where present"]
    }
  ]
}

Rules:
- Only include well-attested countries and sub-groups.
- Leave arrays empty rather than guessing.
- Set isPrimaryHome=true only for the country (or countries) most associated with the group.`,
  }
}

export function culturePrompt(options: {
  canonicalName: string
  description: string
  countries: string[]
}) {
  return {
    system: EXPERT_SYSTEM,
    user: `Write a culture profile for the ${options.canonicalName} people of Africa.
Context: ${options.description}
Countries: ${options.countries.join(', ') || 'unknown'}.

Respond with JSON matching exactly:
{
  "name": "a short culture name, e.g. 'Yoruba'",
  "history": "3-5 paragraphs on origins, migration, historical states/kingdoms, and how the culture evolved, written for general readers. Format as minimal HTML using only <h3> and <p> tags.",
  "language": "the main language name as plain text"
}`,
  }
}
