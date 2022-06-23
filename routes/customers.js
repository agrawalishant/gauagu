var express = require('express');
var router = express.Router();
const sequelize = require("../models/Users")
const english = require("../langauge/en");
const hindi = require("../langauge/hn");
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const multer = require('multer');
var SECRET_KEY = "85266";
var app = express();
const mailer = require('express-mailer'); // call express
//const { body, validationResult } = require('express-validator');
app.set('view engine', 'jade');
var moment = require('moment');
let currentDate = moment().format('YYYY-MM-DD'); 
let differnceTime = moment().format('YYYY-MM-DD h:mm:ss'); 
var bodyParser = require('body-parser')
var multiparty = require('multiparty');
const formidable = require('express-formidable');

var FCM = require('fcm-node');
let fcmkeys='AAAAEsCqLB4:APA91bFmKJIek2MtmE6yth2j0oiu64m5068pxxHEnrrNyIdknkRxPqUB57rxTGQE1GVJnFocw9E57ahQ--9C63SN0gODuDoumtXzo_Qm1aLt-Cwe6_TobSsf4HJcjjEBV4XqKD0Y1CZ1';
var fcm = new FCM(fcmkeys);




app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


/****************************jwt********************************************************* */
let token = jwt.sign({email:"gaugau@gmail.com",id:1},SECRET_KEY, {
  expiresIn: '24h'
})
/***20May *****/
const getUserLang = (userLang) => {
  if(userLang == "hi"){
    return hindi;
  }else if( userLang == "en"){
    return english;
  }else{
    return english;
  }
}
/****************************checkToken********************************************************* */


const checkToken = (req, res, next) => {
  const header = req.headers['authorization'];

  if (header !== 'undefined') {
    const token = header;
    req.token = token;
    next();
  } else {
    res.sendStatus(403)
  }
}

/**************************************************************************************************** */

/*****************************LOGIN-VIA-MOBILE********************************************** */
router.post('/login',function(req,res)
{
  const headers = req.headers;
  const languagues = headers.language || 'en';
  // Set data according to customer language
  const setUserLangValue = getUserLang(languagues);
  let authorization=headers.authorization;
  let mobile = req.body.mobile;
  let fcm_device_id= req.body.fcm_device_id;
  let otp=makeCode(4); 
  if(mobile.length > 0)
  {
    res.json({
      success:false,
      message:setUserLangValue['mobile_field_required'],
      otp:otp
    });

  }
  //1 for verified, 0 for unverified
    sequelize.query("SELECT * FROM otp WHERE mobile_number = ?",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [mobile]}).then(rows => {
    if (rows.length == 0)
    {
     
    sequelize.query("INSERT INTO otp (customer_id,mobile_number,otp,is_verified,created_date,status,otp_expaire_time) VALUES (?,?,?,?,?,?,?)",{type:sequelize.QueryTypes.INSERT, raw:true, replacements:[1,mobile,otp,0,currentDate,1,15245]}).then(result => {
    if (result.length > 0)
    {  
          res.json({
          status:true,
          message: setUserLangValue['otp_send'],
//           otp:otp,
          id:result[0].id,
         
        });
             Send_sms(mobile,otp);        
      }else
      {
          res.json({
          status:false,
          message:setUserLangValue['something_went_wrong'],
  //        otp:otp
        });
//
      }
   });

    res.json({
    status:true,
    message: setUserLangValue['otp_send'],
    Action:'OTP PAGE',
   // otp:otp,
     });
        } 
        else if(rows.length > 0)
        {
        
          if(rows[0].is_verified==0)
          {
            res.json({
            status:true,
            message: setUserLangValue['otp_send'] ,
     //       otp: otp,
            id:rows[0].id
            
          });
          sequelize.query("UPDATE otp SET is_verified= ?,otp=?, updated_date=? WHERE id = ? ",{type:sequelize.QueryTypes.UPDATE, raw:true, replacements:[0,otp,currentDate,rows[0].id]}).then(result => {});
           Send_sms(mobile,otp);
          }else
          {
          sequelize.query("SELECT * FROM customers WHERE mobile_number = ?",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [rows[0].mobile_number]}).then(data => {
          if(data.length >0)
          {
            let customer_id=data[0].id;  
            sequelize.query("SELECT * FROM campaign_customers WHERE customer_id = ?",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [customer_id]}).then(results => {
              if(results.length==0)
             {
            res.json({
           status:true,
           message: setUserLangValue['otp_send'],
       //    otp:otp,

    });


console.log("testotp",otp);
sequelize.query("UPDATE otp SET is_verified= ?, otp=?,updated_date=? WHERE mobile_number = ? ",{type:sequelize.QueryTypes.UPDATE, raw:true, replacements:[0,otp,currentDate,mobile]}).then(result => {});
             //    res.json({
             //    status:false,
             //    message:'No any one campaign found for this customers'
              // });
Send_sms(mobile,otp);
             }
              else if(results.length > 0)
             { 
                res.json({
                 status:true,
                 message:setUserLangValue['otp_send'],
               //  token:token,
         //        otp:otp,
               });
console.log("otp",otp);
    sequelize.query("UPDATE otp SET is_verified= ?, otp= ?, updated_date=? WHERE mobile_number = ? ",{type:sequelize.QueryTypes.UPDATE, raw:true, replacements:[0,otp,currentDate,mobile]}).then(result => {});     

Send_sms(mobile,otp);

             } 
     });

}else
{

      res.json({
      status:true,
      message:setUserLangValue['otp_send'],
     // otp:otp,

    });

sequelize.query("UPDATE otp SET is_verified= ?, otp=?,updated_date=? WHERE mobile_number = ? ",{type:sequelize.QueryTypes.UPDATE, raw:true, replacements:[0,otp,currentDate,mobile]}).then(result => {});
Send_sms(mobile,otp);    
}    
});
}
 }
})
})




