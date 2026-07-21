type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; code: string; message: string };

interface User {
  id: string;
  email: string;
  role: "admin" | "member";
}

function unwrap<T>(result: ApiResult<T>): T {
  if (!result.ok) throw new Error(result.message);
  return result.data;
}

function isUser(value: unknown): value is User {
  return typeof value === "object" && value !== null &&
    "id" in value && "email" in value && "role" in value;
}

const publicUser: Omit<User, "email"> = { id: "u_1", role: "member" };
console.log(unwrap({ ok: true, data: publicUser }));
