enum Shortcut {
  ToggleFirst,
  ToggleSecond,
}

interface IShortcuts {
  getToggleFirst(): ShortcutHandler;
  getToggleSecond(): ShortcutHandler;
}

interface IConfig {
  skipTaskbar: boolean[];
  keepAbove: boolean[];
  noBorder: boolean[];
  onAllDesktops: boolean[];
  maximize: boolean[];
  leftIndent: number[];
  topIndent: number[];
  width: number[];
  height: number[];
  onActiveScreen: boolean[];
  monitorNumber: number[];
}

interface IDriverContext {
  workspace: Workspace;
  readonly backend: string;
  toggledWindowsArr: toggledWindowType[];
  getWindow(idx: number): KwinWindow | null;
  tryGetToggledWindow(ctx: Workspace, idx: number): KwinWindow | null;
  addWindow(idx: number, win: KwinWindow): void;
  newToggledWindow(): toggledWindowType;
  windowPositioning(win: KwinWindow, idx: number): void;
}
let CONFIG: IConfig;
