export default (sequelize, DataTypes) => {
  return sequelize.define('glowify_users', {
    gloCardId: { type: DataTypes.STRING },
    points: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE },
  })
}
