var express = require('express');
var router = express.Router();
const User=require('../models/user')
const Package=require('../models/pakageinfo')
//var admincontroller = require('../controllers/admincontroller')
// var usercontroller = require('../controllers/usercontroller')

/* GET home page. */
router.get('/', function(req, res, next) {
  Package.find({}).limit(3).then(result=>{
    if(result.length!==0)
    {
      var index=Math.floor(Math.random() * 2)
      res.render('home',{
        index:index,
        package:result,
        name:req.session.name,
        authenticated:req.session.authenticated,
        admin:req.session.admin
      });
    }else{
      res.render('home',{
        package:[],
        name:req.session.name,
        authenticated:req.session.authenticated,
        admin:req.session.admin
      });
    }
  })
});

router.get('/rules', function(req, res, next) {
    res.render('rules');
  });

router.get('/contactus', function(req, res, next) {
  try{
    User.findOne({_id:req.session.userid}).then(result=>{
      if(result)
      res.render('contactus',{
        info:result,
        authenticated:req.session.authenticated,
        admin:req.session.admin
      });
      else
      res.redirect('/error')
    }).catch(err=>{
      res.redirect('/error')
    })
  }catch(err)
  {
    res.redirect('/error')
  }
  });


router.get('/user/userreg', function(req, res, next) {
  if(req.session.name!==undefined)
  {
    res.redirect('/user/userhome')
  }else{
    res.render('./userpart/userreg',{error:req.query.error});
  }
});

// router.post('/user/userregdbinsert', usercontroller.userregistration );

router.get('/user/userlogin', function(req, res, next) {
  res.render('./userpart/userlogin',{error:req.query.error});
});
router.get('/user/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/')
})
router.get('/error',(req,res)=>{
  res.render('./error/error')
})
router.get('/', function(req, res, next) {
  res.render('home');
});



module.exports = router;