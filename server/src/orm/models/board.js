export default (sequelize, DataTypes) => {
  return sequelize.define('boards', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    gloId: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE },
  })
}
