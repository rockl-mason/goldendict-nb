import type { ArticlePayload, SuggestionItem } from './bridge'

type Entry = {
  word: string
  pronunciation: string
  level: string
  partOfSpeech: string
  summary: string
  badge: string
  dictionaries: string[]
  html: string
}

const entries: Entry[] = [
  {
    word: 'serendipity',
    pronunciation: '/ˌser.ənˈdɪp.ə.ti/',
    level: 'C1',
    partOfSpeech: 'noun',
    summary: 'finding something valuable when you were not deliberately looking for it',
    badge: 'Oxford',
    dictionaries: ['Oxford', 'Cambridge', 'Wiktionary'],
    html: `
      <section class="entry-block">
        <p class="entry-label">Core meaning</p>
        <h4>the faculty of making fortunate discoveries by accident</h4>
        <ol>
          <li>Researchers often describe their breakthrough as pure serendipity.</li>
          <li>A good dictionary workflow should leave room for serendipity, not only exact search.</li>
        </ol>
      </section>
      <section class="entry-grid">
        <div>
          <p class="entry-label">Notes</p>
          <p>常带有“意外中的好运”色彩，语气比 <em>chance</em> 更积极，也更书面。</p>
        </div>
        <div>
          <p class="entry-label">Word family</p>
          <p><strong>serendipitous</strong> adj. <strong>serendipitously</strong> adv.</p>
        </div>
      </section>
    `,
  },
  {
    word: 'lexicon',
    pronunciation: '/ˈlek.sɪ.kən/',
    level: 'C1',
    partOfSpeech: 'noun',
    summary: 'the vocabulary of a language, speaker, or subject',
    badge: 'Cambridge',
    dictionaries: ['Cambridge', 'Oxford', 'Wikipedia'],
    html: `
      <section class="entry-block">
        <p class="entry-label">Definition</p>
        <h4>the complete set of words used in a language or by a group of people</h4>
        <p>在软件语境里也常用来指“术语库”或“词汇层”。</p>
      </section>
      <section class="entry-grid">
        <div>
          <p class="entry-label">Example</p>
          <p>The interface borrows from the visual lexicon of modern reference sites.</p>
        </div>
        <div>
          <p class="entry-label">Related</p>
          <p>vocabulary, glossary, terminology</p>
        </div>
      </section>
    `,
  },
  {
    word: 'ephemeral',
    pronunciation: '/ɪˈfem.ər.əl/',
    level: 'C2',
    partOfSpeech: 'adjective',
    summary: 'lasting for a very short time',
    badge: 'Wiki',
    dictionaries: ['Oxford', 'Wiktionary'],
    html: `
      <section class="entry-block">
        <p class="entry-label">Definition</p>
        <h4>existing only briefly; transitory or short-lived</h4>
        <p>常用于描述临时内容、短暂趋势或无法长期保存的体验。</p>
      </section>
      <section class="entry-grid">
        <div>
          <p class="entry-label">Contrast</p>
          <p>persistent, durable, enduring</p>
        </div>
        <div>
          <p class="entry-label">UI note</p>
          <p>好的词典 UI 不应该让重要学习成果变得 ephemeral。</p>
        </div>
      </section>
    `,
  },
  {
    word: 'mnemonic',
    pronunciation: '/nɪˈmɒn.ɪk/',
    level: 'C1',
    partOfSpeech: 'noun / adjective',
    summary: 'something intended to help the memory',
    badge: 'Study',
    dictionaries: ['Cambridge', 'Oxford'],
    html: `
      <section class="entry-block">
        <p class="entry-label">Definition</p>
        <h4>a memory aid, especially a pattern, phrase, or association</h4>
        <p>非常适合和单词本、闪卡、例句收集结合。</p>
      </section>
      <section class="entry-grid">
        <div>
          <p class="entry-label">Example</p>
          <p>Turning a dictionary note into a mnemonic flashcard closes the learning loop.</p>
        </div>
        <div>
          <p class="entry-label">Common collocations</p>
          <p>mnemonic device, mnemonic strategy</p>
        </div>
      </section>
    `,
  },
]

export const mockCollections = [
  { name: 'Daily captures', count: 31 },
  { name: 'Academic writing', count: 84 },
  { name: 'IELTS speaking', count: 56 },
  { name: 'Flashcard backlog', count: 19 },
]

function toArticle(entry: Entry): ArticlePayload {
  return {
    word: entry.word,
    pronunciation: entry.pronunciation,
    level: entry.level,
    partOfSpeech: entry.partOfSpeech,
    dictionaries: entry.dictionaries,
    html: entry.html,
  }
}

export const defaultArticle = toArticle(entries[0])

export function getMockSuggestions(query: string): SuggestionItem[] {
  const normalized = query.trim().toLowerCase()

  if (!normalized) {
    return entries.map((entry) => ({
      text: entry.word,
      preview: entry.summary,
      badge: entry.badge,
    }))
  }

  return entries
    .filter((entry) => {
      return (
        entry.word.toLowerCase().includes(normalized) ||
        entry.summary.toLowerCase().includes(normalized) ||
        entry.partOfSpeech.toLowerCase().includes(normalized)
      )
    })
    .map((entry) => ({
      text: entry.word,
      preview: entry.summary,
      badge: entry.badge,
      uncertain: !entry.word.toLowerCase().startsWith(normalized),
    }))
}

export function findMockArticle(word: string): ArticlePayload {
  const normalized = word.trim().toLowerCase()
  const exact = entries.find((entry) => entry.word.toLowerCase() === normalized)

  if (exact) {
    return toArticle(exact)
  }

  const similar = entries.find((entry) => entry.word.toLowerCase().includes(normalized))
  return toArticle(similar ?? entries[0])
}
