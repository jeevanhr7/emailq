module.exports = (sequelize, DataTypes) => {
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
  }, {
    tableName: 'templates',
    timestamps: true,
    createdAt: 'CreatedAt',
    updatedAt: 'UpdatedAt',
    underscored: true,
  });

  return Template;
};
