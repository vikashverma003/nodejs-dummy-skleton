var express = require('express');
var router = express.Router();
var userModule=require('../modules/user');
var passCateModel=require('../modules/password_category');
var passModel=require('../modules/add_password');
var umuserModel=require('../modules/musers');
var carModel=require('../modules/cars');
var imageModel=require('../modules/image_upload');

const mongoose = require('mongoose');
const paginate = require('express-paginate');
//const app = express();
//app.use(paginate.middleware(10, 50));

var multer = require('multer');

var fs = require('fs');
//var path = require('path');


var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var storage = multer.diskStorage({
  destination: (req, file, cb) => {

    if (file.fieldname === 'image') {
      cb(null, './public/uploads')

    } else {
      cb(null, './public/uploads/icon')
    }
  },
  filename: (req, file, cb) => {
    if (file.fieldname === 'image') {
      cb(null, Date.now()+file.originalname)

    } else {
      cb(null, Date.now()+file.originalname)
    }

  }
});

var upload = multer({ storage: storage });

// middleware for the access control or checking the loggin user.
function checkLoginUser(req,res,next){
  var userToken=localStorage.getItem('userToken');
  try {
    var decoded = jwt.verify(userToken, 'loginToken');
  } catch(err) {
    res.redirect('/');
  }
  next();
}
/* GET home page. */
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}



// middleware for checking the duplicate name
function checkUsername(req,res,next){
  var uname=req.body.uname;
  var checkexitemail=userModule.findOne({username:uname});
  checkexitemail.exec((err,data)=>{
 if(err) throw err;
 if(data){
  
return res.render('signup', { title: 'Password Management System', msg:'Username Already Exit' });

 }
 next();
  });
}
// middleware for checking the duplicate email


function checkEmail(req,res,next){
  var email=req.body.email;
  var checkexitemail=userModule.findOne({email:email});
  checkexitemail.exec((err,data)=>{
 if(err) throw err;
 if(data){
  
return res.render('signup', { title: 'Password Management System', msg:'Email Already Exit' });

 }
 next();
  });
}

router.get('/', function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  if(loginUser==null)
  {

  res.render('index', { title: 'Login Form',msg:'',loginUser:''});
  }
  else{
    res.redirect('/add-new-category');

  }
});
router.post('/', function(req, res, next) {
 var username=req.body.uname;
 var password=req.body.password;

 var check_module=userModule.findOne({username:username});
 check_module.exec((err,data)=>{
   if(data==null){
    res.render('index', { title: 'Login Form',msg:'Invalid data',loginUser:''});
   }
   else{
    var getId=data._id;
    var getPassword=data.password;
    if(bcrypt.compareSync(password,getPassword)){
      var token = jwt.sign({ userID: getId }, 'loginToken');
      localStorage.setItem('userToken', token);
      localStorage.setItem('loginUser', username);
      res.redirect('/user');

    }else{
      res.render('index', { title: 'Password Management System', msg:"Invalid Username and Password.",loginUser:'' });
    
    }
    res.render('index', { title: 'Login Form',msg:'passed data',loginUser:''});

   }
 });
 //console.log(check_module);
 //console.log(req.body);
 
  // res.render('index', { title: 'Login Form',msg:''});
});

router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Signup Form',msg:'',loginUser:'' });
});

router.post('/signup',checkUsername, checkEmail,function(req, res, next) {
  var username=req.body.uname;
  var email=req.body.email;
  var password=req.body.password;
  var confpassword=req.body.confpassword;

  if(password !=confpassword){
    res.render('signup', { title: 'Signup Form',msg:'Password and confirm password does not match',loginUser:'' });

  }
  else{

    var hash = bcrypt.hashSync(password, 10);
    var userDetails= new userModule({
      _id:mongoose.Types.ObjectId(),
      username:username,
      email:email,
      password:hash
    });
    userDetails.save((err,doc)=>{
      if(err) throw err;
      res.render('signup',{title:'Signup form',msg:'registration has been completed',loginUser:''});
    });


  }

});

