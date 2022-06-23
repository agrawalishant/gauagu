const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('stocks_translations', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    locale: {
      type: DataTypes.STRING(5),
      allowNull: false,
      defaultValue: "",
      primaryKey: true
    },
    farmer_name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      defaultValue: ""
    },
    animal_name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      defaultValue: ""
    }
  }, {
    sequelize,
    tableName: 'stocks_translations',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
          { name: "locale" },
        ]
      },
    ]
  });
};
