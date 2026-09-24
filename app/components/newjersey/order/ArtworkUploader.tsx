"use client";

import {
  type ChangeEvent,
  useRef,
  useState,
} from "react";

import {
  CheckCircle2,
  FileText,
  LoaderCircle,
  Upload,
} from "lucide-react";

type Props = {
  orderNumber: string;
  artworkId: string;

  currentStatus?: string;

  currentFileName?:
    | string
    | null;
};

type UploadResponse = {
  success: boolean;

  message?: string;

  artwork?: {
    id: string;
    fileName: string;
    mimeType: string;
    fileSize: number;
    status: string;
  };
};

const MAX_FILE_SIZE =
  15 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

function formatFileSize(
  bytes: number
) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (
    bytes <
    1024 * 1024
  ) {
    return `${(
      bytes / 1024
    ).toFixed(1)} KB`;
  }

  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(1)} MB`;
}

export default function ArtworkUploader({
  orderNumber,
  artworkId,
  currentStatus,
  currentFileName,
}: Props) {
  const inputRef =
    useRef<HTMLInputElement>(
      null
    );

  const [
    selectedFile,
    setSelectedFile,
  ] =
    useState<File | null>(
      null
    );

  const [
    uploading,
    setUploading,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    uploadedFileName,
    setUploadedFileName,
  ] = useState<
    string | null
  >(
    currentFileName ??
      null
  );

  const [
    status,
    setStatus,
  ] = useState(
    currentStatus ??
      "pending"
  );

  function chooseFile() {
    if (uploading) {
      return;
    }

    inputRef.current?.click();
  }

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    setError("");

    const file =
      event.target.files?.[0];

    if (!file) {
      setSelectedFile(
        null
      );

      return;
    }

    if (
      !ALLOWED_TYPES.includes(
        file.type
      )
    ) {
      setSelectedFile(
        null
      );

      setError(
        "Choose a JPG, PNG, WebP or PDF file."
      );

      event.target.value =
        "";

      return;
    }

    if (
      file.size >
      MAX_FILE_SIZE
    ) {
      setSelectedFile(
        null
      );

      setError(
        "Artwork must be 15 MB or smaller."
      );

      event.target.value =
        "";

      return;
    }

    if (
      file.size === 0
    ) {
      setSelectedFile(
        null
      );

      setError(
        "The selected file is empty."
      );

      event.target.value =
        "";

      return;
    }

    setSelectedFile(
      file
    );
  }

  async function uploadArtwork() {
    if (
      !selectedFile ||
      uploading
    ) {
      return;
    }

    try {
      setUploading(
        true
      );

      setError("");

      const formData =
        new FormData();

      formData.append(
        "file",
        selectedFile
      );

      formData.append(
        "artworkId",
        artworkId
      );

      const response =
        await fetch(
          `/api/orders/${encodeURIComponent(
            orderNumber
          )}/artwork`,
          {
            method: "POST",
            body: formData,
          }
        );

      const data =
        (await response.json()) as UploadResponse;

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Unable to upload artwork."
        );
      }

      setUploadedFileName(
        data.artwork
          ?.fileName ??
          selectedFile.name
      );

      setStatus(
        data.artwork
          ?.status ??
          "uploaded"
      );

      setSelectedFile(
        null
      );

      if (
        inputRef.current
      ) {
        inputRef.current.value =
          "";
      }

      window.location.reload();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to upload artwork."
      );
    } finally {
      setUploading(
        false
      );
    }
  }

  const hasUpload =
    Boolean(
      uploadedFileName
    );

  return (
    <div className="rounded-2xl border border-black/[0.07] bg-white p-4">
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf"
        onChange={
          handleFileChange
        }
        className="hidden"
      />

      {hasUpload && (
        <div className="mb-4 flex gap-3 rounded-xl bg-[#f7f7f5] p-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#FF6B00]">
            <CheckCircle2
              size={16}
            />
          </div>

          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-[#333]">
              {
                uploadedFileName
              }
            </p>

            <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#888]">
              {status.replaceAll(
                "-",
                " "
              )}
            </p>
          </div>
        </div>
      )}

      {selectedFile ? (
        <div>
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff5ed] text-[#FF6B00]">
              <FileText
                size={17}
              />
            </div>

            <div className="min-w-0">
              <p className="truncate text-xs font-bold">
                {
                  selectedFile.name
                }
              </p>

              <p className="mt-1 text-[9px] text-[#999]">
                {formatFileSize(
                  selectedFile.size
                )}
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={
                chooseFile
              }
              disabled={
                uploading
              }
              className="rounded-xl border border-black/10 px-4 py-3 text-[10px] font-bold transition hover:border-black/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Change file
            </button>

            <button
              type="button"
              onClick={
                uploadArtwork
              }
              disabled={
                uploading
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#222] px-4 py-3 text-[10px] font-bold text-white transition hover:bg-[#FF6B00] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploading ? (
                <>
                  <LoaderCircle
                    size={14}
                    className="animate-spin"
                  />

                  Uploading
                </>
              ) : (
                <>
                  <Upload
                    size={14}
                  />

                  Upload
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={
            chooseFile
          }
          disabled={
            uploading
          }
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-black/15 bg-[#fafaf8] px-4 py-4 text-[10px] font-bold text-[#555] transition hover:border-[#FF6B00] hover:text-[#FF6B00]"
        >
          <Upload
            size={15}
          />

          {hasUpload
            ? "Replace artwork"
            : "Choose artwork"}
        </button>
      )}

      <p className="mt-3 text-[9px] leading-4 text-[#999]">
        JPG, PNG, WebP or PDF.
        Maximum 15 MB.
      </p>

      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-[9px] font-semibold text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}