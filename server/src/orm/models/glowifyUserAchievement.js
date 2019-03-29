export default (sequelize, DataTypes) => {
  return sequelize.define('glowify_users_achievements', {
    count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE },
  })
}
