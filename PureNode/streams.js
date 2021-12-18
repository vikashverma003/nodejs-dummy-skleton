const fs=require('fs');

const readStream=fs.createReadStream('./docx/blog5.txt',{encoding:'utf8'});

const writeStream=fs.createWriteStream('./docx/blog7.txt');

/*readStream.on('data',(chunk)=>{
   
    console.log('------New Line-----');
    console.log(chunk);
    writeStream.write('-----New Line------');
    writeStream.write(chunk);
});*/


//piping
readStream.pipe(writeStream);