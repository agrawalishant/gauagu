
var express = require('express');
var router = express.Router();
const sequelize = require("../models/Users")
const Sequelizejkdf=require("../models/Jkdf");
const english=require("../langauge/en");
const hindi=require("../langauge/hn");
const marathi=require("../langauge/mr");
const punjabi=require("../langauge/pa");
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
const { json } = require('body-parser');

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
/******user Language 20 may******/
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

/*****************************GET STOCKS********************************************** */

router.post('/lang',function(req,res){
//console.log(langauge);
let langauge = req.headers['language'];
console.log("langauge",langauge);
if(langauge=='hi')
{
  res.send(hindi);

}else if(langauge=='mr')
{
  res.send(marathi);
}
else if(langauge=='pa')
{
  res.send(punjabi); 
}else
{



}



});


router.post("/getStocks", async function (req, res) {
  const headers = req.headers;
  const languagues = headers.language || 'en';
  // Set data according to customer language
  const setUserLangValue = getUserLang(languagues);
  let authorization = headers.authorization;
  let customer_id = req.body.customer_id;
  let offset = req.body.offset;
  /***Pagination Login Start ***/ 
  let limit = req.body.limit || 10;
  let pageNo = req.body.page_no * limit || 0;
  let limitQuery = ` LIMIT ${pageNo}, ${limit}`;
  /***Pagination Login END ***/
  // filter param
  var obj = {};
  let images = [];
  let animal_type = [];
  let filter_type = [];
  let breeds;
  let price = [];
  let breed_fiter = [];
  let dynamicquery = [];
  let lactation_number = [];
  let price_fiter = [];
  let lactation_numbers;
  let milk_capacity = [];
  let milk_capacitys;
  let pregnancy_delivery_status = [];
  let pregnancy_status_parm;
  let calf_status;
  let calf_status_arr = [];
  let no_of_teeth;
  let no_of_teeth_arr = [];
  let caif;
  //end

 //update lang
    sequelize
  .query(
    "UPDATE customers SET preferred_langague= ?, updated=? WHERE id = ?",
    {
      type: sequelize.QueryTypes.UPDATE,
      raw: true,
      replacements: [languagues, currentDate, customer_id],
    }
  );

  let data_array = [];
  const rows = await sequelize.query(
    "SELECT * FROM campaign_customers WHERE customer_id = ?",
    {
      type: sequelize.QueryTypes.SELECT,
      raw: true,
      replacements: [customer_id],
    }
  );
  if (rows.length > 0) {
    let campaign_id = rows[0].campaign_id;
    const result = await sequelize.query(
      "SELECT * FROM campaigns WHERE id = ?",
      {
        type: sequelize.QueryTypes.SELECT,
        raw: true,
        replacements: [campaign_id],
      }
    );
    if (result.length > 0) {
      let maxMin_filter = " ";
      let filter_query =
        "SELECT stocks.*,stock_images.media_type, stock_images.file_type,stock_images.image_path FROM stocks INNER JOIN stock_images ON stocks.id = stock_images.stock_id";
      let group_by = "where inventory_status=1  GROUP by stocks.id";
      let limitPages='  and inventory_status=1  GROUP by stocks.id';
      let criteria = result[0].criteria;
      var itemnew = JSON.parse([criteria]);

   
      var cattle_type = "";
      let data_array1 = [];
      var breed = "";
      let data1 = [];
      let Data11 = [];
      let images = [];
      if (itemnew[0]["Cattle_Type"]) {
  
        filter_query += " where animal_type in ("+itemnew[0]["Cattle_Type"] +") ";

      }
      if (itemnew[0]["Breed"]) {
       filter_query += " or animal_breed in ("+itemnew[0]["Breed"] +") ";    
      
      }

      if (itemnew[0]["Supplier"]) {
        filter_query += " or supplier_id in ("+itemnew[0]["Supplier"] +") ";  
        
      }
            
           if(itemnew[0]['Milk_Capacity'])
              { 
              filter_query += " or milk_capacity in ("+itemnew[0]["Milk_Capacity"] +") "; 
              }
              if(itemnew[0]['Lactation'])
              { 
               filter_query += " or lactation_number in ("+itemnew[0]["Lactation"] +") "; 
                
              }
              if(itemnew[0]['Deliver_Status'])
              { 
                filter_query += " or pregnancy_delivery_time in ("+itemnew[0]["Deliver_Status"] +") "; 
               
              }

 //this connection comming from jkdf */
              if(itemnew[0]['price'])
              { 
            

              var priceFilter = itemnew[0]['price'].split(',');
              let max=priceFilter[0];
              let min=priceFilter[1];

              filter_query += " or base_price <= "+max+" AND base_price >= "+min+""; 
                ;
                

              //  res.send(filter_query);

              
           
              }
              //  res.send(filter_query);
             
      let new_arr = [];
 
      / MaxMin Price start /
   
    
      const maxMinQuery =
        "SELECT MAX(base_price) ,MIN(base_price) FROM stocks";
        
      const prepare_query_withOutLimit = maxMinQuery + maxMin_filter;
      
      const maxMin_Data = await Sequelizejkdf.query(
        prepare_query_withOutLimit,
        {
          type: sequelize.QueryTypes.SELECT,
          raw: true,
          replacements: [filter_query],
        }
      );
      //res.send(prepare_query_withOutLimit);
 
      let prepare_query = filter_query + limitPages + limitQuery;
      //res.send(prepare_query);
    
   
      const data = await Sequelizejkdf.query(prepare_query, {
        type: sequelize.QueryTypes.SELECT,
        raw: true,
        replacements: [filter_query],
      });
      let image_url = "";
      if (data.length > 0) {
        for (i = 0; i < data.length; i++) {
          //code for filter
          if (
            data[i].animal_type == "cow" ||
            data[i].animal_type == "baffalo"
          ) {
            if (i == 0) {
              price = {
                min: maxMin_Data[0]["MIN(base_price)"],
                max: maxMin_Data[0]["MAX(base_price)"],
                selection: "single",
                image: "",
              };
              price_fiter.push(price);
            }
            if (i == 0) {
              obj = [
                {
                  parent_name: "Animal type",
                  parent_type:"animal_type",
                  id:1,
                  list_type: "grid",
                  childList: [
                    {
                      selection: "single",
                      title: "Cow",
                      image:
                        "https://staging.gaugau.co/img/stocks/235/angle2.jpeg",
                      id: "1",
                    },
                    {
                      selection: "single",
                      title: "Baffalo",
                      image:
                        "https://staging.gaugau.co/img/stocks/241/angle2.jpeg",
                      id: "2",
                    },
                  ],
                },
                (obj = {
                  parent_name: "Price",
                  parent_type:"base_price",
                  id:2,
                  list_type: "grid",
                  childList: price_fiter,
                }),
                (obj = {
                  parent_name: "Breed",
                  parent_type:"animal_breed",
                  id:3,
                  list_type: "grid",
                  childList: breed_fiter,
                }),
                (obj = {
                  parent_name: "pregnancy_status",
                  parent_type:"pregnancy_delivery_status",
                  id:4,
                  list_type: "linear",
                  childList: pregnancy_delivery_status,
                }),
                (obj = {
                  parent_name: "lactation_number",
                  parent_type:"lactation_number",
                  id:5,
                  list_type: "grid",
                  childList: lactation_number,
                }),
                (obj = {
                  parent_name: "Milk capcity",
                  parent_type:"milk_capcity",
                  id:6,
                  list_type: "grid",
                  childList: milk_capacity,
                }),
                (obj = {
                  parent_name: "Calf status",
                  parent_type:"calf",
                  id:7,
                  list_type: "grid",
                  childList: calf_status_arr,
                }),
                (obj = {
                 parent_name: "No of theeth",
                 parent_type:"animal_teeth_count",
                 id:8,
                 list_type: "grid",
                 childList: no_of_teeth_arr,
                }),
              ];
              filter_type.push(obj);
            }
            breeds = {
              title: data[i].animal_breed,
              id: data[i].id,
              animal_type: data[i].animal_type,
              selection: "single",
              image: "",
            };
            lactation_numbers = {
              title: data[i].lactation_number,
              id: data[i].id,
              animal_type: data[i].animal_type,
              animal_breed: data[i].animal_breed,
              selection: "multiselect",
              image: "",
            };
            milk_capacitys = {
              title: data[i].milk_capacity,
              id: data[i].id,
              animal_type: data[i].animal_type,
              animal_breed: data[i].animal_breed,
              selection: "single",
              image: "",
            };
            pregnancy_status_parm = {
              title: data[i].pregnancy_delivery_status,
              id: data[i].id,
              animal_type: data[i].animal_type,
              animal_breed: data[i].animal_breed,
              selection: "multiselect",
              image: "",
            };
            calf_status = {
              title: data[i].calf,
              id: data[i].id,
              animal_type: data[i].animal_type,
              animal_breed: data[i].animal_breed,
              selection: "multiselect",
              image: "",
            };
            no_of_teeth = {
              title: data[i].animal_teeth_count,
              id: data[i].id,
              animal_type: data[i].animal_type,
              animal_breed: data[i].animal_breed,
              selection: "single",
              image: "",
            };
            breed_fiter.push(breeds);
            lactation_number.push(lactation_numbers);
            milk_capacity.push(milk_capacitys);
            pregnancy_delivery_status.push(pregnancy_status_parm);
            calf_status_arr.push(calf_status);
            no_of_teeth_arr.push(no_of_teeth);
          }
          //end of filter
          //shortlist
          const shortstatus =await sequelize
            .query(
              "SELECT * FROM shortlisted_stocks WHERE stock_id = ? and  customer_id =?",
              {
                type: sequelize.QueryTypes.SELECT,
                raw: true,
                replacements: [data[i].id, customer_id],
              }
            )
              if (shortstatus.length > 0) {
                   data[i].shortlisted= true;
              } else {
                     data[i].shortlisted=false;
              }   




           //transalate
          const translations = await sequelize.query(
          //  "SELECT * FROM translations",
            "SELECT * FROM content_translations where language= '"+languagues+"'",
            {
              type: sequelize.QueryTypes.SELECT,
              raw: true,
              replacements: [],
            }
          );
         if(translations.length >0)
         {
              for(j=0;j<translations.length;j++)
              {
                  
                    console.log("lang",data[i].animal_breed); 
                  if(translations[j].meta_key==data[i].animal_type)
                  {
                
                    
                         console.log("test",translations[j].values);
                         data[i].animal_type=translations[j].values;
                               
                  }
                
                 if(translations[j].meta_key==data[i].animal_breed)
                {
                       data[i].animal_breed=translations[j].values;

                     
                }


              }
     
         }



          let count;
          try{
            const resultData = await sequelize.query(
              "SELECT stock_id,count(stock_id) FROM shortlisted_stocks WHERE stock_id = ?",
              {
                type: sequelize.QueryTypes.SELECT,
                replacements: [data[i].id],
              }
            );
            count = resultData[0]["count(stock_id)"];
            if (count >= 2) {
              data[i].inDemand = 1;
            } else {
              data[i].inDemand = 0;
            }
          }catch(err){
            res.status(500).json(err);
          }
        }
        // filter array result
        var filter_arr = filter_type[0];
        res.json({
          status: true,
          message: setUserLangValue['stock_list_success'],
          
         campaign_id:campaign_id,
         data,
          filter_arr,
        });
      } else {
        res.json({
          status: true,
          message:  setUserLangValue['campaign_error'],
         data:[]
        });
      }
    }
  } else {
    res.json({
      status: true,
      message: setUserLangValue['campaign_associate_customer_error'],
     data:[]
    });
  }
});




