import Image from "next/image";

const brandImage = "/assets/Luxurious%20Gold%20Goynar%20Gontobbo%20Monogram.png";

export function BrandImage({
  alt = "Goynar Gontobbo",
  className,
  width,
  height,
  priority,
}: {
  alt?: string;
  className: string;
  width: number;
  height: number;
  priority?: boolean;
}) {
  return <Image src={brandImage} alt={alt} width={width} height={height} priority={priority} className={className} />;
}
