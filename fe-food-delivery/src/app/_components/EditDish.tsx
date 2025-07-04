import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pen } from "lucide-react";

export function EditDish() {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="relative w-[36px] flex items-center justify-center p-2 rounded-full bg-white hover:bg-red-50 top-16 h-[36px] left-40"
          >
            <Pen className="text-red-400 " />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[472px]">
          <DialogHeader>
            <DialogTitle>Dishes info</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          <div className="flex justify-between">
            <div>Dish name</div>
            <div>
              <Input id="name-1" name="name" defaultValue="" />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
