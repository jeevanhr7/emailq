module.exports = function (sequelize, DataTypes) {
  const Template = sequelize.define('Template', {
    id: {
      type: DataTypes.INTEGER(14),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    TemplateName: DataTypes.STRING,
    ConfigurationSetName: DataTypes.STRING,
    SubjectPart: DataTypes.STRING,
    HtmlPart: DataTypes.STRING,
    TextPart: DataTypes.STRING,
    TemplateData: DataTypes.STRING,
    DefaultTemplateData: DataTypes.STRING,
    Source: DataTypes.STRING,
    ToAddresses: DataTypes.STRING,
    replyTo: DataTypes.STRING,
    cc: DataTypes.STRING,
    bcc: DataTypes.STRING,
    comments: DataTypes.STRING,
  }, {
    tableName: 'templates',
    timestamps: true,
    createdAt: 'CreatedAt',
    updatedAt: 'UpdatedAt',
    underscored: true,
  });

  Template.associate = function (db) {

  };

  return Template;
};
