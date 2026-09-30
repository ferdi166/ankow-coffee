import z from "zod";

export const ProfileCafeSchemaForm = z.object({
  cafe_name: z.string(),
  tagline: z.string(),
  description: z.string(),
  banner_url: z.union([z.string(), z.instanceof(File)]),
  open_time: z.string().time(),
  close_time: z.string().time(),
  wifi_speed: z.string(),
  total_sockets: z.string(),
});

export type ProfileCafeForm = z.infer<typeof ProfileCafeSchemaForm>;
export type ProfileCafe = z.infer<typeof ProfileCafeSchemaForm> & {
  id: string;
};
