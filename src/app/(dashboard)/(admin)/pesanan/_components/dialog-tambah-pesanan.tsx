import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { createPesanan } from "@/actions/order-action";
import { toast } from "@/components/ui/toast";
import FormPesanan from "./form-pesanan";
import {
  OrdersWithItemsForm,
  OrdersWithItemsSchemaForm,
} from "@/validations/orders-validation";
import {
  INITIAL_ORDERS,
  INITIAL_STATE_ORDERS,
} from "@/constants/orders-constant";

export default function DialogTambahPesanan({
  refetch,
  onSuccess,
}: {
  refetch: () => void;
  onSuccess: () => void;
}) {
  const form = useForm<OrdersWithItemsForm>({
    resolver: zodResolver(OrdersWithItemsSchemaForm),
    defaultValues: INITIAL_ORDERS,
  });

  const [createPesananState, createPesananAction, isPendingCreatePesanan] =
    useActionState(createPesanan, INITIAL_STATE_ORDERS);

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();

    formData.append("customer_name", data.customer_name ?? "");
    formData.append("order_type", data.order_type);
    formData.append("table_id", data.table_id ?? "");
    formData.append("items", JSON.stringify(data.items));

    startTransition(() => {
      createPesananAction(formData);
    });
  });

  useEffect(() => {
    if (createPesananState.status === "error") {
      toast.add({
        type: "error",
        title: "Tambah Pesanan gagal",
        description: createPesananState.errors?._form?.[0],
        priority: "high",
      });
    }

    if (createPesananState.status === "success") {
      toast.add({
        type: "success",
        title: "Tambah Pesanan berhasil",
        description: "Data Pesanan berhasil ditambahkan",
      });
      form.reset();

      onSuccess();
      refetch();
    }
  }, [
    createPesananState.errors,
    createPesananState.status,
    form,
    onSuccess,
    refetch,
  ]);

  return (
    <>
      <FormPesanan
        type="Tambah"
        form={form}
        isLoading={isPendingCreatePesanan}
        onSubmit={onSubmit}
      />
    </>
  );
}
