export default (sequelize, DataTypes) => {
  return sequelize.define('glowify_rank_columns', {
    gloId: { type: DataTypes.STRING, allowNull: false },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE },
  })
}
