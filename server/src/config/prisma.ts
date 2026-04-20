// this file is to create the prisma client so that other modules can use this prisma client 
import { PrismaClient } from "../generated/prisma/client"

const prisma = new PrismaClient();


// we will now export this prisma client to be used at multiple other modules for this purpose 
export default prisma

