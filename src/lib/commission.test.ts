import { describe, expect, it } from "vitest";
import { commissionSchema } from "./commission";

describe("commissionSchema", () => {
  it("accepts a valid commission payload", () => {
    const result = commissionSchema.safeParse({
      fullName: "Test User",
      email: "test@example.com",
      brandName: "Orbit Test Studio",
      projectType: "Creative studio website",
      budget: "NGN 600k - 1.2m",
      timeline: "3-4 weeks",
      goals: "We need a premium portfolio that helps us pitch better clients and makes our service offer clearer.",
      references: "https://example.com/reference",
    });

    expect(result.success).toBe(true);
  });

  it("accepts a concise project goal", () => {
    const result = commissionSchema.safeParse({
      fullName: "Test User",
      email: "test@example.com",
      brandName: "Orbit Test Studio",
      projectType: "Creative studio website",
      budget: "NGN 600k - 1.2m",
      timeline: "3-4 weeks",
      goals: "Landing page redesign",
      references: "",
    });

    expect(result.success).toBe(true);
  });
});
