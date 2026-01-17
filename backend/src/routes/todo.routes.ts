import { Router } from "express";
import { createTodo, deleteTodo, getTodos, getTodosById, updateTodo } from "../controller/todo.controller";

// this file consists of all routes related to todos for this purpose
const router = Router();



// all the relevant routes comes here related to todo model
router.post("/", createTodo);
router.get("/", getTodos);
router.get("/:id", getTodosById);
router.patch("/:id", updateTodo);
router.delete("/:id", deleteTodo);


export default router;
