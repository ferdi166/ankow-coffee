"use client";

import PageTitle from "@/components/common/page-title";
import { createClient } from "@/lib/supabase/client";
import type { ProfileCafe } from "@/validations/profile-cafe-validation";
import { useQuery } from "@tanstack/react-query";
import UpdateProfileCafe from "./form-update-profile-cafe";

export default function ProfileCafe() {
  const supabase = createClient();
  const {
    data: profile_cafe,
    isLoading,
    refetch,
  } = useQuery<ProfileCafe | null>({
    queryKey: ["profile_cafe"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profile_cafe")
        .select(
          "id, cafe_name, tagline, description, banner_url, open_time, close_time",
        )
        .maybeSingle();

      if (error) {
        throw error;
      }

      return data as ProfileCafe | null;
    },
  });

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6">
      <header className="flex flex-col gap-4 border-b border-border pb-5 md:flex-row md:items-end md:justify-between">
        <PageTitle
          title="Pengaturan Profil Kafe"
          description="Kelola informasi publik, jam operasional, fasilitas WFC, dan banner
            landing page Ankow Coffee."
        />
      </header>

      {profile_cafe && (
        <UpdateProfileCafe profile_cafe={profile_cafe} refetch={refetch} />
      )}
    </div>
  );
}
