'use strict';

const tap = require('tap');

tap.test('Async Context', (t) => {
  t.autoend();

  // Make sure continuify doesn't exist yet and then load it.
  t.notOk(global.continuify, 'should not have continuify in global space yet');
  require('../../index');
  t.type(
    global.continuify,
    'function',
    'should expose continuify after loading'
  );
  t.type(
    global.getCurrentContext,
    'function',
    'should expose getCurrentContext after loading'
  );

  t.test('continuify', (t) => {
    t.plan(6);
    const obj = {};

    let called = false;
    const cb = () => {
      t.pass('should call the callback');
      called = true;
      return obj;
    };

    t.equal(continuify(obj), obj, 'should not wrap non-function arguments');
    t.equal(continuify(), undefined, 'should not die will missing arguments');

    const continued = continuify(cb);
    t.notEqual(continued, cb, 'should wrap functions');
    t.notOk(called, 'should not call the given function');

    t.equal(continued(), obj, 'continuation should return the result of the callback');
  });

  t.test('context creation', (t) => {
    // TODO: Create a root context for the module scope (i.e. the file).
    t.equal(getCurrentContext(), null, 'should start in a null context');

    const cb = continuify(() => {
      return getCurrentContext();
    });

    const context1 = cb();
    const context2 = cb();

    t.notEqual(context1, context2, 'should create a new context each invocation');
    t.notEqual(context1.id, context2.id, 'should have new ids for each context');

    t.equal(context1.continuation, cb, 'should link to continuation');
    t.end();
  });

  t.test('context propagation', (t) => {
    // Create a short context chain.
    let context0 = null;
    let context1 = null;
    let context2 = null;
    continuify(() => {
      context0 = getCurrentContext();

      continuify(() => {
        context1 = getCurrentContext();

        continuify(() => {
          context2 = getCurrentContext();
        })();
      })();
    })();

    t.notEqual(context0, context1, 'should create a new context each step (0-1)');
    t.notEqual(context0, context2, 'should create a new context each step (0-2)');
    t.notEqual(context1, context2, 'should create a new context each step (1-2)');

    t.equal(context2.continuation.linkData.linkContext, context1, 'should link contexts (2-1)');
    t.equal(context1.continuation.linkData.linkContext, context0, 'should link contexts (1-0)');

    t.end();
  });
});
