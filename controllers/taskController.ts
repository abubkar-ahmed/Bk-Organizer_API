const Board = require('../model/Board');
import { Response , Request } from "express";
import getCurrentUser from "../helpers/getCurrentUser";
import { BoardInterface, Column, SubTask, Task } from "./boardController";


const addNewTask = async (req: Request, res: Response) => {
    const currentUser = await getCurrentUser(req, res);
    if (currentUser.status) {
      const { boardId, columnId, task } = req.body;
      if (!boardId || !columnId || !task.title || !task.desc || task.subTasks.length <= 0)
        return res.status(400).json({
          message: "All Fields Are Required!",
        });
      const board = await Board.findOne({ userId: currentUser.userId }).exec();
      if (!board) return res.sendStatus(400);
  
      const foundBoardIndex = board.boards.findIndex((board: BoardInterface) => board._id.toString() === boardId);
      if (foundBoardIndex === -1) return res.sendStatus(400);
  
      const foundColumnIndex = board.boards[foundBoardIndex].columns.findIndex((column: Column) => column._id.toString() === columnId);
      if (foundColumnIndex === -1) return res.sendStatus(400);
  
      board.boards[foundBoardIndex].columns[foundColumnIndex].tasks.push(task);
      const result = await board.save();

  
      return res.status(201).json({
        boards : result.boards.map((e:BoardInterface) => {
            return {
                id : e._id,
                name : e.name,
                columns : e.columns.map((h:Column) => {
                    return {
                        id : h._id,
                        colName : h.colName,
                        tasks : h.tasks?.map((j:Task) => {
                            return {
                                id : j._id,
                                title: j.title,
                                desc : j.desc,
                                subTasks : j.subTasks.map((s:SubTask) => {
                                    return {
                                        id : s._id,
                                        status : s.status,
                                        title:s.title
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
      });
    } else {
      return res.sendStatus(500);
    }
};

const deleteTask = async (req : Request , res : Response) => {
    const {boardId , columnId , taskId} = req.params;
    if(!boardId || !columnId || !taskId) return res.status(400);
    const currentUser = await getCurrentUser(req,res);

    if(currentUser.status){
        const board = await Board.findOne({userId : currentUser.userId}).exec();
        if(!board) return res.sendStatus(400);

        const boardIndex = board.boards.findIndex((board: BoardInterface) => board._id.toString() === boardId);
        if (boardIndex === -1) return res.sendStatus(400);

        const columnIndex = board.boards[boardIndex].columns.findIndex((column: Column) => column._id.toString() === columnId);
        if (columnIndex === -1) return res.sendStatus(400)

        const newTasks = board.boards[boardIndex].columns[columnIndex].tasks.filter((e:Task) => {
            return e._id.toString() !== taskId
        })

        board.boards[boardIndex].columns[columnIndex].tasks = newTasks;

        const result = await board.save();

        return res.status(201).json({
            boards : result.boards.map((e:BoardInterface) => {
                return {
                    id : e._id,
                    name : e.name,
                    columns : e.columns.map((h:Column) => {
                        return {
                            id : h._id,
                            colName : h.colName,
                            tasks : h.tasks?.map((j:Task) => {
                                return {
                                    id : j._id,
                                    title: j.title,
                                    desc : j.desc,
                                    subTasks : j.subTasks.map((s:SubTask) => {
                                        return {
                                            id : s._id,
                                            status : s.status,
                                            title:s.title
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        })


    }else{
        return res.sendStatus(500);
    }
}

const editeSubTask = async (req : Request , res : Response) => {
    const {boardId , columnId , taskId , subTaskId} = req.body;
    if(!boardId || !columnId || !taskId || !subTaskId) return res.status(400);
    const currentUser = await getCurrentUser(req,res);

    if(currentUser.status){
        const board = await Board.findOne({userId : currentUser.userId}).exec();
        if(!board) return res.sendStatus(400);

        const boardIndex = board.boards.findIndex((board: BoardInterface) => board._id.toString() === boardId);
        if (boardIndex === -1) return res.sendStatus(400);

        const columnIndex = board.boards[boardIndex].columns.findIndex((column: Column) => column._id.toString() === columnId);
        if (columnIndex === -1) return res.sendStatus(400)

        const taskIndex = board.boards[boardIndex].columns[columnIndex].tasks.findIndex((task: Task) => task._id.toString() === taskId);
        if (taskIndex === -1) return res.sendStatus(400)

        const newSubTasks = board.boards[boardIndex].columns[columnIndex].tasks[taskIndex].subTasks.map((subTask : SubTask) => {
            if(subTask._id.toString() === subTaskId){
                return {
                    ...subTask ,
                    status : !subTask.status
                }
            }
            return subTask;
        })

        board.boards[boardIndex].columns[columnIndex].tasks[taskIndex].subTasks = newSubTasks;

        const result = await board.save();

        return res.status(201).json({
            boards : result.boards.map((e:BoardInterface) => {
                return {
                    id : e._id,
                    name : e.name,
                    columns : e.columns.map((h:Column) => {
                        return {
                            id : h._id,
                            colName : h.colName,
                            tasks : h.tasks?.map((j:Task) => {
                                return {
                                    id : j._id,
                                    title: j.title,
                                    desc : j.desc,
                                    subTasks : j.subTasks.map((s:SubTask) => {
                                        return {
                                            id : s._id,
                                            status : s.status,
                                            title:s.title
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        })


    }else{
        return res.sendStatus(500);
    }
}

const editeTask = async (req : Request , res : Response) => {
    const {boardId , columnId , prevColumnId , task } = req.body;
    if(!boardId || !columnId || !prevColumnId || !task.id || !task.title || !task.desc ||  task.subTasks.length <= 0) return res.status(400).json({'message' : 'All Fields Are Required!'});
    const currentUser = await getCurrentUser(req,res);

    if(currentUser.status){
        const board = await Board.findOne({userId : currentUser.userId}).exec();
        if(!board) return res.sendStatus(400);

        const boardIndex = board.boards.findIndex((board: BoardInterface) => board._id.toString() === boardId);
        if (boardIndex === -1) return res.sendStatus(400);


        const columnIndex = board.boards[boardIndex].columns.findIndex((column: Column) => column._id.toString() === columnId);
        if (columnIndex === -1) return res.sendStatus(400);


        const prevColumnIndex = board.boards[boardIndex].columns.findIndex((column: Column) => column._id.toString() === prevColumnId);
        if (prevColumnIndex === -1) return res.sendStatus(400);



        if(columnId === prevColumnId){
            const newTasks = board.boards[boardIndex].columns[columnIndex].tasks.map((e : Task) => {
                if(e._id.toString() === task.id){
                    return task
                }
                return e ;
            })
    
            board.boards[boardIndex].columns[columnIndex].tasks = newTasks

        }else{
            const newTasks = board.boards[boardIndex].columns[prevColumnIndex].tasks.filter((e : Task) => {
                return e._id.toString() !== task.id;
            })
    
            board.boards[boardIndex].columns[prevColumnIndex].tasks = newTasks

            board.boards[boardIndex].columns[columnIndex].tasks.push({
                title : task.title,
                desc : task.desc,
                subTasks : task.subTasks,
            })
        }

        const result = await board.save();

        return res.status(201).json({
            boards : result.boards.map((e:BoardInterface) => {
                return {
                    id : e._id,
                    name : e.name,
                    columns : e.columns.map((h:Column) => {
                        return {
                            id : h._id,
                            colName : h.colName,
                            tasks : h.tasks?.map((j:Task) => {
                                return {
                                    id : j._id,
                                    title: j.title,
                                    desc : j.desc,
                                    subTasks : j.subTasks.map((s:SubTask) => {
                                        return {
                                            id : s._id,
                                            status : s.status,
                                            title:s.title
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        })


    }else{
        return res.sendStatus(500);
    }
}
  
  

module.exports ={
    addNewTask,
    deleteTask,
    editeSubTask,
    editeTask
}