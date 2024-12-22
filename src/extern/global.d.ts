/* KWin global objects */
declare var KWIN: KWin;
declare function print(s: string): void;
// declare function callDBus(
//   service: string,
//   path: string,
//   interface: string,
//   method: string,
//   args: any[],
//   callback: (reply: string) => void
// ): void;

interface Api {
  workspace: Workspace;
  kwin: KWin;
  shortcuts: IShortcuts;
}
// declare var KWINCONFIG: KWinConfig;
/* QML objects */
declare var activityInfo: Plasma.TaskManager.ActivityInfo;
declare var mousePoller: Plasma.PlasmaCore.DataSource;
// declare var scriptRoot: object;

interface PopupDialogs {
  show(hops: [string, number, number][]): void;
  hidePopups(): void;
}
declare var scriptRoot: PopupDialogs;

/* Common Javascript globals */
declare let console: any;
declare let setTimeout: any;
