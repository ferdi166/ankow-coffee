"use client";

import PageTitle from "@/components/common/page-title";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type {
  ProfileCafe,
  ProfileCafeForm,
} from "@/validations/profile-cafe-validation";
import { ProfileCafeSchemaForm } from "@/validations/profile-cafe-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Save } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import FormProfileCafe from "./form-profile-cafe";
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
          "id, cafe_name, tagline, description, banner_url, open_time, close_time, wifi_speed, total_sockets",
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
          description=" Kelola informasi publik, jam operasional, fasilitas WFC, dan banner
            landing page Ankow Coffee."
        />
      </header>

      {profile_cafe && (
        <UpdateProfileCafe profile_cafe={profile_cafe} refetch={refetch} />
      )}
    </div>
  );
}
