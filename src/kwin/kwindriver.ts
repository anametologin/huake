var KWIN: KWin;

interface IToggledWindow {
  window: KwinWindow | null;
  accessTime: number;
  rendered: boolean;
  outputName: string;
}

type toggledWindowType = Required<IToggledWindow>;

class KWinDriver implements IDriverContext {
  public static backendName: string = "kwin";

  getWindow(idx: number): KwinWindow | null {
    let currentTime = new Date().valueOf();
    let currentConsole = this.toggledWindowsArr[idx];
    if (currentConsole && currentTime - currentConsole.accessTime > 200) {
      if (currentConsole.window !== null && currentConsole.window.deleted) {
        this.toggledWindowsArr[idx] = this.newToggledWindow();
      }
      if (currentConsole.window === null) {
        let foundConsole = this.tryGetToggledWindow(this.workspace, idx);
        if (foundConsole !== null) {
          this.addWindow(idx, foundConsole);
        }
      }
      currentConsole.accessTime = currentTime;
      return currentConsole.window;
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
      print(
        `huake:userIndex:${userIndex} wincaption-${clients[i].resourceClass}`
      );
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
  }

  public get backend(): string {
    return KWinDriver.backendName;
  }

  public workspace: Workspace;

  public toggledWindowsArr: toggledWindowType[];

  private shortcuts: IShortcuts;

  private entered: boolean;

  constructor(api: Api) {
    KWIN = api.kwin;
    this.workspace = api.workspace;
    this.shortcuts = api.shortcuts;
    this.toggledWindowsArr = [this.newToggledWindow(), this.newToggledWindow()];
    this.entered = false;
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
      } else if (winClass === "huake2") {
        this.addWindow(1, kwinWindow);
      }
    });
  }

  newToggledWindow(): IToggledWindow {
    return {
      window: null,
      accessTime: 0,
      rendered: false,
      outputName: "",
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
    let w = ctx.workspace;
    let toggledWindow = ctx.getWindow.bind(ctx)(idx);
    const currentVirtualDesktop = w.currentDesktop;

    if (toggledWindow !== null) {
      let desktops = toggledWindow.desktops;
      let isShow = false;
      if (
        desktops.length !== 0 &&
        desktops.find((d) => d.id === currentVirtualDesktop.id) === undefined
      ) {
        toggledWindow.desktops = [currentVirtualDesktop];
        isShow = true;
      }
      if (!ctx.toggledWindowsArr[idx].rendered) {
        ctx.windowPositioning.bind(ctx)(toggledWindow, idx);
        if (CONFIG.maximize[idx]) toggledWindow.setMaximize(true, true);
        ctx.toggledWindowsArr[idx].rendered = true;
        toggledWindow.minimized = false;
        ctx.workspace.activeWindow = toggledWindow;
      } else if (isShow) {
        ctx.windowPositioning.bind(ctx)(toggledWindow, idx);
        toggledWindow.minimized = false;
        ctx.workspace.activeWindow = toggledWindow;
      } else if (
        toggledWindow.minimized &&
        CONFIG.onActiveScreen &&
        ctx.workspace.activeScreen.name !==
          ctx.toggledWindowsArr[idx].outputName
      ) {
        ctx.windowPositioning.bind(ctx)(toggledWindow, idx);
        toggledWindow.minimized = false;
        ctx.workspace.activeWindow = toggledWindow;
      } else if (toggledWindow.minimized) {
        toggledWindow.minimized = false;
        ctx.workspace.activeWindow = toggledWindow;
      } else {
        toggledWindow.minimized = true;
      }
    } else {
      print(`Huake: toggleWindow: ${idx} is null`);
    }
  }

  windowPositioning(win: KwinWindow, idx: number) {
    let output: Output;
    if (CONFIG.onActiveScreen[idx]) {
      output = this.workspace.activeScreen;
    } else {
      output = this.workspace.screens[CONFIG.monitorNumber[idx]]
        ? this.workspace.screens[CONFIG.monitorNumber[idx]]
        : this.workspace.screens[0];
    }
    this.toggledWindowsArr[idx].outputName = output.name;
    if (CONFIG.maximize[idx]) {
      win.frameGeometry = Qt.rect(
        output.geometry.x + output.geometry.x * 0.2,
        output.geometry.y + output.geometry.y * 0.2,
        output.geometry.width - output.geometry.width * 0.4,
        output.geometry.height - output.geometry.height * 0.4
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
