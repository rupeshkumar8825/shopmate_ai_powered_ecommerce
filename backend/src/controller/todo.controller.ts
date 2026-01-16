// this is the controller for the todo  
// it contains some business logic and it will call the service layer for DB related

import { Request, Response } from "express";
import { Todo } from "../generated/prisma/client";
import { createtTodoSchema } from "../schemas/todo.schema";
import * as todoService from "../services/todo.service";

// operation for this purpose
export const createTodo = async (req : Request, res : Response) : Promise<void> => {
    const {title} = createtTodoSchema.parse(req.body);
    const todo = await todoService.createTodo(title);

    // what happens if the creation of this todo failed?? need to figure it out
    res.status(201).json(todo);
}