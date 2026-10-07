import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FacilityIconResolver, SpotItem } from "@/types/galeri-spot";
import { Edit, Trash2, Users } from "lucide-react";
import Image from "next/image";
import DialogEditSpot from "./dialog-edit-spot";
import { Spot } from "@/validations/spot-validation";

export default function CardSpot({
  spot,
  viewMode,
  getFacilityIcon,
  handleToggleVisibility,
  refetch,
  handleCreateSuccess,
  onEdit,
  onDelete,
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  currentData,
}: {
  spot: SpotItem;
  viewMode: "grid" | "list";
  getFacilityIcon: FacilityIconResolver;
  handleToggleVisibility: (id: string, isActive: boolean) => void;
  refetch: () => void;
  handleCreateSuccess: () => void;
  currentData: Spot;
  onEdit?: () => void;
  onDelete?: () => void;
  isCreateDialogOpen?: boolean;
  setIsCreateDialogOpen?: () => void;
}) {
  return (
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
          loading="eager"
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
          {spot.category}
        </span>
        {/* Badge Kapasitas */}
        <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-card/90 backdrop-blur-sm text-fobg-foreground shadow-xs">
          <Users className="size-3 text-primary" />
          Kapasitas {spot.capacity} Orang
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
            onCheckedChange={(checked) =>
              handleToggleVisibility(spot.id, checked)
            }
          />
          <Label
            htmlFor={`visible-${spot.id}`}
            className="text-xs font-semibold text-fobg-foreground cursor-pointer">
            Tampil di Web
          </Label>
        </div>

        <div className="flex gap-2">
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger
              render={
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-xs"
                  onClick={onEdit}>
                  <Edit className="size-4" />
                </Button>
              }
            />
            <DialogEditSpot
              spot={currentData}
              refetch={refetch}
              onSuccess={handleCreateSuccess}
            />
          </Dialog>

          <Button
            variant="destructive"
            size="icon-sm"
            aria-label="Hapus Spot"
            className="size-8"
            onClick={onDelete}>
            <Trash2 className="size-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
