import React from "react";

type IconProps = React.SVGProps<SVGSVGElement>;

const createIcon = (path: string) => (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
    <path d={path} />
  </svg>
);

export const FaArrowLeft = createIcon(
  "M15.7 5.3a1 1 0 0 1 0 1.4L12.4 10H20a1 1 0 1 1 0 2h-7.6l3.3 3.3a1 1 0 0 1-1.4 1.4l-5-5a1 1 0 0 1 0-1.4l5-5a1 1 0 0 1 1.4 0z"
);

export const FaEdit = createIcon(
  "M4 17.25V20h2.75L17.81 8.94l-2.75-2.75L4 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
);

export const FaSearch = createIcon(
  "M15.5 14h-.79l-.28-.27A6.5 6.5 0 1 0 9.5 16a6.5 6.5 0 0 0 4.23-1.53l.27.28v.79l5 5L20.5 19l-5-5zm-6 0a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z"
);

export const FaRandom = createIcon(
  "M18 3h-5v2h3.59l-3.3 3.29 1.42 1.42L18 6.41V10h2V3h-2zM6 5 2 9l4 4v-3h5V8H6V5zm6.71 6.29L11.3 12.7 14.17 15H10v2h6l-3.29 3.29 1.41 1.42L20 16.41 18.59 15 15 18.59V17h-1.83l-1.46-1.46 1-1.25z"
);

export const GiSoccerKick = createIcon(
  "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 2.5 2.4 1.4-.5 2.6h-3.8l-.5-2.6L12 4.5zm-5 6 .8-2.2 2.1.2 1.1 2.1-1.6 1.7L7 10.5zm5 6.9-2.2-1.5.7-2.5h3l.7 2.5-2.2 1.5zm3.9-5.1-1.6-1.7 1.1-2.1 2.1-.2.8 2.2-2.4 1.8z"
);

export const GiGoalKeeper = createIcon(
  "M7 3a2 2 0 0 0-2 2v9.5A5.5 5.5 0 0 0 10.5 20h3A5.5 5.5 0 0 0 19 14.5V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v3h-1V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v5H9V5a2 2 0 0 0-2-2z"
);