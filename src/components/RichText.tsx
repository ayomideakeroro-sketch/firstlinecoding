import type { ReactNode } from 'react'
import type { Block } from '@/data/curriculum'

/** Renders `inline code` and **bold** inside lesson copy. */
export function Inline({ text }: { text: string }) {
  const parts: ReactNode[] = []
  const re = /(`[^`]+`|\*\*[^*]+\*\*)/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index))
    const token = m[0]
    parts.push(
      token.startsWith('`') ? (
        <code key={m.index}>{token.slice(1, -1)}</code>
      ) : (
        <strong key={m.index} className="font-semibold text-ink">
          {token.slice(2, -2)}
        </strong>
      ),
    )
    last = m.index + token.length
  }
  if (last < text.length) parts.push(text.slice(last))
  return <>{parts}</>
}

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="prose-lesson">
      {blocks.map((b, i) =>
        b.kind === 'p' ? (
          <p key={i}>
            <Inline text={b.text} />
          </p>
        ) : (
          <pre key={i}>
            <code>{b.text}</code>
          </pre>
        ),
      )}
    </div>
  )
}
