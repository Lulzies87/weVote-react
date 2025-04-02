import { Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Poll } from "@/types/poll";

type DeletePollButtonProps = {
  poll: Poll;
  onClick: () => void;
};

export function DeletePollButton({ poll, onClick }: DeletePollButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger className="p-2 bg-destructive/90 hover:bg-destructive">
          <Trash className="h-4 w-4"/>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-bold text-destructive">
            This will permanently delete the poll
          </AlertDialogTitle>
          <AlertDialogDescription className="text-foreground">
            Are you sure you want to permenantly delete {poll.title}?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-destructive/90 hover:bg-destructive" onClick={onClick}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
