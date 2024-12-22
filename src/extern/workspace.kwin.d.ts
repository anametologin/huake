interface Workspace {
  readonly desktops: Output[];
  readonly desktopGridSize: QSize;
  readonly desktopGridWidth: number;
  readonly desktopGridHeight: number;
  readonly workspaceWidth: number;
  readonly workspaceHeight: number;
  readonly workspaceSize: QSize;
  readonly activeScreen: Output;
  readonly screens: Output[];
  readonly activities: string[];
  readonly virtualScreenSize: QSize;
  readonly virtualScreenGeometry: QRect;
  readonly stackingOrder: KwinWindow[];
  readonly cursorPos: QPoint;
  // read-write props
  currentDesktop: VirtualDesktop;
  activeWindow: KwinWindow | null;
  currentActivity: string;
  // signals
  windowAdded: QSignal; // (window: IWindow)
  windowRemoved: QSignal; // (window: IWindow
  windowActivated: QSignal; // (window: IWindow)
  desktopsChanged: QSignal;
  desktopLayoutChanged: QSignal;
  screensChanged: QSignal;
  currentActivityChanged: QSignal; // (activity new. const id: string)
  activitiesChanged: QSignal; // (activity new. const id: string)
  activityAdded: QSignal; // (activity new. const id: string)
  activityRemoved: QSignal; // (activity new. const id: string)
  virtualScreenSizeChanged: QSignal;
  virtualScreenGeometryChanged: QSignal;
  currentDesktopChanged: QSignal; // (desktop: IVirtualDesktop)
  cursorPosChanged: QSignal;
  // functions
  sendClientToScreen(client: KwinWindow, output: Output): void;
  showOutline(geometry: QRect): void;
  showOutline(x: number, y: number, width: number, height: number): void;
  hideOutline(): void;
  screenAt(pos: QPoint): Output;
  clientArea(
    option: ClientAreaOption,
    output: Output,
    desktop: VirtualDesktop
  ): QRect;
  clientArea(option: ClientAreaOption, window: KwinWindow): QRect;
  createDesktop(position: number, name: string): void;
  removeDesktop(desktop: VirtualDesktop): void;
  supportInformation(): string;
  raiseWindow(window: KwinWindow): void;
  getClient(windowId: number): KwinWindow;
  windowAt(pos: QPoint, count: number): KwinWindow[];
  isEffectActive(pluginId: string): boolean;
}
