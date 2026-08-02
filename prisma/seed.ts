import { PrismaClient } from '@prisma/client';import bcrypt from 'bcryptjs';import { randomUUID } from 'crypto';const prisma=new PrismaClient();
async function main(){const pass=process.env.SEED_LEADER_PASSWORD||'restoreleader123';await prisma.leader.upsert({where:{username:'leader'},update:{},create:{username:'leader',passwordHash:await bcrypt.hash(pass,12)}});const existing=await prisma.card.count();if(existing===0)await prisma.card.createMany({data:Array.from({length:25},()=>({uuid:randomUUID()}))});}
main().finally(()=>prisma.$disconnect());
