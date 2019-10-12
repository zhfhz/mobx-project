import PropTypes from 'prop-types'
import { Route } from 'react-router-dom'

// suppress prop-types warning on Route component when using with React.lazy
// until react-router-dom@4.4.0 or higher version released
/* eslint-disable react/forbid-foreign-prop-types */
Route.propTypes.component = PropTypes.oneOfType([
  Route.propTypes.component,
  PropTypes.object,
])
/* eslint-enable react/forbid-foreign-prop-types */
