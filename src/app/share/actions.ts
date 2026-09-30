"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { addCode } from "@/lib/codes";
import { CATEGORIES, type Category } from "@/lib/types";

export type ShareState = {
  error?: string;
  values?: Record<string, string>;
};

const MAX_LENGTH = 200;

export async function shareCode(
  _prev: ShareState,
  formData: FormData,
): Promise<ShareState> {
  const values = Object.fromEntries(
    [
      "platform",
      "title",
      "code",
      "reward",
      "category",
      "howToRedeem",
      "expiresAt",
      "sharedBy",
    ].map((key) => [key, String(formData.get(key) ?? "").trim()]),
  );

  const required = ["platform", "title", "code", "reward"] as const;
  const missing = required.filter((key) => !values[key]);
  if (missing.length > 0) {
    return { error: `Please fill in: ${missing.join(", ")}.`, values };
  }
  if (Object.values(values).some((v) => v.length > MAX_LENGTH)) {
    return { error: `Fields must be ${MAX_LENGTH} characters or fewer.`, values };
  }
  const category = CATEGORIES.find((c) => c === values.category);
  if (!category) {
    return { error: "Please pick a valid category.", values };
  }
  if (
    values.expiresAt &&
    (!/^\d{4}-\d{2}-\d{2}$/.test(values.expiresAt) ||
      Number.isNaN(Date.parse(values.expiresAt)))
  ) {
    return { error: "Expiry date is not a valid date.", values };
  }

  const created = await addCode({
    platform: values.platform,
    title: values.title,
    code: values.code,
    reward: values.reward,
    category: category satisfies Category,
    howToRedeem: values.howToRedeem || undefined,
    expiresAt: values.expiresAt || undefined,
    sharedBy: values.sharedBy || "anonymous",
  });

  revalidatePath("/");
  redirect(`/codes/${created.id}`);
}
