# BetterPropTypes

A DSL for less verbse `propTypes` declarations in React.

## Installation

```
npm install [--save] better-prop-types
```

## Usage

When declaring your `propTypes`, instead of a plain object, pass an object to the function exported from the `better-prop-types` package. See below for more details.

```javascript
import pt from 'better-prop-types';

export default class MyReactComponent extends React.Component {
  static propTypes = pt({
    // ... BetterPropTypes declaration here
  })
}
```

## Differences from normal `prop-types`

BetterPropTypes makes two assertions:

1. **Most props should usually be required** by default, and optional props should be made explict (rather than the other way around)
2. **Nested object types are a pain to declare** due to lots of nested `PropTypes.shape({...}).isRequired` calls

To remedy this, BetterPropTypes exports an interface just like the normal `prop-types` package, but with the following changes:

1. All types are required by default; call `.opt` on them to make them optional
2. Instead of `PropTypes.shape({...}).isRequired`, for required objects, simply use plain objects
3. Instead of `PropTypes.shape({...})` for optional objects, use `pt.opt({...})`
4. Your top-level `propTypes` declaration should be an object passed to the `pt` function (the main package export) instead of a plain object

### Example

Before:

```javascript
import PropTypes from 'prop-types';
// ...
static propTypes = {
  callback: PropTypes.func.isRequired,
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
      slug: PropTypes.string
    }).isRequired,
    friends: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        user: PropTypes.shape({
          name: PropTypes.string.isRequired
        }).isRequired
      }).isRequired
    )
  }).isRequired
}
```

After:

```javascript
import pt from 'better-prop-types';
// ...
static propTypes = pt({
  callback: pt.func,
  data: {
    id: pt.string,
    user: {
      name: pt.string,
      slug: pt.string.opt,
    },
    friends: pt.arrayOf({
      id: pt.string,
      user: {
        name: pt.string,
      },
    }).opt
  },
})
```
