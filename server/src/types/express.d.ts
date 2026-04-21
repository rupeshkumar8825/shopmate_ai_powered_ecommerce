// here we will define all our custom made types for this purpose
declare global{
    namespace Express{
        interface Request {
            userId? : string, 
            email? : string
        }
    }
}

export {}