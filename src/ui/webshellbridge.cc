#include "webshellbridge.hh"

WebShellBridge::WebShellBridge( QObject * parent ):
  QObject( parent )
{
}

void WebShellBridge::setBootstrapHandler( std::function< void() > handler )
{
  bootstrapHandler_ = std::move( handler );
}

void WebShellBridge::setSearchHandler( std::function< void( const QString & ) > handler )
{
  searchHandler_ = std::move( handler );
}

void WebShellBridge::setLookupHandler( std::function< void( const QString & ) > handler )
{
  lookupHandler_ = std::move( handler );
}

void WebShellBridge::setQuery( const QString & query )
{
  query_ = query;
  emit queryChanged( query_ );
}

void WebShellBridge::setSuggestions( const QVariantList & suggestions )
{
  suggestions_ = suggestions;
  emit suggestionsChanged( suggestions_ );
}

void WebShellBridge::setArticle( const QVariantMap & article )
{
  article_ = article;
  emit articleChanged( article_ );
}

void WebShellBridge::setStatus( const QString & status )
{
  status_ = status;
  emit statusChanged( status_ );
}

void WebShellBridge::bootstrap()
{
  if ( bootstrapHandler_ ) {
    bootstrapHandler_();
  }

  emit queryChanged( query_ );
  emit suggestionsChanged( suggestions_ );
  emit articleChanged( article_ );
  emit statusChanged( status_ );
}

void WebShellBridge::search( const QString & query )
{
  if ( searchHandler_ ) {
    searchHandler_( query );
  }
}

void WebShellBridge::lookup( const QString & word )
{
  if ( lookupHandler_ ) {
    lookupHandler_( word );
  }
}
