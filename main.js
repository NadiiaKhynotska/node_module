const {sayHello}= require('./sayHello');
// sayHello();
//
// console.log(__dirname);
// console.log(__filename);
// console.log(process.cwd())
//
// const path = require('path');
//
// const joinedPath = path.join('test1', 'r=test2' , 'test3');
// const joinedPath2 = path.join(__dirname, 'folder', 'sayHello.js');
// const resolvedPath = path.resolve('test5', joinedPath2)
// const ext = path.extname('sayHello.txt')
//
// console.log(joinedPath);
// console.log(joinedPath2)
// console.log(resolvedPath)
// console.log(ext)
//
// const os = require('os')
// console.log(os.cpus())
// console.log(os.arch())

const fs = require('node:fs')
const path =  require('node:path');

const filePath = path.join(__dirname, 'folder', "text.txt")
 fs.writeFile(filePath, 'Hello from Nadiia!',(error)=>{
    if ( error) {
        throw new Error(error.message)
    }
})

fs.appendFile(filePath, "hello AGAIN\n", (err)=>{
    if(err){
        throw new Error(err.message)
    }
})

fs.appendFile(filePath, 'today is new day', (err)=>{
    if (err){
        throw new Error(err.message)
    }
})