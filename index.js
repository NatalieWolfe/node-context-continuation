'use strict';

if (!global.continuify) {
  polyfillContinuify(global);
  require('./lib/instrument')();
}

function polyfillContinuify(exports) {
  let contextCounter = 0;
  let continuationCounter = 0;
  let linkCounter = 0;

  const CONTINUATION = Symbol('Continuation')

  const state = Object.create(null);
  state.context = null;

  class Context {
    constructor(continuation) {
      this.id = ++contextCounter;
      this.continuation = continuation;
      this.readyContext = null;
    }
  }

  class ContinuationLinkData {
    constructor(context) {
      // The link context is the context active when the continuation is constructed.
      this.id = ++linkCounter;
      this.linkContext = context;
    }
  }

  const continuify = (fn) => {
    // Don't wrap non-functions or double-wrap continuations.
    if (typeof fn !== 'function' || fn[CONTINUATION]) {
      return fn;
    }

    const continuation = function(...args) {
      const context = new Context(continuation);
      const prev = state.context;
      state.context = context;
      try {
        return fn.apply(this, args);
      } finally {
        state.context = prev;
      }
    };
    continuation[CONTINUATION] = true;
    continuation.id = ++continuationCounter;
    continuation.original = fn;
    continuation.linkData = new ContinuationLinkData(state.context);

    return continuation;
  };

  exports.continuify = continuify;
  exports.getCurrentContext = () => state.context;
}