/******************************************************STOCKS DETAILS*********************************************************** */



router.post('/getStocksdetails',async function (req, res) {
  const headers = req.headers;
  const languagues = headers.language || 'en';
  // Set data according to customer language
  const setUserLangValue = getUserLang(languagues);
  let authorization=headers.authorization;
  let customer_id = req.body.customer_id;  
  let stock_id = req.body.stock_id;  
  let langauge = req.body.langauge; 
  let data_array = []; 
  let page=1;
  let image_url='';
  let result='';
  let campaign_id;
  let client_id;
  let sorting_arry=[];
  let image_sort=[];


  //campigan

  let rows=await sequelize.query("SELECT * FROM campaign_customers WHERE customer_id = ?",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [customer_id]});
  if(rows.length > 0)
  {
    
     campaign_id=rows[0].campaign_id;
     client_id=rows[0].client_id;

  }

  // stock check
  let short_status='';
  let shortstatus=await sequelize.query("SELECT * FROM shortlisted_stocks WHERE stock_id = ? and  customer_id =?",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [stock_id,customer_id]})
  if(shortstatus.length > 0)
  {
    short_status=true;
    
  }else
  {
    short_status=false;

  }

  let filter_query='SELECT * from stocks where inventory_status=1 and id='+stock_id;
  console.log("filter_query",filter_query);
  let data= await Sequelizejkdf.query(filter_query,{type:sequelize.QueryTypes.SELECT,raw:true, replacements: [filter_query]})