/************************************FILE UPLOADS**************************************************************** */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/upload");
    },
    filename: (req, file, cb) => {
      const file_name = file.originalname;
      const user_name = req.body.first_name;
      cb(null, `${user_name}${file_name}`);
    },
  });
  const upload = multer({ storage: storage });
/**************************************************************************************************** */


/**********************************************Registrater***********************************************/
router.post('/logout',function(req,res)
{
  let mobile = req.body.mobile;
  const headers = req.headers;
  const languagues = headers.language || 'en';
  // Set data according to customer language
  const setUserLangValue = getUserLang(languagues);
  sequelize.query("SELECT * FROM otp WHERE mobile_number = ?",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [mobile]}).then(rows => {
   if (rows.length > 0)
    {

      sequelize.query("UPDATE otp SET is_verified= ?, updatedDate=? WHERE mobile_number = ? ",{type:sequelize.QueryTypes.UPDATE, raw:true, replacements:[0,currentDate,mobile]}).then(result => {
      res.json({
      status: true,
      message: setUserLangValue['logout_success'],                
              });
          });

    }else
    {

      res.json({
        status: false,
        message: setUserLangValue['something_went_wrong'],                
      });

    }

  });
  
});

/*router.post('/registers',upload.single("image"),function(req,res){
  
  res.send("SUCESS");


});*/

  router.post('/registers_old',function(req,res){
  const headers = req.headers;
  const languagues = headers.language || 'en';
  // Set data according to customer language
  const setUserLangValue = getUserLang(languagues);
  var form = new multiparty.Form();
//  let headers=req.headers;
//  let languagues=headers.language;
  let authorization=headers.authorization;
  var uniq=makeCode(6);
  form.parse(req, function(err, body, files) {
  console.log("body",body.first_name);  
  console.log("files",files.image);
  let first_name = body.first_name; 
  let middle_name = body.middle_name; 
  let last_name = body.last_name; 
  let state_var = body.state_id; 
  let district =body.district_id; 
  let address = body.address;
  let teshil =body.tehsil_id;
  let images='';
console.log("test",files);
//  if(file!=""){
 // let images = files.image[0].originalFilename;
 // }else
  //{
   //let images ='';
  //}
  let mobile_number = body.mobile;
  

console.log("first_name.length",body.first_name);
  //let no_of_catal_need= req.body.no_of_catal_need;
  if(first_name == "")
  {
    res.json({
      status:false,
      message:setUserLangValue['first_name_required'],
      
    });
  }
  if(last_name == "")
  {
    res.json({
      status:false,
      message: setUserLangValue['last_name_required'],
      
    });

  }
  if(state_var == "")
  {
    res.json({
      status:false,
      message: setUserLangValue['state_required'],
      
    });

  }
  if(district == "")
  {
    res.json({
      status:false,
      message: setUserLangValue['district_required'],
     
    });
  }
  try {
  sequelize.query("SELECT * FROM customers WHERE mobile_number = ?",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [mobile_number]}).then(CustomerRes => {
  if(CustomerRes.length >0)
  {

      res.json({
      status:false,
      message: setUserLangValue['number_already_exists'],
     
    });

  }
  });
  sequelize.query("INSERT INTO customers (first_name,middle_name,last_name,state_id,district_id,tehsil_id,is_verified,created,number_of_cattle_to_buy,address,image,mobile_number) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",{type:sequelize.QueryTypes.INSERT, raw:true, replacements:[body.first_name,middle_name,body.last_name,body.state_id,body.district_id,body.tehsil_id,1,currentDate,0,body.address,images,body.mobile]}).then(insertRow => {
   console.log(insertRow);
   
   if(insertRow)
   {
       sequelize.query("SELECT * FROM customers WHERE id = ?",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [insertRow[0]]}).then(Data => {
       res.json({
       status:true,
       message:setUserLangValue['registered_successful'],
       ACTION:'HOME PAGE',
       Data:data,
      
     });
    });
   }else
   {

      res.json({
      status:false,
      message: setUserLangValue['something_went_wrong'],
     
    });

   }
})
 }
  catch (ex) {  
    res.json({
    status: false,
    message: setUserLangValue['something_went_wrong'],      
    }); 
    
    }

  });// end loops 


});

