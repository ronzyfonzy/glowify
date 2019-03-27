import bcrypt from 'bcrypt'
import crypto from 'crypto'

export default (sequelize, DataTypes) => {
  return sequelize.define(
    'accounts',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING },
      username: { type: DataTypes.STRING, unique: true, allowNull: false, validate: { notEmpty: true } },
      password: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true } },
      email: { type: DataTypes.STRING, unique: true, allowNull: false, validate: { notEmpty: true } },
      gloApiKey: { type: DataTypes.STRING },
      createdAt: { type: DataTypes.DATE },
      updatedAt: { type: DataTypes.DATE },
    },
    {
      hooks: {
        beforeCreate: account => {
          if (account.password) {
            account.password = bcrypt.hashSync('' + account.password, bcrypt.genSaltSync())
          }
        },
      },
    }
  )
}
