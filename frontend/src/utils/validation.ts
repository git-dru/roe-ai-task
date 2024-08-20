import { Notify } from "notiflix/build/notiflix-notify-aio";

const MAX_VIDEO_DURATION = parseInt(
  process.env.NEXT_PUBLIC_MAX_VIDEO_DURATION || "180"
);

export const validateFile = (
  file: File,
  acceptedFileTypes: string[] | null
): Promise<boolean> => {
  return new Promise((resolve) => {
    const video = document.createElement("video");

    video.preload = "metadata";
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      const duration = video.duration;

      if (duration > MAX_VIDEO_DURATION) {
        Notify.failure("Video length cannot exceed 3 minutes");
        resolve(false);
      } else if (acceptedFileTypes && !acceptedFileTypes.includes(file.type)) {
        Notify.failure(
          "File type not accepted. Accepted types: " +
            acceptedFileTypes.join(", ")
        );
        resolve(false);
      } else {
        resolve(true);
      }
    };

    video.src = URL.createObjectURL(file);
  });
};
