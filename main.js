const fs = require('node:fs')
const path = require('node:path')
const mainFolder = path.join(__dirname, 'mainFolder')

fs.mkdir(mainFolder,err => {
    if(err){
        console.error('error create main folder', err.message);
        return;
    }
    console.log('root folder created successfully')
})

for (let i = 1; i<=5; i++){
    const folderName = path.join(mainFolder, `folder${i}`)
    const fileName = path.join(mainFolder, `file${i}.txt`)
    fs.mkdir(folderName,err => {
        if(err){
            console.error(`error create  folder${i}`, err.message)
        }
        console.log(`subfolder${i} created successfully`)
    })
    fs.writeFile(fileName, `file${i}`,err => {
        if(err){
            console.error(`error create  file${i}`, err.message)
        }
        console.log(`subfile${i} created successfully`)
    })
}

 fs.readdir(mainFolder,(err, files) => {
    if(err){
        console.error(err.message)
    }
   files.map(file =>{
       const filePath = path.join(mainFolder, file);
       fs.stat(filePath,(err1, stats) => {
           if(err1){
               console.error('validation error', err1.message)
               return;
           }
           if(stats.isFile()){
               console.log(`${filePath} - this is file`)
           }else if(stats.isDirectory()){
               console.log(`${filePath} - this is directory`)
           }
       })
   })
})