/***********************************UPLOAD************************************************ */
router.post('/profile',
  upload.none(), function (req, res, next) {
    // validate `req.body.name` here
    // and call next(err) if it fails
  //  res.end('done!');
    next();
  },
  upload.single('image'), function (req, res, next) {
    // file is now uploaded, save the location to the database
    res.end('done!');
  });

/***********************************UPLOAD************************************************ */






/***************************************otp verify****************************************************************/

router.post('/verifyotp',function(req,res){
  const headers = req.headers;
  const languagues = headers.language || 'en';
  let mobile = req.body.mobile;
  let otp = req.body.otp;    
 // let headers=req.headers;
 // let languagues=headers.langaugue;
  let authorization=headers.authorization;
  let device_type = req.body.device_type;  
  let device_id = req.body.device_id; 
  let langaugue = req.body.langaugue; 
  let fcm_token = req.body.fcm_token;
  // Set data according to customer language
  const setUserLangValue = getUserLang(languagues);
//  let messagesng='Welcome to Gaugau ,Thankyou for registration';
 

let  messagesng = setUserLangValue['welcome_message'] ;



 var  notification_type=0;
  id=0;
  //send_notification(fcm_token,messagesng,id,notification_type);
 
  sequelize.query("SELECT * FROM otp WHERE mobile_number = ?",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [mobile]}).then(rows => {
  if (rows.length == 0) {
            res.json({
            status:false,
            message: setUserLangValue['invalid_number']
          });
        } else{   

          if(rows[0].is_verified==1)
          {
           // res.json({
            //  status:false,
             // message:'Otp already verified',
             
           // });
 sequelize.query("SELECT * FROM customers WHERE mobile_number = ?",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [mobile]}).then(data => {

              res.json({
              status:false,
              message:  setUserLangValue['already_otp_verified'],
              data
             
            });
          });

          }   

          if(rows[0].otp == otp)
          {
            //  res.json({
             // status:true,
             // message:'Otp verify successfully',
             // Action:"REGISTRATION PAGE FOR OUTSIDE USERS",
             // rows,
 sequelize.query("SELECT * FROM customers WHERE mobile_number = ?",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [mobile]}).then(data => {

            if(data.length > 0)
            {
   //multipe cattle

       let number_of_cattle_to_buy =data[0].number_of_cattle_to_buy;
       let no_of_cattle_multiple =data[0].no_of_cattle_multiple;
       let fina_val=number_of_cattle_to_buy*no_of_cattle_multiple;
       data[0].number_of_cattle_to_buy=fina_val;

              res.json({
                status:true,
                message: setUserLangValue['verified_otp'],
                //Action:"REGISTRATION PAGE FOR OUTSIDE USERS",
                authorization:token,
                 data,
  
               
              });

            }else
            {
                

              res.json({
                status:true,
                message: setUserLangValue['verified_otp'],
                //Action:"REGISTRATION PAGE FOR OUTSIDE USERS",
                data:[ {
                 registration:"false",
//                  Cattle: false
                }
              ]
                })
            }

             
          });
             
           
            sequelize.query("UPDATE otp SET is_verified= ?, updated_date=? WHERE mobile_number = ? ",{type:sequelize.QueryTypes.UPDATE, raw:true, replacements:[1,currentDate,mobile]}).then(rows => {
            res.json({
                    status: true,
                    message: setUserLangValue['verified_otp'],          
                  });
              });
             sequelize.query("UPDATE customers SET fcm_device_id= ?, device_type=?,device_id=?,updated=? WHERE mobile_number = ? ",{type:sequelize.QueryTypes.UPDATE, raw:true, replacements:[fcm_token,device_type,device_id,currentDate,mobile]}).then(rows => { });
             sequelize.query("UPDATE otp SET fcm_token =? WHERE mobile_number = ? ",{type:sequelize.QueryTypes.UPDATE, raw:true, replacements:[fcm_token,mobile]}).then(rows => { });        
          }
          else
          {
            res.json({
              status:false,
              message: setUserLangValue['otp_not_matched'],
             
            });

            }
          }
      })
})


