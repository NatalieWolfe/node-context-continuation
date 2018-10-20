'use strict';

module.exports = instrument

const WRAP = Symbol('Wrap');
const WRAP_CALLBACK_LAST = {[WRAP]: {callbackIndex: -1}}

const DEFINITIONS = {
  child_process: {
    exec: WRAP_CALLBACK_LAST,
    execFile: WRAP_CALLBACK_LAST,
    ChildProcess: {
      prototype: {
        send: WRAP_CALLBACK_LAST
      }
    }
  },

  cluster: {
    disconnect: WRAP_CALLBACK_LAST,
    Worker: {
      prototype: {
        send: WRAP_CALLBACK_LAST
      }
    }
  },

  crypto: {
    generateKeyPair: WRAP_CALLBACK_LAST,
    pbkdf2: WRAP_CALLBACK_LAST,
    randomBytes: WRAP_CALLBACK_LAST,
    randomFill: WRAP_CALLBACK_LAST,
    scrypt: WRAP_CALLBACK_LAST
  },

  dns: {
    lookup: WRAP_CALLBACK_LAST,
    lookupService: WRAP_CALLBACK_LAST,
    resolve: WRAP_CALLBACK_LAST,
    resolve4: WRAP_CALLBACK_LAST,
    resolve6: WRAP_CALLBACK_LAST,
    resolveAny: WRAP_CALLBACK_LAST,
    resolveCname: WRAP_CALLBACK_LAST,
    resolveMx: WRAP_CALLBACK_LAST,
    resolveNaptr: WRAP_CALLBACK_LAST,
    resolveNs: WRAP_CALLBACK_LAST,
    resolvePtr: WRAP_CALLBACK_LAST,
    resolveSoa: WRAP_CALLBACK_LAST,
    resolveSrv: WRAP_CALLBACK_LAST,
    resolveTxt: WRAP_CALLBACK_LAST,
    reverse: WRAP_CALLBACK_LAST
  },

  events: {
    EventEmitter: {
      prototype: {
        addListener: WRAP_CALLBACK_LAST,
        on: WRAP_CALLBACK_LAST,
        once: WRAP_CALLBACK_LAST,
        prependListener: WRAP_CALLBACK_LAST,
        prependOnceListener: WRAP_CALLBACK_LAST
      }
    }
  },

  fs: {
    access: WRAP_CALLBACK_LAST,
    appendFile: WRAP_CALLBACK_LAST,
    chmod: WRAP_CALLBACK_LAST,
    chown: WRAP_CALLBACK_LAST,
    copyFile: WRAP_CALLBACK_LAST,
    exists: WRAP_CALLBACK_LAST,
    fchmod: WRAP_CALLBACK_LAST,
    fchown: WRAP_CALLBACK_LAST,
    fdatasync: WRAP_CALLBACK_LAST,
    fstat: WRAP_CALLBACK_LAST,
    fsync: WRAP_CALLBACK_LAST,
    ftruncate: WRAP_CALLBACK_LAST,
    futimes: WRAP_CALLBACK_LAST,
    lchmod: WRAP_CALLBACK_LAST,
    lchown: WRAP_CALLBACK_LAST,
    link: WRAP_CALLBACK_LAST,
    lstat: WRAP_CALLBACK_LAST,
    mkdir: WRAP_CALLBACK_LAST,
    mkdtemp: WRAP_CALLBACK_LAST,
    open: WRAP_CALLBACK_LAST,
    read: WRAP_CALLBACK_LAST,
    readdir: WRAP_CALLBACK_LAST,
    readFile: WRAP_CALLBACK_LAST,
    readlink: WRAP_CALLBACK_LAST,
    realpath: {
      [WRAP]: {callbackIndex: -1},
      native: WRAP_CALLBACK_LAST
    },
    rename: WRAP_CALLBACK_LAST,
    rmdir: WRAP_CALLBACK_LAST,
    stat: WRAP_CALLBACK_LAST,
    symlink: WRAP_CALLBACK_LAST,
    truncate: WRAP_CALLBACK_LAST,
    unlink: WRAP_CALLBACK_LAST,
    utimes: WRAP_CALLBACK_LAST,
    watch: WRAP_CALLBACK_LAST,
    watchFile: WRAP_CALLBACK_LAST,
    write: WRAP_CALLBACK_LAST,
    write: WRAP_CALLBACK_LAST,
    writeFile: WRAP_CALLBACK_LAST
  },

  http: {
    Agent: {
      prototype: {
        createConnection: WRAP_CALLBACK_LAST
      }
    },
    ClientRequest: {
      prototype: {
        end: WRAP_CALLBACK_LAST,
        setTimeout: WRAP_CALLBACK_LAST,
        write: WRAP_CALLBACK_LAST
      }
    },
    Server: {
      prototype: {
        close: WRAP_CALLBACK_LAST,
        listen: WRAP_CALLBACK_LAST,
        setTimeout: WRAP_CALLBACK_LAST
      }
    },
    ServerResponse: {
      prototype: {
        end: WRAP_CALLBACK_LAST,
        setTimeout: WRAP_CALLBACK_LAST,
        write: WRAP_CALLBACK_LAST
      }
    },
    IncomingMessage: {
      prototype: {
        setTimeout: WRAP_CALLBACK_LAST
      }
    },
    createServer: WRAP_CALLBACK_LAST,
    get: WRAP_CALLBACK_LAST,
    request: WRAP_CALLBACK_LAST
  },

  http2: {
    Http2Session: {
      prototype: {
        close: WRAP_CALLBACK_LAST,
        ping: WRAP_CALLBACK_LAST,
        setTimeout: WRAP_CALLBACK_LAST
      }
    },
    Http2Stream: {
      prototype: {
        close: WRAP_CALLBACK_LAST,
        setTimeout: WRAP_CALLBACK_LAST
      }
    },
    ServerHttp2Stream: {
      prototype: {
        pushStream: WRAP_CALLBACK_LAST
      }
    },
    Http2Server: {
      prototype: {
        close: WRAP_CALLBACK_LAST,
        setTimeout: WRAP_CALLBACK_LAST
      }
    },
    Http2SecureServer: {
      prototype: {
        close: WRAP_CALLBACK_LAST,
        setTimeout: WRAP_CALLBACK_LAST
      }
    },
    createServer: WRAP_CALLBACK_LAST,
    createSecureServer: WRAP_CALLBACK_LAST,
    connect: WRAP_CALLBACK_LAST,
    Http2ServerRequest: {
      prototype: {
        setTimeout: WRAP_CALLBACK_LAST
      }
    },
    Http2ServerResponse: {
      prototype: {
        end: WRAP_CALLBACK_LAST,
        setTimeout: WRAP_CALLBACK_LAST,
        write: WRAP_CALLBACK_LAST,
        createPushResponse: WRAP_CALLBACK_LAST
      }
    }
  },

  net: {
    Server: {
      prototype: {
        close: WRAP_CALLBACK_LAST,
        getConnections: WRAP_CALLBACK_LAST,
        listen: WRAP_CALLBACK_LAST
      }
    },
    Socket: {
      prototype: {
        connect: WRAP_CALLBACK_LAST,
        setTimeout: WRAP_CALLBACK_LAST,
        write: WRAP_CALLBACK_LAST
      }
    },
    connect: WRAP_CALLBACK_LAST,
    createConnection: WRAP_CALLBACK_LAST,
    createServer: WRAP_CALLBACK_LAST
  },

  timers: {
    setImmediate: {[WRAP]: {callback: 0}},
    setInterval: {[WRAP]: {callback: 0}},
    setTimeout: {[WRAP]: {callback: 0}},
  },

  zlib: {
    Zlib: {
      prototype: {
        close: WRAP_CALLBACK_LAST,
        flush: WRAP_CALLBACK_LAST,
        params: WRAP_CALLBACK_LAST
      }
    },
    deflate: WRAP_CALLBACK_LAST,
    deflateRaw: WRAP_CALLBACK_LAST,
    gunzip: WRAP_CALLBACK_LAST,
    gzip: WRAP_CALLBACK_LAST,
    inflate: WRAP_CALLBACK_LAST,
    inflateRaw: WRAP_CALLBACK_LAST,
    unzip: WRAP_CALLBACK_LAST
  }
};

