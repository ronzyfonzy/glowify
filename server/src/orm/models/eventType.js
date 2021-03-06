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
    { id: 1, event: 'boards', type: 'archived', points: 1 },
    { id: 2, event: 'boards', type: 'unarchived', points: 1 },
    { id: 3, event: 'boards', type: 'updated', points: 1 },
    { id: 4, event: 'boards', type: 'deleted', points: 1 },
    { id: 5, event: 'boards', type: 'labels_updated', points: 1 },
    { id: 6, event: 'boards', type: 'members_updated', points: 1 },

    { id: 7, event: 'columns', type: 'added', points: 10 },
    { id: 8, event: 'columns', type: 'updated', points: 3 },
    { id: 9, event: 'columns', type: 'reordered', points: 2 },
    { id: 10, event: 'columns', type: 'archived', points: 1 },
    { id: 11, event: 'columns', type: 'unarchived', points: 1 },
    { id: 12, event: 'columns', type: 'deleted', points: 1 },

    { id: 13, event: 'cards', type: 'added', points: 5 },
    { id: 14, event: 'cards', type: 'updated', points: 2 },
    { id: 15, event: 'cards', type: 'copied', points: 1 },
    { id: 16, event: 'cards', type: 'archived', points: 1 },
    { id: 17, event: 'cards', type: 'unarchived', points: 1 },
    { id: 18, event: 'cards', type: 'deleted', points: 1 },
    { id: 19, event: 'cards', type: 'reordered', points: 1 },
    { id: 20, event: 'cards', type: 'moved_column', points: 5 },
    { id: 21, event: 'cards', type: 'moved_to_board', points: 1 },
    { id: 22, event: 'cards', type: 'moved_from_board', points: 1 },
    { id: 23, event: 'cards', type: 'labels_updated', points: 1 },
    { id: 24, event: 'cards', type: 'assignees_updated', points: 1 },

    { id: 25, event: 'comments', type: 'added', points: 4 },
    { id: 26, event: 'comments', type: 'updated', points: 2 },
    { id: 27, event: 'comments', type: 'deleted', points: 1 },
  ]
}
