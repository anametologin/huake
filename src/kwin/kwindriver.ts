var KWIN: KWin;

interface IToggledWindow {
  window: KwinWindow | null;
  accessTime: number;
  // rendered: boolean;
  output: Output | null;
  index: number;
}
type toggledWindowType = Required<IToggledWindow>;

class KWinDriver implements IDriverContext {
  public static backendName: string = "kwin";

  getWindow(idx: number): IToggledWindow | null {
    let currentTime = new Date().valueOf();
    let currentConsole = this.toggledWindowsArr[idx];
    if (currentConsole && currentTime - currentConsole.accessTime > 200) {
      if (currentConsole.window !== null && currentConsole.window.deleted) {
        this.toggledWindowsArr[idx] = this.newToggledWindow(idx);
      }
      if (currentConsole.window === null) {
        let foundConsole = this.tryGetToggledWindow(this.workspace, idx);
        if (foundConsole !== null) {
          this.addWindow(idx, foundConsole);
        }
      }
      currentConsole.accessTime = currentTime;
      return currentConsole;
    }
    return null;
  }

  public tryGetToggledWindow(
    workspace: Workspace,
    idx: number
  ): KwinWindow | null {
    let userIndex = idx + 1;
    const clients: KwinWindow[] = workspace.stackingOrder;
    for (let i = 0; i < clients.length; i++) {
      if (
        clients[i].resourceClass.trim() === `huake${userIndex}` &&
        !clients[i].deleted
      ) {
        print(`huake: Found huake${userIndex}`);
        return clients[i];
      }
    }
    return null;
  }

  public addWindow(idx: number, win: KwinWindow) {
    let toggledWindow = this.toggledWindowsArr[idx];
    win.skipTaskbar = CONFIG.skipTaskbar[idx];
    // win.skipPager = true;
    // win.skipSwitcher = true;
    // win.onAllDesktops = true;
    // win.skipsCloseAnimation = true;
    // win.shade = false;
    win.keepAbove = CONFIG.keepAbove[idx];
    win.noBorder = CONFIG.noBorder[idx];
    win.onAllDesktops = CONFIG.onAllDesktops[idx];
    win.minimized = true;
    toggledWindow.window = win;
    toggledWindow.output = this.getInitialOutput(idx);
  }

  private getInitialOutput(idx: number): Output {
    let output: Output;
    if (CONFIG.onActiveScreen[idx]) {
      output = this.workspace.activeScreen;
    } else {
      if (CONFIG.monitorNumber[idx] >= this.workspace.screens.length) {
        output = this.workspace.screens[this.workspace.screens.length - 1];
      } else {
        output = this.workspace.screens[CONFIG.monitorNumber[idx]];
      }
    }
    this.outputWasChangedByScript = true;
    return output;
  }

  public get backend(): string {
    return KWinDriver.backendName;
  }

  public workspace: Workspace;
  public toggledWindowsArr: toggledWindowType[];
  private shortcuts: IShortcuts;
  private entered: boolean;
  private outputWasChangedByScript: boolean;

  constructor(api: Api) {
    KWIN = api.kwin;
    this.workspace = api.workspace;
    this.shortcuts = api.shortcuts;
    this.toggledWindowsArr = [
      this.newToggledWindow(0),
      this.newToggledWindow(1),
    ];
    this.entered = false;
    this.outputWasChangedByScript = false;
  }

  /*
   * Main
   */

  public main() {
    CONFIG = new KWinConfig();
    this.bindEvents();
    this.bindShortcut();
  }

  private connect(
    signal: Signal<(...args: any[]) => void>,
    handler: (..._: any[]) => void
  ): () => void {
    const wrapper = (...args: any[]) => {
      /* HACK: `workspace` become undefined when the script is disabled. */
      if (typeof this.workspace === "undefined") signal.disconnect(wrapper);
      else this.enter(() => handler.apply(this, args));
    };
    signal.connect(wrapper);

    return wrapper;
  }

  private enter(callback: () => void) {
    if (this.entered) return;

    this.entered = true;
    try {
      callback();
    } catch (e: any) {
      print("Error raised from line " + e.lineNumber);
      print(e);
    } finally {
      this.entered = false;
    }
  }

