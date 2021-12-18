const fs=require('fs');

// for reading the file
/*fs.readFile('./blog.txt',(err,data)=>{
    if(err) throw err;
    console.log(data.toString());   
});*/

// for writing the file

/*fs.writeFile('./blog3.txt', 'Hello HELLLLLLOOOO there', (err,data)=>{
    if(err) throw err;
    console.log('File has been written');
});*/



////////////// working with dir. adding and removing the dir

/*if(!fs.existsSync('./Aussets')){
    fs.mkdir('./Aussets',(err)=>{
        if(err) throw err;
        console.log("dir has been created");
    });
}
else{

    fs.rmdir('./Aussets',(err)=>{
        if(err) throw err;
        console.log('File has been removed');
    });
} */


////// remving the file

if(fs.existsSync('./blog.txt')){
    fs.unlink('./blog.txt',(err)=>{
        if(err) throw err;
        console.log('file has been deleted');
    });
}



//console.log("lasdt line");
//console.log(1212121);