/******************************************RESEND OTP****************************************************** */
router.post('/resendotp',function(req,res){
  let mobile = req.body.mobile;
  const headers = req.headers;
  const languagues = headers.language || 'en';
  let authorization=headers.authorization;
  // Set data according to customer language
  const setUserLangValue = getUserLang(languagues);
  let otp=makeCode(4); 
  if(mobile.length > 0)
  {
    res.json({
      status:false,
      message: setUserLangValue['mobile_field_required'],
      otp:otp
    });

  }  
 try{
    sequelize.query("SELECT * FROM otp WHERE mobile_number = ?",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [mobile]}).then(rows => {
      if (rows.length == 0) {
        res.json({
          status:false,
          message:setUserLangValue['invalid_number']
        });
      }  
    });
   sequelize.query("UPDATE otp SET otp= ?, updated_date=? WHERE mobile_number = ? ",{type:sequelize.QueryTypes.UPDATE, raw:true, replacements:[otp,currentDate,mobile]}).then(rows => {
    res.json({
      status: true,
            message: setUserLangValue['otp_send'],                
          });
      });
        Send_sms(mobile,otp);
    }
    catch(prem)
    {
      res.json({
        success: true,
        message: setUserLangValue['something_went_wrong'],                
      });

    }

})

/**************************************ADD_CATYLE******************************************************* */
router.post('/add_cattle',function(req,res){
  const headers = req.headers;
  const languagues = headers.language || 'en';
  let authorization=headers.authorization;
  let mobile = req.body.mobile;
  let id = req.body.id;
  let no_of_cattle = req.body.no_of_cattle;
  let otp=makeCode(4); 
  // Set data according to customer language
  const setUserLangValue = getUserLang(languagues);
  if(mobile.length > 0)
  {
      res.json({
      status:false,
      message: setUserLangValue['mobile_field_required'],
      otp:otp
    });

  }  
 try{
    sequelize.query("SELECT * FROM customers WHERE mobile_number = ?",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [mobile]}).then(result => {
      if (result.length == 0) {
        res.json({
          status:false,
          message: setUserLangValue['invalid_number']
        });
      }  
    
 let sting_mob=""+mobile+"";
let no_of_multiple=no_of_cattle*3;
   sequelize.query("UPDATE customers SET number_of_cattle_to_buy= ?, no_of_cattle_multiple=?,updated=? WHERE mobile_number = ? ",{type:sequelize.QueryTypes.UPDATE, raw:true, replacements:[no_of_cattle,no_of_multiple,currentDate,sting_mob]}).then(rows => {
    res.json({
      status: true,
            message: setUserLangValue['number_approval_pending_by_admin'],
            data:result                
          });
      });
});
    }
    catch(prem)
    {
      res.json({
        success: true,
        message: setUserLangValue['something_went_wrong'],                
      });

    }

})




