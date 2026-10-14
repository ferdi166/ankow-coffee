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

  const tax = subtotal * 0.1;
  const total = subtotal + tax;
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="mt-4 rounded-xl border bg-muted/40 p-3 text-xs">
      <div className="flex justify-between text-muted-foreground">
        <span>Subtotal ({itemCount} Item)</span>
        <span>Rp {subtotal.toLocaleString("id-ID")}</span>
      </div>

      <div className="mt-1 flex justify-between text-muted-foreground">
        <span>PB1 / Pajak Resto (10%)</span>
        <span>Rp {tax.toLocaleString("id-ID")}</span>
      </div>

      <div className="mt-2 flex justify-between border-t pt-2 text-sm font-bold">
        <span>Total Bayar</span>
        <span className="text-primary">Rp {total.toLocaleString("id-ID")}</span>
      </div>
    </div>
  );
}
