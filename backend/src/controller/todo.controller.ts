// this is the controller for the todo  
// it contains some business logic and it will call the service layer for DB related

import { Request, Response } from "express";
import { Todo } from "../generated/prisma/client";
import { createtTodoSchema } from "../schemas/todo.schema";
import { TodoService } from "../services/todo.service";
import { success } from "zod";

export const createTodo = async (req : Request, res : Response) => {
    // please note that we are not doing any validation on the input 
    // field. More precise to say that we are not doing zod validation here
    // because to centralize and commonize the zod validation we implemented 
    // a middleware for this which before calling the controllers itself it 
    // will first call the validation middleware which will validate the 
    // input send from the client. If error happens then it throws the error 
    // and return from there itself without entering into the controller itself.
    const todo = await TodoService.createTodo(req.body.title);

    res.status(201).json({
        success : true, 
        data : todo
    });
}



// controller function to get the complete list of all the todos for this purpose
export const getTodos = async (req : Request, res: Response) => {
    const todos = await TodoService.getTodos();

    res.status(200).json({
        success : true, 
        data : todos
    });
}


// controller function to fetch the details of the todo given id of the todo
export const getTodosById = async (req: Request, res: Response) => {
    const todo = await TodoService.getTodoById(Number(req.params.id));

    res.status(200).json({
        success : true, 
        data : todo
    });
}



// controller function to update the todo. This function will take the id from the 
// url params and then updated details from the req.body itself
export const updateTodo = async (req : Request, res: Response) => {
    const todo = await TodoService.updateTodo(
        Number(req.params.id), 
        req.body
    );

    res.status(200).json({
        success : true,
        data : todo, 
    });
}



// controller function responsible for deleting the todo given the id of the todo
export const deleteTodo = async (req: Request, res:Response) => {
    await TodoService.deleteTodo(Number(req.params.id));

    res.status(204).send();
}