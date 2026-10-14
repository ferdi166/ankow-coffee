import FormSelect from "@/components/common/form-select";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

type TableOption = {
  id: string;
  table_number: string;
  area_zone: string;
};

type Props<T extends FieldValues> = {
  form: UseFormReturn<T>;
  tables: TableOption[];
};

export default function TableField<T extends FieldValues>({
  form,
  tables,
}: Props<T>) {
  return (
    <div className="mt-4">
      <FormSelect
        form={form}
        name={"table_id" as Path<T>}
        label="Meja"
        selectItem={tables.map((table) => ({
          value: table.id,
          label: `Meja ${table.table_number} - ${table.area_zone}`,
        }))}
      />
    </div>
  );
}
