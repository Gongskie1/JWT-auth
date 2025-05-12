import { Users } from "@prisma/client";

export type CustomUserResponse =   
| { user: Users; error?: undefined}
| { error: Error; user?: undefined };