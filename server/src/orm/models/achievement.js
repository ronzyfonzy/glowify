export default (sequelize, DataTypes) => {
  return sequelize.define('achievements', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING },
    description: { type: DataTypes.STRING },
    color: { type: DataTypes.STRING }, // 'R,G,B,A' => '255,180,23,1'
    minEvents: { type: DataTypes.INTEGER },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE },
  })
}

export function defaults() {
  return [
    { id: 1, title: '✍️', description: 'Commentator', color: '69,179,157,1', minEvents: 10 },
    { id: 2, title: '🚚', description: 'Mover', color: '133,146,158,1', minEvents: 10 },
    { id: 3, title: '👨🏻‍🔧', description: 'Constructor', color: '88,214,141,1', minEvents: 10 },
    { id: 4, title: '💣', description: 'Destructor', color: '203,67,53,1', minEvents: 10 },
  ]
}
