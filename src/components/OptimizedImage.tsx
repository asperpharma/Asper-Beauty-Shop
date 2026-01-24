/**
 * Helper to generate Shopify CDN image URLs with size optimization
 */
export const getOptimizedShopifyImageUrl = (
  url: string,
  width: number,
  height?: number,
): string => {
  if (!url || !url.includes("cdn.shopify.com")) {
    return url;
  }

  // Shopify image URL transformation
  // Format: {url}_WIDTHxHEIGHT.{format} or using query params
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.set("width", width.toString());
    if (height) {
      urlObj.searchParams.set("height", height.toString());
    }
    urlObj.searchParams.set("crop", "center");
    return urlObj.toString();
  } catch {
    return url;
  }
};

/**
 * Generate srcset for responsive images
 */
export const getShopifyImageSrcSet = (
  url: string,
  sizes: number[],
): string => {
  if (!url || !url.includes("cdn.shopify.com")) {
    return "";
  }

  return sizes
    .map((size) => `${getOptimizedShopifyImageUrl(url, size)} ${size}w`)
    .join(", ");
};

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  sizes?: string;
  loading?: "lazy" | "eager";
  fetchPriority?: "high" | "low" | "auto";
  isShopify?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage = ({
  src,
  alt,
  className = "",
  width,
  height,
  sizes = "(max-width: 768px) 100vw, 50vw",
  loading = "lazy",
  fetchPriority = "auto",
  isShopify = true,
  onLoad,
  onError,
}: OptimizedImageProps) => {
  const isShopifyUrl = src?.includes("cdn.shopify.com");

  // Prevent layout shift by calculating aspect ratio
  const aspectRatioStyle = width && height
    ? { aspectRatio: `${width} / ${height}` }
    : {};

  if (isShopify && isShopifyUrl) {
    const srcSet = getShopifyImageSrcSet(src, [200, 400, 600, 800, 1200, 1600]);
    const optimizedSrc = width
      ? getOptimizedShopifyImageUrl(src, width, height)
      : src;

    return (
      <img
        src={optimizedSrc}
        srcSet={srcSet || undefined}
        sizes={srcSet ? sizes : undefined}
        alt={alt}
        className={className}
        loading={loading}
        fetchPriority={fetchPriority}
        width={width}
        height={height}
        onLoad={onLoad}
        onError={onError}
        decoding="async"
        style={aspectRatioStyle}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      fetchPriority={fetchPriority}
      width={width}
      height={height}
      onLoad={onLoad}
      onError={onError}
      decoding="async"
      style={aspectRatioStyle}
    />
  );
};
