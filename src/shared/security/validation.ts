import { UpdatePageInput } from "@/src/domain/notepad/notepad.types";
import { UpdateUserInput } from "@/src/domain/user/user.types";

const MAX_USERNAME_LENGTH = 50;
const MAX_TITLE_LENGTH = 100;
const MAX_CONTENT_LENGTH = 20_000;
const MAX_AUTHOR_NAME_LENGTH = 100;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type UserFieldUpdate = {
  field: keyof UpdateUserInput;
  value: string;
};

export type UserSyncPayload = {
  sub: string;
  email: string;
  username?: string;
};

export function validateUserFieldUpdate(payload: unknown): UserFieldUpdate | null {
  if (!isObject(payload)) {
    return null;
  }

  const field = payload.field;
  const value = payload.value;

  if (field !== "username" && field !== "age") {
    return null;
  }

  if (typeof value !== "string") {
    return null;
  }

  if (field === "username") {
    const username = value.trim();
    if (!username || username.length > MAX_USERNAME_LENGTH) {
      return null;
    }

    return { field, value: username };
  }

  const age = Number.parseInt(value, 10);
  if (!Number.isInteger(age) || age < 0 || age > 130) {
    return null;
  }

  return { field, value: String(age) };
}

export function parsePageNumber(raw: string): number | null {
  const pageNumber = Number.parseInt(raw, 10);
  if (!Number.isInteger(pageNumber) || pageNumber < 1 || pageNumber > 50) {
    return null;
  }

  return pageNumber;
}

export function validatePageUpdatePayload(payload: unknown): UpdatePageInput | null {
  if (!isObject(payload)) {
    return null;
  }

  const title = payload.title;
  const content = payload.content;

  const parsed: UpdatePageInput = {};

  if (title !== undefined) {
    if (typeof title !== "string") {
      return null;
    }

    const normalizedTitle = title.trim();
    if (!normalizedTitle || normalizedTitle.length > MAX_TITLE_LENGTH) {
      return null;
    }

    parsed.title = normalizedTitle;
  }

  if (content !== undefined) {
    if (typeof content !== "string") {
      return null;
    }

    if (content.length > MAX_CONTENT_LENGTH) {
      return null;
    }

    parsed.content = content;
  }

  if (parsed.title === undefined && parsed.content === undefined) {
    return null;
  }

  return parsed;
}

export function validateUserSyncPayload(payload: unknown): UserSyncPayload | null {
  if (!isObject(payload)) {
    return null;
  }

  const sub = payload.sub;
  const email = payload.email;
  const username = payload.username;

  if (typeof sub !== "string" || sub.trim().length === 0 || sub.length > 255) {
    return null;
  }

  if (typeof email !== "string" || !EMAIL_PATTERN.test(email) || email.length > 255) {
    return null;
  }

  if (username !== undefined) {
    if (typeof username !== "string") {
      return null;
    }

    if (username.length > MAX_USERNAME_LENGTH) {
      return null;
    }
  }

  return {
    sub: sub.trim(),
    email: email.trim().toLowerCase(),
    username: normalizeOptionalUsername(username),
  };
}

export function validateAuthorName(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim();
  if (!normalized || normalized.length > MAX_AUTHOR_NAME_LENGTH) {
    return null;
  }

  return normalized;
}

function normalizeOptionalUsername(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = value.trim();
  if (!normalized) {
    return undefined;
  }

  return normalized.slice(0, MAX_USERNAME_LENGTH);
}

function isObject(value: unknown): value is Record<string, any> {
  return typeof value === "object" && value !== null;
}
