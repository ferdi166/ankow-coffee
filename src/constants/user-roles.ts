export const USER_ROLES = {
  ADMIN: "admin",
  BARISTA_KITCHEN: "barista",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
