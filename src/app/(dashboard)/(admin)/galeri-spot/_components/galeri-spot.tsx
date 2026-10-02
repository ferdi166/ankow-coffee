"use client";

import React, { useState } from "react";
import {
  Airplay,
  Armchair,
  Cigarette,
  Coffee,
  Edit,
  Grid2X2,
  ImagePlus,
  Laptop,
  List,
  Music,
  Plug,
  Search,
  Sparkles,
  Trash2,
  Trees,
  Users,
  VolumeX,
  Wind,
} from "lucide-react";
import Image from "next/image";

import PageTitle from "@/components/common/page-title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Facility {
  icon: string;
  label: string;
}

interface SpotItem {
  id: number;
  title: string;
  description: string;
  category: "Indoor" | "Outdoor";
  badgeCategory: string;
  categoryIcon: string;
  capacity: string;
  imageUrl: string;
  isVisible: boolean;
  facilities: Facility[];
}

const SPOT_DATA: SpotItem[] = [
  {
    id: 1,
    title: "Main Bar & Communal Lounge",
    description:
      "Area bar utama dengan suasana hangat, alunan musik lo-fi, dan kursi sofa empuk untuk bersantai santai maupun ngobrol casual.",
    category: "Indoor",
    badgeCategory: "Indoor Area",
    categoryIcon: "coffee",
    capacity: "Kapasitas 25 Orang",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA9ppHeh04x8dQ8GMRWxhEemJl-HeVExN4OArAst_h9ncepSEXkTDSinvlKokRQukNjE_7kUpdBrJ2eeUjD9AQENb0vwYyfPwn0CiTvDuYgM2-0U5jz_4PvRXr1ZhOf2UjlQ1AE_Vmx_vUcXPkwek2InX-uq64EeX0zcBz9udiRv4Mwiq-Pl1DS0LUFi-fbVFMi65JB_fRx_eza_6ALogUxduyyFyN4CGJ_IhJ6XhOstZlkqxe3CmvnJw",
    isVisible: true,
    facilities: [
      { icon: "music_note", label: "Lively Ambience" },
      { icon: "chair", label: "Sofa & Bar Stool" },
      { icon: "mode_fan", label: "AC Central" },
    ],
  },
  {
    id: 2,
    title: "Dedicated WFC Mezzanine",
    description:
      "Area lantai dua khusus kerja & produktivitas. Didesain senyap dengan meja kayu panjang, colokan universal tiap meja, dan WiFi 150 Mbps.",
    category: "Indoor",
    badgeCategory: "Indoor Mezzanine",
    categoryIcon: "laptop_mac",
    capacity: "Kapasitas 16 Orang",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA9ppHeh04x8dQ8GMRWxhEemJl-HeVExN4OArAst_h9ncepSEXkTDSinvlKokRQukNjE_7kUpdBrJ2eeUjD9AQENb0vwYyfPwn0CiTvDuYgM2-0U5jz_4PvRXr1ZhOf2UjlQ1AE_Vmx_vUcXPkwek2InX-uq64EeX0zcBz9udiRv4Mwiq-Pl1DS0LUFi-fbVFMi65JB_fRx_eza_6ALogUxduyyFyN4CGJ_IhJ6XhOstZlkqxe3CmvnJw",
    isVisible: true,
    facilities: [
      { icon: "volume_off", label: "Quiet Zone" },
      { icon: "power", label: "Colokan Tiap Meja" },
      { icon: "chair_alt", label: "Ergonomic Chairs" },
    ],
  },
  {
    id: 3,
    title: "Sunlit Courtyard Garden",
    description:
      "Area halaman belakang terbuka dengan vegetasi tanaman tropis asri, bebatuan koral, kanopi teduh, dan area ramah merokok.",
    category: "Outdoor",
    badgeCategory: "Outdoor Area",
    categoryIcon: "park",
    capacity: "Kapasitas 20 Orang",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBoYXFw8SujC6wMs1PT46YZ8B3LNGEghqbZ7oIYppGS0vLJXHx_PNId6JUNwpeHCGaefR_cyqnaTxPaJZSUKN6v2UZs2RZ9iSxmgHy9IDRJy3kRjnJOPYlzVEDXzfVYDt8LdoTqJDWzSRCc8qXAHGwwIhyIgY89wX80phTHwgscF-NrsbQ7NsOgv4KTZbKF9RleRWKRb7rVqsukhvk5Zb_kDBkqMagIpQ3OyxSPEzaFuxWYF-7D05nH1Q",
    isVisible: true,
    facilities: [
      { icon: "yard", label: "Lush Garden" },
      { icon: "smoking_rooms", label: "Smokers Area" },
      { icon: "air", label: "Natural Breeze" },
    ],
  },
];

