process.env.NODE_ENV = "development";

var assert = require('chai').assert;

var PropTypes = require('prop-types');
var ReactPropTypesSecret = require('prop-types/lib/ReactPropTypesSecret');
var React = require('react');
var pt = require('../');

function checkErrors(typeSpec, values, expectedErrors) {
  const errors = [];
  Object.keys(typeSpec).forEach(key => {
    const err = typeSpec[key](values, key, 'Test', 'prop', null, ReactPropTypesSecret)
    if (err) {
      errors.push(err.message)
    }
  })

  assert.equal(errors.length, expectedErrors.length)
  errors.forEach((err, i) => assert.match(err, expectedErrors[i]))
}

function Thing () {}

describe('basic type proxies', function() {
  it('errors when required types are missing', function() {
    checkErrors(
      pt({
        v1: pt.array,
        v2: pt.bool,
        v3: pt.func,
        v4: pt.number,
        v5: pt.object,
        v6: pt.string,
        v7: pt.symbol,
        v8: pt.node,
        v9: pt.element,
        v10: pt.any,
      }),
      { /* nothing */ },
      [
        /`v1` is marked as required.*its value is `undefined`/,
        /`v2` is marked as required.*its value is `undefined`/,
        /`v3` is marked as required.*its value is `undefined`/,
        /`v4` is marked as required.*its value is `undefined`/,
        /`v5` is marked as required.*its value is `undefined`/,
        /`v6` is marked as required.*its value is `undefined`/,
        /`v7` is marked as required.*its value is `undefined`/,
        /`v8` is marked as required.*its value is `undefined`/,
        /`v9` is marked as required.*its value is `undefined`/,
        /`v10` is marked as required.*its value is `undefined`/,
      ]
    )
  })

  it('errors when tyeps are not correct', function() {
    checkErrors(
      pt({
        v1: pt.array,
        v2: pt.bool,
        v3: pt.func,
        v4: pt.number,
        v5: pt.object,
        v6: pt.string,
        v7: pt.symbol,
        v8: pt.node,
        v9: pt.element,
        v10: pt.any,
      }),
      {
        v1: true,
        v2: () => null,
        v3: 42,
        v4: {test: true},
        v5: 'hello',
        v6: Symbol('hello'),
        v7: () => null,
        v8: {obj: true},
        v9: [1, 2, 3],
        v10: null,
      },
      [
        /Invalid prop `v1` of type `boolean` supplied.*expected `array`/,
        /Invalid prop `v2` of type `function` supplied.*expected `boolean`/,
        /Invalid prop `v3` of type `number` supplied.*expected `function`/,
        /Invalid prop `v4` of type `object` supplied.*expected `number`/,
        /Invalid prop `v5` of type `string` supplied.*expected `object`/,
        /Invalid prop `v6` of type `symbol` supplied.*expected `string`/,
        /Invalid prop `v7` of type `function` supplied.*expected `symbol`/,
        /Invalid prop `v8` supplied.*expected a ReactNode/,
        /Invalid prop `v9` of type `array` supplied.*expected a single ReactElement/,
        /`v10` is marked as required.*its value is `null`/,
      ]
    )
  })

  it('does not error when missing types are optional', function() {
    checkErrors(
      pt({
        v1: pt.array.opt,
        v2: pt.bool.opt,
        v3: pt.func.opt,
        v4: pt.number.opt,
        v5: pt.object.opt,
        v6: pt.string.opt,
        v7: pt.symbol.opt,
        v8: pt.node.opt,
        v9: pt.element.opt,
        v10: pt.any.opt,
      }),
      { /* nothing */ },
      [ /* no errors */ ]
    )
  })

  it('does not error when types are correct', function() {
    checkErrors(
      pt({
        v1: pt.array,
        v2: pt.bool,
        v3: pt.func,
        v4: pt.number,
        v5: pt.object,
        v6: pt.string,
        v7: pt.symbol,
        v8: pt.node,
        v9: pt.element,
        v10: pt.any,
      }),
      {
        v1: [1, 2, 3],
        v2: true,
        v3: () => null,
        v4: 42,
        v5: {test: true},
        v6: 'hello',
        v7: Symbol('hello'),
        v8: 'renderable',
        v9: React.createElement('div'),
        v10: 'anything!',
      },
      [ /* no errors */ ]
    )
  })
})
