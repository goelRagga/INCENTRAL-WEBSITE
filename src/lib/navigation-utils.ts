export function isNavLinkActive(pathname: string, href: string): boolean {
  if (href.startsWith("/#")) {
    return pathname === "/";
  }

  const [pathAndHash, query = ""] = href.split("?");
  const [path, hash = ""] = pathAndHash.split("#");
  if (path === "/") {
    return pathname === "/";
  }

  const pathMatches = pathname === path || pathname.startsWith(`${path}/`);
  if (!pathMatches) return false;
  if (!hash) return true;

  if (typeof window === "undefined") return true;
  const currentHash = window.location.hash.replace(/^#/, "");
  if (query && !window.location.search.includes(query.split("=")[0])) {
    return currentHash === hash;
  }
  return currentHash === hash;
}
