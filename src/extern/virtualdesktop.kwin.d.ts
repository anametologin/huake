interface VirtualDesktop {
  readonly id: string;
  readonly x11DesktopNumber: number;
  name: string;
  nameChanged(): QSignal;
  aboutToBeDestroyed(): QSignal;
}
