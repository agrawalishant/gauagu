const db = require("../config/adminModelConfig.js");
const sequelize = require('sequelize');
const Op = sequelize.Op;
const DateTimeFormat  = require('format-date-time');
const formatter = new DateTimeFormat('YYYY-MM-DD');
const Customer = db.customer;
const Client = db.client;
const Districts = db.districts;
const Tahshils = db.tahshil;
const States = db.state;
const breeds = db.breeds;
const stocks = db.stocks;
const qcStatusModel = db.qc_status;
const suppliers = db.suppliers;
const campaigns = db.campaigns;
const shortlistedStocks = db.shortlistedStocks;
const campaignCustomerModel = db.campaignCustomers;
const calf = db.calf;
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

const csv = require('csv-parser');
const fs = require('fs');
const results = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

exports.AddCsvRead_Customer = async (req, res) => {
    const results = [];
    const clientId = req.body.client_id;
    const campaign_criteria = req.body.criteria;
    const campaginData = {
        campaign_name: req.body.campaign_name,
        criteria: campaign_criteria,
        descriptions: req.body.campaign_descriptions,
        start_date: req.body.start_date,
        campaign_expaire: req.body.end_date,
        status: req.body.status
    };

    const campaginCreateId = await campaigns.create(campaginData).then((data)=>{return data.id}).catch((err)=>{res.send(err)});
    try{
    fs.createReadStream('upload/csv/'+req.file.filename)
    .pipe(csv({}))
    .on('data', (data) =>{
         results.push(data)
        })
    .on ('end', () => {
        let c=0;
          results.forEach(async (results) => {
            var csvAddress = (results.Address!='')?(results.Address):('NA');
            var csvLastname = (results.LastName!='')?(results.LastName):('NA');
            var csvFirstname = (results.FirstName!='')?(results.FirstName):('NA');
            var csvCattle = (results.Cattle!='')?(results.Cattle):(0);
              
            if(results.Tahshil!='' || results.Tahshil!=''  || results.State!=''){
               
                var csvthshil = await Tahshils.findOne({ 
                        where:{tahshil: results.Tahshil}
                    })
                    .then((data)=>{
                        return data.id;                        
                    })
                    .catch((err)=>{
                        console.log(err);
                        return 5463;                        
                    });

                    //Distiic ---------------------
                    var csvDistic = await Districts.findOne({ 
                        where:{district: results.District}
                    })
                    .then((data)=>{
                        return data.id;                        
                    })
                    .catch((err)=>{
                        console.log(err);
                        return 616;                        
                    })
                    
                    //State--------------------------
                    var csvState = await States.findOne({ 
                        where:{name: results.State}
                    })
                    .then((data)=>{
                        return data.id;                        
                    })
                    .catch((err)=>{
                        return 37;
                        
                    })
            }else{
                csvthshil = 5463;
                csvState = 37;
                csvDistic = 616;
            }
            
            var csvMobile = parseInt(results.Mobile);
            const CsvGetMobile =  await Customer.findOne({                    
                    where:{
                        mobile_number: csvMobile
                    }
                });

                if(!CsvGetMobile){
                    var customerData = {
                        first_name:csvFirstname,
                        last_name:csvLastname,
                        mobile_number:csvMobile,
                        state_id:csvState,
                        district_id:csvDistic,
                        tehsil_id:csvthshil,
                        address:csvAddress,
                        number_of_cattle_to_buy:csvCattle,
                        is_verified:'1'
                    };
                    
                    var  customerid = await Customer.create(customerData).then((data)=>{
                        // console.log('create');
                        return data.id;
                    }).catch((err)=>{
                        console.log(err);
                    })
                    
                    
                    //console.log('customerid:', customerid);
                    var addCampagin = {
                        campaign_id:campaginCreateId,
                        client_id:clientId,
                        customer_id:customerid,
                        status:1
                    };
                    await campaignCustomerModel.create(addCampagin)
                    .then((data)=>{
                        console.log('create');
                    }).catch((err)=>{
                        console.log(err);
                    })
                    c++
                    console.log('create',results.FirstName, csvthshil, csvState, csvDistic,c);
                    
                }else{
                    var updateCustomer = {
                        first_name:csvFirstname,
                        last_name:csvLastname,
                        mobile_number:csvMobile,
                        state_id:csvState,
                        district_id:csvDistic,
                        tehsil_id:csvthshil,
                        address:csvAddress,
                        number_of_cattle_to_buy:csvCattle
                    };
                    console.log('CsvGetMobile = ',CsvGetMobile.id);
                    c++
                    // res.send('update')
                    console.log('update',results.FirstName, csvthshil,csvState, csvDistic, c);
                    ////////
                    var customerId = await Customer.update(updateCustomer,{where:{id:CsvGetMobile.id}})
                    .then((data)=>{
                        console.log('create');
                        return data.id;
                    }).catch((err)=>{
                        console.log(err);
                    });

                    var addCampagin = {
                        campaign_id:campaginCreateId,
                        client_id:clientId,
                        customer_id:CsvGetMobile.id,
                        status:1
                    };
                    await campaignCustomerModel.create(addCampagin)
                    .then((data)=>{
                        console.log('create');
                    }).catch((err)=>{
                        console.log(err);
                    })
                }
        })
    })
        res.status(200).send({Message:'Campaign and Campaign Customer Inserted Successfully'});   
    }catch{
        res.status(401).send({Message:'Campaign Created but Customer not Inserted'});   
    }
};

