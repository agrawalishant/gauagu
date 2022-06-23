const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('stocks', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    active: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    latitude: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    longitude: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    farmer_name: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    farmer_contact_no: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    milk_capacity: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "0"
    },
    milk_potential: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    last_lcatation_milking: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    animal_name: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    animal_tag_number: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    animal_type: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    animal_breed: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    animal_date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    animal_age_in_month: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    animal_status: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    animal_body_weight: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    animal_color: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    animal_teeth_count: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    dam_yield: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    sire_semen_used: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    fat: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      defaultValue: 0.00
    },
    snf: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      defaultValue: 0.00
    },
    pragnancy_month: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    last_insemination_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    last_delivery_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    estimated_delivery_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    lactation_number: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    test_reports: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    base_price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      defaultValue: 0.00
    },
    current_bid: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      defaultValue: 0.00
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0
    },
    qc_status: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    inventory_status: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    bidding_start_datetime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    bidding_end_datetime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    insta_bid: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    highest_bidder_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    },
    other_remarks: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated: {
      type: DataTypes.DATE,
      allowNull: true
    },
    current_milk: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "0"
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    asking_price: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    last_price: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    pregnancy_delivery_status: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    pregnancy_delivery_time: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    calf: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    deworming: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    any_other_treatment: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    supplier_name: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    supplier_contact_no: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    supplier_type: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    supplier_village: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    supplier_district: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    supplier_state: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    form: {
      type: DataTypes.STRING(250),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'stocks',
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
