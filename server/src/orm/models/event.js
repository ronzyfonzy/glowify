export default (sequelize, DataTypes) => {
  return sequelize.define('events', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    log: { type: DataTypes.STRING },
    state: { type: DataTypes.INTEGER, defaultValue: 1 }, // 1=received, 2=parsed
    createdAt: { type: DataTypes.DATE },
  })
}
