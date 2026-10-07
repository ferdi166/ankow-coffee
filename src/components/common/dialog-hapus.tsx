import { Loader2, Trash2 } from "lucide-react";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { ReactNode } from "react";

export default function DialogHapus({
  title,
  description,
  onSubmit,
  isLoading,
}: {
  title: string;
  description: ReactNode;
  onSubmit: () => void;
  isLoading: boolean;
}) {
  return (
    <AlertDialogContent size="sm">
      <AlertDialogHeader>
        <AlertDialogMedia className="bg-destructive/10 text-destructive">
          <Trash2 />
        </AlertDialogMedia>
        <AlertDialogTitle className="font-semibold">
          Hapus {title} Ini?
        </AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel variant="outline">Batal</AlertDialogCancel>
        <AlertDialogAction
          onClick={onSubmit}
          disabled={isLoading}
          className="bg-destructive/90 hover:bg-destructive text-primary-foreground">
          {isLoading ? <Loader2 className="animate-spin" /> : "Hapus"}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
