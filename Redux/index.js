const validateAction = action => {
  if (!action || typeof action !== 'object' || Array.isArray(action)) {
    throw new Error('Action must be an obejct!')
  }
  if (typeof action.type === 'undefined') {
    throw new Error('Action must have a type!')
  }
}

const createStore = (reducer, middleware) => {
  let state
  const subscribers = []
  const coreDispatch = action => {
    validateAction(action)
    state = reducer(state, action)
    subscribers.forEach(handler => handler())
  }
  const getState = () => state
  const store = {
    dispatch: coreDispatch,
    getState,
    subscribe: handler => {
      subscribers.push(handler)
      return () => {  // 返回取消订阅的函数
        const index=  subscribers.indexOf(handler)
        if (index > 0) {
          subscribe.splice(index, 1)
        }
      }
    }
  }
  if (middleware) {
    const dispatch = action => store.dispatch(action)
    store.dispatch = middleware({
      dispatch,
      getState
    })(coreDispatch)
  }
  store.dispatch('@@redux/INIT')
  return store
}

const applyMiddleware = (...middleware) => store => {
  if (middleware.length === 0) {
    return dispatch => dispatch
  }
  if (middleware.length === 1) {
    return middleware[0]
  }
  const boundMiddlewares = middleware.map(middleware => middleware(store))
  return boundMiddlewares.reduce((a, b) => 
    next => a(b(next))
  )
}

const delayMiddleware = () => next => action => {
  setTimeout(() => {
    next(action)
  }, 1000)
}
const loggingMiddleware = ({ getState }) => next => action => {
  console.info('before', getState())
  console.info('action', action)
  const result = next(action)
  console.info('after', getState())
  return result
}

const { PropTypes } = React

class Provider extends React.component {  // convert a store prop into a context property
  getChildContext () {
    return {
      store: this.props.store
    }
  }
  render () {
    return this.props.children
  }
}
Provider.childContextTypes = {
  store: PropTypes.object
}

const connect = ( // convert context back into props
  mapStateToProps = () => ({}), mapDisPatchToProps = () => ({})
) => Component => {
  class Connected extends React.Component {
    onStoreOrPropsChange (props) {
      const { store } = this.context
      const state = store.getState()
      const stateProps = mapStateToProps(state, props)
      const dispatchProps = mapDisPatchToProps(store.dispatch, props)
      this.setState({
        ...stateProps,
        ...dispatchProps
      })
    }
    componentWillMount () {
      const { store } = this.context
      this.onStoreOrPropsChange(this.props)
      this.unsubscribe = store.subscribe(() => this.onStoreOrPropsChange(this.props))
    }
    componentWillReceiveProps (nextProps) {
      this.onStoreOrPropsChange(nextProps)
    }
    componentWillMount () {
      this.unsubscribe()
    }
    render () {
      return <Component {...this.props} {...this.state} />
    }
  }
  Connected.contextTypes = {
    store: PropTypes.object
  }
  return Connected
}

const CREATE_NOTE = 'CREATE_NOTE'
const UPDATE_NOTE = 'UPDATE_NOTE'
const OPEN_NOTE = 'OPEN_NOTE'
const CLOSE_NOTE = 'CLOSE_NOE'

const initialSate = {
  nextNoteId: 1,
  notes: {},
  openNoteId: null
}

const reducers = (state = initialSate, action) => {
  switch (action.type) {
    case CREATE_NOTE: {
      const id = state.nextNoteId
      const newNote = {
        id,
        content: ''
      }
      return {
        ...state,
        nextNoteId: id + 1,
        openNoteId: id,
        notes: {
          ...state.notes,
          [id]: newNote
        }
      }
    }
    case UPDATE_NOTE: {
      const {id, content} = action
      const editedNote = {
        ...state.notes[id],
        content
      }
      return {
        ...state,
        notes: {
          ...state.notes,
          [id]: editedNote
        }
      }
    }
    case OPEN_NOTE: {
      return {
        ...state,
        openNoteId: action.id
      }
    }
    case CLOSE_NOTE: {
      return {
        ...state,
        openNoteId: null
      }
    }
    default: 
      return state
  }
}

const store = createStore(reducer, applyMiddleware(
  delayMiddleware,
  loggingMiddleware
))

const NoteEditor = ({ note, onChangeNote, onCloseNote }) => (
  <div>
    <div>
      <textarea
        className="editor-content"
        autoFocus
        value={note.content}
        onChange={event => onChangeNote(note.id, event.target.value)}
      />
    </div>
    <button className="editor-button" onClick={onCloseNote}>
      Close
    </button>
  </div>
)

const NoteTitle = ({ note }) => {
  const title = note.content.split('\n')[0].replace(/^\s+|\s+$/g, '')
  if (title === '') return <i>Untitled</i>
  return <span>{title}</span>
}

const NoteLink = ({ note, onOpenNote }) => (
  <li className="note-list-item">
    <a href="" onClick={() => onOpenNote(note.id)}>
      <NoteTitle note={note} />
    </a>
  </li>
)

const NoteList = ({ notes, onOpenNote }) => (
  <ul className="note-list">
    {
      Object.keys(notes).map(id => 
        <NoteLink 
          key={id}
          note={notes[id]}
          onOpenNote={onOpenNote}
        />
      )
    }
  </ul>
)

const NoteApp = ({
  notes, openNoteId, onAddNote, onChangeNote, onOpenNote, onCloseNote
}) => {
  <div>
    {
      openNoteId ?
        <NoteEditor
          note={notes[openNoteId]}
          onChangeNote={onChangeNote}
          onCloseNote={onCloseNote}
        /> :
        <div>
          <NoteList 
            notes={notes}
            onOpenNote={onOpenNote}
          />
          {
            <button
              className="editor-button"
              onClick={onAddNote}
            >
              New Note
            </button>
          }
        </div>
    }
  </div>
}

const mapStateToProps = state => ({  // takes the current state from our store and returns some props
  notes: state.notes,
  openNoteId: state.openNoteId
})

const mapDisPatchToProps = dispatch => ({ // takes the dispatch method of our store and returns some more props
  onAddNote: () => dispatch({
    type: CREATE_NOTE
  }),
  onChangeNote: (id, content) => dispatch({
    type: UPDATE_NOTE,
    id,
    content
  }),
  onOpenNote: id => dispatch({
    type: OPEN_NOTE,
    id
  }),
  onCloseNote: () => dispatch({
    type: CLOSE_NOTE
  })
})

const NoteAppContainer = connect(mapStateToProps, mapDisPatchToProps)(NoteApp) // a new component get all those mapped props

ReactDOM.render(
  <Provider store={store}>
    <NoteAppContainer />
  </Provider>,
  document.getElementById('root')
)