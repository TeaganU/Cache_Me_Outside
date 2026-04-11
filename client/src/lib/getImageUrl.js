const SERVER_ORIGIN = "http://localhost:4000";

export function getImageUrl(imagePath) {
    if (!imagePath) return "";

    const withCacheBust = imagePath.includes("/api/profile/")
        && imagePath.includes("/image")
        && !imagePath.includes("v=")
        ? `${imagePath}${imagePath.includes("?") ? "&" : "?"}v=latest`
        : imagePath;

    if (withCacheBust.startsWith("http://") || withCacheBust.startsWith("https://")) {
        return withCacheBust;
    }

    return `${SERVER_ORIGIN}${withCacheBust}`;
}
