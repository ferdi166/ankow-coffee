"use client";

import { Download, Edit, Trash2, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table } from "@/validations/table-validation";
import QRCode from "react-qr-code";
import { useRef } from "react";
import { toPng } from "html-to-image";

type MejaCardProps = {
  item: Table;
  refetch: () => void;
};

export default function MejaCard({ item }: MejaCardProps) {
  const qrRef = useRef<HTMLDivElement>(null);

  const cardExportRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!cardExportRef.current) return;

    const dataUrl = await toPng(cardExportRef.current, {
      pixelRatio: 2,
      backgroundColor: "#ffffff",
      cacheBust: true,
    });

    const link = document.createElement("a");
    link.download = `qr-meja-${item.table_number}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <Card className="gap-0 overflow-hidden rounded-xl py-0 shadow-sm transition-shadow hover:shadow-md">
      <div ref={cardExportRef}>
        <CardHeader className="flex-row items-center justify-between gap-3 px-5 py-5">
          <CardTitle className="text-base font-bold">
            Meja {item.table_number}
          </CardTitle>

          <div className="flex items-center gap-1">
            <span className="rounded-full bg-muted px-2 py-1 text-xs">
              {item.area_zone}
            </span>

            <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs text-amber-800">
              <Users className="size-3" />
              {item.capacity} Pax
            </span>
          </div>
        </CardHeader>

        <CardContent className="px-5 pb-5">
          <div className="flex min-h-52 flex-col items-center justify-center rounded-xl bg-muted/40 p-4">
            {item.qr_code_url ? (
              <div className="rounded-xl bg-background p-2.5 shadow-sm">
                <QRCode value={item.qr_code_url} size={128} level="H" />
              </div>
            ) : (
              <span className="text-xs text-muted-foreground">
                QR Code belum tersedia
              </span>
            )}

            <span className="mt-2.5 text-xs text-muted-foreground">
              {process.env.NEXT_PUBLIC_SITE_URL}/table/{item.table_number}
            </span>
          </div>
        </CardContent>
      </div>

      <CardFooter className="justify-between border-t px-5 py-4">
        <span
          className={
            item.is_active
              ? "rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700"
              : "rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-800"
          }>
          <span className="mr-1">•</span>
          {item.is_active ? "Aktif / Ready" : "Nonaktif / Maintenance"}
        </span>

        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-7 text-muted-foreground"
            disabled={!item.qr_code_url}
            onClick={handleDownload}
            aria-label="Unduh QR Code">
            <Download className="size-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="size-7 text-muted-foreground"
            aria-label="Edit Meja">
            <Edit className="size-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="size-7 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            aria-label="Hapus Meja">
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
