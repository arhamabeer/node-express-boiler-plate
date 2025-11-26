const map = new Map();

export function setUserCookie(sessionId, user) {
  map.set(sessionId, user);
}
export function getUserCookie(sessionId) {
  return map.get(sessionId);
}
