const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('shortlisted_stocks', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    stock_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'stocks',
        key: 'id'
      }
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'clients',
        key: 'id'
      }
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'customers',
        key: 'id'
      }
    },
    campaign_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'campaigns',
        key: 'id'
      }
    },
    is_confirmed: {
      type: DataTypes.TINYINT,
      allowNull: true,
      comment: "0=>not_confirmed,1=>confirmed"
    },
    qc_status: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: "0",
      comment: "1=pending\r\n,2=passed\r\n,3=Failed"
    },
    create_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    update_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    booking_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "0=>not_booked,1=>booked",
      references: {
        model: 'bookings',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'shortlisted_stocks',
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
      {
        name: "customer_id",
        using: "BTREE",
        fields: [
          { name: "customer_id" },
        ]
      },
      {
        name: "campaign_id",
        using: "BTREE",
        fields: [
          { name: "campaign_id" },
        ]
      },
      {
        name: "client_id",
        using: "BTREE",
        fields: [
          { name: "client_id" },
        ]
      },
      {
        name: "is_confirmed",
        using: "BTREE",
        fields: [
          { name: "is_confirmed" },
        ]
      },
      {
        name: "stock_id",
        using: "BTREE",
        fields: [
          { name: "stock_id" },
        ]
      },
      {
        name: "booking_id",
        using: "BTREE",
        fields: [
          { name: "booking_id" },
        ]
      },
    ]
  });
};