//  console.log("datssa",data.length);
  if(data.length > 0)
  {

    var lang_param_data;
    let lang_type;
  //transalate 
const translations = await sequelize.query(
//"SELECT * FROM translations",
  "SELECT * FROM content_translations where language= '"+languagues+"'",
{
  type: sequelize.QueryTypes.SELECT,
  raw: true,
  replacements: [],
}
);

if(translations.length >0)
{
  for(j=0;j<translations.length;j++)
  {
     if(languagues=='hi')
     {
      lang_type='hi';
      lang_param_data="hindi"
     }if(languagues=='en')
     {
      lang_type='en';
      lang_param_data=english
     }if(languagues=='mr')
     {
      lang_type='mr';
      lang_param_data=marathi
     }if(languagues=='pn')
     {
      lang_type='pn';
      lang_param_data=punjabi
     }



        if (languagues == lang_type) {
          
          if(translations[j].meta_key==data[0].animal_type)
          {

            console.log("fdf",lang_param_data);
            data[0]["animal_type"]=translations[j].hindi;   
            console.log("amit",translations[j].hindi);

          }
          if(translations[j].meta_key==data[0].animal_breed)
          {
            data[0]["animal_breed"]=translations[j].values;    
          }
          if(translations[j].meta_key==data[0].pregnancy_delivery_status)
          {
            data[0]["pregnancy_delivery_status"]=translations[j].values;    
          }
          if(translations[j].meta_key==data[0].milk_capacity)
          {
            data[0]["milk_capacity"]=translations[j].values;    
          }
          if(translations[j].meta_key==data[0].lactation_number)
         {
            data[0]["lactation_number"]=translations[j].values;    
          }
          if(translations[j].meta_key==data[0].last_delivery_date)
          {
            data[0]["last_delivery_date"]=translations[j].values;    
          }
          if(translations[j].meta_key==data[0].calf)
          {
            data[0]["calf"]=translations[j].values;    
          }
          if(translations[j].meta_key==data[0].estimated_delivery_date)
          {
            data[0]["estimated_delivery_date"]=translations[j].values;    

          }
          if(translations[j].meta_key==data[0].animal_teeth_count)
          {
            data[0]["animal_teeth_count"]=translations[j].values;    
          }
          if(translations[j].meta_key==data[0].last_lcatation_milking)
          {
            data[0]["last_lcatation_milking"]=translations[j].values;    
          }
             
        }
      

  }

}

   var shortlisted;
    Sequelizejkdf.query("SELECT * FROM stock_images WHERE stock_id = ?",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [stock_id]}).then(result => 
    {

  for(i=0; i < result.length; i++){
  console.log("result.length",result.length);
  result[i].image_url = "https://staging.gaugau.co/img/stocks/";
 // console.log("result",result);

   if(result[i].file_type=='video')
   {
    sorting_arry.push(result[i]);

   }
    if(result[i].file_type!='video')
   {

    // console.log("let sorting_arry",sorting_arry)
     image_sort.push(result[i]);

   }
  }
   
   data[0]["shortlisted"]=short_status;
   data[0]["share_url"]='http://staging.gaugau.co/animals/detail/';
  const merge = sorting_arry.concat(image_sort);      
  data[0]["image"] = merge; 				
  ///console.log(data);
  res.json({
  status: true,
  message:  setUserLangValue['stock_list_success'],
  campaign_id:campaign_id,
  client_id:client_id,
  data,                
   });


  });

  }else{
    res.json({
      status: true,
      message:  setUserLangValue['not_data_found'],
     data:[],
                 
    });    
  }

});





/***********************************************ADD_STOCKS*******************************************************/



