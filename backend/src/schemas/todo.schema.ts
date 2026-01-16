// this is to have all the relevant schemas related to TODO model may be
// we will use the zod validation too in this case for this purpose

import z from "zod"

// schema for create new todo
export const createtTodoSchema = z.object({
    title : z.string().min(1)
});


// schema for the update todo 
export const updateTodoSchema = z.object({
    title : z.string().min(1).optional(),
    completed : z.boolean().optional()
});


// schema for the todo id object 
export const todoIdSchema = z.object({
    id : z.string().regex(/^\d+$/),
});


export type CreateTodoType = z.infer<typeof createtTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
