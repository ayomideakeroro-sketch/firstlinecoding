import { useMemo, useRef } from 'react'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import xml from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('css', css)

interface Props {
  value: string
  onChange: (value: string) => void
  language: 'javascript' | 'xml'
  onRun?: () => void
  label?: string
  minHeight?: number
}

/**
 * Lightweight code editor: a transparent textarea layered over a
 * highlight.js-rendered <pre>. Both share font metrics from `.code-layer`.
 */
export function CodeEditor({ value, onChange, language, onRun, label = 'Code editor', minHeight = 260 }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null)
  const html = useMemo(() => hljs.highlight(value, { language }).value, [value, language])
  const lines = value.split('\n').length

  const insert = (text: string, cursorOffset = text.length) => {
    const el = ref.current
    if (!el) return
    const { selectionStart: start, selectionEnd: end } = el
    const next = value.slice(0, start) + text + value.slice(end)
    onChange(next)
    requestAnimationFrame(() => {
      el.selectionStart = el.selectionEnd = start + cursorOffset
    })
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      onRun?.()
      return
    }
    if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault()
      insert('  ')
      return
    }
    if (e.key === 'Enter') {
      // Keep the current line's indentation
      const el = e.currentTarget
      const lineStart = value.lastIndexOf('\n', el.selectionStart - 1) + 1
      const indent = value.slice(lineStart).match(/^[ \t]*/)?.[0] ?? ''
      const extra = value[el.selectionStart - 1] === '{' ? '  ' : ''
      e.preventDefault()
      insert('\n' + indent + extra)
    }
  }

  return (
    <div className="flex h-full overflow-auto bg-night text-[#e6e2d9]" style={{ minHeight }}>
      <div
        aria-hidden
        className="code-layer sticky left-0 select-none text-right text-[#5d626d] bg-night pr-3 pl-4 border-r border-white/5"
      >
        {Array.from({ length: lines }, (_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      <div className="relative flex-1 min-w-max">
        <pre aria-hidden className="code-layer hljs pointer-events-none" dangerouslySetInnerHTML={{ __html: html + '\n' }} />
        <textarea
          ref={ref}
          aria-label={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          wrap="off"
          className="code-layer code-input absolute inset-0 w-full h-full resize-none overflow-hidden bg-transparent text-transparent caret-[#f08a6c] outline-none"
        />
      </div>
    </div>
  )
}
