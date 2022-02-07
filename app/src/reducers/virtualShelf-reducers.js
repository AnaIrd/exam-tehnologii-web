const INITIAL_STATE = {
    virtualShelfList: [],
    count: 0,
    error: null,
    fetching: false,
    fetched: false
  }
  
  export default function reducer (state = INITIAL_STATE, action) {
    switch (action.type) {
      case 'GET_VIRTUAL_SHELVES_PENDING':
      case 'ADD_VIRTUAL_SHELF_PENDING':
      case 'SAVE_VIRTUAL_SHELF_PENDING':
      case 'DELETE_VIRTUAL_SHELF_PENDING':
        return { ...state, error: null, fetching: true, fetched: false }
      case 'GET_VIRTUAL_SHELVES_FULFILLED':
      case 'ADD_VIRTUAL_SHELF_FULFILLED':
      case 'SAVE_VIRTUAL_SHELF_FULFILLED':
      case 'DELETE_VIRTUAL_SHELF_FULFILLED':
        return { ...state, virtualShelfList: action.payload.records, count: action.payload.count, error: null, fetching: false, fetched: true }
      case 'GET_VIRTUAL_SHELVES_REJECTED':
      case 'ADD_VIRTUAL_SHELF_REJECTED':
      case 'SAVE_VIRTUAL_SHELF_REJECTED':
      case 'DELETE_VIRTUAL_SHELF_REJECTED':
        return { ...state, virtualShelfList: [], error: action.payload, fetching: false, fetched: true }
      default:
        return state
    }
  }