import FormInput from "@/components/common/form-input";
import SectionHeader from "@/components/common/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProfileCafe } from "@/validations/profile-cafe-validation";
import {
  Clock3,
  ImagePlus,
  Save,
  Store,
  Trash2,
  UploadCloud,
} from "lucide-react";
import Image from "next/image";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

export default function FormProfileCafe<T extends FieldValues>({
  form,
  profile_cafe,
  onSubmit,
}: {
  form: UseFormReturn<T>;
  profile_cafe: ProfileCafe;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
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
          <div className="relative aspect-video max-h-95 overflow-hidden rounded-xl border border-border">
            {typeof profile_cafe?.banner_url === "string" && (
              <Image
                src={profile_cafe.banner_url}
                alt="Banner Kafe"
                fill
                loading="eager"
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 960px"
              />
            )}
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => {}}
              title="Hapus banner"
              aria-label="Hapus banner"
              className="absolute top-3 right-3 shadow-md">
              <Trash2 />
              Hapus
            </Button>
          </div>
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 p-8 text-center transition-colors hover:border-primary">
            <UploadCloud className="mb-2 size-8 text-primary" />
            <span className="text-sm font-semibold">
              {"Unggah foto banner baru"}
            </span>
            <span className="mt-1 text-xs text-muted-foreground">
              PNG, JPG, atau WebP hingga 5 MB
            </span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="sr-only"
            />
          </label>
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
            name={"open_time" as Path<T>}
            label="Jam Buka"
          />
          <FormInput
            form={form}
            name={"close_time" as Path<T>}
            label="Jam Buka"
          />
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button type="submit" className="shrink-0">
          <Save /> Simpan Perubahan
        </Button>
      </div>
    </form>
  );
}