router.post('/getCustomer',async function(req,res)
{
	
  const headers = req.headers;
  const languagues = headers.language || 'en';
  let authorization=headers.authorization;
  let customer_id = req.body.customer_id;
  // Set data according to customer language
  const setUserLangValue = getUserLang(languagues);
  let count_cattle;
 
   //shortlist calculate 30may
  const shortlistCal =await sequelize
  .query(
    "SELECT * FROM shortlisted_stocks WHERE  customer_id =? and is_confirmed=0 ",
    {
      type: sequelize.QueryTypes.SELECT,
      raw: true,
      replacements: [customer_id, 0],
    }
  )








  
    sequelize.query("SELECT * FROM customers WHERE id = ?",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [customer_id]}).then(data => {
  if (data.length > 0) {
      // let number_of_cattle_to_buy =data[0].number_of_cattle_to_buy;
      // let no_of_cattle_multiple =data[0].no_of_cattle_multiple;
      // let fina_val=no_of_cattle_multiple;
       data[0].number_of_cattle_to_buy=data[0].no_of_cattle_multiple;
   count_cattle=shortlistCal.length;
      data[0].shortlisted_no_of_cattle=count_cattle
       if(data[0].image!="")
                {
                  data[0].image=english.upload_image_url+ data[0].image;

                }else
                {
                  data[0].image='';
                }


            res.json({
            status:true,
            message:  setUserLangValue['customer_list'],
			data
          });
        } else{  
res.json({
            status:false,
            message:  setUserLangValue['something_went_wrong'],
			data
          });		

		}
	});
	
	
});



/************************************************************************************************ */



/******************************************OTP CODE****************************************************** */
function makeCode(length) {
  var result           = '';
  var characters       = '1234567890';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}



router.post('/endpoint', function (req, res) { 
  
  var form = new multiparty.Form();
  const headers = req.headers;
  const languagues = headers.language || 'en';
  // Set data according to customer language
  const setUserLangValue = getUserLang(languagues);
  
  form.parse(req, function(err, fields, files) {
    console.log("err",err);
    var first_name=fields.first_name;
    console.log("fields",fields.first_name);
    console.log("files",files);
    if(fields.first_name=="")
    {
      res.json({
        status:false,
        message:setUserLangValue['first_name_required'],
       
      });

    }   
    //console.log("name",req.body.first_name);
      // fields fields fields
  });
})




