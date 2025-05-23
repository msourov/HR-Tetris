import { useState } from "react";
import { Tooltip } from "@mantine/core";

const AvatarWithFallback = ({ name, src }: { name: string; src: string }) => {
  const [imgError, setImgError] = useState(false);

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Tooltip label={name}>
      {imgError ? (
        <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-semibold border-2 border-white hover:scale-110 transition-transform cursor-pointer">
          {initials}
        </div>
      ) : (
        <img
          src={src}
          alt={name}
          onError={() => setImgError(true)}
          className="w-8 h-8 rounded-full object-cover border-2 border-white hover:scale-110 transition-transform cursor-pointer"
        />
      )}
    </Tooltip>
  );
};
export default AvatarWithFallback;
