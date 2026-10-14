import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { createMeja } from "../action";
import { toast } from "@/components/ui/toast";
import { INITIAL_STATE_TABLE } from "@/constants/meja-constant";
import FormPesanan from "./form-pesanan";
import {
  OrdersWithItemsForm,
  OrdersWithItemsSchemaForm,
} from "@/validations/orders-validation";

export default function DialogTambahPesanan({
  refetch,
  onSuccess,
}: {
  refetch: () => void;
  onSuccess: () => void;
}) {
  const form = useForm<OrdersWithItemsForm>({
    resolver: zodResolver(OrdersWithItemsSchemaForm),
    defaultValues: {
      customer_name: "",
      order_type: "Takeaway",
      table_id: null,
      items: [],
    },
  });

  const [createMejaState, createMejaAction, isPendingCreateMeja] =
    useActionState(createMeja, INITIAL_STATE_TABLE);

  const onSubmit = form.handleSubmit((data) => {
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
      <FormPesanan
        type="Tambah"
        form={form}
        isLoading={isPendingCreateMeja}
        onSubmit={onSubmit}
      />
    </>
  );
}
