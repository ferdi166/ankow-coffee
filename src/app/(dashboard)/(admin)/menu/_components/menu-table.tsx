"use client";

import { useCallback, useMemo, useState } from "react";
import { Pencil, Search, Trash2 } from "lucide-react";

import PaginationDataTable from "@/components/common/pagination-data-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Menu } from "@/validations/menu-validation";
import Image from "next/image";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import DialogEditMenu from "./dialog-edit-menu";
import DialogHapusMenu from "./dialog-hapus-menu";

type MenuTableProps = {
  items: Menu[];
  refetch: () => void;
};

const LIMIT = 5;

export default function MenuTable({ items, refetch }: MenuTableProps) {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [onlyUnavailable, setOnlyUnavailable] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editMenuId, setEditMenuId] = useState<string | null>(null);
  const [deleteMenuId, setDeleteMenuId] = useState<string | null>(null);

  const handleEditSuccess = useCallback(() => {
    setIsEditDialogOpen(false);
    setEditMenuId(null);
  }, []);

  const handleDeleteSuccess = useCallback(() => {
    setDeleteMenuId(null);
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory =
        category === "all" || item.categories.name === category;

      const matchesSearch = item.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesAvailability = !onlyUnavailable || !item.is_available;

      return matchesCategory && matchesSearch && matchesAvailability;
    });
  }, [items, category, search, onlyUnavailable]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / LIMIT));

  const pageItems = filteredItems.slice(
    (currentPage - 1) * LIMIT,
    currentPage * LIMIT,
  );

  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b bg-muted/30 px-6 pt-3">
        <Tabs
          value={category}
          onValueChange={(value) => {
            setCategory(value);
            setCurrentPage(1);
          }}>
          <TabsList variant="line" className="w-full justify-start">
            <TabsTrigger value="all">Semua Menu</TabsTrigger>
            <TabsTrigger value="Espresso Based">Espresso Based</TabsTrigger>
            <TabsTrigger value="Manual Brew">Manual Brew</TabsTrigger>
            <TabsTrigger value="Non-Coffee">Non-Coffee</TabsTrigger>
            <TabsTrigger value="Main Course">Main Course</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-col justify-between gap-4 py-0 p-5 md:flex-row md:items-center">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setCurrentPage(1);
            }}
            placeholder="Cari nama menu..."
            className="pl-9"
          />
        </div>

        <label className="flex items-center gap-3 text-sm">
          <span>Tampilkan hanya stok habis</span>
          <Switch
            checked={onlyUnavailable}
            onCheckedChange={(checked) => {
              setOnlyUnavailable(checked);
              setCurrentPage(1);
            }}
          />
        </label>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="min-w-[360px] px-6">
                Menu Item & Deskripsi
              </TableHead>
              <TableHead>Harga Dasar</TableHead>
              <TableHead>Status Stok</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {pageItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="px-6">
                  <div className="flex items-start gap-3.5">
                    <div className="size-14 shrink-0 overflow-hidden rounded-lg border bg-muted">
                      {item.image_url && (
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          loading="eager"
                          width={100}
                          height={100}
                          className="size-full object-cover"
                        />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="font-bold">{item.name}</p>
                      <span className="mt-1 inline-flex rounded-full bg-muted px-2 py-0.5 text-xs">
                        {item.categories.name}
                      </span>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="whitespace-nowrap font-bold">
                  Rp {item.price.toLocaleString("id-ID")}
                </TableCell>

                <TableCell>
                  <span
                    className={
                      item.is_available
                        ? "inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600"
                        : "inline-flex items-center gap-1.5 rounded-full border border-muted bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                    }>
                    <span
                      className={
                        item.is_available
                          ? "size-1.5 rounded-full bg-emerald-500"
                          : "size-1.5 rounded-full bg-muted-foreground"
                      }
                    />
                    {item.is_available ? "Tersedia" : "Stok Habis"}
                  </span>
                </TableCell>

                <TableCell>
                  <div className="flex justify-center gap-2">
                    <Dialog
                      open={editMenuId === item.id}
                      onOpenChange={(open) => {
                        setEditMenuId(open ? item.id : null);
                      }}>
                      <DialogTrigger
                        render={
                          <Button variant="outline" size="icon">
                            <Pencil />
                          </Button>
                        }
                      />
                      <DialogEditMenu
                        menu={item}
                        refetch={refetch}
                        onSuccess={handleEditSuccess}
                      />
                    </Dialog>

                    <Dialog
                      open={deleteMenuId === item.id}
                      onOpenChange={(open) => {
                        setDeleteMenuId(open ? item.id : null);
                      }}>
                      <DialogTrigger
                        render={
                          <Button variant="destructive" size="icon">
                            <Trash2 />
                          </Button>
                        }
                      />
                      <DialogHapusMenu
                        menu={item}
                        refetch={refetch}
                        onSuccess={handleDeleteSuccess}
                      />
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {pageItems.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-muted-foreground">
                  Tidak ada data menu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 border-t bg-muted/20 px-6 py-4 sm:flex-row">
        <span className="text-sm text-muted-foreground">
          Menampilkan {pageItems.length} dari {filteredItems.length} menu
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
