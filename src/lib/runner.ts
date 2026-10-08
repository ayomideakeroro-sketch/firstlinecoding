/**
 * Runs learner code inside a sandboxed iframe (opaque origin, scripts only)
 * and reports console output, runtime errors and check results back to the
 * page via postMessage.
 */

export type RunMode = 'js' | 'html'

export interface LogLine {
  level: 'log' | 'info' | 'warn' | 'error'
  text: string
}

export interface RunResult {
  logs: LogLine[]
  error?: string
  checks: boolean[]
  timedOut?: boolean
}

const escapeScript = (src: string) => src.replace(/<\/script/gi, '<\\/script')

function harness(runId: string) {
  return `<script>
window.__logs = [];
(function () {
  var send = function (type, data) { parent.postMessage({ __firstline: ${JSON.stringify(runId)}, type: type, data: data }, '*'); };
  window.__send = send;
  var fmt = function (v) {
    if (typeof v === 'string') return v;
    try { var j = JSON.stringify(v); return j === undefined ? String(v) : j; } catch (e) { return String(v); }
  };
  ['log', 'info', 'warn', 'error'].forEach(function (level) {
    var original = console[level];
    console[level] = function () {
      var text = Array.prototype.map.call(arguments, fmt).join(' ');
      window.__logs.push(text);
      send('log', { level: level, text: text });
      original.apply(console, arguments);
    };
  });
  window.addEventListener('error', function (e) { send('error', { text: e.message }); });
})();
</script>`
}

function checkScript(checks: string[], afterLoad: boolean) {
  const body = `var results = ${JSON.stringify(checks)}.map(function (src) {
    try { return !!(0, eval)(src); } catch (e) { return false; }
  });
  window.__send('done', { results: results });`
  return afterLoad
    ? `<script>window.addEventListener('load', function () { ${body} });</script>`
    : `<script>(function () { ${body} })();</script>`
}

export function buildDocument(mode: RunMode, code: string, checks: string[], runId: string) {
  if (mode === 'js') {
    return `<!doctype html><html><body>${harness(runId)}<script>\n${escapeScript(code)}\n</script>${checkScript(checks, false)}</body></html>`
  }
  // HTML lessons: the learner's markup is the page. Checks run after load so styles apply.
  return `${code}\n${harness(runId)}${checkScript(checks, true)}`
}

/**
 * Execute code in the given iframe. Resolves when checks finish or after a
 * timeout (for runaway loops).
 */
export function runInFrame(
  frame: HTMLIFrameElement,
  mode: RunMode,
  code: string,
  checks: string[],
  onLog?: (line: LogLine) => void,
  timeoutMs = 3000,
): Promise<RunResult> {
  const runId = Math.random().toString(36).slice(2)
  const result: RunResult = { logs: [], checks: checks.map(() => false) }

  return new Promise((resolve) => {
    const finish = () => {
      window.removeEventListener('message', onMessage)
      clearTimeout(timer)
      resolve(result)
    }
    const onMessage = (e: MessageEvent) => {
      const msg = e.data
      if (!msg || msg.__firstline !== runId) return
      if (msg.type === 'log') {
        result.logs.push(msg.data)
        onLog?.(msg.data)
      } else if (msg.type === 'error') {
        result.error = msg.data.text
      } else if (msg.type === 'done') {
        result.checks = msg.data.results
        finish()
      }
    }
    const timer = setTimeout(() => {
      result.timedOut = true
      frame.srcdoc = '<!doctype html><html><body></body></html>'
      finish()
    }, timeoutMs)

    window.addEventListener('message', onMessage)
    frame.srcdoc = buildDocument(mode, code, checks, runId)
  })
}