router.post('/shortlist_stocks',function(req,res){
  const headers = req.headers;
  const languagues = headers.language || 'en';
  // Set data according to customer language
  const setUserLangValue = getUserLang(languagues);
  let stock_id = req.body.stock_id;
  let customer_id = req.body.customer_id;
  let client_id = req.body.client_id;
  let campaign_id = req.body.campaign_id;
  let stock_status=req.body.stock_status;
  let messages= setUserLangValue['shortlisted_successful'];
  let customer_deviceid='';
 let   cattle_no='';
 // sequelize.query("SELECT * FROM customers WHERE id = ?",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [customer_id]}).then(data => {
 // let customer_deviceid=data[0].fcm_device_id;
//});

sequelize.query("SELECT * FROM customers WHERE id = ?",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [customer_id]}).then(data => {
  customer_deviceid=data[0].fcm_device_id;
  cattle_no=data[0].number_of_cattle_to_buy;
   if(cattle_no*3)
   {

      res.json({
      status:false,
      message:  setUserLangValue['shortlisted_limit_'],
      otp:otp
    });

   }
   else{
    // final_val=cattle_no-1;
     //sequelize.query("UPDATE customers SET number_of_cattle_to_buy=?  WHERE id = ? ",{type:sequelize.QueryTypes.UPDATE, raw:true, replacements:[final_val,customer_id]}).then(result => {});
   }
  
});


  //console.log("customer_deviceid")


  if(stock_id == "")
  {
      res.json({
      status:false,
      message: setUserLangValue['stock_id_required'],
      otp:otp
    });

  }  
  if(customer_id == "")
  {
      res.json({
      status:false,
      message:  setUserLangValue['customer_id_required'],
      otp:otp
    });

  }
  if(client_id == "")
  {
      res.json({
      status:false,
      message:  setUserLangValue['client_id_required'],
      otp:otp
    });

  }
 try{
    sequelize.query("SELECT * FROM shortlisted_stocks WHERE stock_id = ? and customer_id=? ",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [stock_id,customer_id]}).then(rows => {
      if (rows.length > 0) {
        res.json({
          status:true,
          message:  setUserLangValue['already_shortlisted'],
         
        });
      }else
      {
        sequelize.query("INSERT INTO shortlisted_stocks (stock_id,client_id,customer_id,campaign_id,create_date,is_confirmed) VALUES (?,?,?,?,?,?)",{type:sequelize.QueryTypes.INSERT, raw:true, replacements:[stock_id,client_id,customer_id,campaign_id,currentDate,0]}).then(insertRow => {
        console.log(insertRow);
        let customer_deviceid=''; 
       
          if(insertRow)
          {

            

              res.json({
              status:true,
              message: setUserLangValue['successfuly_added']
            });

              var message = {
              to: customer_deviceid,
              collapse_key: 'green',

              notification: {
              title: 'Alert',
              body: 'Shortlisted catelog'
              },

            
          };

         /* fcm.send(message, function(err, response) {
            if (err) {
                   res.status(500).json({
                    success: false,
                    message: 'Something went wrong',
                    customerId: customer_deviceid,

                });
            } else {

                   res.status(200).json({
                    success: true,
                    message: 'Notification send successful!',
                    customerId: customer_deviceid,
                });
            }
        });*/
        sequelize.query("INSERT INTO notifications (customer_id,descriptions,status,createdDate) VALUES (?,?,?,?)",{type:sequelize.QueryTypes.INSERT, raw:true, replacements:[customer_id,messages,0,currentDate]}).then(insertRow => {});



          } else
          {
         
              res.json({
              status:true,
              message:  setUserLangValue['something_went_wrong'],
             data:[],
            });

          } 
      });
    }
  });
}
    catch(prem)
    {
      res.json({
        success: true,
        message:  setUserLangValue['something_went_wrong'], 
        data:[]               
      });

    }

})



router.post('/add_confirm_shortlist',function(req,res){
  const headers = req.headers;
  const languagues = headers.language || 'en';
  let stock_id = req.body.stock_id;
  let customer_id = req.body.customer_id;
  let client_id = req.body.client_id;
  let qc_status = 1;
  // Set data according to customer language
  const setUserLangValue = getUserLang(languagues);
  console.log("stock_id",stock_id);
  if(stock_id == "")
  {
      res.json({
      status:false,
      message:  setUserLangValue['stock_id_required'],
    });

  }  
  if(customer_id == "")
  {
      res.json({
      status:false,
      message:  setUserLangValue['customer_id_required'],
      otp:otp
    });

  }
  if(client_id == "")
  {
      res.json({
      status:false,
      message:  setUserLangValue['client_id_required'],
      otp:otp
    });

  }
 try{

  

 let no_of_cattle;
   sequelize.query("SELECT * FROM customers WHERE id=?  ",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [customer_id]}).then(data => {
    if (data.length > 0) {
     let number_of_cattle_to_buy=  data[0].number_of_cattle_to_buy;
     if(number_of_cattle_to_buy!=0){
      no_of_cattle=number_of_cattle_to_buy-stock_id.length;
     }else
     {
        res.json({
        status:true,
        message:'Limit exist',
        data:[],
      });

     }
     sequelize
     .query(
       "UPDATE customers SET number_of_cattle_to_buy= ?, updated=? WHERE id = ? ",
       {
         type: sequelize.QueryTypes.UPDATE,
         raw: true,
         replacements: [no_of_cattle, currentDate, customer_id],
       }
     );

    }

  });

  for(i=0;i < stock_id.length ; i++){

      sequelize.query("SELECT * FROM shortlisted_stocks  WHERE stock_id=? and  customer_id=?  and is_confirmed=? " ,{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [stock_id[i],customer_id,1]}).then(data => {
      if (data.length > 0) {
          res.json({
          status:true,
          message: setUserLangValue['already_shortlisted'],
          data
        });
      }
});



 console.log("is",stock_id[i]);
  sequelize.query("UPDATE shortlisted_stocks SET  qc_status =? ,is_confirmed=? WHERE  stock_id = ? ",{type:sequelize.QueryTypes.UPDATE, raw:true, replacements:[1,1,stock_id[i]]}).then(result => {
    if(result)
     {

        res.json({
        status:true,
        message: setUserLangValue['shortlisted_for_QC'],
       data:[]
       
      });

     }else
     {
        res.json({
        status:false,
        message: setUserLangValue['something_went_wrong'],
       data:[]
      });


     }

});

 }
  
}
    catch(prem)
    {
      res.json({
status: true,
        message: setUserLangValue['something_went_wrong'],                
      });

    }

})


