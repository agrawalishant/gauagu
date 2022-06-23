const sequelize = require("../models/Users")
var express = require('express');
var app = express();
const jwt = require('jsonwebtoken');
const jwtKey = 'e-com';
var router = express.Router();
const clientCtrl = require('../controllers/clientController');
const customerCtrl = require('../controllers/customerController');
const loginCtrl = require('../controllers/loginController');
const campaignCtrl = require('../controllers/campaignController');

const multer = require('multer');
var storage = multer.diskStorage({
    destination:function(req, file, cb){
        cb(null,'upload/csv/')
    },
    filename:function(req, file, cb){
        var filName = Date.now()+file.originalname;
        cb(null,filName)
    }
});
var upload = multer({storage:storage});

const checkJwt = async (req, res, next) => {
    var reqToken = req.headers['authorization'];
    if(typeof reqToken!=='undefined'){
        const bearer = reqToken.split(' ');
        const bearerToken = bearer[1];
        // req.token = bearerToken;
        const tokenVar = await jwt.verify(bearerToken, jwtKey, (err, decode) => {
            if(err){
                res.status(404).send({Message:'Authorization is Invalid'});
            }else{
                next();
            }
        });
    }else{
        res.status(403).send({Message:'Authorization is Failed'});
    }   
};

// client Api
router.post('/addClient', checkJwt, clientCtrl.addClient);
router.get('/editClient/:id', checkJwt, clientCtrl.editClient);
router.put('/updateClient/:id', checkJwt, clientCtrl.updateClient);
router.put('/deleteClient/:id', checkJwt, clientCtrl.deleteClient);
router.get('/clientList', checkJwt, clientCtrl.getClient);

// Login Api
router.post('/login',loginCtrl.login);
router.get('/dashboard', checkJwt, loginCtrl.dashboardCount);

// Customer Api
router.post('/addCustomer', checkJwt, customerCtrl.addCustomer);
router.get('/customerList', checkJwt, customerCtrl.getCustomer);
router.get('/editCustomer/:id', checkJwt, customerCtrl.editCustomer);
router.put('/updateCustomer/:id', checkJwt, customerCtrl.updateCustomer);
router.put('/deleteCustomer/:id', checkJwt, customerCtrl.deleteCustomer);

// Campagin Api
router.get('/campaginList', checkJwt, campaignCtrl.campaginList);
router.get('/filter', checkJwt, campaignCtrl.filter);
router.post('/filterData', checkJwt, campaignCtrl.filterData);
router.put('/campaginDelete/:id', checkJwt, campaignCtrl.campaginDelete);
router.put('/campaginActive/:id', checkJwt, campaignCtrl.campaginActiveStatus);
router.put('/campaginInactive/:id', checkJwt, campaignCtrl.campaginInactiveStatus);
router.get('/campaginUserList/:id', checkJwt, campaignCtrl.campaginCustomerList);
router.post('/addCsv',upload.single('file'), checkJwt, campaignCtrl.AddCsvRead_Customer);
router.get('/campagin', checkJwt, campaignCtrl.campaginData);
router.get('/campaginEdit/:id', checkJwt, campaignCtrl.campaginEdit);
router.put('/campaginUpdate/:id', checkJwt, campaignCtrl.campaginUpdate);
router.get('/campaginCustomerList/:id', checkJwt, campaignCtrl.customerList);

app.use('/',router);
module.exports = router;