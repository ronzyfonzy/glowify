export default (sequelize, DataTypes) => {
  return sequelize.define('users', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    gloId: { type: DataTypes.STRING },
    name: { type: DataTypes.STRING },
    username: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE },
  })
}
