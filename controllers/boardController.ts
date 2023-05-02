const Board = require('../model/Board');
import { Response , Request } from "express";
import getCurrentUser from "../helpers/getCurrentUser";

export interface BoardInterface{
    _id : string,
    name : string,
    columns : Column[]
}

export interface SubTask {
    _id:string,
    status: boolean,
    title : string
}

export interface Task {
    _id:string,
    title : string,
    desc : string,
    subTasks : SubTask[]
}
  
export interface Column {
    _id: string;
    colName: string;
    tasks? : Task[]
}

const getBoard = async (req:Request , res : Response) => {
    const currentUser = await getCurrentUser(req , res);
    if(currentUser.status){
        try{
            const board = await Board.findOne({userId : currentUser.userId});
            
            if(!board) return res.status(200).json({
                boards : []
            })
            
            return res.status(200).json({
                boards : board.boards.map((e:BoardInterface) => {
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
        }catch(err){
            console.log(err);
            return res.sendStatus(500);
        }
    }else{
        return res.sendStatus(500);
    }
}

const addNewBoard =async (req:Request , res : Response) => {
    const currentUser = await getCurrentUser(req , res);

    const {name , columns} = req.body;

    if(!name || columns.length <= 0) return res.sendStatus(400).json({
        'message' : 'all Fields Are Required'
    })
    if(currentUser.status){
        const board = await Board.findOne({userId : currentUser.userId}).exec();

        if(board){
            for(let i = 0 ; i < board.boards.length ; i++){
                if(board.boards[i].name === name){
                    return res.status(409).json({
                        'message' : 'Boards Is Already Exict'
                    })
                }
            }

            board.boards.push({
                name : name,
                columns : columns,
            })
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
                                tasks : h.tasks
                            }
                        })
                    }
                }) 
            })
        }else{
            try{
                const newBoard = new Board({
                    userId : currentUser.userId,
                    boards : [
                        {
                            name: name,
                            columns : columns,
                        }
                    ]
                });

                const result = await newBoard.save();
                    
                return res.status(201).json({
                    boards : result.boards.map((e:BoardInterface) => {
                        return {
                            id : e._id,
                            name : e.name,
                            columns : e.columns.map((h:Column) => {
                                return {
                                    id : h._id,
                                    colName : h.colName,
                                    tasks : h.tasks
                                }
                            })
                        }
                    }) 
                })

            }catch(err){
                console.log(err)
                return res.sendStatus(500)
            }
        }
    }else{
        return res.sendStatus(500);
    }



}

const updateBoard = async (req : Request , res : Response) => {
    const currentUser = await getCurrentUser(req, res);
    if(currentUser.status){
        const {id , name , columns} = req.body;
        if(!id || !name || columns.length < 0 ) return res.sendStatus(400);

        try{
            const board = await Board.findOne({userId:currentUser.userId});
            if(!board) return res.sendStatus(500);
            const editedBoard = board.boards.map((e:BoardInterface) => {
                if(e._id.toString() === id){
                    return {
                        _id : e._id,
                        name : name,
                        columns : columns,
                    }
                }
                return e;
            })
            board.boards = editedBoard;

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
        }catch (err:any){   
            console.log(err);
            return res.sendStatus(500)
        }
    }else{
        return res.sendStatus(500)
    }
}

const deleteBoard = async (req:Request , res : Response) => {
    const currentUser = await getCurrentUser(req,res);
    const {boardId} = req.params;

    if(!boardId) return res.status(400).json({
        'message': 'Please Provide Board Id.'
    })

    if(currentUser.status){
        try{
            const board = await Board.findOne({userId : currentUser.userId}).exec() ;
            if(!board) return res.status(400).json({
                'message' : 'User Have No Boards'
            })

            const filterdBoards = board.boards.filter((e: BoardInterface) => {
                return e._id.toString() !== boardId;
            });

            board.boards = filterdBoards;

            const result = await board.save();

            
            return {
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
            }
        }catch(err){
            console.log(err);
            return res.sendStatus(500)
        }
    }else{
        return res.sendStatus(500);
    }
}

module.exports = {
    getBoard,
    addNewBoard,
    deleteBoard,
    updateBoard
}