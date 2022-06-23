var DataTypes = require("sequelize").DataTypes;
var _access_requests = require("./access_requests");
var _admin_users = require("./admin_users");
var _app_versions = require("./app_versions");
var _authorised = require("./authorised");
var _bookings = require("./bookings");
var _breeds = require("./breeds");
var _calf = require("./calf");
var _campaign_customers = require("./campaign_customers");
var _campaigns = require("./campaigns");
var _categories = require("./categories");
var _clients = require("./clients");
var _colors = require("./colors");
var _content_translations = require("./content_translations");
var _current_milk = require("./current_milk");
var _customers = require("./customers");
var _customers_old = require("./customers_old");
var _delivery = require("./delivery");
var _delivery_time = require("./delivery_time");
var _dewormings = require("./dewormings");
var _districts = require("./districts");
var _farm = require("./farm");
var _inventory_status = require("./inventory_status");
var _lactation = require("./lactation");
var _milk_capacity = require("./milk_capacity");
var _notifications = require("./notifications");
var _otp = require("./otp");
var _pregnancy = require("./pregnancy");
var _processes = require("./processes");
var _qc_status = require("./qc_status");
var _roles = require("./roles");
var _send_inquiry = require("./send_inquiry");
var _shortlisted_stocks = require("./shortlisted_stocks");
var _states = require("./states");
var _stock_addresses = require("./stock_addresses");
var _stock_bids = require("./stock_bids");
var _stock_bids_log = require("./stock_bids_log");
var _stock_images = require("./stock_images");
var _stock_status = require("./stock_status");
var _stocks = require("./stocks");
var _stocks_additional = require("./stocks_additional");
var _stocks_translations = require("./stocks_translations");
var _stocks_vaccination = require("./stocks_vaccination");
var _supplier_district = require("./supplier_district");
var _supplier_name = require("./supplier_name");
var _supplier_phone = require("./supplier_phone");
var _supplier_state = require("./supplier_state");
var _supplier_type = require("./supplier_type");
var _supplier_village = require("./supplier_village");
var _suppliers = require("./suppliers");
var _tahshil = require("./tahshil");
var _teeth = require("./teeth");
var _tehsils = require("./tehsils");
var _treatments = require("./treatments");
var _types = require("./types");
var _vaccination = require("./vaccination");
var _vaccinations = require("./vaccinations");

