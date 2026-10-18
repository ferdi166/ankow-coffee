"use server";

import { createClient } from "@/lib/supabase/server";

type KitchenOrderStatus = "received" | "in_progress" | "ready" | "completed";

const nextStatus: Record<KitchenOrderStatus, KitchenOrderStatus | null> = {
  received: "in_progress",
  in_progress: "ready",
  ready: "completed",
  completed: null,
};

export async function updateKitchenOrderStatus(
  orderId: string,
  currentStatus: KitchenOrderStatus,
) {
  const status = nextStatus[currentStatus];

  if (!status) {
    return { success: false };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("orders")
    .update({ order_status: status })
    .eq("id", orderId)
    .eq("order_status", currentStatus);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true };
}
