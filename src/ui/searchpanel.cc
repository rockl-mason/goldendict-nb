#include "searchpanel.hh"
#include <QHBoxLayout>

SearchPanel::SearchPanel( QWidget * parent ):
  QWidget( parent )
{
  setObjectName( "inlineSearchPanel" );

  lineEdit = new QLineEdit( this );
  lineEdit->setObjectName( "inlineSearchField" );
  lineEdit->setPlaceholderText( tr( "Find in current entry" ) );

  close = new QPushButton( this );
  close->setObjectName( "inlineSearchCloseButton" );
  close->setIcon( QIcon( ":/icons/closetab.svg" ) );
  close->setFlat( true );
  close->setToolTip( tr( "Close find bar" ) );

  previous = new QPushButton( this );
  previous->setObjectName( "inlineSearchPreviousButton" );
  previous->setIcon( QIcon( ":/icons/previous.svg" ) );
  previous->setText( tr( "Previous" ) );
  previous->setShortcut( QKeySequence( tr( "Ctrl+Shift+G" ) ) );
  previous->setEnabled( false );

  next = new QPushButton( this );
  next->setObjectName( "inlineSearchNextButton" );
  next->setIcon( QIcon( ":/icons/next.svg" ) );
  next->setText( tr( "Next" ) );
  next->setShortcut( QKeySequence( tr( "Ctrl+G" ) ) );
  next->setEnabled( false );

  caseSensitive = new QCheckBox( this );
  caseSensitive->setObjectName( "inlineSearchCaseSensitive" );
  caseSensitive->setText( tr( "Case sensitive" ) );

  statusLabel = new QLabel( tr( "Find in current entry" ), this );
  statusLabel->setObjectName( "inlineSearchStatusLabel" );
  statusLabel->setMinimumWidth( 120 );

  auto * layout = new QHBoxLayout( this );
  layout->setContentsMargins( 14, 12, 14, 12 );
  layout->setSpacing( 10 );
  layout->addWidget( lineEdit, 1 );
  layout->addWidget( statusLabel );
  layout->addWidget( caseSensitive );
  layout->addWidget( previous );
  layout->addWidget( next );
  layout->addWidget( close );

  setMinimumHeight( 58 );
}
