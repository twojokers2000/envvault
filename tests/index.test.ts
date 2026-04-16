import { describe, it, expect } from "vitest";
import { createEnv, EnvValidationError } from "../src/index";

describe("createEnv", () => {
  it("parses valid string variables", () => {
    const env = createEnv(
      { APP_NAME: { type: "string" } },
      { APP_NAME: "my-app" }
    );
    expect(env.APP_NAME).toBe("my-app");
  });

  it("coerces numbers", () => {
    const env = createEnv(
      { TIMEOUT: { type: "number" } },
      { TIMEOUT: "3000" }
    );
    expect(env.TIMEOUT).toBe(3000);
    expect(typeof env.TIMEOUT).toBe("number");
  });

  it("coerces booleans (true/false)", () => {
    const env = createEnv(
      { DEBUG: { type: "boolean" } },
      { DEBUG: "true" }
    );
    expect(env.DEBUG).toBe(true);
  });

  it("coerces booleans (1/0)", () => {
    const env = createEnv(
      { DEBUG: { type: "boolean" } },
      { DEBUG: "0" }
    );
    expect(env.DEBUG).toBe(false);
  });

  it("validates email", () => {
    const env = createEnv(
      { EMAIL: { type: "email" } },
      { EMAIL: "user@example.com" }
    );
    expect(env.EMAIL).toBe("user@example.com");
  });

  it("validates URL", () => {
    const env = createEnv(
      { API_URL: { type: "url" } },
      { API_URL: "https://api.example.com" }
    );
    expect(env.API_URL).toBe("https://api.example.com");
  });

  it("validates port range", () => {
    const env = createEnv(
      { PORT: { type: "port" } },
      { PORT: "3000" }
    );
    expect(env.PORT).toBe(3000);
  });

  it("uses default value when variable is missing", () => {
    const env = createEnv(
      { NODE_ENV: { type: "string", default: "development" } },
      {}
    );
    expect(env.NODE_ENV).toBe("development");
  });

  it("throws for missing required variable", () => {
    expect(() =>
      createEnv({ SECRET: { type: "string" } }, {})
    ).toThrow(EnvValidationError);
  });

  it("throws for invalid email", () => {
    expect(() =>
      createEnv({ EMAIL: { type: "email" } }, { EMAIL: "not-an-email" })
    ).toThrow(EnvValidationError);
  });

  it("throws for invalid URL", () => {
    expect(() =>
      createEnv({ URL: { type: "url" } }, { URL: "not-a-url" })
    ).toThrow(EnvValidationError);
  });

  it("throws for out-of-range port", () => {
    expect(() =>
      createEnv({ PORT: { type: "port" } }, { PORT: "99999" })
    ).toThrow(EnvValidationError);
  });

  it("validates choices", () => {
    const env = createEnv(
      { ENV: { type: "string", choices: ["development", "production"] } },
      { ENV: "production" }
    );
    expect(env.ENV).toBe("production");
  });

  it("throws for invalid choice", () => {
    expect(() =>
      createEnv(
        { ENV: { type: "string", choices: ["development", "production"] } },
        { ENV: "staging" }
      )
    ).toThrow(EnvValidationError);
  });

  it("collects multiple errors at once", () => {
    try {
      createEnv(
        {
          A: { type: "string" },
          B: { type: "number" },
        },
        {}
      );
    } catch (e) {
      expect(e).toBeInstanceOf(EnvValidationError);
      expect((e as EnvValidationError).errors).toHaveLength(2);
    }
  });

  it("allows optional variables", () => {
    const env = createEnv(
      { OPTIONAL: { type: "string", required: false } },
      {}
    );
    expect(env.OPTIONAL).toBeUndefined();
  });
});
