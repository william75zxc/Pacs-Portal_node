const mongooes = require('mongoose')
const Schema = mongooes.Schema

const Schedule = new Schema ({
    id:{
        type:Number,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required : true,
    },
    age:{
        type:Number,
        required: true,
    },
    gender:{
        type:String,
        required: true,
    },
    idcard:{
        type:String,
        required: true,
    },
    Schedule:{
        type:String,
        required: true,
        default:'掛號',
    }
})

module.exports = mongooes.model('patient',Schedule,'patient')