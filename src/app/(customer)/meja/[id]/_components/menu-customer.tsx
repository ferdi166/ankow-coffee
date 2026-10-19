"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu } from "@/validations/menu-validation";
import MenuCardCustomer from "./menu-card-customer";

type Props = {
  menu: Menu[];
  onAdd: (item: Menu) => void;
};

export default function MenuCustomer({ menu, onAdd }: Props) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");

  const categories = useMemo(() => {
    const categoryNames = menu.map((item) => item.categories.name);

    return ["Semua", ...new Set(categoryNames)];
  }, [menu]);

  const filteredMenu = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return menu.filter((item) => {
      const matchesCategory =
        activeCategory === "Semua" || item.categories.name === activeCategory;

      const matchesSearch =
        !keyword ||
        item.name.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword) ||
        item.categories.name.toLowerCase().includes(keyword);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, menu, search]);

  return (
    <section className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Cari menu kopi, pastry, beans..."
          className="h-11 rounded-full bg-card pl-10 pr-4 shadow-sm"
        />
      </div>

      {/* Filter kategori */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((category) => {
          const isActive = activeCategory === category;

          return (
            <Button
              key={category}
              type="button"
              size="sm"
              variant={isActive ? "default" : "outline"}
              className="shrink-0 rounded-full"
              onClick={() => setActiveCategory(category)}>
              {category}
            </Button>
          );
        })}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <span className="h-4 w-2 rounded-full bg-primary" />
          <h2 className="font-heading text-lg font-semibold">Daftar Menu</h2>
        </div>

        <span className="text-xs text-muted-foreground">
          {filteredMenu.length} Menu Tersedia
        </span>
      </div>

      {/* Daftar menu */}
      {filteredMenu.length > 0 ? (
        <div className="grid gap-3">
          {filteredMenu.map((item) => (
            <MenuCardCustomer
              key={item.id}
              item={item}
              onAdd={() => onAdd(item)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed bg-card p-8 text-center text-sm text-muted-foreground">
          Menu tidak ditemukan.
        </div>
      )}
    </section>
  );
}
