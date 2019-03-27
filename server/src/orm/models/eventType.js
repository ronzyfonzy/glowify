export default (sequelize, DataTypes) => {
  return sequelize.define('event_types', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    event: { type: DataTypes.STRING },
    type: { type: DataTypes.STRING },
    points: { type: DataTypes.INTEGER, defaultValue: 1 },
  })
}

export function defaults() {
  return [
    { event: 'boards', type: 'archived', points: 1 },
    { event: 'boards', type: 'unarchived', points: 1 },
    { event: 'boards', type: 'updated', points: 1 },
    { event: 'boards', type: 'deleted', points: 1 },
    { event: 'boards', type: 'labels_updated', points: 1 },
    { event: 'boards', type: 'members_updated', points: 1 },

    { event: 'columns', type: 'added', points: 10 },
    { event: 'columns', type: 'updated', points: 3 },
    { event: 'columns', type: 'reordered', points: 2 },
    { event: 'columns', type: 'archived', points: 1 },
    { event: 'columns', type: 'unarchived', points: 1 },
    { event: 'columns', type: 'deleted', points: 1 },

    { event: 'cards', type: 'added', points: 5 },
    { event: 'cards', type: 'updated', points: 2 },
    { event: 'cards', type: 'copied', points: 1 },
    { event: 'cards', type: 'archived', points: 1 },
    { event: 'cards', type: 'unarchived', points: 1 },
    { event: 'cards', type: 'deleted', points: 1 },
    { event: 'cards', type: 'reordered', points: 1 },
    { event: 'cards', type: 'moved_column', points: 5 },
    { event: 'cards', type: 'moved_to_board', points: 1 },
    { event: 'cards', type: 'moved_from_board', points: 1 },
    { event: 'cards', type: 'labels_updated', points: 1 },
    { event: 'cards', type: 'assignees_updated', points: 1 },

    { event: 'comments', type: 'added', points: 4 },
    { event: 'comments', type: 'updated', points: 2 },
    { event: 'comments', type: 'deleted', points: 1 },
  ]
}
