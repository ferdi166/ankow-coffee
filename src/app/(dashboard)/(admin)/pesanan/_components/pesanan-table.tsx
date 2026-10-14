"use client";

import { useMemo, useState } from "react";
import { Edit, Eye, Pencil, Search } from "lucide-react";

import PaginationDataTable from "@/components/common/pagination-data-table";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrdersWithItems } from "@/validations/orders-validation";
import { Button } from "@/components/ui/button";

type PesananTableProps = {
  items: OrdersWithItems[];
};

const LIMIT = 5;

const statusTabs = [
  { value: "all", label: "Semua Pesanan" },
  { value: "unpaid", label: "Menunggu Bayar" },
  { value: "processing", label: "Diproses Dapur" },
  { value: "ready", label: "Siap Diantar" },
  { value: "completed", label: "Selesai" },
  { value: "cancelled", label: "Dibatalkan" },
];

export default function PesananTable({ items }: PesananTableProps) {
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredItems = useMemo(() => {
    return items.filter((order) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        order.order_number.toLowerCase().includes(keyword) ||
        order.customer_name.toLowerCase().includes(keyword) ||
        order.order_items.some((item) =>
          item.menu_items.name.toLowerCase().includes(keyword),
        );

      const matchesStatus =
        status === "all" ||
        (status === "unpaid" && order.payment_status === "unpaid") ||
        (status === "processing" && order.order_status === "processing") ||
        (status === "ready" && order.order_status === "ready") ||
        (status === "completed" && order.order_status === "completed") ||
        (status === "cancelled" && order.order_status === "cancelled");

      return matchesSearch && matchesStatus;
    });
  }, [items, search, status]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / LIMIT));

  const pageItems = filteredItems.slice(
    (currentPage - 1) * LIMIT,
    currentPage * LIMIT,
  );

  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b bg-muted/30 px-4 pt-3">
        <Tabs
          value={status}
          onValueChange={(value) => {
            setStatus(value);
            setCurrentPage(1);
          }}>
          <TabsList
            variant="default"
            className="h-auto w-full justify-start gap-2 bg-transparent p-0">
            {statusTabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="rounded-xl border bg-background px-3 py-2 text-xs data-active:bg-espresso data-active:text-white">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setCurrentPage(1);
            }}
            placeholder="Cari ID order, nomor meja, atau menu..."
            className="pl-9"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="text-center">ID & Waktu</TableHead>
              <TableHead>Tipe & Meja</TableHead>
              <TableHead>Rincian Item</TableHead>
              <TableHead>Status Dapur</TableHead>
              <TableHead>Status Bayar</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {pageItems.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="text-center">
                  <strong>#{order.order_number}</strong>
                  <div className="text-xs text-muted-foreground">
                    {new Date(order.created_at).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    WIB
                  </div>
                </TableCell>

                <TableCell>
                  {order.order_type === "Takeaway"
                    ? `Takeaway`
                    : (order.tables?.table_number ?? "-")}
                  <div className="text-xs text-muted-foreground">
                    {order.order_type === "Takeaway"
                      ? order.customer_name
                      : order.tables?.area_zone}
                  </div>
                </TableCell>

                <TableCell>
                  <p className="max-w-[280px] truncate">
                    {order.order_items
                      .map(
                        (item) => `${item.quantity}x ${item.menu_items.name}`,
                      )
                      .join(", ")}
                  </p>

                  <p className="max-w-[280px] truncate text-xs text-muted-foreground">
                    {order.order_items
                      .map((item) => item.notes)
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </TableCell>

                <TableCell>{order.order_status}</TableCell>
                <TableCell>
                  <span
                    className={
                      order.payment_status === "paid"
                        ? "inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700"
                        : order.payment_status === "void"
                          ? "inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700"
                          : "inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700"
                    }>
                    <span
                      className={
                        order.payment_status === "paid"
                          ? "size-1.5 rounded-full bg-emerald-500"
                          : order.payment_status === "void"
                            ? "size-1.5 rounded-full bg-rose-500"
                            : "size-1.5 rounded-full bg-amber-500"
                      }
                    />

                    {order.payment_status === "paid"
                      ? `Lunas${order.payment_method ? ` (${order.payment_method})` : ""}`
                      : order.payment_status === "void"
                        ? "Void"
                        : "Belum Bayar"}
                  </span>
                </TableCell>

                <TableCell className="font-bold">
                  Rp {order.total_amount.toLocaleString("id-ID")}
                </TableCell>

                <TableCell className="text-center">
                  {/* Tombol lihat, edit, dan cetak */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground"
                    aria-label="Detail Pesanan">
                    <Eye />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground"
                    aria-label="Edit Pesanan">
                    <Edit />
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {pageItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Tidak ada data pesanan
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between border-t p-5">
        <span className="text-sm text-muted-foreground">
          Menampilkan {pageItems.length} dari {filteredItems.length} pesanan
        </span>

        <div className="[&>nav]:mx-0 [&>nav]:w-auto">
          <PaginationDataTable
            currentPage={currentPage}
            totalPages={totalPages}
            onChangePage={setCurrentPage}
          />
        </div>
      </div>
    </Card>
  );
}
