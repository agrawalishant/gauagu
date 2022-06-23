const db = require("../config/adminModelConfig.js")
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Client = db.client;
var _ = require('lodash');
const { Validator } = require('node-input-validator');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


exports.addClient = async (req, res) => {

    const v = new Validator(req.body, {
        client_name: 'required',
        mobile_number: 'required|minLength:10'
      });
    
      v.check().then((matched) => {
        if (!matched) {
          res.status(422).send(v.errors);
        }
      });

    let dataValue = req.body;
    for (const prop in dataValue) {
        if(_.isEmpty(dataValue[prop])){
            return res.json({
                status: "False",
                message: "Fields are not inserted properly"
            })
        }
    }

    Client.create({
        client_name:dataValue.client_name,
        mobile_number:dataValue.mobile_number,
        descriptions:dataValue.descriptions,
        email:'NA',
        delete_status:'0',
        status:'0',
        delete_status:'0'
    }).then( result => {
        return res.status(200).send({Message:'Client Inserted Successfully',Data:result});
    }).catch( err => {
        return res.status(401).send({Error:'Error '+err});
    });
};

exports.editClient = async (req, res) => {
    await Client.findOne({where:{id:req.params.id}}).then( data => {
        res.status(200).send({Message:data});
    }).catch( err => {
        res.status(401).send({Error:'Error '+err});
    });
};

exports.updateClient = async (req, res) => {
    var data = req.body;
    for (const prop in data) {
        if(_.isEmpty(data[prop])){
            return res.json({
                status: "False",
                message: "Fields are not updated properly"
            })
        }
    }
    var updateData = {
        client_name:data.client_name,
        mobile_number:data.mobile_number,
        descriptions:data.descriptions
    };
    await Client.update(updateData,{where:{id:req.params.id}}).then( result => {
        return res.status(200).send({Message:'Client Updated Successfully.',Data:updateData});
    }).catch( err => {
        return res.status(401).send({Error:'Error '+err});
    });
};

exports.deleteClient = async (req, res) => {
    var data = {status : '-1'}
    await Client.update(data, { where: {id:req.params.id}}).then( () => {
        return res.status(200).send({Message:'Client Deleted Successfully.'});
    }).catch( err => {
        return res.status(401).send({Error:'Error '+err});
    });
};

exports.getClient = async (req, res) => {
    await Client.findAll({where:{status:{[Op.not]: '-1'}}}).then( data => {
        res.status(200).send({Message:'Client Found Successfully',Data:data});
    }).catch( err => {
        res.status(401).send({Error:'Error '+err,Message:'Data Not Found'});    
    });
};
