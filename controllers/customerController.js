const db = require("../config/adminModelConfig.js")
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Customer = db.customer;
const clientModel = db.client;
const campaignModel = db.campaigns;
const campaignCustomer = db.campaignCustomers;
const districtModel = db.districts;
const stateModel = db.state;
const tahshilModel = db.tahshil;
var _ = require('lodash');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


exports.addCustomer = async (req, res) => {
    let dataValue = req.body;
    for (const prop in dataValue) {
        if(_.isEmpty(dataValue[prop])){
            return res.json({
                status: "False",
                message: "Fields are not inserted properly"
            })
        }
    }

    customer.create({
        client_name:dataValue.client_name,
        mobile_number:dataValue.mobile_number,
        descriptions:dataValue.descriptions,
        delete_status:'0'
    }).then( result => {
        return res.status(200).send({Message:'Data Inserted Successfully',data:result});
    }).catch( err => {
        return res.status(401).send({Error:'Error'+err});
    });
};

exports.editCustomer = async (req, res) => {
    await Customer.findOne({
        include:[{
            model:stateModel, as: 'stateref',
            attributes:['name']
        },{
            model:districtModel, as: 'districtref',
            attributes:['district']
        },{
            model:tahshilModel, as: 'tehsilref',
            attributes:['tahshil']
        },{
            model:campaignCustomer, as: 'campaign_customersref',
            attributes:['client_id','campaign_id'],
            include:[{
                model:clientModel, as: 'clientref',
                attributes:['client_name']
            },{
                model:campaignModel, as: 'campaignsref',
                attributes:['campaign_name']
            }]
        }],
        where:{id:req.params.id}
    }).then( data => {
        res.status(200).send({Message:data});
    }).catch( err => {
        res.status(401).send({Error:'Error '+err});
    });
};

exports.updateCustomer = async (req, res) => {
    var distId, stateId, tahshilId = '';
    var data = req.body;
    
    // for (const prop in data) {
    //     if(_.isEmpty(data[prop])){
    //         return res.json({
    //             status: "False",
    //             message: "Something is Missing In Field"
    //         })
    //     }
    // }

    await districtModel.findOne({where:{district:data.district}}).then( destVal => {
        distId = destVal.id;
    }).catch( err => {
        res.status(401).send({Message:'District Not Found',Error:'Error '+err});
    });

    await stateModel.findOne({where:{name:data.state}}).then( stateVal => {
        stateId = stateVal.id;
    }).catch( err => {
        res.status(401).send({Message:'State Not Found',Error:'Error '+err});
    });

    await tahshilModel.findOne({where:{tahshil:data.tehsil}}).then( tahshilVal => {
        tahshilId = tahshilVal.id;
    }).catch( err => {
        res.status(401).send({Message:'State Not Found',Error:'Error '+err});
    });

    var updateData = {
        first_name:data.name,
        mobile_number:data.mobile,
        number_of_cattle_to_buy:data.cattle,
        state_id:stateId,
        district_id:distId,
        tehsil_id:tahshilId
    };
    await Customer.update(updateData,{where:{id:req.params.id}}).then( result => {
        return res.status(200).send({Message:'Data Updated Successfully.',Data:updateData});
    }).catch( err => {
        return res.status(401).send({Error:'Error '+err});
    });
};

exports.deleteCustomer = async (req, res) => {
    var data = {status:'-1'}
    await Customer.update(data, { where: {id:req.params.id}}).then( () => {
        return res.status(200).send({Message:'Customer Deleted Successfully.'});
    }).catch( err => {
        return res.status(401).send({Error:'Error '+err});
    });
};

exports.getCustomer = async (req, res) => {
    // var data = await Customer.findAll({where:{status:{[Op.not]:'-1'}}});
    
    await Customer.findAll({
        include:[{
            model:stateModel, as: 'stateref',
            attributes:['name']
        },{
            model:districtModel, as: 'districtref',
            attributes:['district']
        },{
            model:tahshilModel, as: 'tehsilref',
            attributes:['tahshil']
        },{
            model:campaignCustomer, as: 'campaign_customersref',
            attributes:['client_id','campaign_id'],
            include:[{
                model:clientModel, as: 'clientref',
                attributes:['client_name']
            },{
                model:campaignModel, as: 'campaignsref',
                attributes:['campaign_name']
            }]
        }],
        where:{
            status:{[Op.not]:'-1'}
        }
    }).then( data => {
        res.status(200).send({Message:data});
    }).catch( err => {
        res.status(401).send({Error:'Error '+err});
    });
};
