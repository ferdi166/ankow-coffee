"use client";

import { Grid2X2, List, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type SpotCategory = "ALL" | "Indoor" | "Outdoor";
type ViewMode = "grid" | "list";

interface SpotFilterProps {
  activeTab: SpotCategory;
  searchQuery: string;
  viewMode: ViewMode;
  totalSpots: number;
  countIndoor: number;
  countOutdoor: number;
  onTabChange: (value: SpotCategory) => void;
  onSearchChange: (value: string) => void;
  onViewModeChange: (value: ViewMode) => void;
}

export default function SpotFilter({
  activeTab,
  searchQuery,
  viewMode,
  totalSpots,
  countIndoor,
  countOutdoor,
  onTabChange,
  onSearchChange,
  onViewModeChange,
}: SpotFilterProps) {
  return (
    <div className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-card p-3 shadow-[0_1px_3px_rgba(0,0,0,0.03)] sm:flex-row sm:items-center">
      <Tabs
        value={activeTab}
        onValueChange={(value) => onTabChange(value as SpotCategory)}>
        <TabsList className="h-auto gap-1 bg-muted py-4.5">
          <TabsTrigger
            value="ALL"
            className="px-3.5 py-3.5 text-xs font-semibold">
            Semua Spot ({totalSpots})
          </TabsTrigger>

          <TabsTrigger
            value="Indoor"
            className="px-3.5 py-3.5 text-xs font-semibold">
            Area Indoor ({countIndoor})
          </TabsTrigger>

          <TabsTrigger
            value="Outdoor"
            className="px-3.5 py-3.5 text-xs font-semibold">
            Area Outdoor ({countOutdoor})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:w-56">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Cari spot area..."
            className="border-border bg-background pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-1">
          <Button
            size="icon-sm"
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            aria-label="Grid View"
            onClick={() => onViewModeChange("grid")}>
            <Grid2X2 />
          </Button>

          <Button
            size="icon-sm"
            variant={viewMode === "list" ? "secondary" : "ghost"}
            aria-label="List View"
            onClick={() => onViewModeChange("list")}>
            <List />
          </Button>
        </div>
      </div>
    </div>
  );
}
