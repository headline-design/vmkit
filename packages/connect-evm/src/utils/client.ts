export function parseCookie(cookie: string, key: string) {
    const keyValue = cookie.split("; ").find((x) => x.startsWith(`${key}=`));
    if (!keyValue) return undefined;
    return keyValue.substring(key.length + 1);
  }

  export const cookieStorage = {
    getItem(key: string) {
      if (typeof window === "undefined") return null;
      const value = parseCookie(document.cookie, key);
      return value ?? null;
    },
    setItem(key: any, value: any) {
      if (typeof window === "undefined") return;
      document.cookie = `${key}=${value}`;
    },
    removeItem(key: any) {
      if (typeof window === "undefined") return;
      document.cookie = `${key}=;max-age=-1`;
    },
  };
