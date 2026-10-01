import FormImage from "@/components/common/form-image";
import FormInput from "@/components/common/form-input";
import SectionHeader from "@/components/common/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Preview } from "@/types/general";
import { Clock3, ImagePlus, Loader2, Save, Store } from "lucide-react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

export default function FormProfileCafe<T extends FieldValues>({
  form,
  onSubmit,
  isLoading,
  preview,
  setPreview,
}: {
  form: UseFormReturn<T>;
  onSubmit: (event: React.SubmitEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  preview?: Preview;
  setPreview?: (preview: Preview) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-8 mt-4">
      <Card>
        <SectionHeader
          icon={Store}
          title="Informasi Umum Kafe"
          description="Identitas publik kafe pada halaman utama."
        />
        <CardContent className="grid gap-5 md:grid-cols-2">
          <FormInput
            form={form}
            name={"cafe_name" as Path<T>}
            label="Nama Kafe"
          />
          <FormInput
            form={form}
            name={"tagline" as Path<T>}
            label="Tagline Utama"
          />
          <div className="col-span-2">
            <FormInput
              form={form}
              name={"description" as Path<T>}
              label="Deskripsi Singkat"
              type="textarea"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <SectionHeader
          icon={ImagePlus}
          title="Hero Banner Kafe"
          description="Visual pembuka landing page utama dengan rasio rekomendasi 16:9."
        />
        <CardContent className="space-y-5">
          <FormImage
            form={form}
            name={"banner_url" as Path<T>}
            label="Banner Kafe"
            preview={preview}
            setPreview={setPreview}
          />
        </CardContent>
      </Card>

      <Card>
        <SectionHeader
          icon={Clock3}
          title="Waktu Operasional Kedai"
          description="Jadwal buka-tutup kedai yang ditampilkan pada layanan pelanggan."
        />
        <CardContent className="grid gap-5 md:grid-cols-2">
          <FormInput
            form={form}
            type="time"
            name={"open_time" as Path<T>}
            label="Jam Buka"
          />
          <FormInput
            form={form}
            type="time"
            name={"close_time" as Path<T>}
            label="Jam Buka"
          />
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button type="submit" className="shrink-0">
          {isLoading ? <Loader2 className="animate-spin" /> : <Save />}
          {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>
    </form>
  );
}
