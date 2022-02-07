import virtualShelvesJSON from './virtualShelvesJSON.json'

const SERVER = 'http://localhost:7777'

// PT HEROKU
// const SERVER = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`

export const getVirtualShelves = (filterString, page, size, sortField, sort) => {
    return {
        type: 'GET_VIRTUAL_SHELVES',
        payload: async () => {
            const response = await fetch(`${SERVER}/virtualShelves?${filterString}&sortField=${sortField || ''}&sort=${sort || ''}&page=${page || ''}&size=${size || ''}`)
            const data = await response.json()
            return data
        }
    }
}

export const addVirtualShelf = (virtualShelf, filterString, page, size, sortField, sort) => {
    return {
        type: 'ADD_VIRTUAL_SHELF',
        payload: async () => {
            let response = await fetch(`${SERVER}/virtualShelves`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(virtualShelf)
            })
            response = await fetch(`${SERVER}/virtualShelves?${filterString}&sortField=${sortField || ''}&sort=${sort || ''}&page=${page || ''}&size=${size || ''}`)
            const data = await response.json()
            return data
        }
    }
}

export const saveVirtualShelf = (id, virtualShelf, filterString, page, size, sortField, sort) => {
    return {
        type: 'SAVE_VIRTUAL_SHELF',
        payload: async () => {
            let response = await fetch(`${SERVER}/virtualShelves/${id}`, {
                method: 'put',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(virtualShelf)
            })
            response = await fetch(`${SERVER}/virtualShelves?${filterString}&sortField=${sortField || ''}&sort=${sort || ''}&page=${page || ''}&size=${size || ''}`)
            const data = await response.json()
            return data
        }
    }
}

export const deleteVirtualShelf = (id, filterString, page, size, sortField, sort) => {
    return {
        type: 'DELETE_VIRTUAL_SHELF',
        payload: async () => {
            let response = await fetch(`${SERVER}/virtualShelves/${id}`, {
                method: 'delete'
            })
            response = await fetch(`${SERVER}/virtualShelves?${filterString}&sortField=${sortField || ''}&sort=${sort || ''}&page=${page || ''}&size=${size || ''}`)
            const data = await response.json()
            return data
        }
    }
}

export const exportVirtualShelves = () => {
    return {
        type: 'EXPORT_VIRTUAL_SHELVES',
        payload: async () => {
            let response = await fetch(`${SERVER}/virtualShelves/export`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await response.json()
           
            const file = JSON.stringify(data)
            const url = URL.createObjectURL(new Blob([file], { type: "text/plain" }))
            const link = document.createElement('a');
            link.download = 'virtual_shelves.json';
            link.href = url;
            link.click();
            
            return data
        }
    }
}

export const importVirtualShelves = (filterString, page, size, sortField, sort) => {
    return {
        type: 'IMPORT_VIRTUAL_SHELVES',
        payload: async () => {
            let response = await fetch(`${SERVER}/virtualShelves/import`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(virtualShelvesJSON)
            })
            response = await fetch(`${SERVER}/virtualShelves?${filterString}&sortField=${sortField || ''}&sort=${sort || ''}&page=${page || ''}&size=${size || ''}`)
            const data = await response.json()
            return data
        }
    }
}

export const getBooks = (id) => {
    return {
        type: 'GET_BOOKS',
        payload: async () => {
            const response = await fetch(`${SERVER}/virtualShelves/${id}/books`)
            const data = await response.json()
            return data
        }
    }
}

export const addBook = (id, book) => {
    return {
        type: 'ADD_BOOK',
        payload: async () => {
            let response = await fetch(`${SERVER}/virtualShelves/${id}/books`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(book)
            })
            response = await fetch(`${SERVER}/virtualShelves/${id}/books`)
            const data = await response.json()
            return data
        }
    }
}

export const saveBook = (vsid, bid, book) => {
    return {
        type: 'SAVE_BOOK',
        payload: async () => {
            let response = await fetch(`${SERVER}/virtualShelves/${vsid}/books/${bid}`, {
                method: 'put',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(book)

            })
            response = await fetch(`${SERVER}/virtualShelves/${vsid}/books`)
            const data = await response.json()
            return data
        }
    }
}

export const deleteBook = (vsid, bid) => {
    return {
        type: 'DELETE_BOOK',
        payload: async () => {
            let response = await fetch(`${SERVER}/virtualShelves/${vsid}/books/${bid}`, {
                method: 'delete'
            })
            response = await fetch(`${SERVER}/virtualShelves/${vsid}/books`)
            const data = await response.json()
            return data
        }
    }
}