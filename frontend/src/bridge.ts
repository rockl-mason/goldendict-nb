import { defaultArticle, findMockArticle, getMockSuggestions } from './mockData'

export type SuggestionItem = {
  text: string
  preview: string
  badge: string
  uncertain?: boolean
}

export type ArticlePayload = {
  word: string
  pronunciation: string
  level: string
  partOfSpeech: string
  dictionaries: string[]
  html: string
}

type Listener<T> = (value: T) => void

export type DictionaryBridge = {
  mode: 'mock' | 'qt'
  bootstrap: () => void
  search: (query: string) => void
  lookup: (word: string) => void
  onQueryChanged: (listener: Listener<string>) => () => void
  onSuggestionsChanged: (listener: Listener<SuggestionItem[]>) => () => void
  onArticleChanged: (listener: Listener<ArticlePayload>) => () => void
  onStatusChanged: (listener: Listener<string>) => () => void
}

type QtSignal<T> = {
  connect: (callback: Listener<T>) => void
  disconnect?: (callback: Listener<T>) => void
}

type QtBridgeObject = {
  bootstrap: () => void
  search: (query: string) => void
  lookup: (word: string) => void
  queryChanged: QtSignal<string>
  suggestionsChanged: QtSignal<SuggestionItem[]>
  articleChanged: QtSignal<ArticlePayload>
  statusChanged: QtSignal<string>
}

declare global {
  interface Window {
    QWebChannel?: new (
      transport: unknown,
      callback: (channel: { objects: Record<string, QtBridgeObject> }) => void,
    ) => void
    qt?: {
      webChannelTransport?: unknown
    }
  }
}

function bindListener<T>(signal: QtSignal<T>, listener: Listener<T>) {
  signal.connect(listener)

  return () => {
    signal.disconnect?.(listener)
  }
}

async function loadQtBridge(): Promise<DictionaryBridge | null> {
  if (!window.qt?.webChannelTransport) {
    return null
  }

  if (!window.QWebChannel) {
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'qrc:///qtwebchannel/qwebchannel.js'
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Failed to load qwebchannel.js'))
      document.head.appendChild(script)
    })
  }

  return new Promise((resolve) => {
    const QWebChannelCtor = window.QWebChannel

    if (!QWebChannelCtor || !window.qt?.webChannelTransport) {
      resolve(null)
      return
    }

    new QWebChannelCtor(window.qt.webChannelTransport, (channel) => {
      const bridge = channel.objects.webShellBridge

      resolve({
        mode: 'qt',
        bootstrap: () => bridge.bootstrap(),
        search: (query) => bridge.search(query),
        lookup: (word) => bridge.lookup(word),
        onQueryChanged: (listener) => bindListener(bridge.queryChanged, listener),
        onSuggestionsChanged: (listener) => bindListener(bridge.suggestionsChanged, listener),
        onArticleChanged: (listener) => bindListener(bridge.articleChanged, listener),
        onStatusChanged: (listener) => bindListener(bridge.statusChanged, listener),
      })
    })
  })
}

function createMockBridge(): DictionaryBridge {
  let queryListener: Listener<string> = () => undefined
  let suggestionsListener: Listener<SuggestionItem[]> = () => undefined
  let articleListener: Listener<ArticlePayload> = () => undefined
  let statusListener: Listener<string> = () => undefined

  const emitSuggestions = (query: string) => {
    queryListener(query)
    suggestionsListener(getMockSuggestions(query))
  }

  return {
    mode: 'mock',
    bootstrap: () => {
      queryListener('serendipity')
      suggestionsListener(getMockSuggestions('serendipity'))
      articleListener(defaultArticle)
      statusListener('Browser preview uses mock dictionary data')
    },
    search: (query) => {
      emitSuggestions(query)
      statusListener(query.trim() ? `Searching “${query}”` : 'Ready')
    },
    lookup: (word) => {
      const article = findMockArticle(word)
      queryListener(word)
      suggestionsListener(getMockSuggestions(word))
      articleListener(article)
      statusListener(`Showing article for “${article.word}”`)
    },
    onQueryChanged: (listener) => {
      queryListener = listener
      return () => {
        queryListener = () => undefined
      }
    },
    onSuggestionsChanged: (listener) => {
      suggestionsListener = listener
      return () => {
        suggestionsListener = () => undefined
      }
    },
    onArticleChanged: (listener) => {
      articleListener = listener
      return () => {
        articleListener = () => undefined
      }
    },
    onStatusChanged: (listener) => {
      statusListener = listener
      return () => {
        statusListener = () => undefined
      }
    },
  }
}

export async function createDictionaryBridge() {
  try {
    const qtBridge = await loadQtBridge()
    return qtBridge ?? createMockBridge()
  }
  catch {
    return createMockBridge()
  }
}