router.get('/user', function(req, res) {
  var loginUser=localStorage.getItem('loginUser');
  var userToken=localStorage.getItem('userToken');

  res.render('dashboard',{title:"dashboard",loginUser:loginUser,userToken:userToken});
});

router.get('/add-new-category',checkLoginUser,function(req,res,next){
  var loginUser=localStorage.getItem('loginUser');

  res.render('addNewCategory',{title:'Add New Category',msg:'Category has been added',loginUser:loginUser,success:'',errors:''});
});

router.post('/add-new-category',checkLoginUser,function(req,res,next){
  var loginUser=localStorage.getItem('loginUser');

console.log(req.body);
var category=req.body.passwordCategory;
var category_details=new passCateModel({
  passord_category:category
});

category_details.save((err,data)=>{
  if(err) throw err;
  res.render('addNewCategory',{title:'Add New Category',msg:'Category has been added',loginUser:loginUser,success:'',errors:''});
});

});

router.get('/all_category',checkLoginUser,function(req,res,next){
  var loginUser=localStorage.getItem('loginUser');
  var all=passCateModel.find({});
  var get=all.exec((err,data)=>{
    if(err) throw err;
    res.render('category_listing',{title:'Category Listing',msg:'Category Listing',records:data,loginUser:loginUser,success:'',errors:''});

  });
 // console.log(all);

});

router.get('/category_edit/:id', checkLoginUser,function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  var passcat_id=req.params.id;
  var getpassCategory=passCateModel.findById(passcat_id);
  getpassCategory.exec(function(err,data){
    if(err) throw err;
 
    res.render('edit_pass_category', { title: 'Password Management System',loginUser: loginUser,errors:'',success:'',records:data,id:passcat_id});

  });
});

router.post('/category_edit/', checkLoginUser,function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  var passcat_id=req.body.id;
  var passwordCategory=req.body.passwordCategory;
  //res.send(passwordCategory);
  //console.log(passwordCategory);
 var update_passCat= passCateModel.findByIdAndUpdate(passcat_id,{passord_category:passwordCategory});
 update_passCat.exec(function(err,doc){
    if(err) throw err;
 
res.redirect('/all_category');
  });
});

router.get('/category_delete/:id', checkLoginUser,function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  var passcat_id=req.params.id;
  var passdelete=passCateModel.findByIdAndDelete(passcat_id);
  passdelete.exec(function(err){
    if(err) throw err;
    res.redirect('/all_category');
  });
});



router.get('/add_new_password',checkLoginUser,function(req,res,next){
  var loginUser=localStorage.getItem('loginUser');

  var all_Cate=passCateModel.find({});
  all_Cate.exec((err,data)=>{
    if(err) throw err;
    res.render('add-new-password',{title:'Add New password for category',msg:'',records:data,loginUser:loginUser,success:'',errors:''});
  });
});

router.post('/add_new_password',checkLoginUser,function(req,res,next){
  var loginUser=localStorage.getItem('loginUser');

  var pass_cat=req.body.pass_cat;
  var project_name=req.body.project_name;
  var pass_details=req.body.pass_details;
  var all_Cate=passCateModel.find({});

 var pass_instance= new passModel({
  password_category:pass_cat,
  project_name:project_name,
  password_detail:pass_details,
 });

 pass_instance.save((err,doc)=>{
   if(err) throw err;

   all_Cate.exec((err,data)=>{
    if(err) throw err;
    res.render('add-new-password',{title:'Add New password for category',msg:'Password has been added',records:data,loginUser:loginUser,success:'',errors:''});
  });

 });


});

router.get('/image_upload', (req, res) => {
  imageModel.find({}, (err, items) => {
      if (err) {
          console.log(err);
          res.status(500).send('An error occurred', err);
      }
      else {
          res.render('imagesPage', { items: items });
      }
  });
});

/* when we have multiple file to send then use this use multiple in the view and follow the below points */
// upload.array('blogimage', 5)
//   var fileinfo = req.files;
// use multiple in the views

//  upload.single('image') pass this as a middleware
// use req.file.filname  for storing in the db.