function initModels(sequelize) {
  var access_requests = _access_requests(sequelize, DataTypes);
  var admin_users = _admin_users(sequelize, DataTypes);
  var app_versions = _app_versions(sequelize, DataTypes);
  var authorised = _authorised(sequelize, DataTypes);
  var bookings = _bookings(sequelize, DataTypes);
  var breeds = _breeds(sequelize, DataTypes);
  var calf = _calf(sequelize, DataTypes);
  var campaignCustomers = _campaign_customers(sequelize, DataTypes);
  var campaigns = _campaigns(sequelize, DataTypes);
  var categories = _categories(sequelize, DataTypes);
  var client = _clients(sequelize, DataTypes);
  var colors = _colors(sequelize, DataTypes);
  var content_translations = _content_translations(sequelize, DataTypes);
  var current_milk = _current_milk(sequelize, DataTypes);
  var customer = _customers(sequelize, DataTypes);
  var customers_old = _customers_old(sequelize, DataTypes);
  var delivery = _delivery(sequelize, DataTypes);
  var delivery_time = _delivery_time(sequelize, DataTypes);
  var dewormings = _dewormings(sequelize, DataTypes);
  var districts = _districts(sequelize, DataTypes);
  var farm = _farm(sequelize, DataTypes);
  var inventory_status = _inventory_status(sequelize, DataTypes);
  var lactation = _lactation(sequelize, DataTypes);
  var milk_capacity = _milk_capacity(sequelize, DataTypes);
  var notifications = _notifications(sequelize, DataTypes);
  var otp = _otp(sequelize, DataTypes);
  var pregnancy = _pregnancy(sequelize, DataTypes);
  var processes = _processes(sequelize, DataTypes);
  var qc_status = _qc_status(sequelize, DataTypes);
  var roles = _roles(sequelize, DataTypes);
  var send_inquiry = _send_inquiry(sequelize, DataTypes);
  var shortlistedStocks = _shortlisted_stocks(sequelize, DataTypes);
  var state = _states(sequelize, DataTypes);
  var stock_addresses = _stock_addresses(sequelize, DataTypes);
  var stockBids = _stock_bids(sequelize, DataTypes);
  var stockBidLog = _stock_bids_log(sequelize, DataTypes);
  var stock_images = _stock_images(sequelize, DataTypes);
  var stock_status = _stock_status(sequelize, DataTypes);
  var stocks = _stocks(sequelize, DataTypes);
  var stocks_additional = _stocks_additional(sequelize, DataTypes);
  var stocks_translations = _stocks_translations(sequelize, DataTypes);
  var stocks_vaccination = _stocks_vaccination(sequelize, DataTypes);
  var supplier_district = _supplier_district(sequelize, DataTypes);
  var supplier_name = _supplier_name(sequelize, DataTypes);
  var supplier_phone = _supplier_phone(sequelize, DataTypes);
  var supplier_state = _supplier_state(sequelize, DataTypes);
  var supplier_type = _supplier_type(sequelize, DataTypes);
  var supplier_village = _supplier_village(sequelize, DataTypes);
  var suppliers = _suppliers(sequelize, DataTypes);
  var tahshil = _tahshil(sequelize, DataTypes);
  var teeth = _teeth(sequelize, DataTypes);
  var tehsils = _tehsils(sequelize, DataTypes);
  var treatments = _treatments(sequelize, DataTypes);
  var types = _types(sequelize, DataTypes);
  var vaccination = _vaccination(sequelize, DataTypes);
  var vaccinations = _vaccinations(sequelize, DataTypes);

  shortlistedStocks.belongsTo(bookings, { as: "booking", foreignKey: "booking_id"});
  bookings.hasMany(shortlistedStocks, { as: "shortlisted_stocks", foreignKey: "booking_id"});
  campaignCustomers.belongsTo(campaigns, { as: "campaign", foreignKey: "campaign_id"});
  campaigns.hasMany(campaignCustomers, { as: "campaign_customers", foreignKey: "campaign_id"});
  shortlistedStocks.belongsTo(campaigns, { as: "campaign", foreignKey: "campaign_id"});
  campaigns.hasMany(shortlistedStocks, { as: "shortlisted_stocks", foreignKey: "campaign_id"});
  campaignCustomers.belongsTo(client, { as: "client", foreignKey: "client_id"});
  client.hasMany(campaignCustomers, { as: "campaign_customers", foreignKey: "client_id"});
  shortlistedStocks.belongsTo(client, { as: "client", foreignKey: "client_id"});
  client.hasMany(shortlistedStocks, { as: "shortlisted_stocks", foreignKey: "client_id"});
  campaignCustomers.belongsTo(customer, { as: "customer", foreignKey: "customer_id"});
  customer.hasMany(campaignCustomers, { as: "campaign_customers", foreignKey: "customer_id"});
  shortlistedStocks.belongsTo(customer, { as: "customer", foreignKey: "customer_id"});
  customer.hasMany(shortlistedStocks, { as: "shortlisted_stocks", foreignKey: "customer_id"});
  customer.belongsTo(districts, { as: "district", foreignKey: "district_id"});
  districts.hasMany(customer, { as: "customers", foreignKey: "district_id"});
  customer.belongsTo(state, { as: "state", foreignKey: "state_id"});
  state.hasMany(customer, { as: "customers", foreignKey: "state_id"});
  shortlistedStocks.belongsTo(stocks, { as: "stock", foreignKey: "stock_id"});
  stocks.hasMany(shortlistedStocks, { as: "shortlisted_stocks", foreignKey: "stock_id"});
  stockBids.belongsTo(stocks, { as: "stock", foreignKey: "stock_id"});
  stocks.hasMany(stockBids, { as: "stock_bids", foreignKey: "stock_id"});
  stockBidLog.belongsTo(stocks, { as: "stock", foreignKey: "stock_id"});
  stocks.hasMany(stockBidLog, { as: "stock_bids_logs", foreignKey: "stock_id"});
  customer.belongsTo(tahshil, { as: "tehsil", foreignKey: "tehsil_id"});
  tahshil.hasMany(customer, { as: "customers", foreignKey: "tehsil_id"});

  return {
    access_requests,
    admin_users,
    app_versions,
    authorised,
    bookings,
    breeds,
    calf,
    campaign_customers,
    campaigns,
    categories,
    clients,
    colors,
    content_translations,
    current_milk,
    customers,
    customers_old,
    delivery,
    delivery_time,
    dewormings,
    districts,
    farm,
    inventory_status,
    lactation,
    milk_capacity,
    notifications,
    otp,
    pregnancy,
    processes,
    qc_status,
    roles,
    send_inquiry,
    shortlisted_stocks,
    states,
    stock_addresses,
    stock_bids,
    stock_bids_log,
    stock_images,
    stock_status,
    stocks,
    stocks_additional,
    stocks_translations,
    stocks_vaccination,
    supplier_district,
    supplier_name,
    supplier_phone,
    supplier_state,
    supplier_type,
    supplier_village,
    suppliers,
    tahshil,
    teeth,
    tehsils,
    treatments,
    types,
    vaccination,
    vaccinations,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
