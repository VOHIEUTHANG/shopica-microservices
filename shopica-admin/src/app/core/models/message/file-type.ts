export interface FileType {
  name: string;
  colorCode: string;
  mimeType: string[];
}
export const fileMineTypes: FileType[] = [
  {
    name: "other",
    colorCode: "#56687a",
    mimeType: [
      "application/octet-stream"
    ]
  },
  {
    name: "DOC",
    colorCode: "#1f4182",
    mimeType: [
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ]
  },
  {
    name: "IMAGE",
    colorCode: "#56687a",
    mimeType: [
      "image/png",
      "image/jpeg",
      "image/gif",
      "image/bmp"
    ]
  },
  {
    name: "VIDEO",
    colorCode: "#56687a",
    mimeType: [
      "video/mp4",
      "video/mpeg"
    ]
  },
  {
    name: "PDF",
    colorCode: "#cd2827",
    mimeType: [
      "application/pdf"
    ]
  },
  {
    name: "xlsx",
    colorCode: "#367643",
    mimeType: [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv"
    ]
  },
  {
    name: "TXT",
    colorCode: "#8344cc",
    mimeType: [
      "text/plain"
    ]
  },
  {
    name: "ppt",
    colorCode: "#b24020",
    mimeType: [
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ]
  }
]
