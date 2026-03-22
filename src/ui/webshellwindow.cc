#include "webshellwindow.hh"
#include "webshellbridge.hh"

#include <QWebChannel>
#include <QWebEngineSettings>
#include <QWebEngineView>
#include <QUrl>

WebShellWindow::WebShellWindow( QWidget * parent ):
  QMainWindow( parent )
{
  setAttribute( Qt::WA_DeleteOnClose, false );
  setObjectName( "webShellWindow" );
  setWindowTitle( tr( "GoldenDict-ng Web UI Preview" ) );
  resize( 1560, 980 );

  view_ = new QWebEngineView( this );
  setCentralWidget( view_ );

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
