/* Peran yang boleh MENULIS per resource. Divalidasi di server pada SETIAP
   request API — UI hanya menyembunyikan tombol sebagai kenyamanan. */
export const WRITE: Record<string, string[]> = {
  programs:     ["SUPER_ADMIN", "ADMIN", "EDITOR"],
  batches:      ["SUPER_ADMIN", "ADMIN"],
  instructors:  ["SUPER_ADMIN", "ADMIN"],
  alumni:       ["SUPER_ADMIN", "ADMIN"],
  partners:     ["SUPER_ADMIN", "ADMIN"],
  news:         ["SUPER_ADMIN", "ADMIN", "EDITOR"],
  gallery:      ["SUPER_ADMIN", "ADMIN", "EDITOR"],
  faq:          ["SUPER_ADMIN", "ADMIN", "EDITOR"],
  jobs:         ["SUPER_ADMIN", "ADMIN"],
  applications: ["SUPER_ADMIN", "ADMIN", "OPERATOR"],
  users:        ["SUPER_ADMIN"],
  backup:       ["SUPER_ADMIN"],
  upload:       ["SUPER_ADMIN", "ADMIN", "EDITOR"],
};

export const can = (role: string | null | undefined, res: string) =>
  !!role && (WRITE[res] || []).includes(role);