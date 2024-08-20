"use client";

import React, { useState, ChangeEvent, useRef } from "react";
import axios from "axios";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import { Loading } from "notiflix/build/notiflix-loading-aio";
import { validateFile } from "@/utils/validation";

interface DetectProps {
  acceptedFileTypes?: string[] | null;
  label?: string;
  labelAlt?: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Detect(props: DetectProps) {
  const { acceptedFileTypes, label = "", labelAlt = "" } = props;

  const [selectedFile, setSelectedFile] = useState<File>();
  const [searchText, setSearchText] = useState<string>("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [resultVideoPath, setResultVideoPath] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const clearFileInputValue = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const resetUploader = () => {
    setUploadError(null);
    setUploadSuccess(false);
    setResultVideoPath("");
    setSearchText("");
    setSelectedFile(undefined);
    clearFileInputValue();
  };

  const fileSelectedHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setSelectedFile(file);
    }
  };

  const fileUploadHandler = (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("search_text", searchText);

    Loading.dots();

    axios
      .post(`${BACKEND_URL}/api/detect`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        Notify.success("Successfully uploaded!");
        setUploadSuccess(true);
        setResultVideoPath(res.data.file_url);
      })
      .catch((error) => {
        Notify.failure(
          "An error occurred while uploading the file. Error: " +
            (error.response?.statusText || error.message)
        );
      })
      .finally(() => {
        Loading.remove();
      });
  };

  const onChangeSearchText = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const onSubmit = async () => {
    if (selectedFile && searchText) {
      const isValid = await validateFile(
        selectedFile,
        acceptedFileTypes ?? null
      );
      if (isValid) {
        setUploadError(null);
        fileUploadHandler(selectedFile);
      }
    }
  };

  const full_result_video_path = resultVideoPath
    ? `${BACKEND_URL}${resultVideoPath}`
    : "";

  return (
    <>
      <div className="flex flex-col gap-4 w-full">
        {uploadSuccess ? (
          <div className="flex flex-col gap-2">
            <div className="btn-group w-full">
              <span className="btn btn-success w-1/2">Success!</span>
              <button className="btn w-1/2" onClick={resetUploader}>
                Upload Another
              </button>
            </div>
          </div>
        ) : (
          <div className="form-control w-full gap-4">
            <div>
              <label className="label">
                <span className="label-text">{label}</span>
                <span className="label-text-alt">{labelAlt}</span>
              </label>
              <input
                type="file"
                className="file-input file-input-bordered file-input-primary w-full"
                onChange={fileSelectedHandler}
                accept={
                  acceptedFileTypes ? acceptedFileTypes.join(",") : undefined
                }
                ref={fileInputRef}
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">Input Search Text</span>
              </label>
              <input
                type="text"
                className="input input-bordered input-primary w-full px-4"
                value={searchText}
                onChange={onChangeSearchText}
              />
            </div>

            <button
              className="btn btn-primary w-full mt-4"
              onClick={onSubmit}
              type="button"
              disabled={!selectedFile || !searchText}
            >
              Submit
            </button>

            <label className="label">
              <span className="label-text-alt text-red-500">{uploadError}</span>
            </label>
          </div>
        )}
      </div>

      {resultVideoPath && (
        <>
          <label className="label">
            <span className="label-text">Search Text: {searchText}</span>
          </label>
          <video width="100%" autoPlay controls src={full_result_video_path} />
        </>
      )}
    </>
  );
}