router.post('/update_profile_old',function(req,res){
var form = new multiparty.Form();  
form.parse(req, function(err, body, files) {
  let customer_id = body.customer_id; 
  let first_name = body.first_name; 
  let middle_name = body.middle_name; 
  let last_name = body.last_name; 
  let state_var = body.state_id; 
  let district =body.district_id; 
  let address = body.address;
  let teshil =body.tehsil_id;
  let images='';
  const headers = req.headers;
  const languagues = headers.language || 'en';
    // Set data according to customer language
  const setUserLangValue = getUserLang(languagues);

    sequelize.query("SELECT * FROM customers WHERE id = ?",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [customer_id]}).then(data => {
    if (data.length > 0)
     {



  if(body.customer_id=="")
  {

      res.json({
      status:false,
      message: setUserLangValue['customer_id_required'],
      
    });
}

//try
//{
  console.log("rererer");//,state_var=? ,district=?,address=?,teshil=?,image=? //state_var,district,address,teshil,image,
  sequelize.query("UPDATE customers SET first_name= ?, middle_name=?,last_name=? ,state_id=? ,district_id=?,address=?,tehsil_id=?,image=? WHERE id = ? ",
  {type:sequelize.QueryTypes.UPDATE, raw:true, replacements:[first_name,middle_name,last_name,state_var,district,address,teshil,images,customer_id]}).then(rows => { });
  {
    res.json({
    status:true,
    message:  setUserLangValue['successfully_updated'],
    data,
   
  });

} 
/*}catch(error)
{
    res.json({
    status:false,
    message:'Something went wrong',
   
  });

} */
}else
{
res.json({
status:false,
message:  setUserLangValue['no_data_found'],
});
}
});
});
})





