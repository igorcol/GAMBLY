
export const STRATEGY_DATA = {
  headers: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "A"],
  rows: [
    { hand: "17+", moves: ["P", "P", "P", "P", "P", "P", "P", "P", "P", "P"] },
    { hand: "16", moves: ["P", "P", "P", "P", "P", "PC", "PC", "PC", "PC", "PC"] },
    { hand: "15", moves: ["P", "P", "P", "P", "P", "PC", "PC", "PC", "PC", "PC"] },
    { hand: "14", moves: ["P", "P", "P", "P", "P", "PC", "PC", "PC", "PC", "PC"] },
    { hand: "13", moves: ["P", "P", "P", "P", "P", "PC", "PC", "PC", "PC", "PC"] },
    { hand: "12", moves: ["PC", "PC", "P", "P", "P", "PC", "PC", "PC", "PC", "PC"] },
    { hand: "11", moves: ["D", "D", "D", "D", "D", "D", "D", "D", "D", "PC"] },
    { hand: "10", moves: ["D", "D", "D", "D", "D", "D", "D", "D", "PC", "PC"] },
    { hand: "9", moves: ["PC", "D", "D", "D", "D", "PC", "PC", "PC", "PC", "PC"] },
    { hand: "5-8", moves: ["PC", "PC", "PC", "PC", "PC", "PC", "PC", "PC", "PC", "PC"] },
    { hand: "A,8-10", moves: ["P", "P", "P", "P", "P", "P", "P", "P", "P", "P"] },
    { hand: "A,7", moves: ["P", "D", "D", "D", "D", "P", "P", "PC", "PC", "PC"] },
    { hand: "A,6", moves: ["PC", "D", "D", "D", "D", "PC", "PC", "PC", "PC", "PC"] },
    { hand: "A,5", moves: ["PC", "PC", "D", "D", "D", "PC", "PC", "PC", "PC", "PC"] },
    { hand: "A,4", moves: ["PC", "PC", "D", "D", "D", "PC", "PC", "PC", "PC", "PC"] },
    { hand: "A,3", moves: ["PC", "PC", "PC", "D", "D", "PC", "PC", "PC", "PC", "PC"] },
    { hand: "A,2", moves: ["PC", "PC", "PC", "D", "D", "PC", "PC", "PC", "PC", "PC"] },
    { hand: "A,A / 8,8", moves: ["R", "R", "R", "R", "R", "R", "R", "R", "R", "R"] },
    { hand: "10,10", moves: ["P", "P", "P", "P", "P", "P", "P", "P", "P", "P"] },
    { hand: "9,9", moves: ["R", "R", "R", "R", "R", "P", "R", "R", "P", "P"] },
    { hand: "7,7", moves: ["R", "R", "R", "R", "R", "R", "PC", "PC", "PC", "PC"] },
    { hand: "6,6", moves: ["R", "R", "R", "R", "R", "PC", "PC", "PC", "PC", "PC"] },
    { hand: "5,5", moves: ["D", "D", "D", "D", "D", "D", "D", "D", "PC", "PC"] },
    { hand: "4,4", moves: ["PC", "PC", "PC", "R", "R", "PC", "PC", "PC", "PC", "PC"] },
    { hand: "3,3", moves: ["R", "R", "R", "R", "R", "R", "PC", "PC", "PC", "PC"] },
    { hand: "2,2", moves: ["R", "R", "R", "R", "R", "R", "PC", "PC", "PC", "PC"] }
  ]
};

export const MOVE_LABELS: Record<string, string> = {
  P: "Stand",
  PC: "Hit",
  D: "Double",
  R: "Split"
};

export const MOVE_COLORS: Record<string, string> = {
  P: "bg-red-500/20 text-red-200 border-red-500/30",
  PC: "bg-green-500/20 text-green-200 border-green-500/30",
  D: "bg-yellow-500/20 text-yellow-200 border-yellow-500/30",
  R: "bg-blue-500/20 text-blue-200 border-blue-500/30",
};