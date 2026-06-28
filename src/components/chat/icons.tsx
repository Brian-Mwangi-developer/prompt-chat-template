export const SparklesIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    height={size}
    strokeLinejoin="round"
    style={{ color: "currentcolor" }}
    viewBox="0 0 16 16"
    width={size}
  >
    <path
      d="M2.5 0.5V0H3.5V0.5C3.5 1.60457 4.39543 2.5 5.5 2.5H6V3V3.5H5.5C4.39543 3.5 3.5 4.39543 3.5 5.5V6H3H2.5V5.5C2.5 4.39543 1.60457 3.5 0.5 3.5H0V3V2.5H0.5C1.60457 2.5 2.5 1.60457 2.5 0.5Z"
      fill="currentColor"
    />
    <path
      d="M14.5 4.5V5H13.5V4.5C13.5 3.94772 13.0523 3.5 12.5 3.5H12V3V2.5H12.5C13.0523 2.5 13.5 2.05228 13.5 1.5V1H14H14.5V1.5C14.5 2.05228 14.9477 2.5 15.5 2.5H16V3V3.5H15.5C14.9477 3.5 14.5 3.94772 14.5 4.5Z"
      fill="currentColor"
    />
    <path
      d="M8.40706 4.92939L8.5 4H9.5L9.59294 4.92939C9.82973 7.29734 11.7027 9.17027 14.0706 9.40706L15 9.5V10.5L14.0706 10.5929C11.7027 10.8297 9.82973 12.7027 9.59294 15.0706L9.5 16H8.5L8.40706 15.0706C8.17027 12.7027 6.29734 10.8297 3.92939 10.5929L3 10.5V9.5L3.92939 9.40706C6.29734 9.17027 8.17027 7.29734 8.40706 4.92939Z"
      fill="currentColor"
    />
  </svg>
);


export const PaperclipIcon = ({ size = 16, style }: { size?: number; style?: React.CSSProperties }) => (
  <svg
    height={size}
    strokeLinejoin="round"
    style={{ color: "currentcolor", ...style }}
    viewBox="0 0 16 16"
    width={size}
  >
    <path
      clipRule="evenodd"
      d="M13.936 2.064a3.5 3.5 0 0 0-4.95 0L2.5 8.55A5 5 0 0 0 9.57 15.62l6.365-6.364-1.06-1.06L8.51 14.56a3.5 3.5 0 0 1-4.95-4.95l6.486-6.486a2 2 0 0 1 2.83 2.83L6.39 12.44a.5.5 0 0 1-.71-.71l5.657-5.656-1.061-1.06-5.657 5.656a2 2 0 0 0 2.829 2.829l6.485-6.485a3.5 3.5 0 0 0 0-4.95Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

export const StopIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    height={size}
    strokeLinejoin="round"
    style={{ color: "currentcolor" }}
    viewBox="0 0 16 16"
    width={size}
  >
    <rect fill="currentColor" height="10" rx="2" width="10" x="3" y="3" />
  </svg>
);

export const CopyIcon = () => (
  <svg
    height="14"
    strokeLinejoin="round"
    style={{ color: "currentcolor" }}
    viewBox="0 0 16 16"
    width="14"
  >
    <path
      clipRule="evenodd"
      d="M2.5 5.5H1v9h9v-1.5H2.5v-7.5ZM6 1.5h7.5v9H6v-9Zm0-1.5a1.5 1.5 0 0 0-1.5 1.5v9A1.5 1.5 0 0 0 6 12h7.5A1.5 1.5 0 0 0 15 10.5v-9A1.5 1.5 0 0 0 13.5 0H6Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

export const ThumbUpIcon = () => (
  <svg
    height="14"
    strokeLinejoin="round"
    style={{ color: "currentcolor" }}
    viewBox="0 0 16 16"
    width="14"
  >
    <path
      clipRule="evenodd"
      d="M5.5 6V14H3.5V6h2ZM7 14V6.5L10 1l.879.439A1.5 1.5 0 0 1 11.71 3L11 6h3.5A1.5 1.5 0 0 1 16 7.5v1a1.5 1.5 0 0 1-.11.565L13.5 13.5A1.5 1.5 0 0 1 12 14.5H7V14Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

export const ThumbDownIcon = () => (
  <svg
    height="14"
    strokeLinejoin="round"
    style={{ color: "currentcolor" }}
    viewBox="0 0 16 16"
    width="14"
  >
    <path
      clipRule="evenodd"
      d="M5.5 2v8H3.5V2h2ZM7 2v7.5L10 15l.879-.439A1.5 1.5 0 0 0 11.71 13L11 10h3.5A1.5 1.5 0 0 0 16 8.5v-1a1.5 1.5 0 0 0-.11-.565L13.5 2.5A1.5 1.5 0 0 0 12 1.5H7V2Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

export const PencilEditIcon = () => (
  <svg
    height="14"
    strokeLinejoin="round"
    style={{ color: "currentcolor" }}
    viewBox="0 0 16 16"
    width="14"
  >
    <path
      clipRule="evenodd"
      d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61Zm1.414 1.06a.25.25 0 0 0-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 0 0 0-.354l-1.086-1.086ZM11.189 6.25 9.75 4.81 3.23 11.33a.25.25 0 0 0-.064.108l-.578 2.022 2.022-.579a.25.25 0 0 0 .108-.063L11.19 6.25Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

export const CrossSmallIcon = ({ size = 10 }: { size?: number }) => (
  <svg
    height={size}
    strokeLinejoin="round"
    style={{ color: "currentcolor" }}
    viewBox="0 0 10 10"
    width={size}
  >
    <path
      d="M1.5 1.5L8.5 8.5M8.5 1.5L1.5 8.5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.5"
    />
  </svg>
);