router.post('/deleteShortlist',function(req,res){
  let stock_id = req.body.stock_id;
  let customer_id = req.body.customer_id;
  const headers = req.headers;
  const languagues = headers.language || 'en';
  // Set data according to customer language
  const setUserLangValue = getUserLang(languagues);
  sequelize.query("delete from shortlisted_stocks WHERE stock_id = ? and customer_id=? ",{type:sequelize.QueryTypes.DELETE, raw:true,  replacements: [stock_id,customer_id]}).then(rows => {
    console.log("rows",rows);
    if(rows==undefined) {
        res.json({
        status:true,
        message:  setUserLangValue['deleted_succesfully']
      });
    }else
    {

        res.json({
        status:true,
        message:  setUserLangValue['something_went_wrong']
      });

    }



});
});




router.post('/booking',function(req,res){
const headers = req.headers;
  const languagues = headers.language || 'en';
  // Set data according to customer language
  const setUserLangValue = getUserLang(languagues);
  let stock_id = req.body.stock_id;
  let customer_id = req.body.customer_id;
  let client_id = req.body.client_id;
  let campaign_id=req.body.campaign_id;
  let status='booked';


  console.log("stock_id",stock_id);
  if(stock_id == "")
  {
      res.json({
      status:false,
      message:setUserLangValue['stock_id_required'],
    });

  }  
  if(customer_id == "")
  {
      res.json({
      status:false,
      message: setUserLangValue['customer_id_required'],
     
    });

  }
  if(client_id == "")
  {
      res.json({
      status:false,
      message: setUserLangValue['client_id_required'],
     
    });

  }
 //try{

  Sequelizejkdf.query("SELECT * FROM bookings WHERE stock_id=?",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [stock_id]}).then(data => {
    console.log("data.length",data.length);
    
    if (data.length > 0) {
        res.json({
          status:true,
          message: setUserLangValue['order_placed_already'],
        
        });
      }else
      {
          Sequelizejkdf.query("INSERT INTO bookings (stock_id,client_id,customer_id,campaign_id,status) VALUES (?,?,?,?,?)",{type:sequelize.QueryTypes.INSERT, raw:true, replacements:[stock_id,client_id,customer_id,campaign_id,status]}).then(insertRow => {
          console.log("insertRow",insertRow.length);
            if(insertRow.length > 0)
              {
          
                  res.json({
                  status:true,
                  message:  setUserLangValue['successfully_booked'],
                 data:[],
                 
                });
          
               }else
               {
                  res.json({
                  status:true,
                  message:  setUserLangValue['something_went_wrong'],
                 data:[],                 
                });
          
               }
          
          });


        
      }
});
  
})



router.post('/orders', async function(req, res){
  let customer_id_req = req.body.customer_id;  
  let  new_data=[];
  let data=[];
  let qc_status;
  let booking_status;
  let inventory_status;
  let booking_arry=[];
  let confirm_arr=[];
 // image_url='';
  let campaign_id;
  let client_id;
  let final_arry=[];
  let send_arry=[];
  const headers = req.headers;
  const languagues = headers.language || 'en';
  // Set data according to customer language
  const setUserLangValue = getUserLang(languagues);

  const campiagan = await sequelize.query("SELECT * FROM campaign_customers WHERE customer_id = ?",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [customer_id_req]}).then(campiagan => {
  if (campiagan.length > 0)
      {
        
      campaign_id=   campiagan[0].campaign_id;
      client_id=   campiagan[0].client_id;
      }
    });

  const records = await sequelize.query('SELECT * FROM shortlisted_stocks  WHERE customer_id = ? and is_confirmed=? and qc_status=?',{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [customer_id_req,1,1]});
  if(records.length > 0)
  {
  

    //data.push(mergeresult);  
  
    for(i=0; i < records.length; i++)
    {

     // let mergeresult=[];
     
      stock_id  =records[i].stock_id; 
      let filter_query='SELECT stocks.*,stock_images.media_type, stock_images.file_type,stock_images.image_path FROM stocks INNER JOIN stock_images ON stocks.id = stock_images.stock_id';
      let group_by=' where stocks.id='+stock_id+'  GROUP by stocks.id';
      
    //  let filter_query_order='select s . *,m.image_path,m.is_primary,m.file_type,m.media_type,m.created ,b.status from stocks s inner join stock_images m on s.id = m.stock_id inner join bookings b on  b.stock_id = m.stock_id where s.id='+stock_id+' GROUP by s.id';
      let prepare_query=filter_query+group_by;
      console.log("prepare_query",prepare_query);
    
      const mergeresult = await  Sequelizejkdf.query(prepare_query,{type:sequelize.QueryTypes.SELECT, raw:true, nest: true, replacements: []})
      console.log("mergeresult",mergeresult.length);
     
      if(mergeresult.length > 0){
      let booked;
      let booking_id;
      let   customer_id;
      const bookings = await  Sequelizejkdf.query('select status,id,customer_id  from bookings where stock_id=?' ,{type:sequelize.QueryTypes.SELECT, raw:true, nest: true, replacements: [stock_id]})
       if(bookings.length > 0)
       {
      

        
        customer_id=bookings[0].customer_id;  
        booked=bookings[0].status;
        booking_id=records[i].booking_id;
       }
       else
       {
        booked='';
        booking_id=0;
        customer_id=''; 
       }

      //  data[0].isActive = true;
     mergeresult[0].image_url='https://staging.gaugau.co/img/stocks/';
     mergeresult[0].booking_id=booking_id;
     mergeresult[0].booking_status=booked;
     mergeresult[0].customer_id=customer_id;
     data.push(mergeresult[0]);
   
     // data.push(mergeresult[0].images);
      
     
    
    // data.push(mergeresult[0].image_url=; 
   //  console.log("test_opl",data);
     
    }else
    {

     res.json({
     status: true,
     message: setUserLangValue['no_data_found'],             
     data
          
      });

    }
        
  }

 //
//
//console.log("data",data);

//let counter = 0;



for(k=0;k<data.length;k++)
{

   qc_status=data[k]['qc_status'];
   booking_status=data[k]['booking_status'];
   inventory_status=data[k]['status'];


   if(qc_status==1 && booking_status=='booked')
   {
   send_arry.push(data[k]);
   }


   if(qc_status==1 && booking_status=='confirmed')
   {
    
   send_arry.push(data[k]);
   }


  if(qc_status==1) 
{
        send_arry.push(data[k]);

}


if(qc_status==2) 
{
        send_arry.push(data[k]);

}


   ///console.log("qc_status",qc_status);
   //console.log("booking_status",booking_status);

/*   if(qc_status==2 && booking_status=='confirmed')
   {
    
         send_arry.push(data[k]);

     // console.log("confirmed",data[k]);
     // confirm_arr.push(data[k]);
   }*/


  

 

  /* if(qc_status==1 && booking_status=='')
   {
      
    //  final_arry.push(data[k]);
//      send_arry.push(data[k]);
   }*/



  }

//send_arry.push(booking_arry);
//send_arry.push(confirm_arr);
//send_arry.push(final_arry);


  //console.log("send_arry0",send_arry[0]);
  //console.log("booking_arry",booking_arry);

//data=final_arry;
data=send_arry;
 res.json({
  status: true,
  message:  setUserLangValue['order_list'],       
  campaign_id: campaign_id,
  client_id: client_id,      
  data
 });
 




}
    res.json({
    status: true,
    message: setUserLangValue['no_data_found'],             
    data:[],
      
  });


  });



