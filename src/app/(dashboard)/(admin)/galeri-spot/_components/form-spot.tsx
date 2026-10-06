import FormFacilities from "@/components/common/form-facilities";
import FormImage from "@/components/common/form-image";
import FormInput from "@/components/common/form-input";
import FormSelect from "@/components/common/form-select";
import FormSwitch from "@/components/common/form-switch";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { CATEGORY_AREA_LIST } from "@/constants/category-area-constant";
import { SpotItem } from "@/types/galeri-spot";
import { Preview } from "@/types/general";
import { CheckCircle2Icon, Loader2 } from "lucide-react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

export default function FormSpot<T extends FieldValues>({
  form,
  spot,
  type,
  preview,
  setPreview,
  onSubmit,
  isLoading,
}: {
  form: UseFormReturn<T>;
  spot?: SpotItem;
  onSubmit: (event: React.SubmitEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  type: "Tambah" | "Edit";
  preview?: Preview;
  setPreview?: (preview: Preview) => void;
}) {
  return (
    <DialogContent>
      <DialogHeader>
        {type === "Tambah" ? "Tambah Spot Baru" : `Edit Spot`}
      </DialogHeader>
      <DialogDescription>
        {type === "Tambah"
          ? "Lengkapi informasi spot kafe untuk ditampilkan di landing page utama."
          : "Perbarui informasi, foto, dan fasilitas spot kafe ini."}
      </DialogDescription>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-4 max-h-[50vh] p-1 overflow-y-auto">
          <FormInput form={form} name={"title" as Path<T>} label="Nama Spot" />
          <div className="grid gap-5 md:grid-cols-2">
            <FormSelect
              form={form}
              name={"category_tag" as Path<T>}
              label="Kategori Area"
              selectItem={CATEGORY_AREA_LIST}
            />
            <FormInput
              form={form}
              name={"capacity_text" as Path<T>}
              label="Kapasitas (Orang)"
            />
          </div>
          <FormInput
            form={form}
            type="textarea"
            name={"description" as Path<T>}
            label="Deskripsi Singkat"
            placeholder="Jelaskan suasana dan keunggulan spot ini untuk kenyamanan pengunjung..."
          />
          <FormImage
            form={form}
            type="Form Dialog"
            name={"image_url" as Path<T>}
            label="Foto Spot Kafe"
            preview={preview}
            setPreview={setPreview}
          />
          <FormFacilities form={form} name={"features" as Path<T>} />
          <FormSwitch form={form} name={"is_active" as Path<T>} />
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Batal</Button>} />
          <Button type="submit" className="shrink-0">
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <CheckCircle2Icon />
            )}
            {isLoading ? "Menyimpan..." : "Simpan Spot"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
