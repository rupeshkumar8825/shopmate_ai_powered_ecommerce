import prisma from "../config/prisma";
import { AppError } from "../errors/AppError";
import { ErrorCodes } from "../errors/errorCodes";
import { Prisma, Todo } from "../generated/prisma/client";


// we will create for complete todo service functionality
export class TodoService {

    // function to create a new todo into the database
    static async createTodo (title : string) : Promise<Todo> {
        try{
            const todo : Todo = await prisma.todo.create({
                data: {title},
            })
            return todo;
        }catch(error)
        {
            // check if this error is due to the Prism client error or not 
            if(error instanceof Prisma.PrismaClientKnownRequestError)
            {
                throw new AppError(
                    ErrorCodes.CONFLICT,
                    "Unable to create todo due to a data conflict"
                );
            }
            else 
            {
                // now this is some random error so no need to modify to hence 
                // we will simply throw the error again 
                throw new AppError(ErrorCodes.INTERNAL_ERROR, "Failed to Create Todo");
            }
        }
    }


    // service function to get the list of all the todos in this case 
    static getTodos = async () : Promise<Todo[]>=> {
        try{
            const todoList : Todo[] = await prisma.todo.findMany({
                orderBy : {createdAt: 'desc'}, 
            });
            
            // say everything went fine 
            return todoList;
        }catch(error)
        {
            // check if this error is due to the Prism client error or not 
            if(error instanceof Prisma.PrismaClientKnownRequestError)
            {
                throw new AppError(
                    ErrorCodes.CONFLICT,
                    "Unable to create todo due to a data conflict"
                );
            }
            else 
            {
                // now this is some random error so no need to modify to hence 
                // we will simply throw the error again 
                throw new AppError(ErrorCodes.INTERNAL_ERROR, "Failed to Create Todo");
            }
        }
    }


    // service function to implement get the todo given the id of the todo 
    static async getTodoById(id : number) {
        const todo = await prisma.todo.findUnique({
            where : {id : id},
        });

        if(!todo)
        {
            // this means that there is no todo present with this id
            // we need to throw a new app error of type not found 
            throw new AppError(ErrorCodes.NOT_FOUND, "Todo Not Found");
        }

        // else we were able to find it
        return todo;
    }



    // service function to update an existing todo
    static async updateTodo (id : number, data : {title?: string, completed? : boolean})
    {
        // the below function if able to find the todo then its fine otherwise it 
        // will throw the error which will be captured by the central middleware. 
        await this.getTodoById(id);
        
        // use the try catch block here 
        try{
            return await prisma.todo.update({
                where : {id : id}, 
                data : data, 
            });

        }catch
        {
            throw new AppError(ErrorCodes.INTERNAL_ERROR, "Failed to update todo");
        }
    }

    
    static async deleteTodo(id: number) {
    await this.getTodoById(id);

    try {
      await prisma.todo.delete({
        where: { id },
      });
    } catch {
      throw new AppError(
        ErrorCodes.INTERNAL_ERROR,
        'Failed to delete todo'
      );
    }
  }
}
