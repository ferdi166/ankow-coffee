"use client";

import React, { useMemo, useState } from "react";
import { Grid2X2, ImagePlus, List, Search } from "lucide-react";
import PageTitle from "@/components/common/page-title";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";
import CardSpot from "./card-spot";
import { SpotItem } from "@/types/galeri-spot";
import { getFacilityIcon } from "../_utils/get-facility-icon";
import SpotFilter from "./spot-filter";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import DialogTambahSpot from "./dialog-tambah-spot";

export default function GaleriSpotMain() {
  const supabase = createClient();
  const {
    data: galeri_spot,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["galeri_spot"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("galleries")
        .select(
          "id, title, description, image_url, category_tag, capacity_text, features, is_active",
        );

      if (error) {
        throw error;
      }

      return data;
    },
  });

  const spots: SpotItem[] = useMemo(() => {
    return (galeri_spot ?? []).map((item) => {
      const category = item.category_tag === "Outdoor" ? "Outdoor" : "Indoor";

      return {
        id: item.id,
        title: item.title,
        description: item.description,
        category,
        badgeCategory: `${category} Area`,
        categoryIcon: category === "Outdoor" ? "park" : "building-2",
        capacity: item.capacity_text,
        imageUrl: item.image_url,
        isVisible: item.is_active,
        facilities: item.features ?? [],
      };
    });
  }, [galeri_spot]);

  // const [spots, setSpots] = useState<SpotItem[]>(SPOT_DATA);
  const [activeTab, setActiveTab] = useState<"ALL" | "Indoor" | "Outdoor">(
    "ALL",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);

  const handleToggleVisibility = async (id: string, isActive: boolean) => {
    const { error, success } = await supabase
      .from("galleries")
      .update({ is_active: isActive })
      .eq("id", id);

    if (error) {
      console.error("Gagal mengubah status galeri:", error);
      return;
    }

    if (success) {
      await refetch();
      toast.add({
        type: "success",
        title: "Update Status Galeri berhasil",
      });
      return;
    }
  };

  const filteredSpots = spots.filter((spot) => {
    const matchesTab = activeTab === "ALL" ? true : spot.category === activeTab;
    const matchesSearch = spot.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const countIndoor = spots.filter((s) => s.category === "Indoor").length;
  const countOutdoor = spots.filter((s) => s.category === "Outdoor").length;

  return (
    <main className="p-8 flex flex-col gap-6 max-w-[1440px] mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageTitle
          title="Manajemen Galeri Spot"
          description="Kelola foto, deskripsi, dan fasilitas area kafe yang tampil di landing page utama."
        />
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger
            render={
              <Button>
                <ImagePlus />
                Tambah Spot Baru
              </Button>
            }
          />
          <DialogTambahSpot
            refetch={refetch}
            onSuccess={() => setIsCreateDialogOpen(false)}
          />
        </Dialog>
      </div>

      {/* Filter Tabs & Search Row */}
      <SpotFilter
        activeTab={activeTab}
        searchQuery={searchQuery}
        viewMode={viewMode}
        totalSpots={spots.length}
        countIndoor={countIndoor}
        countOutdoor={countOutdoor}
        onTabChange={setActiveTab}
        onSearchChange={setSearchQuery}
        onViewModeChange={setViewMode}
      />

      {/* 3-Column Spot Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSpots?.map((spot) => (
          <CardSpot
            key={spot.id}
            spot={spot}
            viewMode={viewMode}
            getFacilityIcon={getFacilityIcon}
            handleToggleVisibility={handleToggleVisibility}
          />
        ))}
      </div>
    </main>
  );
}