//register code change by rahul
router.post(
    "/registers",upload.single("image") || next(),
    async (req, res) => {
      const headers = req.headers;
      const languagues = headers.language || "en";
      let authorization = headers.authorization;
      // Set data according to customer language
      const setUserLangValue = getUserLang(languagues);
      var uniq = makeCode(6);
      // form.parse(req,(err, body, files)=> {
      let image = "";
      if (req.file == undefined) {
        image = "";
      } else {
        image = req.file.filename;
      }
      const first_name = req.body.first_name;
      const middle_name = req.body.middle_name;
      const last_name = req.body.last_name;
      const state_var = req.body.state_id;
      const district = req.body.district_id;
      const address = req.body.address;
      const teshil = req.body.tehsil_id;
  
      const mobile_number = req.body.mobile;
  
      //let no_of_catal_need= req.body.no_of_catal_need;
      if (first_name == "") {
        res.json({
          status: false,
          message: setUserLangValue["first_name_required"],
        });
      }
      if (last_name == "") {
        res.json({
          status: false,
          message: setUserLangValue["last_name_required"],
        });
      }
      if (state_var == "") {
        res.json({
          status: false,
          message: setUserLangValue["state_required"],
        });
      }
      if (district == "") {
        res.json({
          status: false,
          message: setUserLangValue["district_required"],
        });
      }
      try {
        const CustomerRes = await sequelize.query(
          "SELECT * FROM customers WHERE mobile_number = ?",
          {
            type: sequelize.QueryTypes.SELECT,
            raw: true,
            replacements: [mobile_number],
          }
        );
        if (CustomerRes.length > 0) {
          res.json({
            status: false,
            message: setUserLangValue["number_already_exists"],
          });
        } else {
          console.log("entered");
          const insertRow = await sequelize.query(
            "INSERT INTO customers (first_name,middle_name,last_name,state_id,district_id,tehsil_id,is_verified,created,number_of_cattle_to_buy,address,mobile_number,image) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
            {
              type: sequelize.QueryTypes.INSERT,
              raw: true,
              replacements: [
                first_name,
                middle_name,
                last_name,
                state_var,
                district,
                teshil,
                1,
                currentDate,
                0,
                address,
                mobile_number,
                image,
              ],
            }
          );
          console.log(insertRow);
  
          if (insertRow) {
            sequelize
              .query("SELECT * FROM customers WHERE id = ?", {
                type: sequelize.QueryTypes.SELECT,
                raw: true,
                replacements: [insertRow[0]],
              })
              .then((Data) => {
              if(Data[0].image!="")
                {
                  Data[0].image=english.upload_image_url+ Data[0].image;

                }else
                {
                  Data[0].image='';
                }
                res.json({
                  status: true,
                  message: setUserLangValue["registered_successful"],
                  //ACTION: "HOME PAGE",
                  data: Data,
                });
              });
  
              // add notifications
  
         //     let notification_msg='0';
          //    sequelize.query("INSERT INTO notifications (customer_id,descriptions,notification_type,status,created_date) VALUES (?,?,?,?,?)",{type:sequelize.QueryTypes.INSERT, raw:true, replacements:[insertRow[0],notification_msg,0,0,currentDate]}).then(insertRow => {});
  
    // add notifications
              let notification_msg='';
              if(languagues=='hi')
              {
                notification_msg='प्रिय  '+first_name+' जी गऊ-गऊ व्यापार ऐप साइन अप करने के लिए धन्यवाद। आपको आगे की पशु-खरीद यात्रा की शुभकामनाएँ!';
              }else
              {

                notification_msg='Dear '+first_name+' Thank you for signing up Gaugau vyapar app.Wish you happy cattle-buying journey ahead !';
              }

              let fcm_token;
              sequelize
              .query("SELECT * FROM otp  WHERE mobile_number = ?", {
                type: sequelize.QueryTypes.SELECT,
                raw: true,
                replacements: [mobile_number],
              })
              .then((Data) => { 
              fcm_token=Data[0].fcm_token
              id=0;
              notification_type=0;
              send_notification(fcm_token,notification_msg,id,notification_type);


              });
             sequelize.query("INSERT INTO notifications (customer_id,message,notification_type,status,created_date) VALUES (?,?,?,?,?)",{type:sequelize.QueryTypes.INSERT, raw:true, replacements:[insertRow[0],notification_msg,0,0,currentDate]}).then(insertRow => {});


          } else {
            res.json({
              status: false,
             
              message: setUserLangValue["something_went_wrong"],
            });
          }
        }
      } catch (ex) {
        res.json({
          status: false,
          message: setUserLangValue["something_went_wrong"],
        });
      }
      // }); // end loops
    }
  );



  router.post(
    "/update_profile",
    upload.single("image") || next(),
    async (req, res) => {
      const customer_id = req.body.customer_id;
      const first_name = req.body.first_name;
      const middle_name = req.body.middle_name;
      const last_name = req.body.last_name;
      const state_var = req.body.state_id;
      const district = req.body.district_id;
      const address = req.body.address;
      const teshil = req.body.tehsil_id;
      let image = "";
      if (req.file == undefined) {
        image = "";
      } else {
        image = req.file.filename;
      }
      const headers = req.headers;
      const languagues = headers.language || "en";
      
      // Set data according to customer language
      const setUserLangValue = getUserLang(languagues);
      const data = await sequelize.query("SELECT * FROM customers WHERE id = ?", {
        type: sequelize.QueryTypes.SELECT,
        raw: true,
        replacements: [customer_id],
      });
      console.log("data ", data);
      if (data.length > 0) {
        if (req.body.customer_id == "") {
          res.json({
            status: false,
            message: setUserLangValue["customer_id_required"],
          });
        }
        //try
        //{
        console.log("rererer"); //,state_var=? ,district=?,address=?,teshil=?,image=? //state_var,district,address,teshil,image,
  
        const rows = await sequelize.query(
          "UPDATE customers SET first_name= ?, middle_name=?,last_name=? ,state_id=? ,district_id=?,address=?,tehsil_id=?,image=? WHERE id = ? ",
          {
            type: sequelize.QueryTypes.UPDATE,
            raw: true,
            replacements: [
              first_name,
              middle_name,
              last_name,
              state_var,
              district,
              address,
              teshil,
              image,
              customer_id,
            ],
          }
        );
        {
          // as the sql query is successfully fired, we will update data value rather than firing a whole new query.
          data[0].first_name = first_name;
          data[0].middle_name = middle_name;
          data[0].last_name = last_name;
          data[0].state_id = state_var;
          data[0].district_id = district;
          data[0].tehsil_id = teshil;
          data[0].address = address;
if(data[0].image!="")
                {
                  data[0].image=english.upload_image_url+ data[0].image;

                }else
                {
                  data[0].image='';
                }

         // data[0].image = image;
          res.json({
            status: true,
            message: setUserLangValue["successfully_updated"],
            data,
          });
        }
        /*}catch(error)
  {
    res.json({
    status:false,
    message:'Something went wrong',
   
  });
  
  } */
      } else {
        res.json({
          status: false,
          message: setUserLangValue["no_data_found"],
        });
      }
    }
  );





