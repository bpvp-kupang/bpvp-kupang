export const READ_RULES: Record<string, string[]> = {
  programs: ["SUPER_ADMIN", "ADMIN", "OPERATOR", "EDITOR", "VIEWER"],
  batches: ["SUPER_ADMIN", "ADMIN", "OPERATOR", "EDITOR", "VIEWER"],
  news: ["SUPER_ADMIN", "ADMIN", "OPERATOR", "EDITOR", "VIEWER"],
  gallery: ["SUPER_ADMIN", "ADMIN", "OPERATOR", "EDITOR", "VIEWER"],
  users: ["SUPER_ADMIN"],
};

export const WRITE_RULES: Record<string, string[]> = {
  programs: ["SUPER_ADMIN", "ADMIN", "EDITOR"],
  batches: ["SUPER_ADMIN", "ADMIN"],
  news: ["SUPER_ADMIN", "ADMIN"],
  gallery: ["SUPER_ADMIN", "ADMIN"],

  upload: ["SUPER_ADMIN", "ADMIN", "EDITOR"],
  backup: ["SUPER_ADMIN"],
};

export function can(
  role: string | null | undefined,
  resource: string
): boolean {
  return !!role && (WRITE_RULES[resource] ?? []).includes(role);
}

export function canRead(
  role: string | null | undefined,
  resource: string
): boolean {
  return !!role && (READ_RULES[resource] ?? []).includes(role);
}
