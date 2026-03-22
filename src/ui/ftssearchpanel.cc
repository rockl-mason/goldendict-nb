#include "ftssearchpanel.hh"
#include <QHBoxLayout>

FtsSearchPanel::FtsSearchPanel( QWidget * parent ):
  QWidget( parent )
{
  setObjectName( "ftsSearchPanel" );

  auto * layout = new QHBoxLayout( this );
  layout->setContentsMargins( 14, 12, 14, 12 );
  layout->setSpacing( 10 );
  previous    = new QPushButton( this );
  next        = new QPushButton( this );
  close       = new QPushButton( this );
  statusLabel = new QLabel( tr( "Browse full-text matches" ), this );

  layout->addWidget( previous );
  layout->addWidget( next );
  layout->addWidget( statusLabel, 1 );
  layout->addWidget( close );

  previous->setIcon( QIcon( ":/icons/previous.svg" ) );
  next->setIcon( QIcon( ":/icons/next.svg" ) );
  close->setIcon( QIcon( ":/icons/closetab.svg" ) );

  previous->setText( tr( "Previous" ) );
  next->setText( tr( "Next" ) );
  close->setToolTip( tr( "Close full-text find bar" ) );
  close->setFlat( true );
  previous->setEnabled( false );
  next->setEnabled( false );
}
