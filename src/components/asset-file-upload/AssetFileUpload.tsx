import React, { useCallback, useState } from "react";
import { UPLOAD_RETURN_TYPES } from "./AssetFileUpload.consts";

interface FileDropProps {
  onFileLoad: (fileContent: string | any) => void;
  returnType?: string;
}

export const AssetFileUpload: React.FC<FileDropProps> = ({
  onFileLoad,
  returnType = UPLOAD_RETURN_TYPES.FILE,
}) => {
  const [isDragOver, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];

    if (file) {
      switch (returnType) {
        case UPLOAD_RETURN_TYPES.FILE:
          const fileContent = await readFileContent(file);
          onFileLoad(fileContent);
          break;
        case UPLOAD_RETURN_TYPES.UPLOAD_OBJECT:
        default:
          onFileLoad(file);
          break;
      }
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result.toString());
        } else {
          reject(new Error("Failed to read the file."));
        }
      };
      reader.readAsText(file);
    });
  };

  const onFileInputChange = useCallback(
    (fileInputEvent) => {
      const files = fileInputEvent.target.files;
      if (files) {
        onFileLoad(files);
      }
    },
    [onFileLoad]
  );

  return (
    <div
      className={`add-file-container ${isDragOver ? "drag-over" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input type="file" onChange={onFileInputChange} />
    </div>
  );
};
