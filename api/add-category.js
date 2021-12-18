var express = require('express');
var router = express.Router();
var userModule=require('../modules/user');
var passCateModel=require('../modules/password_category');
var passModel=require('../modules/add_password');
var umuserModel=require('../modules/musers');
var carModel=require('../modules/cars');

router.get('/get_category',function(err,res){
    var all_cat=passCateModel.find();
    all_cat.exec((err,doc)=>{
        if(err) throw err;
       // res.send(doc);
        //console.log(doc);
        res.status(200).json({
            message:"Category data listing",
            data:doc
        });
    });

});

router.post('/add_muser',function(req,res){
    var name=req.body.cate_name;
    var age=req.body.age;

    var muser_instance=new umuserModel({
        name:name,
        age:age
    });
   
    muser_instance.save()
    .then(doc=>{
        res.status(201).json({
              message:"muser has been added",
              data:doc
         });
    })
    .catch(err=>{
        res.json(err);
    });
});

router.post('/addCar', async (req, res)=>{

    try {
       //validate data as required
       const car = new carModel(req.body);
       // book.publisher = publisher._id; <=== Assign user id from signed in publisher to publisher key
       await car.save();
        console.log(car);
       const publisher = await umuserModel.findById({_id: car.owner})
     //publisher.cars=car;

       publisher.cars.push(car);
      
       await publisher.save();
       console.log(car);
       console.log(22);
       console.log(publisher);
       res.status(200).json({success:true, data: car,publisher:publisher })
 
    } catch (err) {
       res.status(400).json({success: false, message:err.message})
    }
 })

router.get('/get_muser',function(req,res){
    var all_muser=umuserModel.find();
    all_muser.exec((err,doc)=>{
        if(err) throw err;
       // res.send(doc);
        //console.log(doc);
        res.status(200).json({
            message:"Muser's listing",
            data:doc
        });
    });

});






router.post('/add_category',function(req,res){
    var cat=req.body.cate_name;
    var cat_instance=new passCateModel({
        passord_category:cat
    });
    // cat_instance.save((err,doc)=>{
    //     if(err) throw err;
    //     res.status(201).json({
    //         message:"Category has been added",
    //         data:doc
    //     });
    // });
    cat_instance.save()
    .then(doc=>{
        res.status(201).json({
              message:"Category has been added",
              data:doc
         });
    })
    .catch(err=>{
        res.json(err);
    });
});

router.put('/update_category/:id',function(req,res,next){
    var id= req.params.id;
    var cate_name=req.body.cate_name;

    passCateModel.findById(id,function(err,data){
       // console.log(data);
        data.passord_category=cate_name?cate_name:data.passord_category;
       /* data.save((err,doc)=>{
            if(err) throw err;
            res.status(201).json({
                message:"Category has been Updated successfully",
                data:doc
            });
        });*/
        data.save()
        .then(doc=>{
            res.status(201).json({
                message:"Category has been Updated successfully",
                data:doc
            });
        })
        .catch(err=>{
            res.json(err);
        });
    });
});

router.delete('/delete_category/:id',function(req,res,next){
    var id=req.params.id;
   /* passCateModel.findByIdAndRemove(id,function(err){
        if(err) throw err;
        res.status(201).json({
            message:"Category has been deleted successfully",
        });
    });*/
    passCateModel.findByIdAndRemove(id)
    .then(doc=>{
        res.status(201).json({
            message:"Category has been deleted successfully",
        });
    })
    .catch(err=>{
        res.json(err);
    })
});

router.delete('/delete_category',function(req,res,next){
    var id=req.body.id;
    /*passCateModel.findByIdAndRemove(id,function(err){
        if(err) throw err;
        res.status(201).json({
        message:"Category has been deleted successfully",
    });
    });*/
    passCateModel.findByIdAndRemove(id)
    .then(doc=>{
        res.status(201).json({
            message:"Category has been deleted successfully",
        });
    })
    .catch(err=>{
        res.json(err);
    })
});



module.exports = router;