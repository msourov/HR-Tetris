import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

type UserImageProps = {
  src?: string | null;
  fallback?: string;
  size?: number;
  className?: string;
  imageKey?: number;
};

export default function UserImage({
  src,
  fallback = "/assets/employee_avatar.png",
  size = 144,
  className = "",
  imageKey = Date.now(),
}: UserImageProps) {
  const imageSrc = src ? `${src}?t=${imageKey}` : fallback;

  return (
    <LazyLoadImage
      src={imageSrc}
      alt="User"
      effect="blur"
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.onerror = null;
        target.src = fallback;
      }}
      style={{
        width: size,
        height: size,
      }}
      className={`block object-cover rounded-full aspect-square ${className}`}
    />
  );
}
