"use client";

import QRCode from "react-qr-code";
import { Download, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table } from "@/validations/table-validation";

const BASE_URL = `${process.env.NEXT_PUBLIC_SITE_URL}/table`;

export default function FormQrCode({
  type,
  table,
}: {
  type: "Tambah" | "Edit";
  table?: Table;
}) {
  const tableUrl = table ? `${BASE_URL}/${table.table_number}` : undefined;

  if (type === "Tambah") {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50/50 px-4 py-3 text-sm text-muted-foreground">
        <QrCode className="size-5 shrink-0 text-amber-600" />
        <span>
          QR Code unik akan otomatis dibuat oleh sistem setelah disimpan.
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border bg-muted/20 px-3 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg border bg-background p-1">
          {tableUrl ? (
            <QRCode value={tableUrl} size={42} />
          ) : (
            <QrCode className="size-6 text-muted-foreground" />
          )}
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold">QR Code Terpasang</p>
          <p className="truncate text-xs text-muted-foreground">{tableUrl}</p>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={!tableUrl}
        onClick={() => window.open(tableUrl, "_blank")}>
        <Download />
        Cetak / Unduh QR
      </Button>
    </div>
  );
}
