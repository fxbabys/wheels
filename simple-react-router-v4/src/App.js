import React, { Component } from 'react'
import PropTypes from 'prop-types'

let instances = []

const register = comp => instances.push(comp)
const unregister = comp => instances.splice(instances.indexOf(comp), 1)

const historyPush = path => {
  window.history.pushState({}, null, path)
  instances.forEach(instance => instance.forceUpdate())
}

const historyReplace = path => {
  window.history.replaceState({}, null, path)
  instances.forEach(instance => instance.forceUpdate())
}

const matchPath = (pathname, options) => {
  const { exact = false, path } = options

  if (!path) {
    return {
      path: null,
      url: pathname,
      isExact: true
    }
  }

  const match = new RegExp(`^${path}`).exec(pathname)

  if (!match) return null

  const url = match[0]
  const isExact = pathname === url

  if (exact && !isExact) return null

  return {
    path,
    url,
    isExact
  }
}

// 当 path 匹配时渲染对应的 UI
export class Route extends Component {
  static propTypes = {
    path: PropTypes.string,
    exact: PropTypes.bool,
    component: PropTypes.func,
    render: PropTypes.func
  }

  componentWillMount () {
    window.addEventListener('popstate', this.handlePop)
    register(this)
  }

  componentWillUnmount () {
    unregister(this)
    window.addEventListener('popstate', this.handlePop)
  }

  handlePop = () => {
    this.forceUpdate() // 强制更新 UI
  }

  render () {
    const { path, exact, component, render } = this.props

    const match = matchPath(window.location.pathname, { path, exact })

    if (!match) return null

    if (component) return React.createElement(component, { match })

    if (render) return render({ match })

    return null
  }
}

// 声明式更新 URL
export class Link extends Component {
  static propTypes = {
    to: PropTypes.string.isRequired,
    replace: PropTypes.bool
  }

  handleClick = e => {
    const { replace, to } = this.props

    e.preventDefault()
    replace ? historyReplace(to) : historyPush(to)
  }

  render () {
    const { to, children } = this.props

    return (
      <a href={to} onClick={this.handleClick}>
        {children}
      </a>
    )
  }
}

export class Redirect extends Component {
  static defaultProps = {
    push: false
  }

  static propTypes = {
    to: PropTypes.string.isRequired,
    push: PropTypes.bool.isRequired
  }

  componentDidMount () {
    const { to, push } = this.props

    push ? historyPush(to) : historyReplace(to)
  }

  render () {
    return null
  }
}