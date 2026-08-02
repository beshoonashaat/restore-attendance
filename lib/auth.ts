import { SignJWT,jwtVerify } from 'jose';import { cookies } from 'next/headers';import { prisma } from './prisma';import bcrypt from 'bcryptjs';
const key=new TextEncoder().encode(process.env.AUTH_SECRET||'dev-secret-change-me');
export type Session={type:'admin'}|{type:'leader',leaderId:string,username:string};
export async function setSession(s:Session){const token=await new SignJWT(s as any).setProtectedHeader({alg:'HS256'}).setIssuedAt().setExpirationTime('8h').sign(key);(await cookies()).set('restore_session',token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:60*60*8});}
export async function getSession():Promise<Session|null>{const t=(await cookies()).get('restore_session')?.value;if(!t)return null;try{return (await jwtVerify(t,key)).payload as any}catch{return null}}
export async function clearSession(){(await cookies()).delete('restore_session')}
export async function requireAdmin(){const s=await getSession();if(!s||s.type!=='admin') throw new Error('Unauthorized');return s}
export async function requireLeader(){const s=await getSession();if(!s||s.type!=='leader') throw new Error('Unauthorized');const leader=await prisma.leader.findFirst({where:{id:s.leaderId,enabled:true}});if(!leader)throw new Error('Unauthorized');return s}
export async function verifyLeader(username:string,password:string){const leader=await prisma.leader.findUnique({where:{username}});if(!leader||!leader.enabled)return null;return await bcrypt.compare(password,leader.passwordHash)?leader:null}
