
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('templates', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    TemplateName: {
      type: Sequelize.STRING,
      unique: true,
    },
    ConfigurationSetName: Sequelize.STRING,
    SubjectPart: Sequelize.STRING,
    HtmlPart: Sequelize.STRING,
    TextPart: Sequelize.STRING,
    CreatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    UpdatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: queryInterface => queryInterface.dropTable('templates'),
};
