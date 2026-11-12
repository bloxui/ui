"use client";

import * as React from "react";
import { Field, FileUpload, type UploadFile } from "@blox-ui/ui";

export default function FileUploadExample() {
  const [files, setFiles] = React.useState<UploadFile[]>([]);

  // Pretend upload: in a real app, send each file and report progress the same way.
  function upload(added: UploadFile[]) {
    for (const item of added) {
      let progress = 0;
      const timer = setInterval(() => {
        progress = Math.min(100, progress + 20);
        setFiles((current) => current.map((file) => (file.id === item.id ? { ...file, progress } : file)));
        if (progress === 100) clearInterval(timer);
      }, 300);
    }
  }

  return (
    <Field label="Attachments" className="w-full max-w-md">
      <FileUpload
        files={files}
        onFilesChange={setFiles}
        onFilesAdded={upload}
        accept="image/*,.pdf"
        maxSize={5 * 1024 * 1024}
        maxFiles={3}
        hint="Images or PDF, up to 5 MB each, three files at most."
      />
    </Field>
  );
}
