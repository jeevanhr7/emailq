'use strict';
module.exports = (sequelize, DataTypes) => {
  var Template = sequelize.define('Template', {}, {});
  Template.associate = function(models) {
    // associations can be defined here
  };
  return Template;
};