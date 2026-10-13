"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";

import PaginationDataTable from "@/components/common/pagination-data-table";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table } from "@/validations/table-validation";

import MejaCard from "./meja-card";

type MejaTableProps = {
  items: Table[];
  refetch: () => void;
};

const LIMIT = 6;

export default function MejaDisplay({ items, refetch }: MejaTableProps) {
  const [area, setArea] = useState("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredItems = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return items.filter((item) => {
      const matchesArea = area === "all" || item.area_zone === area;

      const matchesSearch =
        item.table_number.toLowerCase().includes(keyword) ||
        item.area_zone.toLowerCase().includes(keyword) ||
        item.capacity.toLowerCase().includes(keyword);

      return matchesArea && matchesSearch;
    });
  }, [items, area, search]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / LIMIT));

  const pageItems = filteredItems.slice(
    (currentPage - 1) * LIMIT,
    currentPage * LIMIT,
  );

  // Mencegah halaman kosong setelah filter atau data dihapus.
  useEffect(() => {
    if (currentPage > totalPages) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  console.log(items);
  console.log(filteredItems);

  return (
    <Card className="gap-0 overflow-hidden p-0">
      <div className="border-b bg-muted/30 px-6 pt-3">
        <Tabs
          value={area}
          onValueChange={(value) => {
            setArea(value);
            setCurrentPage(1);
          }}>
          <TabsList variant="line" className="w-full justify-start">
            <TabsTrigger value="all">Semua Meja</TabsTrigger>
            <TabsTrigger value="Indoor">Indoor Area</TabsTrigger>
            <TabsTrigger value="Outdoor">Outdoor Area</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="p-5">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setCurrentPage(1);
            }}
            placeholder="Cari nomor meja, area, atau kapasitas..."
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 p-5 md:grid-cols-2 lg:grid-cols-3">
        {pageItems.map((item) => (
          <MejaCard key={item.id} item={item} refetch={refetch} />
        ))}

        {pageItems.length === 0 && (
          <div className="col-span-full py-12 text-center text-sm text-muted-foreground">
            Tidak ada data meja
          </div>
        )}
      </div>

      <div className="flex flex-col items-center justify-between gap-3 border-t bg-muted/20 px-6 py-4 sm:flex-row">
        <span className="text-sm text-muted-foreground">
          Menampilkan {pageItems.length} dari {filteredItems.length} meja
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
