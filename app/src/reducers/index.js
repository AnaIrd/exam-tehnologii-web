import { combineReducers } from 'redux'
import virtualShelf from './virtualShelf-reducers'
import book from './book-reducers'

export default combineReducers({
  virtualShelf, book
})
