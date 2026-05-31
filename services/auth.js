const API = process.env.NEXT_PUBLIC_API_URL;

export async function login(email, password) {
  try {
    const res = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Login failed",
      };
    }

    return data;
  } catch (err) {
    return {
      success: false,
      message: "Network error: " + err.message,
    };
  }
}

export async function signup(fullName, email, password) {
  try {
    const res = await fetch(`${API}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, password }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Signup failed",
      };
    }

    return data;
  } catch (err) {
    return {
      success: false,
      message: "Network error: " + err.message,
    };
  }
}

export async function getUser(token) {
  try {
    const res = await fetch(`${API}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Unauthorized",
      };
    }

    return data;
  } catch (err) {
    return {
      success: false,
      message: "Network error: " + err.message,
    };
  }
}
