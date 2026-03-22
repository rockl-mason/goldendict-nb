import { useEffect, useState } from 'react'
import {
  createDictionaryBridge,
  type ArticlePayload,
  type DictionaryBridge,
  type SuggestionItem,
} from './bridge'
import { defaultArticle, mockCollections } from './mockData'

const notebookStats = [
  { label: 'Notebook', value: '248' },
  { label: 'Flashcards', value: '62' },
  { label: 'Today', value: '18' },
]

export function App() {
  const [bridge, setBridge] = useState<DictionaryBridge | null>(null)
  const [mode, setMode] = useState<'mock' | 'qt'>('mock')
  const [query, setQuery] = useState('serendipity')
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([])
  const [article, setArticle] = useState<ArticlePayload>(defaultArticle)
  const [status, setStatus] = useState('Ready')

  useEffect(() => {
    let dispose = () => undefined

    createDictionaryBridge().then((nextBridge) => {
      setBridge(nextBridge)
      setMode(nextBridge.mode)

      const cleanups = [
        nextBridge.onQueryChanged((value) => setQuery(value)),
        nextBridge.onSuggestionsChanged((items) => setSuggestions(items)),
        nextBridge.onArticleChanged((nextArticle) => setArticle(nextArticle)),
        nextBridge.onStatusChanged((message) => setStatus(message)),
      ]

      nextBridge.bootstrap()

      dispose = () => {
        cleanups.forEach((cleanup) => cleanup())
      }
    })

    return () => dispose()
  }, [])

  function handleSearchChange(value: string) {
    setQuery(value)
    bridge?.search(value)
  }

  function handleLookup(word: string) {
    if (!word.trim()) {
      return
    }

    setQuery(word)
    bridge?.lookup(word)
  }

  return (
    <div className="app-shell">
      <aside className="library-panel">
        <div className="brand-block">
          <div className="brand-mark">G</div>
          <div>
            <p className="eyebrow">GoldenDict-ng</p>
            <h1>Lexisphere</h1>
          </div>
        </div>

        <div className="collection-grid">
          {notebookStats.map((item) => (
            <article key={item.label} className="metric-card">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </article>
          ))}
        </div>

        <section className="panel-card">
          <div className="section-heading">
            <span className="eyebrow">Workspace</span>
            <span className={`mode-pill mode-pill--${mode}`}>{mode === 'qt' ? 'Qt bridge' : 'Browser mock'}</span>
          </div>
          <p className="panel-copy">
            桌面端词典能力保留在 Qt/C++，页面层使用现代 Web UI 统一搜索、词条展示、单词本与闪卡工作流。
          </p>
        </section>

        <section className="panel-card">
          <div className="section-heading">
            <span className="eyebrow">Collections</span>
          </div>
          <div className="collection-list">
            {mockCollections.map((collection) => (
              <button key={collection.name} className="collection-item" type="button">
                <span>{collection.name}</span>
                <strong>{collection.count}</strong>
              </button>
            ))}
          </div>
        </section>
      </aside>

      <main className="content-shell">
        <header className="hero-panel">
          <div>
            <p className="eyebrow">Modern Dictionary Workspace</p>
            <h2>像优秀在线词典一样清晰，但更适合桌面查词和积累。</h2>
          </div>

          <div className="hero-actions">
            <button className="ghost-action" type="button">
              Import dictionaries
            </button>
            <button className="ghost-action" type="button">
              Review flashcards
            </button>
          </div>
        </header>

        <section className="search-panel">
          <div className="search-frame">
            <span className="search-icon" aria-hidden="true">
              Search
            </span>
            <input
              value={query}
              onChange={(event) => handleSearchChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleLookup(query)
                }
              }}
              placeholder="Search words, forms, phrases, or fuzzy matches"
              type="search"
            />
            <button className="search-commit" onClick={() => handleLookup(query)} type="button">
              Look up
            </button>
          </div>

          <div className="status-row">
            <span>{status}</span>
            <span>{suggestions.length} suggestions</span>
          </div>
        </section>

        <section className="workspace-grid">
          <section className="panel-card results-panel">
            <div className="section-heading">
              <span className="eyebrow">Suggestions</span>
              <span className="muted-label">Fuzzy search + headword matches</span>
            </div>

            <div className="results-list">
              {suggestions.map((item) => (
                <button
                  key={item.text}
                  className="result-row"
                  onClick={() => handleLookup(item.text)}
                  type="button"
                >
                  <div>
                    <strong>{item.text}</strong>
                    <span>{item.preview}</span>
                  </div>
                  <div className="result-meta">
                    {item.uncertain ? <em>Approx</em> : null}
                    <b>{item.badge}</b>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="panel-card article-panel">
            <div className="article-header">
              <div>
                <p className="eyebrow">Article</p>
                <h3>{article.word}</h3>
                <div className="article-meta">
                  <span>{article.pronunciation}</span>
                  <span>{article.level}</span>
                  <span>{article.partOfSpeech}</span>
                </div>
              </div>

              <div className="article-actions">
                <button className="ghost-action" type="button">
                  Add to notebook
                </button>
                <button className="ghost-action" type="button">
                  Make flashcard
                </button>
              </div>
            </div>

            <div className="source-chips">
              {article.dictionaries.map((dictionary) => (
                <span key={dictionary} className="source-chip">
                  {dictionary}
                </span>
              ))}
            </div>

            <article
              className="article-html"
              dangerouslySetInnerHTML={{ __html: article.html }}
            />
          </section>
        </section>
      </main>
    </div>
  )
}
