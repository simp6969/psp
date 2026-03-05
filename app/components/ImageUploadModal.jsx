"use client";

import { useState, useRef } from "react";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";

export function UploadForm({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [username, setUsername] = useState(useUser().user.username);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setStatus(null);
    setMessage("");

    // Generate a local preview
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(selected);
  };

  const resetForm = () => {
    setFile(null);
    setPreview(null);
    setUsername("");
    setStatus(null);
    setMessage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !username.trim()) {
      setStatus("error");
      setMessage("Please select a file and enter a username.");
      return;
    }

    setUploading(true);
    setStatus(null);
    setMessage("");

    const formData = new FormData();
    formData.append("photo", file);
    formData.append("username", username.trim());

    try {
      const response = await fetch("https://photo-share-backend-production.up.railway.app/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setStatus("success");
        setMessage("Photo uploaded successfully!");
        setTimeout(() => {
          resetForm();
          onUploadSuccess?.();
        }, 1200);
      } else {
        const errorData = await response.json();
        setStatus("error");
        setMessage(`Upload failed: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setStatus("error");
      setMessage("Connection error. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
     

      {/* File Drop Zone */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-muted-foreground">
          Photo
        </label>
        <div
          className="relative group cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <div className="w-full border-2 border-dashed border-muted-foreground/25 rounded-xl group-hover:border-primary/50 transition-colors overflow-hidden">
            {preview ? (
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full max-h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    Click to change
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 gap-2">
                <Upload className="w-8 h-8 text-muted-foreground/50 group-hover:text-primary/70 transition-colors" />
                <span className="text-sm text-muted-foreground">
                  Click to select a photo
                </span>
              </div>
            )}
          </div>
        </div>
        {file && (
          <p className="text-xs text-muted-foreground truncate">{file.name}</p>
        )}
      </div>

      {/* Status message */}
      {message && (
        <div
          className={`flex items-center gap-2 text-sm rounded-lg px-3 py-2 ${
            status === "success"
              ? "bg-green-500/10 text-green-600 dark:text-green-400"
              : "bg-red-500/10 text-red-600 dark:text-red-400"
          }`}
        >
          {status === "success" ? (
            <CheckCircle className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          {message}
        </div>
      )}

      {/* Submit */}
      <Button
        type="submit"
        disabled={uploading || status === "success"}
        className="w-full"
      >
        {uploading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Uploading…
          </span>
        ) : status === "success" ? (
          "Done!"
        ) : (
          "Upload Photo"
        )}
      </Button>
    </form>
  );
}
