export const WRITE_RULES: Record<string, string[]> = {
  programs: ["SUPER_ADMIN", "ADMIN", "EDITOR"],
  batches: ["SUPER_ADMIN", "ADMIN"],
  instructors: ["SUPER_ADMIN", "ADMIN"],
  alumni: ["SUPER_ADMIN", "ADMIN"],
  partners: ["SUPER_ADMIN", "ADMIN"],
  news: ["SUPER_ADMIN", "ADMIN"],
  gallery: ["SUPER_ADMIN", "ADMIN"],
  jobs: ["SUPER_ADMIN", "ADMIN"],
  faq: ["SUPER_ADMIN", "ADMIN"],
  applications: ["SUPER_ADMIN", "ADMIN", "OPERATOR"],
  users: ["SUPER_ADMIN"],
  upload: ["SUPER_ADMIN", "ADMIN", "EDITOR"],
  backup: ["SUPER_ADMIN"],
};

export function can(role: string | null | undefined, resource: string): boolean {
  return !!role && (WRITE_RULES[resource] ?? []).includes(role);
}
