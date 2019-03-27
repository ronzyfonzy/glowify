export default (sequelize, DataTypes) => {
  return sequelize.define('rankings', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING },
    position: { type: DataTypes.INTEGER },
    minPoints: { type: DataTypes.INTEGER },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE },
  })
}

export function defaults() {
  return [
    { name: 'Nautilus 🤓', position: 0, minPoints: 0 },
    { name: 'Octopus 🐙 🥉', position: 1, minPoints: 50 },
    { name: 'Squid 🦑 🥈', position: 2, minPoints: 100 },
    { name: 'Kraken 💪 🥇', position: 3, minPoints: 200 },
  ]
}
