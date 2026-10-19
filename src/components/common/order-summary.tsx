type SelectedItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  notes: string;
};

type Props = {
  items: SelectedItem[];
};

export default function OrderSummary({ items }: Props) {
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + tax;
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <div className="space-y-2 rounded-xl border bg-muted/40 p-4 text-sm">
      <div className="flex justify-between text-muted-foreground">
        <span>Subtotal ({itemCount} Item)</span>
        <span>Rp {subtotal.toLocaleString("id-ID")}</span>
      </div>

      <div className="flex justify-between text-muted-foreground">
        <span>PB1 / Pajak Resto (10%)</span>
        <span>Rp {tax.toLocaleString("id-ID")}</span>
      </div>

      <div className="flex justify-between border-t pt-2 font-bold">
        <span>Total Bayar</span>
        <span className="text-primary">Rp {total.toLocaleString("id-ID")}</span>
      </div>
    </div>
  );
}
