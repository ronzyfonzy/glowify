import axios from 'axios'

export default Authorization => {
  const axiosClient = axios.create({
    baseURL: 'https://gloapi.gitkraken.com/v1/glo',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization },
  })

  return {
    // boards: boardId => {
    //   return {
    //     getAll: async params => {
    //       return axiosClient.get('/boards', { params }).then(response => response.data)
    //     },
    //     get: async (boardId, params) => {
    //       return axiosClient.get(`/boards/${boardId}`, { params }).then(response => response.data)
    //     },
    //     cards: cardId => {
    //       return {
    //         getAll: async params => {
    //           return axiosClient.get(`/boards/${boardId}/cards`, { params }).then(response => response.data)
    //         },
    //       }
    //     },
    //   }
    // },

    boards: {
      getAll: async params => {
        return axiosClient.get('/boards', { params }).then(response => response.data)
      },
      get: async (boardId, params) => {
        return axiosClient.get(`/boards/${boardId}`, { params }).then(response => response.data)
      },
    },
    columns: {
      getAll: async (boardId, params) => {
        return axiosClient.get(`/boards/${boardId}/columns`, { params }).then(response => response.data)
      },
      get: async (boardId, columnId) => {
        return axiosClient.get(`/boards/${boardId}/columns/${columnId}`).then(response => response.data)
      },
      create: async (boardId, name, position) => {
        return axiosClient.post(`/boards/${boardId}/columns`, { name, position }).then(response => response.data)
      },
      delete: async (boardId, columnId) => {
        return axiosClient.delete(`/boards/${boardId}/columns/${columnId}`).then(response => response.data)
      },
    },
    cards: {
      getAll: async (boardId, params) => {
        return axiosClient.get(`/boards/${boardId}/cards`, { params }).then(response => response.data)
      },
      get: async (boardId, cardId, params) => {
        return axiosClient.get(`/boards/${boardId}/cards/${cardId}`, { params }).then(response => response.data)
      },
      create: async (boardId, cardData) => {
        return axiosClient.post(`/boards/${boardId}/cards`, cardData).then(response => response.data)
      },
      edit: async (boardId, cardId, cardData) => {
        return axiosClient.post(`/boards/${boardId}/cards/${cardId}`, cardData).then(response => response.data)
      },
      delete: async (boardId, cardId) => {
        return axiosClient.delete(`/boards/${boardId}/cards/${cardId}`).then(response => response.data)
      },
    },
    labels: {
      create: async (boardId, labelData) => {
        return axiosClient.post(`/boards/${boardId}/labels`, labelData).then(response => response.data)
      },
      edit: async (boardId, labelId, labelData) => {
        return axiosClient.post(`/boards/${boardId}/labels/${labelId}`, labelData).then(response => response.data)
      },
      delete: async (boardId, labelId) => {
        return axiosClient.delete(`/boards/${boardId}/labels/${labelId}`).then(response => response.data)
      },
    },
  }
}
