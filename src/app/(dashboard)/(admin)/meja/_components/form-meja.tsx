import FormCapacity from "@/components/common/form-capacity";
import FormImage from "@/components/common/form-image";
import FormInput from "@/components/common/form-input";
import FormQrCode from "@/components/common/form-qr-code";
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
import { createClient } from "@/lib/supabase/client";
import { Preview } from "@/types/general";
import { Menu } from "@/validations/menu-validation";
import { Table } from "@/validations/table-validation";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2Icon, Loader2 } from "lucide-react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

export default function FormMeja<T extends FieldValues>({
  form,
  table,
  type,
  onSubmit,
  isLoading,
}: {
  form: UseFormReturn<T>;
  table?: Table;
  onSubmit: (event: React.SubmitEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  type: "Tambah" | "Edit";
}) {
  return (
    <DialogContent className="sm:max-w-[75vh] max-h-[90vh]">
      <DialogHeader className="mx-2 mt-2">
        <DialogTitle className="font-semibold">
          {type === "Tambah"
            ? "Tambah Meja Baru"
            : `Edit Meja - ${table?.table_number}`}
        </DialogTitle>
        <DialogDescription>
          {type === "Tambah"
            ? "Tambahkan unit meja baru untuk membuat QR Code ordering otomatis."
            : "Ubah informasi kapasitas, lokasi, atau status operasional meja ini."}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-4 max-h-[50vh] p-2 overflow-y-auto">
          <FormInput
            form={form}
            name={"name" as Path<T>}
            label="Nomor Meja"
            placeholder="Masukkan Nomor Meja..."
          />
          <FormSelect
            form={form}
            name={"category_id" as Path<T>}
            label="Kategori Area"
            selectItem={CATEGORY_AREA_LIST}
          />
          <FormCapacity form={form} name={"capacity" as Path<T>} />
          <FormSwitch
            form={form}
            name={"is_available" as Path<T>}
            label="Status"
            description="Meja langsung aktif untuk dipesan pelanggan."
          />
          <FormQrCode type={type} table={table} />
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Batal</Button>} />
          <Button type="submit" className="shrink-0">
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <CheckCircle2Icon />
            )}
            {isLoading ? "Menyimpan..." : "Simpan Meja"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
