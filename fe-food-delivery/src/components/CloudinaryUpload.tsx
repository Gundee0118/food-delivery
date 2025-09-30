"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import Image from "next/image";

interface CloudinaryUploadProps {
  onImageUpload: (imageUrl: string) => void;
  currentImage?: string;
}

export const CloudinaryUpload = ({
  onImageUpload,
  currentImage,
}: CloudinaryUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);

  const uploadToCloudinary = async (file: File): Promise<string> => {
    console.log("=== UPLOAD START ===");
    console.log("File details:", {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    // Use direct fetch - the simplest method
    const cloudName = "dk51jqc4v";
    const uploadPreset = "foodDeliverySoftware";

    console.log("🔗 Using direct fetch method...");
    console.log("Cloudinary config:", { cloudName, uploadPreset });

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      console.log("🚀 Making direct fetch request...");
      console.log(
        "Upload URL:",
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
      );

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      console.log("📡 Response received:");
      console.log("- status:", response.status);
      console.log("- ok:", response.ok);
      console.log("- statusText:", response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Cloudinary error response:", errorText);
        throw new Error(
          `Upload failed: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      const data = await response.json();
      console.log("✅ Upload successful!");
      console.log("- secure_url:", data.secure_url);
      console.log("- public_id:", data.public_id);
      console.log("- format:", data.format);
      console.log("- width:", data.width);
      console.log("- height:", data.height);
      console.log("=== UPLOAD END ===");
      return data.secure_url;
    } catch (error: any) {
      console.error("❌ Upload failed:");
      console.error("- error name:", error.name);
      console.error("- error message:", error.message);
      console.error("- error stack:", error.stack);
      console.error("=== UPLOAD ERROR END ===");

      // More specific error handling
      if (
        error.name === "TypeError" &&
        error.message.includes("Failed to fetch")
      ) {
        throw new Error(
          "Сүлжээний алдаа: Cloudinary-тай холбогдох боломжгүй байна. Интернет холболт эсвэл CORS асуудал байж магадгүй."
        );
      }

      if (error.message.includes("Upload failed:")) {
        throw new Error(`Cloudinary upload алдаа: ${error.message}`);
      }

      throw error;
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.log("No file selected");
      return;
    }

    console.log("File selected:", file.name, file.size, file.type);

    // File size check (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Файлын хэмжээ 5MB-аас их байна");
      return;
    }

    // File type check
    if (!file.type.startsWith("image/")) {
      alert("Зөвхөн зураг файл оруулна уу");
      return;
    }

    setUploading(true);

    try {
      console.log("File validation passed, starting upload...");

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        console.log("Preview created:", result ? "Yes" : "No");
        setPreview(result);
      };
      reader.readAsDataURL(file);

      // Upload to Cloudinary
      console.log("Calling uploadToCloudinary...");
      const imageUrl = await uploadToCloudinary(file);
      console.log("Upload completed, calling onImageUpload with:", imageUrl);

      // Call the callback function
      onImageUpload(imageUrl);
      console.log("onImageUpload called successfully");
    } catch (error: any) {
      console.error("Upload failed:", error);
      alert(
        `Зураг upload хийхэд алдаа гарлаа: ${error.message || "Unknown error"}`
      );
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setPreview(null);
    onImageUpload("");
  };

  return (
    <div className="space-y-4">
      {preview ? (
        <div className="relative">
          <Image
            src={preview}
            alt="Preview"
            width={300}
            height={200}
            className="rounded-lg object-cover w-full h-48"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={removeImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            Зураг сонгох эсвэл энд чирж тавина уу
          </p>
          <p className="text-xs text-gray-500">PNG, JPG, GIF хүртэл 5MB</p>
        </div>
      )}

      <div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
          id="image-upload"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById("image-upload")?.click()}
          disabled={uploading}
          className="w-full"
        >
          {uploading ? "Upload хийж байна..." : "Зураг сонгох"}
        </Button>
      </div>
    </div>
  );
};
