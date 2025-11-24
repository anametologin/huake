class KWinConfig implements IConfig {
  focusFirst: boolean;
  winClass1: string;
  winClass2: string;
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
  constructor() {
    this.focusFirst = KWIN.readConfig("focusFirst", true);
    this.winClass1 = KWIN.readConfig("winClass1", "huake1").trim();
    if (this.winClass1 === "") this.winClass1 = "huake1";
    this.winClass2 = KWIN.readConfig("winClass2", "huake2").trim();
    if (this.winClass2 === "") this.winClass2 = "huake2";
    this.skipTaskbar = [
      KWIN.readConfig("skipTaskbar1", true),
      KWIN.readConfig("skipTaskbar2", true),
    ];
    this.keepAbove = [
      KWIN.readConfig("keepAbove1", true),
      KWIN.readConfig("keepAbove2", true),
    ];
    this.noBorder = [
      KWIN.readConfig("noBorder1", true),
      KWIN.readConfig("noBorder2", true),
    ];
    this.onAllDesktops = [
      KWIN.readConfig("onAllDesktops1", false),
      KWIN.readConfig("onAllDesktops2", false),
    ];
    this.maximize = [
      KWIN.readConfig("maximize1", true),
      KWIN.readConfig("maximize2", true),
    ];
    this.leftIndent = [
      KWIN.readConfig("leftIndent1", 5),
      KWIN.readConfig("leftIndent2", 5),
    ];
    this.topIndent = [
      KWIN.readConfig("topIndent1", 5),
      KWIN.readConfig("topIndent2", 5),
    ];
    this.width = [KWIN.readConfig("width1", 90), KWIN.readConfig("width2", 90)];
    this.height = [
      KWIN.readConfig("height1", 90),
      KWIN.readConfig("height2", 90),
    ];
    this.onActiveScreen = [
      KWIN.readConfig("onActiveScreen1", false),
      KWIN.readConfig("onActiveScreen2", false),
    ];
    this.monitorNumber = [
      KWIN.readConfig("monitorNumber1", 0),
      KWIN.readConfig("monitorNumber2", 0),
    ];
  }

  public toString(): string {
    return "Config(" + JSON.stringify(this, undefined, 2) + ")";
  }
}
// xrandr --listmonitors | cut -d' ' -f6

// /* HACK: save casting */
// var KWINCONFIG: KWinConfig;
