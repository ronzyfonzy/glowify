export default (sequelize, DataTypes) => {
  return sequelize.define('achievements_event_types', {
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE },
  })
}

export function defaults() {
  return [
    // Commentator
    { achievementId: 1, eventTypeId: 25 },
    { achievementId: 1, eventTypeId: 26 },

    // Mover
    { achievementId: 2, eventTypeId: 20 },
    { achievementId: 2, eventTypeId: 21 },
    { achievementId: 2, eventTypeId: 22 },

    // Constructor
    { achievementId: 3, eventTypeId: 7 },
    { achievementId: 3, eventTypeId: 13 },
    { achievementId: 3, eventTypeId: 25 },

    // Desctuctor
    { achievementId: 3, eventTypeId: 4 },
    { achievementId: 3, eventTypeId: 12 },
    { achievementId: 3, eventTypeId: 18 },
    { achievementId: 3, eventTypeId: 27 },
  ]
}
