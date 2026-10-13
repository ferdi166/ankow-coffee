import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { startTransition, useActionState, useEffect, useRef } from "react";
import { editMeja } from "../action";
import { toast } from "@/components/ui/toast";
import FormMeja from "./form-meja";
import {
  Table,
  TableForm,
  TableSchemaForm,
} from "@/validations/table-validation";
import { INITIAL_STATE_TABLE } from "@/constants/meja-constant";

export default function DialogEditMeja({
  table,
  refetch,
  onSuccess,
}: {
  table: Table;
  refetch: () => void;
  onSuccess: () => void;
}) {
  const form = useForm<TableForm>({
    resolver: zodResolver(TableSchemaForm),
    defaultValues: {
      table_number: table.table_number,
      area_zone: table.area_zone,
      capacity: table.capacity,
      is_active: table.is_active,
      qr_code_url: table.qr_code_url,
    },
  });

  const [editMejaState, editMejaAction, isPendingEditMeja] = useActionState(
    editMeja,
    INITIAL_STATE_TABLE,
  );

  const hasHandledResult = useRef(false);

  // eslint-disable-next-line react-hooks/refs
  const onSubmit = form.handleSubmit((data) => {
    hasHandledResult.current = false;
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value ?? ""));
    });

    formData.append("id", table.id);

    startTransition(() => {
      editMejaAction(formData);
    });
  });

  useEffect(() => {
    if (
      (editMejaState.status !== "success" &&
        editMejaState.status !== "error") ||
      hasHandledResult.current
    ) {
      return;
    }

    hasHandledResult.current = true;

    if (editMejaState.status === "error") {
      toast.add({
        type: "error",
        title: "Edit Meja gagal",
        description: editMejaState.errors?._form?.[0],
        priority: "high",
      });

      return;
    }

    toast.add({
      type: "success",
      title: "Edit Meja berhasil",
      description: "Data Meja berhasil dirubah",
    });

    onSuccess();
    refetch();
  }, [editMejaState, form, onSuccess, refetch]);

  return (
    <>
      <FormMeja
        type="Edit"
        form={form}
        table={table}
        isLoading={isPendingEditMeja}
        onSubmit={onSubmit}
      />
    </>
  );
}
