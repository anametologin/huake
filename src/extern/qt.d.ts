interface QObject {
  destroy(): void;

  show(text: string, x: number, y: number, interval: number): void;
  hide(): void;
}

interface Signal<T extends Function> {
  connect(callback: T): void;
  disconnect(callback: T): void;
}
declare enum Component {
  Null,
  Ready,
  Loading,
  Error,
}
interface QtComponent {
  progress: number;
  status: Component;
  url: String;

  errorString(): string;
  createObject(parent: QObject | null, props: any): QObject;

  statusChanged: Signal<() => void>;
}
interface QTimer extends QObject {
  interval: number;
  repeat: boolean;
  running: boolean;
  triggeredOnStart: boolean;

  restart(): void;
  start(): void;
  stop(): void;

  triggered: Signal<() => void>;
}
interface DBusCall {
  dbusInterface: string;
  service: string;
  path: string;
  method: string;
  arguments: any[];

  call(): void;

  finished: Signal<(returnValue: any[]) => void>;
  failed: Signal<() => void>;
}

interface ShortcutHandler {
  name: string;
  text: string;
  sequence: string;

  activated: Signal<() => void>;
}

interface QByteArray {
  /* keep it empty for now */
}

interface QUuid {
  toString(): string;
  toByteArray(): QByteArray;
}

interface QRect {
  height: number;
  width: number;
  x: number;
  y: number;
}

interface QPoint {
  x: number;
  y: number;
}

interface QSize {
  width: number;
  height: number;
}

interface QSignal {
  connect(callback: any): void;
  disconnect(callback: any): void;
}

/* Reference: http://doc.qt.io/qt-5/qml-qtqml-timer.html */
interface QQmlTimer {
  interval: number;
  repeat: boolean;
  running: boolean;
  triggeredOnStart: boolean;

  triggered: QSignal;

  restart(): void;
  start(): void;
  stop(): void;
}

declare namespace Qt {
  function createQmlObject(qml: string, parent: object, filepath?: string): any;
  function createComponent(path: string): QtComponent;

  function rect(x: number, y: number, width: number, height: number): QRect;
}
