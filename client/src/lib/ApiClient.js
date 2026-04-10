const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "/api").replace(/\/$/, "");
const TOKEN_KEY = "authToken";

async function request(path, options = {}) {
    const isFormData = options.body instanceof FormData;
    const token = localStorage.getItem(TOKEN_KEY);

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers ?? {}),
        },
    });

    let data = null;

    try {
        data = await response.json();
    } catch {
        data = null;
    }

    if (!response.ok) {
        if (response.status === 403 && data?.code === "ACCOUNT_BANNED" && typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("auth:banned", { detail: data?.ban ?? null }));
        }

        const error = new Error(data?.general || data?.message || "Request failed");
        error.status = response.status;
        error.data = data;
        throw error;
    }

    return data;
}

export const apiClient = {
    get(path) {
        return request(path, { method: "GET" });
    },
    post(path, body) {
        return request(path, {
            method: "POST",
            body: body instanceof FormData ? body : JSON.stringify(body),
        });
    },
    patch(path, body) {
        return request(path, {
            method: "PATCH",
            body: body instanceof FormData ? body : JSON.stringify(body),
        });
    },
    put(path, body) {
        return request(path, {
            method: "PUT",
            body: body instanceof FormData ? body : JSON.stringify(body),
        });
    },
    delete(path) {
        return request(path, { method: "DELETE" });
    },
};