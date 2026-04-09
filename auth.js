
export const getLoggedInUser = () => {
  if (typeof window === "undefined") return null;

  const cookieStr = document.cookie.split('; ').find(row => row.startsWith('loggedInUser='));
  const user = cookieStr ? decodeURIComponent(cookieStr.split('=')[1]) : null;
  return user ? JSON.parse(user) : null;
};

