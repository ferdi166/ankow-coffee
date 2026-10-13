import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { createMeja } from "../action";
import { toast } from "@/components/ui/toast";
import { TableForm, TableSchemaForm } from "@/validations/table-validation";
import { INITIAL_STATE_TABLE, INITIAL_TABLE } from "@/constants/meja-constant";
import FormMeja from "./form-meja";

export default function DialogTambahMeja({
  refetch,
  onSuccess,
}: {
  refetch: () => void;
  onSuccess: () => void;
}) {
  const form = useForm<TableForm>({
    resolver: zodResolver(TableSchemaForm),
    defaultValues: INITIAL_TABLE,
  });

  const [createMejaState, createMejaAction, isPendingCreateMeja] =
    useActionState(createMeja, INITIAL_STATE_TABLE);

  const onSubmit = form.handleSubmit((data) => {
    // console.log(data);
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value ?? ""));
    });

    startTransition(() => {
      createMejaAction(formData);
    });
  });

  useEffect(() => {
    if (createMejaState.status === "error") {
      toast.add({
        type: "error",
        title: "Tambah Meja gagal",
        description: createMejaState.errors?._form?.[0],
        priority: "high",
      });
    }

    if (createMejaState.status === "success") {
      toast.add({
        type: "success",
        title: "Tambah Meja berhasil",
        description: "Data Meja berhasil ditambahkan",
      });
      form.reset();

      onSuccess();
      refetch();
    }
  }, [
    createMejaState.errors,
    createMejaState.status,
    form,
    onSuccess,
    refetch,
  ]);

  return (
    <>
      <FormMeja
        type="Tambah"
        form={form}
        isLoading={isPendingCreateMeja}
        onSubmit={onSubmit}
      />
    </>
  );
}
