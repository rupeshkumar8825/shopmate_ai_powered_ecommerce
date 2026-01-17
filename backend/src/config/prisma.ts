// this is to export the prisma client so that 
// it can be used across all the application for this purpose

import { PrismaClient } from "../generated/prisma/client";


const prisma = new PrismaClient();

// we can improve this to have only a singleton prisma itself. 
// we will have to look at it what we can do this purpose


// need to export this 
export default prisma;