"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CloudinaryUpload } from "@/components/CloudinaryUpload";

interface AddFoodModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryName: string;
  foodData: {
    foodName: string;
    image: string;
    ingredients: string;
    price: number;
  };
  onFoodDataChange: (data: any) => void;
  onSubmit: () => void;
}

export const AddFoodModal = ({
  open,
  onOpenChange,
  categoryName,
  foodData,
  onFoodDataChange,
  onSubmit,
}: AddFoodModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-2xl font-bold">
            Add new food to {categoryName}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Add a new dish to this category
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="foodName" className="text-sm font-medium">
              Food Name
            </Label>
            <Input
              id="foodName"
              value={foodData.foodName}
              onChange={(e) =>
                onFoodDataChange({ ...foodData, foodName: e.target.value })
              }
              placeholder="Enter food name"
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image" className="text-sm font-medium">
              Food Image
            </Label>
            <CloudinaryUpload
              onImageUpload={(url) =>
                onFoodDataChange({ ...foodData, image: url })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ingredients" className="text-sm font-medium">
              Ingredients
            </Label>
            <Textarea
              id="ingredients"
              value={foodData.ingredients}
              onChange={(e) =>
                onFoodDataChange({ ...foodData, ingredients: e.target.value })
              }
              placeholder="Enter ingredients"
              className="min-h-[80px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm font-medium">
              Price ($)
            </Label>
            <div className="relative">
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={foodData.price || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  onFoodDataChange({
                    ...foodData,
                    price: value === "" ? 0 : parseFloat(value),
                  });
                }}
                className="pr-8"
                placeholder="0.00"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                $
              </span>
            </div>
            <p className="text-xs text-gray-400">Жишээ: 15000, 25000.50</p>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={onSubmit}
            className="w-full bg-black hover:bg-gray-800 text-white"
          >
            Add Food
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
