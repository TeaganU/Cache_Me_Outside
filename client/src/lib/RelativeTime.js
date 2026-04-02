export function RelativeTime(timestamp) {
    if (!timestamp) {
        return "Recently";
    }

    const postDate = new Date(timestamp);
    if (Number.isNaN(postDate.getTime())) {
        return "Recently";
    }

    const diffMs = Date.now() - postDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 0) {
        return `${diffDays} Day${diffDays === 1 ? "" : "s"} Ago`;
    }

    if (diffHours > 0) {
        return `${diffHours} Hour${diffHours === 1 ? "" : "s"} Ago`;
    }

    if (diffMins > 0) {
        return `${diffMins} Minute${diffMins === 1 ? "" : "s"} Ago`;
    }

    return "Recently";
}