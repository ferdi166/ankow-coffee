import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect, useRef } from "react";
import { editPesanan } from "../action";
import { toast } from "@/components/ui/toast";
import FormPesanan from "./form-pesanan";
import {
  OrdersWithItems,
  OrdersWithItemsForm,
  OrdersWithItemsSchemaForm,
} from "@/validations/orders-validation";
import {
  INITIAL_ORDERS,
  INITIAL_STATE_ORDERS,
} from "@/constants/orders-constant";

export default function DialogEditPesanan({
  pesanan,
  refetch,
  onSuccess,
}: {
  pesanan: OrdersWithItems;
  refetch: () => void;
  onSuccess: () => void;
}) {
  const form = useForm<OrdersWithItemsForm>({
    resolver: zodResolver(OrdersWithItemsSchemaForm),
    defaultValues: INITIAL_ORDERS,
  });

  useEffect(() => {
    form.reset({
      customer_name: pesanan.customer_name,
      order_type: pesanan.order_type as "Dine In" | "Takeaway",
      table_id: pesanan.table_id || null,
      items: pesanan.order_items.map((item) => ({
        menu_item_id: item.menu_items.id,
        quantity: item.quantity,
        notes: item.notes ?? undefined,
      })),
    });
  }, [pesanan, form]);

  const [editPesananState, editPesananAction, isPendingEditPesanan] =
    useActionState(editPesanan, INITIAL_STATE_ORDERS);

  const hasHandledResult = useRef(false);

  // eslint-disable-next-line react-hooks/refs
  const onSubmit = form.handleSubmit((data) => {
    hasHandledResult.current = false;
    const formData = new FormData();

    formData.append("customer_name", data.customer_name);
    formData.append("order_type", data.order_type);
    formData.append("table_id", data.table_id ?? "");
    formData.append("items", JSON.stringify(data.items));
    formData.append("id", pesanan.id);
    startTransition(() => {
      editPesananAction(formData);
    });
  });

  useEffect(() => {
    if (
      (editPesananState.status !== "success" &&
        editPesananState.status !== "error") ||
      hasHandledResult.current
    ) {
      return;
    }

    hasHandledResult.current = true;

    if (editPesananState.status === "error") {
      toast.add({
        type: "error",
        title: "Edit Pesanan gagal",
        description: editPesananState.errors?._form?.[0],
        priority: "high",
      });

      return;
    }

    toast.add({
      type: "success",
      title: "Edit Pesanan berhasil",
      description: "Data Pesanan berhasil dirubah",
    });

    onSuccess();
    refetch();
  }, [editPesananState, form, onSuccess, refetch]);

  return (
    <>
      <FormPesanan
        type="Edit"
        pesanan={pesanan}
        form={form}
        isLoading={isPendingEditPesanan}
        onSubmit={onSubmit}
      />
    </>
  );
}