exports.campaginData = async (req, res) => {
    const client = await Client.findAll({
        where:{
            status:{[Op.not]:'-1'}
        }
    });
    const breed = await breeds.findAll({
        attributes:['id','name']
    });
    const qc_status = qcStatusModel.findAll({
        attributes:['id','name']
    });
    const supplier = await suppliers.findAll({
        attributes:['id','name']
    });
    
    await stocks.findAll({
        attributes: [
            [sequelize.fn('min', sequelize.col('base_price')), 'min_price'],
            [sequelize.fn('max', sequelize.col('base_price')), 'max_price']],
        raw: true,
    }).then( stock => {
        res.status(200).send({Client:client, Breed:breed, Stock:stock, QcStatus:qc_status, Supplier:supplier});
    }).catch( err => {
        res.status(401).send({Error:'Error '+err});
    });
};

exports.campaginDelete = async (req, res) => {
    var id = req.params.id;
    await shortlistedStocks.findAndCountAll({where:{
        campaign_id: id
    }}).then( (data) => {
        if(data.count>0){
            return res.status(199).json({Message:'There are some stock shortlisted for this campaign and can not be deleted, please mark it inactive.'});
        }else{
            var updateData = {status : '-1'};
            campaigns.update(updateData,{where:{id:req.params.id}}).then( () => {
                return res.status(200).send({Message:'Campaign Deleted Successfully.'});
            }).catch( err => {
                return res.status(401).send({Error:'Error '+err});
            });
        }
    }).catch( (err) => {
        return res.status(401).send({Message:'No Record Found.',Error:'Error'+err});
    });
};

exports.campaginList = async (req, res) => {
    const campagins_ids = campagins_names = clients_names = clients_ids = customers_ids = customers_names = [];
    const current_date = new Date();
    var finalDate = formatter.now(current_date);
    await campaigns.findAll({
        include:[{
            model:campaignCustomerModel, as: 'campaign_customersref',
            attributes:['client_id','customer_id'],          
            include:[{
                model:Client, as: 'clientref',
                attributes:['client_name']
            }],
        }],group: ['client_id'],
        where:{
            campaign_expaire: {
                [Op.gte]: finalDate
            },
            status: {
                [Op.ne]: '-1'
            }
        }
    }).then( finalData => {
        res.status(200).send({Message:'Campaign Data Found Successfully.',Data:finalData});
    }).catch( err => {
        res.status(401).send({Message:'No Campaign Data Found.',Error:'Error'+err});
    });  
};

exports.campaginCustomerList = async (req, res) => {
    await campaignCustomerModel.findAll({
        include:[{
            model:Customer, as :'customerref',
            attributes: ['first_name','mobile_number','number_of_cattle_to_buy'],
            include:[{
                    model:States, as :'stateref',
                    attributes: ['name']
                },
                {
                    model:Tahshils, as :'tehsilref',
                    attributes: ['tahshil']
                },
                {
                    model:Districts, as :'districtref',
                    attributes: ['district']
               }],
           }],
        where:{campaign_id:req.params.id}
    }).then( (finalData) => {
        return res.status(200).send({Message:'Customer List Found Successfully.',Data:finalData});
    }).catch( err => {
        return res.status(401).send({Message:'No Customer Found.',Error:'Error '+err});
    });
};

