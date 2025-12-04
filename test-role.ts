// client/test-role.ts
import { Role } from "@prisma/client";

console.log('Role object:', Role);
console.log('VENDOR:', Role.VENDOR);
console.log('ADMIN:', Role.ADMIN);
console.log('All values:', Object.values(Role));