// Helper untuk pemetaan ikon Lucide dari string nama fasilitas
const getFacilityIcon = (iconName: string) => {
  switch (iconName) {
    case "music_note":
      return <Music className="size-3" />;
    case "chair":
    case "chair_alt":
      return <Armchair className="size-3" />;
    case "mode_fan":
      return <Airplay className="size-3" />;
    case "volume_off":
      return <VolumeX className="size-3" />;
    case "power":
      return <Plug className="size-3" />;
    case "yard":
    case "park":
      return <Trees className="size-3" />;
    case "smoking_rooms":
      return <Cigarette className="size-3" />;
    case "air":
      return <Wind className="size-3" />;
    case "coffee":
      return <Coffee className="size-3" />;
    case "laptop_mac":
      return <Laptop className="size-3" />;
    default:
      return <Sparkles className="size-3" />;
  }
};

export default function GaleriSpotMain() {
  const [spots, setSpots] = useState<SpotItem[]>(SPOT_DATA);
  const [activeTab, setActiveTab] = useState<"ALL" | "Indoor" | "Outdoor">(
    "ALL",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const handleToggleVisibility = (id: number) => {
    setSpots((prev) =>
      prev.map((spot) =>
        spot.id === id ? { ...spot, isVisible: !spot.isVisible } : spot,
      ),
    );
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
        {filteredSpots.map((spot) => (
          <Card
            key={spot.id}
            className={`group flex h-full flex-col gap-0 overflow-hidden border-border py-0 transition-all hover:border-primary/50 ${
              viewMode === "list" ? "md:flex-row" : ""
            }`}>
            {/* Image Box dengan Overlays Badge */}
            <div
              className={`relative overflow-hidden bg-muted ${
                viewMode === "list" ? "h-48 md:h-auto md:w-64" : "h-48 w-full"
              }`}>
              <Image
                src={spot.imageUrl}
                alt={spot.title}
                fill
                priority={spot.id === 1}
                sizes={
                  viewMode === "list"
                    ? "(max-width: 768px) 100vw, 256px"
                    : "(max-width: 768px) 100vw, 33vw"
                }
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Badge Kategori */}
              <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-foreground/80 backdrop-blur-sm text-card">
                <span className="text-primary">
                  {getFacilityIcon(spot.categoryIcon)}
                </span>
                {spot.badgeCategory}
              </span>
              {/* Badge Kapasitas */}
              <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-card/90 backdrop-blur-sm text-fobg-foreground shadow-xs">
                <Users className="size-3 text-[#865225]" />
                {spot.capacity}
              </span>
            </div>

            {/* Content Deskripsi & Fasilitas */}
            <CardContent className="flex flex-1 flex-col gap-3 p-5">
              <div className="flex flex-col gap-1">
                <h3 className="font-bold tracking-tight text-fobg-foreground text-base">
                  {spot.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {spot.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {spot.facilities.map((facility, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-muted text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                    <span className="text-primary">
                      {getFacilityIcon(facility.icon)}
                    </span>
                    {facility.label}
                  </span>
                ))}
              </div>
            </CardContent>

            {/* Footer Kontrol */}
            <CardFooter className="justify-between border-t border-border bg-background px-5 py-3.5">
              <div className="flex items-center gap-2">
                <Switch
                  id={`visible-${spot.id}`}
                  checked={spot.isVisible}
                  onCheckedChange={() => handleToggleVisibility(spot.id)}
                />
                <Label
                  htmlFor={`visible-${spot.id}`}
                  className="text-xs font-semibold text-fobg-foreground cursor-pointer">
                  Tampil di Web
                </Label>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-xs">
                  <Edit className="size-4" />
                </Button>

                <Button
                  variant="destructive"
                  size="icon-sm"
                  aria-label="Hapus Spot"
                  className="size-8">
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}
