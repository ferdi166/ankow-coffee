type Props = {
  params: Promise<{ id: string }>;
};

export default async function PesananMeja({ params }: Props) {
  const { id } = await params;

  return (
    <div>
      <h1>Pesanan Meja {id}</h1>
    </div>
  );
}
