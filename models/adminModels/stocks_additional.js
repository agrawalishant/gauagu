const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('stocks_additional', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    stocks_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    condition_of_eyes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    length: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    width: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    height: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    horns: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    injury_marks: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    muzzles: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    dungs: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    udders: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    teats: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    skin_types: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    seller_type: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    sellers_name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    sellers_identification: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    sellers_address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    purchase_price: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    date_of_purchase: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    name_of_field_executive: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    name_of_broker: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    brokerage_amount: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    cost_of_transport: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    inward_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    farm_name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    name_of_buyer: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    buyers_number: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    buyers_identification: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    buyers_address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    sell_price: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    media: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    vendor_name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    name_of_bank: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    account_number: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ifcs_code: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    branch_name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    purchased_for: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    authorised_by: {
      type: DataTypes.MEDIUMINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'stocks_additional',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
