interface KWin {
  MaximizeArea: number;
  readConfig<T>(property: string, defaultValue: T): T;
  registerShortcut(
    name: string,
    desc: string,
    key: string,
    callback: Function
  ): void;
  callDBus(
    service: string,
    path: string,
    interf: string,
    method: string,
    ...args: object[]
  ): void;
  registerScreenEdge(edge: number, callback: Function): void;
  unregisterScreenEdge(edge: number): void;
  registerTouchScreenEdge(edge: number, callback: Function): void;
  unregisterTouchScreenEdge(edge: number): void;
  registerUserActionsMenu(callback: Function): void;
}
