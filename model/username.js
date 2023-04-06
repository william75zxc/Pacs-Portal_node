const mongoose = require('mongoose')
const Schema = mongoose.Schema

//建立Schema
const Passward_Schema = new Schema(
    {   
        id :{
            type:Number,
            required: true, //不得為空直
            unique: true, //唯一
        },
        name: {
            type: String,
            required: true, //不得為空直
        },
        powd: {
            type: String,
            required: true,
        },
        pass: {
            type: String,
            required: true,
        },
        d_pass: {
            type: String,
            required: true,
        },
        management: {
            type : String,
            required: true,
            default:"使用者",
        },
    },
    { timestamps: true } //自動增加時間
)
module.exports = mongoose.model('Passward',Passward_Schema, 'Passward')