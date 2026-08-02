import { z } from 'zod';
export const claimSchema=z.object({uuid:z.string().uuid(),fullName:z.string().trim().min(2).max(120).regex(/^[\p{L}\p{M}\s.'-]+$/u,'Invalid name')});
export const uuidSchema=z.string().uuid();export const generateSchema=z.object({count:z.coerce.number().int().min(1).max(1000)});
export const leaderSchema=z.object({username:z.string().trim().min(3).max(40).regex(/^[a-zA-Z0-9_.-]+$/),password:z.string().min(8).max(128)});
export const attendanceSchema=z.object({cardId:z.string().cuid(),attendanceNumber:z.coerce.number().int().min(1).max(4),checked:z.boolean()});
export const searchSchema=z.object({q:z.string().trim().max(120).optional(),status:z.enum(['all','claimed','unclaimed','complete']).default('all'),count:z.coerce.number().int().min(0).max(4).optional()});
