const enum LayoutDirection {
  Floating,
  Horizontal,
  Vertical,
}

const enum ClientAreaOption {
  PlacementArea,
  MovementArea,
  MaximizeArea,
  MaximizeFullArea,
  FullScreenArea,
  WorkArea,
  FullArea,
  ScreenArea,
}

const enum Edge {
  TopEdge = 1,
  LeftEdge = 2,
  RightEdge = 4,
  BottomEdge = 8,
}

const enum MaximizeMode {
  MaximizeRestore = 0,
  MaximizeVertical = 1,
  MaximizeHorizontal = 2,
  MaximizeFull = MaximizeVertical | MaximizeHorizontal,
}

