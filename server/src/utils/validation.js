export function fail(message, status = 400) {
  throw Object.assign(new Error(message), { status });
}
export function text(value, name, max = 200) {
  if (typeof value !== "string" || !value.trim() || value.trim().length > max)
    fail(`Invalid ${name}`);
  return value.trim();
}
export function email(value) {
  const result = text(value, "email", 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result)) fail("Invalid email");
  return result;
}
export function password(value) {
  if (
    typeof value !== "string" ||
    value.length < 8 ||
    Buffer.byteLength(value) > 72
  )
    fail("Password must be at least 8 characters and at most 72 bytes");
  return value;
}
export function quantity(value, allowZero = false) {
  if (!Number.isInteger(value) || value < (allowZero ? 0 : 1) || value > 99)
    fail("Quantity must be an integer between 1 and 99 (0 removes an item)");
  return value;
}
export function address(value = {}) {
  const out = {};
  for (const key of [
    "firstName",
    "lastName",
    "phone",
    "address",
    "city",
    "state",
    "zip",
  ])
    out[key] = text(value[key], key);
  out.email = email(value.email);
  if (
    !/^[+\d ()-]{7,25}$/.test(out.phone) ||
    !/^[A-Za-z0-9 -]{3,12}$/.test(out.zip)
  )
    fail("Invalid phone or postal code");
  return out;
}
export function objectId(value) {
  if (typeof value !== "string" || !/^[a-f\d]{24}$/i.test(value))
    fail("Invalid ID");
  return value;
}
