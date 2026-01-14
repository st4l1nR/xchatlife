"use client";

import { useState, useCallback } from "react";
import { api } from "@/trpc/react";

export type UploadProgress = {
  status: "idle" | "getting-url" | "uploading" | "success" | "error";
  progress: number;
  error?: string;
};

export type UploadResult = {
  publicUrl: string;
  key: string;
};

export function useMediaUpload() {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    status: "idle",
    progress: 0,
  });

  const getPresignedUrl = api.media.getPresignedUploadUrl.useMutation();

  const uploadFile = useCallback(
    async (
      file: File,
      folder: "characters" | "avatars" | "posters" | "videos" = "characters",
    ): Promise<UploadResult> => {
      setUploadProgress({ status: "getting-url", progress: 0 });

      try {
        // Step 1: Get presigned URL from server
        const { data } = await getPresignedUrl.mutateAsync({
          filename: file.name,
          contentType: file.type,
          folder,
        });

        if (!data) {
          throw new Error("Failed to get presigned URL");
        }

        setUploadProgress({ status: "uploading", progress: 10 });

        // Step 2: Upload file directly to R2 using presigned URL
        const uploadResponse = await fetch(data.uploadUrl, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });

        if (!uploadResponse.ok) {
          throw new Error(`Upload failed: ${uploadResponse.statusText}`);
        }

        setUploadProgress({ status: "success", progress: 100 });

        return {
          publicUrl: data.publicUrl,
          key: data.key,
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Upload failed";
        setUploadProgress({
          status: "error",
          progress: 0,
          error: errorMessage,
        });
        throw error;
      }
    },
    [getPresignedUrl],
  );

  const resetProgress = useCallback(() => {
    setUploadProgress({ status: "idle", progress: 0 });
  }, []);

  return {
    uploadFile,
    uploadProgress,
    resetProgress,
    isUploading:
      uploadProgress.status === "getting-url" ||
      uploadProgress.status === "uploading",
  };
}