  private bindEvents() {
    this.connect(this.workspace.windowAdded, (kwinWindow: KwinWindow) => {
      let winClass = kwinWindow.resourceClass.trim();
      if (winClass === "huake1") {
        this.addWindow(0, kwinWindow);
        this.bindWindowEvents(this, kwinWindow, 0);
      } else if (winClass === "huake2") {
        this.addWindow(1, kwinWindow);
        this.bindWindowEvents(this, kwinWindow, 1);
      }
    });
  }

  private bindWindowEvents(
    ctx: IDriverContext,
    window: KwinWindow,
    index: number
  ) {
    this.connect(window.outputChanged, () => {
      if (!this.outputWasChangedByScript) {
        const toggledWindow = ctx.toggledWindowsArr[index];
        toggledWindow.output = window.output;
        ctx.windowPositioning.bind(ctx)(toggledWindow);
      } else {
        this.outputWasChangedByScript = false;
      }
    });
  }

  newToggledWindow(idx: number): IToggledWindow {
    return {
      window: null,
      accessTime: 0,
      // rendered: false,
      output: null,
      index: idx,
    };
  }

  private bindShortcut() {
    this.shortcuts
      .getToggleFirst()
      .activated.connect(() => this.toggleWindowCallback(this, 0));
    this.shortcuts
      .getToggleSecond()
      .activated.connect(() => this.toggleWindowCallback(this, 1));
  }

  private toggleWindowCallback(ctx: IDriverContext, idx: number) {
    let toggleWindow = ctx.getWindow.bind(ctx)(idx);
    if (toggleWindow === null || toggleWindow.window === null) {
      print(`Huake: toggleWindow: ${idx} is null`);
      return;
    }
    let w = ctx.workspace;
    const currentVirtualDesktop = w.currentDesktop;
    const win = toggleWindow.window;

    let desktops = win.desktops;
    let isShow = false;
    if (
      desktops.length !== 0 &&
      desktops.find((d) => d.id === currentVirtualDesktop.id) === undefined
    ) {
      win.desktops = [currentVirtualDesktop];
      isShow = true;
    }
    if (
      isShow ||
      (win.minimized &&
        ((CONFIG.onActiveScreen && ctx.workspace.activeScreen !== win.output) ||
          win.output !== toggleWindow.output))
    ) {
      ctx.windowPositioning.bind(ctx)(toggleWindow);
      win.minimized = false;
      ctx.workspace.activeWindow = win;
    } else if (CONFIG.focusFirst && !win.minimized && !win.active) {
      ctx.workspace.activeWindow = win;
    } else if (win.minimized) {
      win.minimized = false;
      ctx.workspace.activeWindow = win;
    } else {
      win.minimized = true;
    }
  }

  windowPositioning(toggledWindow: IToggledWindow) {
    if (toggledWindow.window === null || toggledWindow.output === null) return;
    let output: Output;
    let win = toggledWindow.window;
    let vDesktop = this.workspace.currentDesktop;
    let idx = toggledWindow.index;

    if (CONFIG.onActiveScreen[idx]) {
      output = toggledWindow.output = this.workspace.activeScreen;
      this.outputWasChangedByScript =
        toggledWindow.output.name !== toggledWindow.window.output.name;
    } else {
      output = toggledWindow.output;
    }

    if (CONFIG.maximize[idx]) {
      // if (win.maximizeMode === 0) win.setMaximize(true, true);
      win.frameGeometry = this.workspace.clientArea(
        KWIN.MaximizeArea,
        output,
        vDesktop
      );
    } else {
      let leftIndent = (output.geometry.width * CONFIG.leftIndent[idx]) / 100;
      let topIndent = (output.geometry.height * CONFIG.topIndent[idx]) / 100;
      let width = (output.geometry.width * CONFIG.width[idx]) / 100;
      let height = (output.geometry.height * CONFIG.height[idx]) / 100;
      win.frameGeometry = Qt.rect(
        output.geometry.x + leftIndent,
        output.geometry.y + topIndent,
        output.geometry.width - width - leftIndent >= 0
          ? width
          : output.geometry.width - leftIndent,
        output.geometry.height - height - topIndent >= 0
          ? height
          : output.geometry.height - topIndent
      );
    }
  }
}
