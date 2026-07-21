const permissions = { admin: ['project:read', 'project:delete'], member: ['project:read'] };
export const requirePermission = permission => (req, res, next) =>
  permissions[req.user.role]?.includes(permission) ? next() : res.status(403).json({ error: 'forbidden' });
console.log(permissions.member.includes('project:read'));
