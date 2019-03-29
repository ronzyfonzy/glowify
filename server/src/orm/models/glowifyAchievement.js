export default (sequelize, DataTypes) => {
  return sequelize.define('glowify_achievements', {
    gloId: { type: DataTypes.STRING, allowNull: false },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE },
  })
}