router.post('/update_profile_olds',function(req,res){
var form = new multiparty.Form();  
form.parse(req, function(err, body, files) {
  let customer_id = body.customer_id; 
  let first_name = body.first_name; 
  let middle_name = body.middle_name; 
  let last_name = body.last_name; 
  let state_var = body.state_id; 
  let district =body.district_id; 
  let address = body.address;
  let teshil =body.tehsil_id;
  let images='';
  const headers = req.headers;
  const languagues = headers.language || 'en';
    // Set data according to customer language
  const setUserLangValue = getUserLang(languagues);
  if(body.customer_id=="")
  {

      res.json({
      status:false,
      message:  setUserLangValue['customer_id_required'],
      
    });
}

//try
//{
  console.log("rererer");//,state_var=? ,district=?,address=?,teshil=?,image=? //state_var,district,address,teshil,image,
  sequelize.query("UPDATE customers SET first_name= ?, middle_name=?,last_name=? ,state=? ,district=?,address=?,teshil=?,image=? WHERE id = ? ",
  {type:sequelize.QueryTypes.UPDATE, raw:true, replacements:[first_name,middle_name,last_name,state_var,district,address,teshil,images,customer_id]}).then(rows => { });
  {
    res.json({
    status:true,
    message: setUserLangValue['successfully_updated'],
   
  });

} 
/*}catch(error)
{
    res.json({
    status:false,
    message:'Something went wrong',
   
  });

} */

});
})




router.post('/smsApi',async function(req,res){
var request = require("request");  
const headers = req.headers;
  const languagues = headers.language || 'en';
  // Set data according to customer language
  const setUserLangValue = getUserLang(languagues);
var options = { method: 'POST',
url: 'https://enterprise.smsgupshup.com/GatewayAPI/rest',
form: 
  { method: 'sendMessage',
  send_to: '918770942076',
  msg:  setUserLangValue['registered_successful_otp_is'],
  msg_type: 'TEXT',
  userid: '2000194577', 
  auth_scheme: 'PLAIN',
  password: 'Gaugau123*',
  format: 'JSON' } };
  request(options, function (error, response, body) {
  if (error) throw new Error(error);
  console.log(body);
  //res.send(body);
  });

});



function send_notification(device_id,messagesng,id,notification_type){
  console.log("device_id",device_id);
  console.log("messagesng",messagesng);
  //device_id,messagesng,id,notification_type
  var message = {
  to: device_id,
  collapse_key: 'green',
  data : {
  body: {  
           'descriptions': messagesng,
            'id':id,
           'notification_type': notification_type
       },
   },
};
fcm.send(message, function(err, response) {
  if(err) {
    console.log(message);
         console.log("Something has gone wrong !");
   } else {
       console.log("Successfully sent with resposne :",response);
     }
  //console.log("err",err);
});
}




function Send_sms(mobile,otp)
{

  var request = require("request");
  var mobile_no = mobile;
//  var message='Thanks for registering to Gaugau.Your confidential OTP is '+otp; 
 var message= otp +' is the OTP for logging in to your GauGau account. Keep the OTP safe. We will never call to ask for your OTP. -GauGau SsHSaNJtUwD';

  var message = encodeURIComponent(message);
  //credential from smsgupshup
  var userid = '2000194577'; 
  var password = 'Cattleways123*'; 
  //try to break api params as much as possible and put variable on it 
  var url = 'http://enterprise.smsgupshup.com/GatewayAPI/rest?method=SendMessage&send_to='+mobile_no+'&msg='+message+'&msg_type=TEXT&userid='+userid+'&auth_scheme=plain&password='+password+'&v=1.1&format=text';
  request
    .get(url)
    .on('response', function(response) {
     console.log(response.statusCode); // 200 
      if(response.statusCode=='200'){
      }else{
  // res.send('0');
 }
});
}




module.exports = router;
