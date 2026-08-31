export function isOnline(lastSeenAt) {
  if (!lastSeenAt) return false;
  const diffMs = Date.now() - new Date(lastSeenAt).getTime();
  return diffMs < 2 * 60 * 1000;
}