router.post('/getNotification', async function(req, res){
const headers = req.headers;
  const languagues = headers.language || 'en';
  // Set data according to customer language
  const setUserLangValue = getUserLang(languagues);
  let customer_id = req.body.customer_id;  
  sequelize.query("SELECT * FROM notifications  WHERE customer_id = ?",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [customer_id]}).then(data => {
  if (data.length > 0)
  {


      res.json({
      status:true,
      message:  setUserLangValue['notification_list'],
      data,
    });


  }else
  {


      res.json({
      status:true,
      message: setUserLangValue['something_went_wrong'],
      data:[],
    });

  }

  
  });


  });




router.get("/locations", async function (req, res) {
const headers = req.headers;
  const languagues = headers.language || 'en';
  // Set data according to customer language
  const setUserLangValue = getUserLang(languagues);
  const data = [];
  try {
    const state = await Sequelizejkdf.query("SELECT id,name FROM states ORDER BY id", {
      type:sequelize.QueryTypes.SELECT,
    });

    for (var i = 0; i < state.length; i++) {
      const stateData = [];
      stateData.push({
        id:state[i].id,
        name:state[i].name,
      });
      let districtData = [];
      const districtQuery = await Sequelizejkdf.query(
        'SELECT * FROM districts WHERE state_id = "' + state[i].id + '"',
        { type:sequelize.QueryTypes.SELECT}
      );
      for (var j = 0; j < districtQuery.length; j++) {
        const tehsilQuery = await Sequelizejkdf.query(
          'SELECT * FROM tehsils WHERE district_id = "' + districtQuery[j].id + '"',
          { type:sequelize.QueryTypes.SELECT }
        );
        let tehsil = [];
        for(var k = 0 ; k < tehsilQuery.length ; k++){
          tehsil.push({
            id:tehsilQuery[k].id,
            name:tehsilQuery[k].tahshil
        });
        }
        districtData.push({
            id:districtQuery[j].id,
            name:districtQuery[j].district,
            tehsil : tehsil
        });
        stateData.forEach(function(districts){
          districts.District = districtData;
        });
      }
        data.push(
          stateData[0]
        );
    }

  res.json({
                  status: true,
                  message: setUserLangValue['all_state_district_tehsil_list'],
             
                data,                
                   });
//    res.status(200).send(totalData);
  } catch (error) {
  //  console.log("fail");
    res.status(500).json(error);
  }
});



