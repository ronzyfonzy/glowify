import crypto from 'crypto'

export default (sequelize, DataTypes) => {
  return sequelize.define(
    'glowifys',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      publishBoardState: { type: DataTypes.INTEGER, defaultValue: 1 },
      secret: { type: DataTypes.STRING },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: 1 },
      createdAt: { type: DataTypes.DATE },
      updatedAt: { type: DataTypes.DATE },
    },
    {
      hooks: {
        beforeCreate: glowify => {
          if (!glowify.secret) {
            glowify.secret = crypto.randomBytes(32).toString('hex')
          }
        },
      },
    }
  )
}
