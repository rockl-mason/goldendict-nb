import { useEffect, useMemo, useState } from 'react'
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

const focusPills = ['Word of the Day', 'Pronunciation', 'Example sentences', 'Notebook sync']

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

  const trendingWords = useMemo(() => {
    if (suggestions.length > 0) {
      return suggestions.slice(0, 5)
    }

    return [
      { text: 'serendipity', preview: 'lucky discovery by accident', badge: 'Oxford' },
      { text: 'lexicon', preview: 'the vocabulary of a language', badge: 'Cambridge' },
      { text: 'mnemonic', preview: 'something that helps you remember', badge: 'Study' },
    ]
  }, [suggestions])

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

        <section className="panel-card workspace-card">
          <div className="section-heading">
            <span className="eyebrow">Workspace</span>
            <span className={`mode-pill mode-pill--${mode}`}>{mode === 'qt' ? 'Qt live' : 'Browser mock'}</span>
          </div>
          <p className="panel-copy">
            像高质量在线词典一样先聚焦搜索，再把单词本、闪卡和词典来源收进同一个学习工作台。
          </p>
          <div className="focus-pill-row">
            {focusPills.map((pill) => (
              <span key={pill} className="focus-pill">
                {pill}
              </span>
            ))}
          </div>
        </section>

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
            <span className="eyebrow">Collections</span>
            <span className="muted-label">Learning shelves</span>
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
        <section className="hero-panel">
          <div className="hero-copy">
            <p className="eyebrow">Dictionary workspace</p>
            <h2>Find the word fast, keep the article readable, and turn good entries into study material.</h2>
            <p className="hero-description">
              借鉴在线词典的搜索层级和杂志化信息卡片，把桌面词典做成更适合持续积累的工作区。
            </p>
          </div>

          <div className="hero-utility">
            <p className="eyebrow">Session status</p>
            <strong>{status}</strong>
            <div className="hero-actions">
              <button className="ghost-action ghost-action--filled" onClick={() => handleLookup(query)} type="button">
                Search now
              </button>
              <button className="ghost-action" type="button">
                Add flashcard
              </button>
            </div>
          </div>
        </section>

        <section className="search-panel">
          <div className="search-frame">
            <label className="search-icon" htmlFor="dictionary-query">
              Search
            </label>
            <input
              id="dictionary-query"
              value={query}
              onChange={(event) => handleSearchChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleLookup(query)
                }
              }}
              placeholder="Search a word, phrase, form, or fuzzy match"
              type="search"
            />
            <button className="search-commit" onClick={() => handleLookup(query)} type="button">
              Look up
            </button>
          </div>

          <div className="trending-row">
            <span className="trending-label">Trending</span>
            <div className="trending-pills">
              {trendingWords.map((item) => (
                <button key={item.text} className="trending-pill" onClick={() => handleLookup(item.text)} type="button">
                  {item.text}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="workspace-grid">
          <section className="panel-card results-panel">
            <div className="section-heading">
              <span className="eyebrow">Suggestions</span>
              <span className="muted-label">{suggestions.length} matches</span>
            </div>

            <div className="results-list">
              {suggestions.map((item) => (
                <button
                  key={item.text}
                  className="result-row"
                  onClick={() => handleLookup(item.text)}
                  type="button"
                >
                  <div className="result-copy">
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

          <section className="article-column">
            <section className="panel-card article-panel">
              <div className="article-kicker">
                <div>
                  <p className="eyebrow">Entry</p>
                  <h3>{article.word}</h3>
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

              <div className="article-meta">
                <span>{article.pronunciation || 'Pronunciation pending'}</span>
                <span>{article.level}</span>
                <span>{article.partOfSpeech}</span>
              </div>

              <div className="source-chips">
                {article.dictionaries.map((dictionary) => (
                  <span key={dictionary} className="source-chip">
                    {dictionary}
                  </span>
                ))}
              </div>

              <article className="article-html" dangerouslySetInnerHTML={{ __html: article.html }} />
            </section>

            <aside className="article-rail">
              <section className="panel-card">
                <div className="section-heading">
                  <span className="eyebrow">Word tools</span>
                </div>
                <ul className="tool-list">
                  <li>Collect entry to notebook</li>
                  <li>Generate flashcard from definition</li>
                  <li>Keep pronunciation and example blocks together</li>
                </ul>
              </section>

              <section className="panel-card">
                <div className="section-heading">
                  <span className="eyebrow">Sources</span>
                </div>
                <div className="source-list">
                  {article.dictionaries.map((dictionary) => (
                    <div key={dictionary} className="source-row">
                      <strong>{dictionary}</strong>
                      <span>Active</span>
                    </div>
                  ))}
                </div>
              </section>
            </aside>
          </section>
        </section>
      </main>
    </div>
  )
}
