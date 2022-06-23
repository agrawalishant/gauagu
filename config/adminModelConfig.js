const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('jkdf-gauagu','root','',{
    host:'localhost',
    dialect:'mysql',
    logging: false,
    pool:{max:5,min:0,idle:10000}
});

sequelize.authenticate()
.then(()=>{
    console.log('Sequelize Authenticate');
}).catch(err => {
    console.log('Error = '+err);
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.sequelize.sync().then(()=>{
    console.log(' Sequelize Sync');
}).catch(err => {
    console.log('Error '+err);
});

// Models connections
db.appVersions = require('../models/adminModels/app_versions.js')(sequelize,DataTypes)
db.adminUsers = require('../models/adminModels/admin_users.js')(sequelize,DataTypes)
db.bookings = require('../models/adminModels/bookings.js')(sequelize,DataTypes)
db.breeds = require('../models/adminModels/breeds.js')(sequelize,DataTypes)
db.campaignCustomers = require('../models/adminModels/campaign_customers.js')(sequelize,DataTypes)
db.campaigns = require('../models/adminModels/campaigns.js')(sequelize,DataTypes)
db.client = require('../models/adminModels/clients.js')(sequelize,DataTypes)
db.contentTranslations = require('../models/adminModels/content_translations.js')(sequelize,DataTypes)
db.customer = require('../models/adminModels/customers.js')(sequelize,DataTypes)
db.districts = require('../models/adminModels/districts.js')(sequelize,DataTypes)
db.notifications = require('../models/adminModels/notifications.js')(sequelize,DataTypes)
db.otp = require('../models/adminModels/otp.js')(sequelize,DataTypes)
db.shortlistedStocks = require('../models/adminModels/shortlisted_stocks.js')(sequelize,DataTypes)
db.state = require('../models/adminModels/states.js')(sequelize,DataTypes)
db.stockImages = require('../models/adminModels/stock_images.js')(sequelize,DataTypes)
db.stocks = require('../models/adminModels/stocks.js')(sequelize,DataTypes)
db.suppliers = require('../models/adminModels/suppliers.js')(sequelize,DataTypes)
db.stockBids = require('../models/adminModels/stock_bids.js')(sequelize,DataTypes)
db.stockBidLog = require('../models/adminModels/stock_bids_log.js')(sequelize,DataTypes)
db.qc_status = require('../models/adminModels/qc_status.js')(sequelize,DataTypes)
db.tahshil = require('../models/adminModels/tehsils.js')(sequelize,DataTypes)


// Relationship
db.customer.belongsTo(db.state, { as: "stateref", foreignKey: "state_id"});
db.state.hasMany(db.customer, { as: "customerref", foreignKey: "state_id"});
db.customer.belongsTo(db.districts, { as: "districtref", foreignKey: "district_id"});
db.districts.hasMany(db.customer, { as: "customerref", foreignKey: "district_id"});
db.customer.belongsTo(db.tahshil, { as: "tehsilref", foreignKey: "tehsil_id"});
db.tahshil.hasMany(db.customer, { as: "customerref", foreignKey: "tehsil_id"});
db.campaignCustomers.belongsTo(db.campaigns, { as: "campaignsref", foreignKey: "campaign_id"});
db.campaigns.hasMany(db.campaignCustomers, { as: "campaign_customersref", foreignKey: "campaign_id"});
db.campaignCustomers.belongsTo(db.client, { as: "clientref", foreignKey: "client_id"});
db.client.hasMany(db.campaignCustomers, { as: "campaign_customersref", foreignKey: "client_id"});
db.campaignCustomers.belongsTo(db.customer, { as: "customerref", foreignKey: "customer_id"});
db.customer.hasMany(db.campaignCustomers, { as: "campaign_customersref", foreignKey: "customer_id"});
db.shortlistedStocks.belongsTo(db.campaigns, { as: "campaignstock", foreignKey: "campaign_id"});
db.campaigns.hasMany(db.shortlistedStocks, { as: "shortlisted_stocksrefcampagin", foreignKey: "campaign_id"});
db.shortlistedStocks.belongsTo(db.client, { as: "clientstock", foreignKey: "client_id"});
db.client.hasMany(db.shortlistedStocks, { as: "shortlisted_stocksrefclient", foreignKey: "client_id"});
db.shortlistedStocks.belongsTo(db.stocks, { as: "stockref", foreignKey: "stock_id"});
db.stocks.hasMany(db.shortlistedStocks, { as: "shortlisted_stocksref", foreignKey: "stock_id"});
db.shortlistedStocks.belongsTo(db.customer, { as: "customerstock", foreignKey: "customer_id"});
db.customer.hasMany(db.shortlistedStocks, { as: "shortlisted_stocksrefcustomer", foreignKey: "customer_id"});
db.shortlistedStocks.belongsTo(db.bookings, { as: "booking", foreignKey: "booking_id"});
db.bookings.hasMany(db.shortlistedStocks, { as: "shortlisted_stocks", foreignKey: "booking_id"});
db.stockBids.belongsTo(db.stocks, { as: "stock", foreignKey: "stock_id"});
db.stocks.hasMany(db.stockBids, { as: "stock_bids", foreignKey: "stock_id"});
db.stockBidLog.belongsTo(db.stocks, { as: "stock", foreignKey: "stock_id"});
db.stocks.hasMany(db.stockBidLog, { as: "stock_bids_logs", foreignKey: "stock_id"});

module.exports = db;