router.post('/image_upload', upload.any(), (req, res, next) => {

 // console.log(req);
 // res.send(req.files);
  var array_images=req.files;
  var photoArray= new Array();
  var iconArray= new Array();

  for(var i=0;i<array_images.length;i++){
   
    if(array_images[i].fieldname==='image'){
      var image=array_images[i].filename;
      photoArray.push(image);
    }
    else{
      var image=array_images[i].filename;
      iconArray.push(image);
    }
    
  }
  var obj = {
      name: req.body.name,
      desc: req.body.desc,
      img: JSON.stringify(photoArray),
      icon:JSON.stringify(iconArray),
  }
  imageModel.create(obj, (err, item) => {
      if (err) {
          console.log(err);
      }
      else {
          res.redirect('/fetch_image_upload');
      }
  });
});

/* router.get('/fetch_image_upload',function(req,res,next){
  var get_all_image=imageModel.find({});
  get_all_image.exec((err,data)=>{
    if(err) throw err;
    res.render('get_image_pages',{records:data});
  });

});*/

/*router.get('/fetch_image_upload/', function(req, res, next) {
  var perPage = 3;
    var page = req.params.page || 1;

    imageModel.find({})
           .skip((perPage * page) - perPage)
           .limit(perPage).exec(function(err,data){
                if(err) throw err;
                imageModel.countDocuments({}).exec((err,count)=>{  
                          
  res.render('get_image_pages', { records: data,
  current: page,
  pages: Math.ceil(count / perPage) });
  
});
  });
  
});*/

router.get('/fetch_image_upload/', function(req, res, next) {
  var perPage = 3;
  var page = req.params.page || 1;
  var query = {};
  var options = {
    lean: true,
    offset: 1,
    limit: 5,
  };


  //result.offset == limit;
  //totalPages= tp;
  imageModel.paginate(query, options).then(function (result) {
    console.log(result);
    res.render('get_image_pages', { records: result.docs,
      current: result.offset,
      pages:Math.ceil(result.totalPages / result.offset) });
  });

    /*imageModel.find({})
           .skip((perPage * page) - perPage)
           .limit(perPage).exec(function(err,data){
                if(err) throw err;
                imageModel.countDocuments({}).exec((err,count)=>{  
                          
  res.render('get_image_pages', { records: data,
  current: page,
  pages: Math.ceil(count / perPage) });
  
});
  });*/
  
});

router.get('/fetch_image_upload/:page', function(req, res, next) {
  var perPage = 3;
    var page = req.params.page || 1;

    imageModel.find({})
           .skip((perPage * page) - perPage)
           .limit(perPage).exec(function(err,data){
                if(err) throw err;
                imageModel.countDocuments({}).exec((err,count)=>{
                  console.log(777);
                  console.log(data);
                           
  res.render('get_image_pages', { records: data,
  current: page,
  pages: Math.ceil(count / perPage) });
  
});
  });
  
});




router.get('/delete_image_pages/:id',function(req,res,next){
    var get_id=req.params.id;
    var del_images_data=imageModel.findByIdAndDelete(get_id);
    del_images_data.exec((err)=>{
      if(err) throw err;
      res.redirect('/fetch_image_upload');
    });

});

router.get('/edit_image_pages/:id',function(req,res,next){

  var get_id=req.params.id;
  var get_info_by_id=imageModel.findById(get_id);
  get_info_by_id.exec((err,data)=>{
    if(err) throw err;
    console.log(data);
    res.render('edit_image_data',{records:data,id:get_id});
  });
  //console.log(get_info_by_id);
});

router.post('/edit_image_update/',function(req,res,next){
  var passcat_id=req.body.id;
  console.log(passcat_id);
//   var name=req.body.name;
//   var desc=req.body.desc;
//   console.log(desc);
  
//  var update_passCat= imageModel.findByIdAndUpdate(passcat_id,{name:name,desc:desc});
//  update_passCat.exec(function(err,doc){
//     if(err) throw err;
 
// res.redirect('/fetch_image_upload');
//   });

});


router.get('/logout', function(req, res, next) {
  localStorage.removeItem('userToken');
  localStorage.removeItem('loginUser');
  res.redirect('/');
});

module.exports = router;