exports.campaginEdit = async (req, res) => {
    await campaignCustomerModel.findOne({
        include:[{
            model:campaigns, as: 'campaignsref',
            attributes:['campaign_name','criteria','start_date','campaign_expaire']
        },{
            model:Client, as: 'clientref',
            attributes:['client_name']
        }],
        where:{id:req.params.id}
    }).then( data => {
        return res.status(200).send({Message:'Campaign Data Found.',Data:data});
    }).catch( err => {
        return res.status(401).send({Error:'Error '+err});
    });
};

exports.campaginUpdate = async (req, res) => {
    var updateData = {
        campaign_name:req.body.campagin_name,
        criteria:req.body.criteria,
        start_date:req.body.start_date,
        campaign_expaire:req.body.end_date
    };
    await campaigns.update(updateData,{where:{id:req.params.id}}).then( data => {
        return res.status(200).send({Message:'Campaign Updated Successfully.',Data:data});
    }).catch( err => {
        return res.status(401).send({Message:'Inner Query Is Not Working.',Error:err});        
    });
};

exports.filter = async (req, res) => {
    const client = await Client.findAll({
        attributes:['client_name'],
        where:{
            status:{[Op.ne]:'-1'}
        }
    });

    const campaign = await campaigns.findAll({
        attributes:['campaign_name'],
        where:{
            status:{[Op.ne]:'-1'}
        }
    });

    res.json({status:'True',Client:client, Campaign:campaign});
};

exports.filterData = async (req, res) => {
    var dataValue = req.body;
    var end_date = formatter.now(dataValue.end_date);
    var condition = '';
    if(dataValue.client_id>0 && dataValue.campaign_id>0){
        condition = {[Op.and]:[{ client_id:dataValue.client_id}, {campaign_id:dataValue.campaign_id }]};
    }else if((dataValue.client_id>0 && dataValue.campaign_id<1) || (dataValue.client_id<1 && dataValue.campaign_id>0)){
        condition = {[Op.or]:[{ client_id:dataValue.client_id}, {campaign_id:dataValue.campaign_id }]};
    }else{
        condition = '';
    }
    await campaignCustomerModel.findAll({
        // attributes: [
        //     sequelize.fn('GROUP_CONCAT', sequelize.col('campaign_id')), 'campaign_id'
        //     ],
            include:[{
                model:campaigns, as: 'campaignsref',
                attributes:['campaign_name','start_date','campaign_expaire'],  
                where:[{
                    start_date:{
                        [Op.gte]:dataValue.start_date
                    }
                },{
                    campaign_expaire:{
                        [Op.gte]:dataValue.end_date
                    }
                }]
            },{
                model:Client, as: 'clientref',
                attributes:['client_name'],    
            }],
        where:{
            [Op.and]:[ condition , {status:'1'}]
        },
        group:['campaign_id']
    }).then( fianlData => {
        res.json({Data:fianlData});
    }).catch( err => {
        res.json({status:'False', Error:'Error'+err});    
    });
};

exports.campaginActiveStatus = async (req, res) => {
    var updateData = {status:req.body.status};
    await campaigns.update(updateData,{where:{id:req.params.id}}).then( finalData => {
        res.status(200).send({Message:'Campaign Active Successfully'});    
    }).catch( err => {
        res.status(401).send({Error:'Error'+err});    
    });
};

exports.campaginInactiveStatus = async (req, res) => {
    var updateData = {status:req.body.status};
    await campaigns.update(updateData,{where:{id:req.params.id}}).then( finalData => {
        res.status(200).send({Message:'Campaign Inactive Successfully'});    
    }).catch( err => {
        res.status(401).send({Error:'Error'+err});    
    });
};

exports.customerList = async (req, res) => {
    await campaignCustomerModel.findAll({
        attributes:['customer_id'],
        include:[{
            model:Customer, as: 'customerref',
            attributes:['first_name','mobile_number','number_of_cattle_to_buy'],
            include:[{
                model:States, as: 'stateref',
                attributes:['name']
            },{
                model:Districts, as: 'districtref',
                attributes:['district']
            },{
                model:Tahshils, as: 'tehsilref',
                attributes:['tahshil']
            }]
        }],
        where:{
            campaign_id:req.params.id,
            status:1
        },
        // group:['campaign_id']
    }).then( data => {
        res.status(200).send({Message: data});
    }).catch( err => {
        res.status(401).send({Message: 'ERROR '+err});
    });      
};