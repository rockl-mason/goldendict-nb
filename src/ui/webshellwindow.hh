#pragma once

#include <QWidget>

class QWebChannel;
class QWebEngineView;
class WebShellBridge;

class WebShellWindow: public QWidget
{
  Q_OBJECT

public:
  explicit WebShellWindow( QWidget * parent = nullptr );
  WebShellBridge * bridge() const;

private:
  QWebEngineView * view_ = nullptr;
  QWebChannel * channel_ = nullptr;
  WebShellBridge * bridge_ = nullptr;
};
