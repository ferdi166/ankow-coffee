export const USER_ROLES = {
  ADMIN: "Admin",
  BARISTA_KITCHEN: "Barista & Dapur",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
