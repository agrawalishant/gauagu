const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('otp', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    mobile_number: {
      type: DataTypes.STRING(11),
      allowNull: true
    },
    otp: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    is_verified: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "0=unverified,1=verified"
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "1=>ACTIVE LOGIN,0=>SUSPENDED USER"
    },
    otp_expaire_time: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fcm_token: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_date: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'otp',
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
        name: "mobile_number",
        using: "BTREE",
        fields: [
          { name: "mobile_number" },
        ]
      },
      {
        name: "customer_id",
        using: "BTREE",
        fields: [
          { name: "customer_id" },
        ]
      },
    ]
  });
};
