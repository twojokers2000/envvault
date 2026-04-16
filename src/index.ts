export type EnvType = "string" | "number" | "boolean" | "url" | "email" | "port";

export interface EnvField<T = unknown> {
  type: EnvType;
  required?: boolean;
  default?: T;
  description?: string;
  choices?: T[];
}

export type EnvSchema = Record<string, EnvField>;

export type InferEnvType<T extends EnvType> = T extends "number" | "port"
  ? number
  : T extends "boolean"
  ? boolean
  : string;

export type InferSchema<S extends EnvSchema> = {
  [K in keyof S]: S[K]["default"] extends NonNullable<S[K]["default"]>
    ? InferEnvType<S[K]["type"]>
    : S[K]["required"] extends false
    ? InferEnvType<S[K]["type"]> | undefined
    : InferEnvType<S[K]["type"]>;
};

export class EnvValidationError extends Error {
  public readonly errors: string[];
  constructor(errors: string[]) {
    super(`Environment validation failed:\n${errors.map((e) => `  ✖ ${e}`).join("\n")}`);
    this.name = "EnvValidationError";
    this.errors = errors;
  }
}

function validateEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validateUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function validatePort(value: string): boolean {
  const num = Number(value);
  return Number.isInteger(num) && num >= 1 && num <= 65535;
}

function coerce<T extends EnvType>(value: string, type: T): InferEnvType<T> {
  switch (type) {
    case "number":
      return Number(value) as InferEnvType<T>;
    case "port":
      return Number(value) as InferEnvType<T>;
    case "boolean":
      return (value.toLowerCase() === "true" || value === "1") as InferEnvType<T>;
    default:
      return value as InferEnvType<T>;
  }
}

export function createEnv<S extends EnvSchema>(
  schema: S,
  source: Record<string, string | undefined> = process.env
): InferSchema<S> {
  const errors: string[] = [];
  const result: Record<string, unknown> = {};

  for (const [key, field] of Object.entries(schema)) {
    const rawValue = source[key];
    const isRequired = field.required !== false;

    // Missing value handling
    if (rawValue === undefined || rawValue === "") {
      if (field.default !== undefined) {
        result[key] = field.default;
        continue;
      }
      if (isRequired) {
        errors.push(
          `Missing required variable "${key}"${field.description ? ` (${field.description})` : ""}`
        );
        continue;
      }
      result[key] = undefined;
      continue;
    }

    // Type-specific validation
    switch (field.type) {
      case "number":
        if (isNaN(Number(rawValue))) {
          errors.push(`"${key}" must be a valid number, got "${rawValue}"`);
          continue;
        }
        break;
      case "port":
        if (!validatePort(rawValue)) {
          errors.push(`"${key}" must be a valid port (1–65535), got "${rawValue}"`);
          continue;
        }
        break;
      case "boolean":
        if (!["true", "false", "1", "0"].includes(rawValue.toLowerCase())) {
          errors.push(`"${key}" must be true/false/1/0, got "${rawValue}"`);
          continue;
        }
        break;
      case "email":
        if (!validateEmail(rawValue)) {
          errors.push(`"${key}" must be a valid email, got "${rawValue}"`);
          continue;
        }
        break;
      case "url":
        if (!validateUrl(rawValue)) {
          errors.push(`"${key}" must be a valid URL, got "${rawValue}"`);
          continue;
        }
        break;
    }

    // Choices validation
    const coerced = coerce(rawValue, field.type);
    if (field.choices && !field.choices.includes(coerced)) {
      errors.push(
        `"${key}" must be one of [${field.choices.join(", ")}], got "${rawValue}"`
      );
      continue;
    }

    result[key] = coerced;
  }

  if (errors.length > 0) {
    throw new EnvValidationError(errors);
  }

  return result as InferSchema<S>;
}
