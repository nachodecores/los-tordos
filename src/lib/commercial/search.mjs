export function listingParams(params) {
  const q = typeof params.q === "string" ? params.q.trim().slice(0, 100) : "";
  const rawPage = typeof params.page === "string" ? Number(params.page) : 1;
  const page = Number.isSafeInteger(rawPage) && rawPage > 0 && rawPage <= 100000 ? rawPage : 1;
  return { q, page, from: (page - 1) * 25, to: page * 25 - 1 };
}