router.post('/shortList', async function(req, res){
  const headers = req.headers;
  const languagues = headers.language || 'en';
  let customer_id = req.body.customer_id;
  let limit = req.body.limit || 10;
  let pageNo = req.body.page_no*limit || 0 ;
  let limitQuery = ` LIMIT ${pageNo}, ${limit}`;
  // Set data according to customer language
  const setUserLangValue = getUserLang(languagues);
  let  new_data=[];
  let data=[];
 // image_url='';
  let campaign_id;
  let client_id;

  const campiagan = await sequelize.query("SELECT * FROM campaign_customers WHERE customer_id = ?",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [customer_id]}).then(campiagan => {
  if (campiagan.length > 0)
      {
        
      campaign_id=   campiagan[0].campaign_id;
      client_id=   campiagan[0].client_id;
      }
    });

  const records = await sequelize.query('SELECT * FROM shortlisted_stocks WHERE customer_id = ? and qc_status= ? and is_confirmed=?',{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [customer_id,0,0]});
  
  
  if(records.length > 0)
  {
  
    

    //data.push(mergeresult);  
    let booking_id;
    let is_confirmed;
    for(i=0; i < records.length; i++)
    {

     // let mergeresult=[];
     

      stock_id  =records[i].stock_id; 
      booking_id  =records[i].booking_id; 
      is_confirmed  =records[i].is_confirmed; 
      console.log("booking_id",booking_id);
      let filter_query='SELECT stocks.*,stock_images.media_type, stock_images.file_type,stock_images.image_path FROM stocks INNER JOIN stock_images ON stocks.id = stock_images.stock_id';
      let group_by=' where stocks.id='+stock_id+'  GROUP by stocks.id';
      let prepare_query=filter_query+group_by+limitQuery;
      console.log("prepare_query",prepare_query);
    
      const mergeresult = await  Sequelizejkdf.query(prepare_query,{type:sequelize.QueryTypes.SELECT, raw:true, nest: true, replacements: []})
      console.log("mergeresult",mergeresult.length);
     
      if(mergeresult.length > 0){
       mergeresult[0].image_url='https://staging.gaugau.co/img/stocks/';
       mergeresult[0].booking_id=booking_id;
       mergeresult[0].is_confirmed=is_confirmed;
     //  console.log("merge",mergeresult[0]);
       data.push(mergeresult[0]);
     
    }else
    {

     res.json({
     status: true,
     message: setUserLangValue['something_went_wrong'],             
     data:[]
          
      });


    }

     
             
  }

 
 res.json({
  status: true,
  message:  setUserLangValue['shortlisted'],       
  campaign_id: campaign_id,
  client_id: client_id,      
  data
        
    });
 




}
    res.json({
    status: true,
    message: setUserLangValue['something_went_wrong'],             
    data:[]
      
  });


  });


router.post('/update_notification',function(req,res){
const headers = req.headers;
  const languagues = headers.language || 'en';
  // Set data according to customer language
  const setUserLangValue = getUserLang(languagues);
let customer_id=req.body.customer_id;
let id=req.body.id;
let read_status=1;
let result;
if(customer_id=="")
{
    res.json({
    status:true,
    message: setUserLangValue['customer_id_required'],
 
  });
}

if(customer_id!="" && id!="")
{

  sequelize.query("UPDATE notifications SET read_status=?  WHERE id = ? ",{type:sequelize.QueryTypes.UPDATE, raw:true, replacements:[1,id]}).then(result => {
    if(result)
    {
    
        res.json({
        status:true,
        message:  setUserLangValue['notification_updated'],
     
      });
    }else
    {
      res.json({
        status:false,
        message: setUserLangValue['something_went_wrong'],
       
      });
    }

  });
}else
{
  sequelize.query("UPDATE notifications SET read_status=?  WHERE customer_id = ? ",{type:sequelize.QueryTypes.UPDATE, raw:true, replacements:[1,customer_id]}).then(result => {
    if(result)
    {
    
        res.json({
        status:true,
        message:  setUserLangValue['notification_updated'],
     
      });
    }else
    {
        res.json({
        status:false,
        message: setUserLangValue['something_went_wrong'],
       
      });
    }

  });

}
})


router.post('/version_check',function(req,res){
const headers = req.headers;
  const languagues = headers.language || 'en';
  // Set data according to customer language
  const setUserLangValue = getUserLang(languagues);
let version=req.body.version;
let devicetype=req.body.device_type;
sequelize.query("SELECT * FROM app_versions WHERE device_type =? ",{type:sequelize.QueryTypes.SELECT, raw:true,  replacements: [devicetype]}).then(rows => {
  if (rows.length > 0) {
    var data=rows;
     if(rows[0].app_version > version)
     {
        res.json({
        status:true,
        message: setUserLangValue['move_to_force_Update'],
        data
       });

     }else
     {

        res.json({
        status:false,
        message: setUserLangValue['no_force_update'],
        data
       });

     }
  
  }else
  {
      res.json({
      status:true,
      message: setUserLangValue['something_went_wrong'],
     
    });
  }
});

});




