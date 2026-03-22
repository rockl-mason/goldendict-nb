#include "webshellwindow.hh"
#include "webshellbridge.hh"

#include <QWebChannel>
#include <QWebEngineSettings>
#include <QWebEngineView>
#include <QUrl>
#include <QVBoxLayout>

WebShellWindow::WebShellWindow( QWidget * parent ):
  QWidget( parent )
{
  setObjectName( "webShellWindow" );
  auto * layout = new QVBoxLayout( this );
  layout->setContentsMargins( 0, 0, 0, 0 );
  layout->setSpacing( 0 );

  view_ = new QWebEngineView( this );
  layout->addWidget( view_ );

  channel_ = new QWebChannel( view_->page() );
  bridge_  = new WebShellBridge( channel_ );
  channel_->registerObject( QStringLiteral( "webShellBridge" ), bridge_ );

  view_->page()->setWebChannel( channel_ );
  view_->settings()->setAttribute( QWebEngineSettings::LocalContentCanAccessRemoteUrls, true );
  view_->load( QUrl( QStringLiteral( "qrc:/webui/dist/index.html" ) ) );
}

WebShellBridge * WebShellWindow::bridge() const
{
  return bridge_;
}
