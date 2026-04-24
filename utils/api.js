/* utils/api.js */

const getCookie = (name) => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

export const fetchWithAuth = async (url, options = {}) => {
  let token = getCookie("token");

  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  let res = await fetch(url, { ...options, headers });

  if (res.status === 401) {
    const refreshToken = getCookie("refreshToken");
    
    if (refreshToken) {
      try {
        const refreshRes = await fetch("http://localhost:5000/api/auth/refresh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: refreshToken })
        });

        if (refreshRes.ok) {
          const data = await refreshRes.json();
          document.cookie = `token=${data.token}; path=/`;
          
          headers.set("Authorization", `Bearer ${data.token}`);
          res = await fetch(url, { ...options, headers });
        } else {
          document.cookie = "token=; path=/; max-age=0";
          document.cookie = "refreshToken=; path=/; max-age=0";
          document.cookie = "loggedInUser=; path=/; max-age=0";
          window.dispatchEvent(new Event("authChange"));
        }
      } catch (err) {
        console.error("Token refresh failed", err);
      }
    } else {
      document.cookie = "token=; path=/; max-age=0";
      document.cookie = "loggedInUser=; path=/; max-age=0";
      window.dispatchEvent(new Event("authChange"));
    }
  }

  return res;
};
