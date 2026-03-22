#pragma once

#include <QObject>
#include <QVariantList>
#include <QVariantMap>
#include <functional>

class WebShellBridge: public QObject
{
  Q_OBJECT

public:
  explicit WebShellBridge( QObject * parent = nullptr );

  void setBootstrapHandler( std::function< void() > handler );
  void setSearchHandler( std::function< void( const QString & ) > handler );
  void setLookupHandler( std::function< void( const QString & ) > handler );

  void setQuery( const QString & query );
  void setSuggestions( const QVariantList & suggestions );
  void setArticle( const QVariantMap & article );
  void setStatus( const QString & status );

  Q_INVOKABLE void bootstrap();
  Q_INVOKABLE void search( const QString & query );
  Q_INVOKABLE void lookup( const QString & word );

signals:
  void queryChanged( const QString & query );
  void suggestionsChanged( const QVariantList & suggestions );
  void articleChanged( const QVariantMap & article );
  void statusChanged( const QString & status );

private:
  std::function< void() > bootstrapHandler_;
  std::function< void( const QString & ) > searchHandler_;
  std::function< void( const QString & ) > lookupHandler_;

  QString query_;
  QVariantList suggestions_;
  QVariantMap article_;
  QString status_;
};
