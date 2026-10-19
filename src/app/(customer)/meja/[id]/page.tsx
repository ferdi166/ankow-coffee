import PesananMeja from "./_components/pesanan-meja";

export const metadata = {
  title: "Pesanan Meja | Ankow Coffee",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default function PesananMejaPage({ params }: Props) {
  return <PesananMeja params={params} />;
}
