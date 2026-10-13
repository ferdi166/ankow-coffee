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
  DialogTitle,
} from "@/components/ui/dialog";
import { CATEGORY_AREA_LIST } from "@/constants/category-area-constant";
import { Preview } from "@/types/general";
import { Spot } from "@/validations/spot-validation";
import { CheckCircle2Icon, Loader2 } from "lucide-react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

export default function FormMenu<T extends FieldValues>({
  form,
  spot,
  type,
  preview,
  setPreview,
  onSubmit,
  isLoading,
}: {
  form: UseFormReturn<T>;
  spot?: Spot;
  onSubmit: (event: React.SubmitEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  type: "Tambah" | "Edit";
  preview?: Preview;
  setPreview?: (preview: Preview) => void;
}) {
  return (
    <DialogContent className="sm:max-w-[75vh] max-h-[90vh]">
      <DialogHeader className="mx-2 mt-2">
        <DialogTitle className="font-semibold">
          {type === "Tambah"
            ? "Tambah Menu Baru"
            : `Edit Menu - ${spot?.title}`}
        </DialogTitle>
        <DialogDescription>
          {type === "Tambah"
            ? "Lengkapi informasi katalog menu, harga, dan ketersediaan stok."
            : "Perbarui informasi katalog menu, harga, dan ketersediaan stok."}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-4 max-h-[50vh] p-2 overflow-y-auto">
          <FormInput
            form={form}
            name={"title" as Path<T>}
            label="Nama Menu"
            placeholder="Masukkan Nama Menu..."
          />
          <div className="grid gap-5 md:grid-cols-2">
            <FormInput
              form={form}
              name={"price" as Path<T>}
              label="Harga"
              placeholder="Contoh:18000"
            />
            <FormSelect
              form={form}
              name={"category_id" as Path<T>}
              label="Kategori Menu"
              selectItem={CATEGORY_AREA_LIST}
            />
          </div>
          <FormInput
            form={form}
            type="textarea"
            name={"description" as Path<T>}
            label="Deskripsi Singkat"
            placeholder="Jelaskan rasa komposisi (espresso, gula aren murni, fresh milk) atau catatan lain..."
          />
          <FormImage
            form={form}
            type="Form Dialog"
            name={"image_url" as Path<T>}
            label="Foto Menu"
            preview={preview}
            setPreview={setPreview}
          />
          <FormSwitch
            form={form}
            name={"is_active" as Path<T>}
            label="Tersedia Langsung"
            description="Bisa dipesan pelanggan."
          />
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