router.post('/SendNotification', async function(req, res)
{
  const headers = req.headers;
  const languagues = headers.language || 'en';
  // Set data according to customer language
  const setUserLangValue = getUserLang(languagues);
  let device_id=req.body.device_id;
  let notification_type;
  let descriptions;

   //const notification = await sequelize.query("SELECT * FROM shortlisted_stocks WHERE create_date =? ", { type: QueryTypes.SELECT , replacements: [currentDate]});
  
   //Shortlisted Cattle, not sent for Quality Check ( If 0 Cattles sent for QC ) ??? Shortlisting Screen
   let filter_query='SELECT shortlisted_stocks.*,customers.fcm_device_id, customers.id FROM shortlisted_stocks INNER JOIN customers ON customers.id = shortlisted_stocks.customer_id';
   let group_by=' where qc_status=1 and shortlisted_stocks.create_date > '+currentDate +'  group by shortlisted_stocks.customer_id'  ;
   let prepare_query=filter_query+group_by;


     //  Increase in Shortlisting qty updated because of failed QC status ??? ??? Shortlisting Screen
    let filter_query_5='SELECT stocks.*,bookings.status, bookings.stock_id FROM stocks INNER JOIN bookings ON bookings.stock_id = stocks.id';
    let group_by_5=' where stocks.qc_status=3 and stocks.inventory_status=1';
    let prepare_query_5=filter_query_5+group_by_5;

    //QC passed but was not booked ??? Order Screen
   let filter_query_2='SELECT stocks.*,bookings.status, bookings.stock_id FROM stocks INNER JOIN bookings ON bookings.stock_id = stocks.id';
   let group_by_2=' where stocks.qc_status=2 and bookings.status=""';
   let prepare_query_2=filter_query_2+group_by_2;

    //Booked but went out of stock ??? Order Screen
    let filter_query_3='SELECT stocks.*,bookings.status, bookings.stock_id FROM stocks INNER JOIN bookings ON bookings.stock_id = stocks.id';
    let group_by_3=' where stocks.qc_status=2 and stocks.inventory_status=2';
    let prepare_query_3=filter_query_3+group_by_3;

  
    //Booked but went out of stock ??? Order Screen
  let filter_query_1='SELECT stocks.*,bookings.status, bookings.stock_id FROM stocks INNER JOIN bookings ON bookings.stock_id = stocks.id';
  let group_by_1=' where stocks.qc_status=2 and bookings.status="Booked"  and stocks.inventory_status=2';
  let prepare_query_1=filter_query_1+group_by_1;

  

  
    //QC passed but went out of stock ??? Order Screen


    let filter_query_4='SELECT stocks.*,bookings.status, bookings.stock_id FROM stocks INNER JOIN bookings ON bookings.stock_id = stocks.id';
    let group_by_4=' where stocks.qc_status=2 and stocks.inventory_status=2  and bookings.status="Booked" group by stocks.id'  ;
    let prepare_query_4=filter_query_4+group_by_4;





//**********************************************************************************/
   console.log("prepare_query",prepare_query);
   const data = await sequelize.query(prepare_query,{type:sequelize.QueryTypes.SELECT,raw:true});
   let customer_device_id;
   let stocks_id;

   if(data.length > 0 )
   {
       console.log("datasss",data);
      notification_type=1;
      descriptions= setUserLangValue['shortlist_successfully_choose_next'];
      for(i=0;i<data.length;i++)
      {
       customer_device_id= data[i].fcm_device_id;
       stocks_id= data[i].stock_id;
  
      }

  }
//**********************************************************************************/
console.log("prepare_query",prepare_query_1);
const data2 = await Sequelizejkdf.query(prepare_query_1,{type:sequelize.QueryTypes.SELECT,raw:true});


if(data2.length > 0 )
{
   console.log("datasss",data);
   notification_type=2;
   descriptions= setUserLangValue['shortlisted_gone_outOfStock'];
   for(i=0;i<data2.length;i++)
   {
    customer_device_id= data2[i].fcm_device_id;
    stocks_id= data[i].stock_id;

   }

}

console.log("prepare_query",prepare_query_2);
const data3 = await Sequelizejkdf.query(prepare_query_2,{type:sequelize.QueryTypes.SELECT,raw:true});
if(data3.length > 0 )
{
    console.log("datasss",data3);
    notification_type=3;
    descriptions= setUserLangValue['shortlisted_gone_outOfStock'];
   for(i=0;i<data3.length;i++)
   {
    customer_device_id= data3[i].fcm_device_id;
    stocks_id= data3[i].stock_id;

   }

}

console.log("prepare_query",prepare_query_2);
const data4 = await Sequelizejkdf.query(prepare_query_3,{type:sequelize.QueryTypes.SELECT,raw:true});
if(data4.length > 0 )
{
    console.log("datasss",data4);
    notification_type=4;
    descriptions= setUserLangValue['shortlisted_gone_outOfStock'];
   for(i=0;i<data4.length;i++)
   {
    customer_device_id= data4[i].fcm_device_id;
    stocks_id= data4[i].stock_id;

   }

}



console.log("prepare_query",prepare_query_2);
const data5 = await Sequelizejkdf.query(prepare_query_4,{type:sequelize.QueryTypes.SELECT,raw:true});
if(data5.length > 0 )
{
    console.log("datasss",data4);
    notification_type=5;
    descriptions= setUserLangValue['shortlisted_gone_outOfStock'];
   for(i=0;i<data5.length;i++)
   {
    customer_device_id= data5[i].fcm_device_id;
    stocks_id= data5[i].stock_id;

   }

}



//**********************************************************************************/
console.log("prepare_query",prepare_query_2);
const data6 = await Sequelizejkdf.query(prepare_query_5,{type:sequelize.QueryTypes.SELECT,raw:true});
if(data6.length > 0 )
{
   
  console.log("datasss",data6);
   notification_type=2;
   for(i=0;i<data6.length;i++)
   {
    customer_device_id= data6[i].fcm_device_id;
    stocks_id= data6[i].stock_id;

   }

}

    // fcm 
    var message = {
    to: customer_device_id,
    collapse_key: 'green',

    data : {
   
      
        body: {  //you can send only notification or only data(or include both)
          'descriptions': descriptions,
           // title: 'Alert',
          'id':stocks_id,
          'notification_type': notification_type
      },

  },

 

  
};
fcm.send(message, function(err, response) {
  if (err) {
         res.status(500).json({
          success: false,
          description: setUserLangValue['something_went_wrong'],
          customer_device_id: customer_device_id,

      });
  } else {

         res.status(200).json({
          success: true,
          description:setUserLangValue['notification_send'],
          notification_type: 0,
          customer_device_id: customer_device_id,
      });
  }
});

   
});




function get_notification(){
var device_id=req.body.device_id;
var messges=req.body.message;  
var message = {
  to: device_id,
  collapse_key: 'green',
  notification: {
  title: 'Welcome messages',
  body: messages
  },
};
fcm.send(message, function(err, response) {
  if (err) {
    res.status(500).json({
     success: true,
     description: 'Something went wrong',
    

 });
} else {

    res.status(200).json({
     success: true,
     description: 'Notification send successful!',
   
 });
}
});
}








module.exports = router;
