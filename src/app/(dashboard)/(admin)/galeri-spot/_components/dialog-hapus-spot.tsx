import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Spot } from "@/validations/spot-validation";
import { Trash2 } from "lucide-react";

export default function DialogHapusSpot({ spot }: { spot: Spot }) {
  return (
    <AlertDialogContent size="sm">
      <AlertDialogHeader>
        <AlertDialogMedia className="bg-destructive/10 text-destructive">
          <Trash2 />
        </AlertDialogMedia>
        <AlertDialogTitle className="font-semibold">
          Hapus Spot Ini?
        </AlertDialogTitle>
        <AlertDialogDescription>
          Apakah Anda yakin ingin menghapus Spot{" "}
          <span className="font-semibold text-foreground">{spot.title}</span>{" "}
          ini? Akses staf ini ke CMS akan langsung dicabut dan tindakan ini
          tidak dapat dibatalkan.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel variant="outline">Batal</AlertDialogCancel>
        <AlertDialogAction className="bg-destructive text-primary-foreground">
          Hapus
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
