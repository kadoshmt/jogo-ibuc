import { jwtVerify } from 'jose';

export async function verifyJwt(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.log("Erro ao verificar JWT:");
    //console.log("Erro ao verificar JWT:", error);
    return null;
  }
}
