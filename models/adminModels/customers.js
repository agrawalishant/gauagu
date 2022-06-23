const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('customers', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    last_name: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    middle_name: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    mobile_number: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "Unique key",
      unique: "mobile_number"
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    state_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'states',
        key: 'id'
      }
    },
    district_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'districts',
        key: 'id'
      }
    },
    tehsil_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tehsils',
        key: 'id'
      }
    },
    zip_code: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0,
      comment: "1=>active,0=>inactive"
    },
    is_verified: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "otp status verified=>1,unverified=0"
    },
    fcm_device_id: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: "FCM device token from login api"
    },
    device_type: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    device_id: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    preferred_langague: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    user_type: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: "INSIDE=>UPLOAD BY CSV, OUTSIDE =>REGISTRAED WITH APP"
    },
    number_of_cattle_to_buy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    no_of_cattle_multiple: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 3
    },
    booking_quantity: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    registration: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "true"
    },
    created: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated: {
      type: DataTypes.DATE,
      allowNull: true
    },
    image: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'customers',
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
        unique: true,
        using: "BTREE",
        fields: [
          { name: "mobile_number" },
        ]
      },
      {
        name: "status",
        using: "BTREE",
        fields: [
          { name: "status" },
        ]
      },
      {
        name: "district_id",
        using: "BTREE",
        fields: [
          { name: "district_id" },
        ]
      },
      {
        name: "tehsil_id",
        using: "BTREE",
        fields: [
          { name: "tehsil_id" },
        ]
      },
      {
        name: "state_id",
        using: "BTREE",
        fields: [
          { name: "state_id" },
        ]
      },
    ]
  });
};
