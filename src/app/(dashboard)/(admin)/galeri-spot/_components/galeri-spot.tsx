"use client";

import React, { useMemo, useState } from "react";
import { Grid2X2, ImagePlus, List, Search } from "lucide-react";
import PageTitle from "@/components/common/page-title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";
import CardSpot from "./card-spot";
import { SpotItem } from "@/types/galeri-spot";
import { getFacilityIcon } from "../_utils/get-facility-icon";

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
        <Button>
          <ImagePlus />
          Tambah Spot Baru
        </Button>
      </div>

      {/* Filter Tabs & Search Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-3 rounded-2xl border border-border shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        {/* Category Filter Pills dengan Warna Kustom */}
        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as "ALL" | "Indoor" | "Outdoor")
          }>
          <TabsList className="bg-muted py-4.5 h-auto gap-1">
            <TabsTrigger
              value="ALL"
              className="text-xs font-semibold px-3.5 py-3.5 text-muted-foreground data-active:bg-foreground data-active:text-card transition-all  hover:bg-card/60">
              Semua Spot ({spots.length})
            </TabsTrigger>
            <TabsTrigger
              value="Indoor"
              className="text-xs font-semibold px-3.5 py-3.5 text-muted-foreground data-active:bg-foreground data-active:text-card  hover:bg-card/60">
              Area Indoor ({countIndoor})
            </TabsTrigger>
            <TabsTrigger
              value="Outdoor"
              className="text-xs font-semibold px-3.5 py-3.5 text-muted-foreground data-active:bg-foreground data-active:text-card  hover:bg-card/60">
              Area Outdoor ({countOutdoor})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search and View Action */}
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-56">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Cari spot area..."
              className="pl-9 bg-background border-border text-xs"
            />
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-1">
            <Button
              size="icon-sm"
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              aria-label="Grid View"
              onClick={() => setViewMode("grid")}>
              <Grid2X2 />
            </Button>

            <Button
              size="icon-sm"
              variant={viewMode === "list" ? "secondary" : "ghost"}
              aria-label="List View"
              onClick={() => setViewMode("list")}>
              <List />
            </Button>
          </div>
        </div>
      </div>

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
