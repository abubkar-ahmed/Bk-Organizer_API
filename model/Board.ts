import mongoose from "mongoose";
const Schema = mongoose.Schema ;

const boardSchema = new Schema({
    userId : {
        require : true,
        type : String
    },
    boards : [
        {
            name : {
                type : String,
                required : true
            },
            columns:[
                {
                    colName :{
                        required : true,
                        type : String,
                    },
                    tasks : [
                        {
                            title : {
                                type : String
                            },
                            desc : {
                                type : String
                            },
                            subTasks : [
                                {
                                    status : {
                                        type : Boolean,
                                    },
                                    title : {
                                        type : String
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }

    ]
});


module.exports = mongoose.model('Board' , boardSchema);