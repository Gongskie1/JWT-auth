import bcrypt from "bcrypt";

const saltRounds = 14;

export async function hashPassword(password:string): Promise<string>{
    const process = await bcrypt.hash(password,saltRounds);

    return process;
}

export async function checkHashedPassword(plainPassword:string,hashPassword:string): Promise<boolean>{
    const result = await bcrypt.compare(plainPassword,hashPassword);

    return result;
}