// HTTPS and HTTP have the same API for our purposes.
DEFINITIONS.https = DEFINITIONS.http;

function instrument() {
  // Wrap everything in our definitions map.
  const modules = Object.keys(DEFINITIONS);
  for (let i in modules) {
    const mod = require(modules[i]);
    _wrap(mod, DEFINITIONS[modules[i]]);
  }

  // Wrap methods on the process.
  process.send = _wrap(process.send, WRAP_CALLBACK_LAST);

  // Copy over timers back to the global object.
  const timers = require('timers');
  global.setTimeout = timers.setTimeout;
  global.setImmediate = timers.setImmediate;
  global.setInterval = timers.setInterval;
}

function _wrap(original, defs) {
  // Null or undefined keys just pass right back.
  if (original == null) {
    return original
  }

  // Look for this definition's wrap specification.
  let res = original;
  if (defs[WRAP] && typeof original === 'function' && !original[WRAP]) {
    const cbIdx = defs[WRAP].callbackIndex;
    res = function(...args) {
      // Adjust negative indexes off the end of the argument array.
      const realCbIdx = cbIdx < 0 ? args.length + cbIdx : cbIdx;
      if (typeof args[realCbIdx] === 'function') {
        // Continue!
        args[realCbIdx] = continuify(args[realCbIdx]);
      }

      // Execute the original method.
      return original.apply(this, args);
    }
    res.original = original;
    res[WRAP] = true;
  }

  // Recursively wrap.
  for (let key in defs) {
    const wrapped = _wrap(res[key], defs[key])
    if (wrapped !== res[key]) {
      res[key] = wrapped
    }
  }

  return res
}
