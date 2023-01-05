let maxbp = [];
let minNumOfEmpty = Infinity;
let mostEfficientPer = null;
let bins = [];
function uniqueId() {
  return parseInt(
    Math.ceil(Math.random() * Date.now())
      .toPrecision(16)
      .toString()
      .replace(".", "")
  );
}

function binsNoSet(arr, iterations, squares) {}

// function printBin(arr, iterations, squares) {
//   const numofempty = checkPermutation(arr.concat(squares));
//   if (numofempty < minNumOfEmpty) {
//     minNumOfEmpty = numofempty;
//     mostEfficientPer = arr.concat(squares);
//   }

//   if (iterations == arr.length) {
//     return;
//   } else {
//     const temp = JSON.parse(JSON.stringify(arr));
//     temp[iterations].reverse();
//     printBin(arr, iterations + 1, squares);
//     printBin(temp, iterations + 1, squares);
//   }
// }

let canvas = document.getElementsByTagName("canvas")[0];

let ctx = canvas.getContext("2d");

function clearBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.height = 0;
  canvas.width = 0;
}

class GridRectangle {
  constructor(
    topLeft,
    topRight,
    bottomLeft,
    bottomRight,
    width,
    height,
    isEmpty
  ) {
    this.topLeft = topLeft;
    this.topRight = topRight;
    this.bottomLeft = bottomLeft;
    this.bottomRight = bottomRight;
    this.width = width;
    this.height = height;
    this.isEmpty = isEmpty;
    this.area = width * height;
    this.id = uniqueId();
  }

  setTopLeft(topLeft) {
    this.topLeft = topLeft;
  }

  setTopRight(topRight) {
    this.topRight = topRight;
  }
  setBottomLeft(bottomLeft) {
    this.bottomLeft = bottomLeft;
  }
  setBottomRight(bottomRight) {
    this.bottomRight = bottomRight;
  }
  setWidth(width) {
    this.width = width;
  }

  setHeight(height) {
    this.height = height;
  }

  setIsEmpty(isEmpty) {
    this.isEmpty = isEmpty;
  }
  setArea(area) {
    this.area = area;
  }

  allvalues() {
    return (
      "area: " +
      this.area +
      " " +
      " height, width: " +
      this.height +
      ", " +
      this.width +
      " topleft, topright, bottomleft, bottomright: " +
      this.topLeft +
      ", " +
      this.topRight +
      ", " +
      this.bottomLeft +
      ", " +
      this.bottomRight
    );
  }

  draw() {
    canvas = document.getElementsByTagName("canvas")[0];
    ctx = canvas.getContext("2d");
    // random colors for the filled rectangles
    let green = Math.floor(Math.random() * 200);
    let red = Math.floor(Math.random() * 200);
    let blue = Math.floor(Math.random() * 200);

    // if it is an empty space, make it red.
    if (this.isEmpty) {
      red = 200;
      blue = 0;
      green = 0;
    }

    ctx.fillStyle = "rgb(" + red + ", " + green + ", " + blue + ")";

    ctx.fillRect(
      this.topLeft[constants.x],
      this.topLeft[constants.y],
      this.width * constants.sizeOfPixelWidth,
      this.height * constants.sizeOfPixelHeight
    );
    ctx.font = "10px Arial";
    ctx.fillStyle = "black";
    ctx.strokeText(
      this.width + "x" + this.height,
      this.topLeft[constants.x],
      this.topLeft[constants.y]
    );
  }

  clearSelf() {
    ctx.clearRect(
      this.topLeft[constants.x],
      this.topLeft[constants.y],
      this.topRight[constants.x],
      this.bottomLeft[constants.y]
    );
  }

  recalcArea() {
    this.area = this.width * this.height;
  }
}

const constants = {
  directions: {
    HORIZONTAL_DIRECTION: 0,
    VERTICAL_DIRECTION: 1,
  },
  x: 0,
  y: 1,
};

function main(
  rectangles,
  canvas,
  bigpiece,
  sizeOfPixelWidth,
  sizeOfPixelHeight
) {
  constants.sizeOfPixelHeight = sizeOfPixelHeight;
  constants.sizeOfPixelWidth = sizeOfPixelWidth;

  let empty_spaces = [];

  let finishedarr = [];

  function isEqual(a, b) {
    return a.id === b.id;
  }

  function addNewEmptySpaces(space, maxAreaRect) {
    let newEmpty = [];
    let empty1 = undefined;
    let empty2 = undefined;

    // if its a horizontal rectangle, or a square (because for a square the direction doesn't matter YET)
    if (maxAreaRect.width >= maxAreaRect.height) {
      // take the empty space to the right, if width and height are more than 0 (there is a shape of some sort)
      // this is the NEW empty space, but there is some leftover of our original empty space.

      const height1 = maxAreaRect.height;
      const width1 = space.width - maxAreaRect.width;

      if (height1 > 0 && width1 > 0) {
        empty1 = new GridRectangle(
          maxAreaRect.topRight,
          space.topRight,
          maxAreaRect.bottomRight,
          [space.topRight[constants.x], maxAreaRect.bottomRight[constants.y]],
          width1,
          height1,
          true
        );
        newEmpty = [...newEmpty, empty1];
      }

      // big one
      const height2 = space.height - maxAreaRect.height;
      const width2 = space.width;

      if (height2 > 0 && width2 > 0) {
        empty2 = new GridRectangle(
          maxAreaRect.bottomLeft,
          [space.topRight[constants.x], maxAreaRect.bottomRight[constants.y]],
          space.bottomLeft,
          space.bottomRight,
          width2,
          height2,
          true
        );
        newEmpty = [...newEmpty, empty2];
      }
    }
    // if its a vertical rectangle
    else if (maxAreaRect.width < maxAreaRect.height) {
      const height1 = space.height - maxAreaRect.height;
      const width1 = maxAreaRect.width;

      if (height1 > 0 && width1 > 0) {
        empty1 = new GridRectangle(
          maxAreaRect.bottomLeft,
          maxAreaRect.bottomRight,
          space.bottomLeft,
          [maxAreaRect.bottomRight[constants.x], space.bottomLeft[constants.y]],
          width1,
          height1,
          true
        );

        newEmpty = [...newEmpty, empty1];
      }

      const height2 = space.height;
      const width2 = space.width - maxAreaRect.width;

      if (height2 > 0 && width2 > 0) {
        empty2 = new GridRectangle(
          maxAreaRect.topRight,
          space.topRight,
          [maxAreaRect.bottomRight[constants.x], space.bottomLeft[constants.y]],
          space.bottomRight,
          width2,
          height2,
          true
        );
        newEmpty = [...newEmpty, empty2];
      }
    }

    return newEmpty.length > 0 ? newEmpty : false;
  }

  function removeEmptySpace(viableEmptySpace) {
    return empty_spaces.filter(
      (x) =>
        x.topLeft[constants.x] !== viableEmptySpace.topLeft[constants.x] &&
        x.topLeft[constants.y] !== viableEmptySpace.topLeft[constants.y]
    );
  }

  function placeIntoEmpty(maxAreaRect, viableEmptySpace, isBp) {
    // same topleft since we're always placing topleft
    maxAreaRect.setTopLeft(viableEmptySpace.topLeft);

    // same y as topleft, since it fits the x value is just the width in pixels
    maxAreaRect.setTopRight([
      maxAreaRect.width * constants.sizeOfPixelWidth +
        viableEmptySpace.topLeft[constants.x],
      viableEmptySpace.topLeft[constants.y],
    ]);

    // same x as topleft, since its on the left and its down by the height
    maxAreaRect.setBottomLeft([
      viableEmptySpace.topLeft[constants.x],
      constants.sizeOfPixelHeight * maxAreaRect.height +
        viableEmptySpace.topLeft[constants.y],
    ]);

    // the height and width have to be calculated since it doesn't have anything in common with topleft.
    maxAreaRect.setBottomRight([
      maxAreaRect.width * constants.sizeOfPixelWidth +
        viableEmptySpace.topLeft[constants.x],
      maxAreaRect.height * constants.sizeOfPixelHeight +
        viableEmptySpace.topLeft[constants.y],
    ]);

    // remove the current empty space as it was filled and new empty spaces may have been created

    empty_spaces = removeEmptySpace(viableEmptySpace);

    // clear the empty space (color)

    // add new empty spaces which were created.

    const x = addNewEmptySpaces(viableEmptySpace, maxAreaRect);

    // if there is a newly created empty space.
    if (x !== false) {
      empty_spaces = [...x, ...empty_spaces];
    }

    // update the big piece (for horizontal and vertical case)

    if (isBp) {
      if (maxAreaRect.width >= maxAreaRect.height) {
        // new height (width doesn't change)
        bigpiece.height = bigpiece.height - maxAreaRect.height;
        // new bigpiece area
        bigpiece.recalcArea();

        // move it down
        bigpiece.topLeft = maxAreaRect.bottomLeft;
        // logic i can't explain. only draw
        bigpiece.topRight = [
          bigpiece.topRight[constants.x],
          maxAreaRect.bottomRight[constants.y],
        ];
      } else {
        bigpiece.width = bigpiece.width - maxAreaRect.width;
        bigpiece.recalcArea();

        bigpiece.topLeft = maxAreaRect.topRight;
        bigpiece.bottomLeft = [
          maxAreaRect.topRight[constants.x],
          bigpiece.bottomLeft[constants.y],
        ];
      }
    }

    maxAreaRect.draw();
  }

  function isTooSmall(emptyspace, rect) {
    if (rect.width > emptyspace.width || rect.height > emptyspace.height) {
      return false;
    }
    return true;
  }

  function findViableEmptySpace(rect) {
    const newarr = [];
    for (let i = 0; i < empty_spaces.length; i++) {
      const element = empty_spaces[i];
      if (isTooSmall(element, rect)) {
        newarr.push(element);
      }
    }

    let minel = null;
    let minarea = Infinity;
    for (let i = 0; i < newarr.length; i++) {
      const element = newarr[i];
      if (element.area < minarea) {
        minarea = element.area;
        minel = element;
      }
    }

    return minel;
  }

  function findMaxArea(rectangles) {
    // turns rectangle objects into area number array
    const arr = rectangles.map((x) => x.area);

    // finds max area
    let maxrect;
    const maxarea = Math.max(...arr);
    for (let i = 0; i < rectangles.length; i++) {
      if (maxarea == rectangles[i].area) maxrect = rectangles[i];
    }

    return maxrect;
  }

  function run() {
    while (rectangles.length > 0) {
      const maxAreaRect = findMaxArea(rectangles);
      const viableEmptySpace = findViableEmptySpace(maxAreaRect);
      // if there is nowhere the max area rectangle can fit
      if (viableEmptySpace == null) {
        // place it top left in two different directions.

        placeIntoEmpty(maxAreaRect, bigpiece, true);
      } else {
        placeIntoEmpty(maxAreaRect, viableEmptySpace, false);
      }

      // find the maxarearect and remove it since it has been placed
      for (let i = 0; i < rectangles.length; i++) {
        const element = rectangles[i];
        if (isEqual(element, maxAreaRect)) {
          const x = rectangles.splice(i, 1);
          finishedarr = [...finishedarr, x];
        }
      }
    }
  }
  run();
  return empty_spaces.length;
}

function createRectanglesFromInput(array) {
  let finalarr = [];
  for (let i = 0; i < array.length; i++) {
    const element = new GridRectangle(
      [-1, -1],
      [-1, -1],
      [-1, -1],
      [-1, -1],
      parseInt(array[i][0]),
      parseInt(array[i][1]),
      false
    );
    finalarr = [...finalarr, element];
  }
  return finalarr;
}

function checkPermutation(rectangles) {
  let bigpiece = createRectanglesFromInput([
    [rectangles[0][0], rectangles[0][1]],
  ])[0];

  const temp = JSON.parse(JSON.stringify(rectangles));
  temp.splice(0, 1);
  rectangles = createRectanglesFromInput(temp);

  // create the canvas by calculating width, height
  if (screen.width / bigpiece.width > screen.height / bigpiece.height) {
    canvas.width = (screen.height / bigpiece.height) * bigpiece.width;
    canvas.height = screen.height;
  } else {
    canvas.height = (screen.width / bigpiece.width) * bigpiece.height;
    canvas.width = screen.width;
  }
  const sizeOfPixelHeight = canvas.height / bigpiece.height;
  const sizeOfPixelWidth = canvas.width / bigpiece.width;
  bigpiece.topLeft = [0, 0];
  bigpiece.topRight = [sizeOfPixelWidth * bigpiece.width, 0];
  bigpiece.bottomLeft = [0, sizeOfPixelHeight * bigpiece.height];
  bigpiece.bottomRight = [
    sizeOfPixelWidth * bigpiece.width,
    sizeOfPixelHeight * bigpiece.height,
  ];
  return main(
    rectangles,
    canvas,
    bigpiece,
    sizeOfPixelHeight,
    sizeOfPixelHeight
  );
}

$(document).ready(function () {
  var max_fields = 10;
  var wrapper = $(".container1");
  var add_button = $(".add_form_field");

  var x = 1;
  $(add_button).click(function (e) {
    e.preventDefault();
    if (x < max_fields) {
      x++;
      $(wrapper).append(
        `<div>
        <label for="width">Width</label>
        <input id="width" class="width" type="number" name="mytext[]"/>
        <label for="height">Height</label>
        <input id="height "class="height"  type="number" name="mytext[]"/>
        <label for="quantity">Quantity</label>
        <input id="quantity" class="quantity"  type="number" name="mytext[]"/>
        <a href="#" class="delete">Delete</a></div>`
      ); //add input box
    } else {
      alert("You Reached the limits");
    }
  });

  $(wrapper).on("click", ".delete", function (e) {
    e.preventDefault();
    $(this).parent("div").remove();
    x--;
  });
  $(wrapper).on("click", ".submitbtn", function (e) {
    e.preventDefault();
    $(wrapper).on("click", ".clearbtn", function (e) {
      e.preventDefault();
      clearBoard();
    });

    // extract all the inputted data
    const widths = document.getElementsByClassName("width");
    const heights = document.getElementsByClassName("height");
    const quantities = document.getElementsByClassName("quantity");

    // shuffle the widths and heights ....

    // all possible permutations with shuffling of all arrays including the stock.
    const values = [];
    const squares = [];
    for (let i = 0; i < widths.length; i++) {
      const w = parseInt(widths[i].value);
      const h = parseInt(heights[i].value);

      if (w === h) {
        if (i !== 0) {
          for (let j = 0; j < quantities[i - 1].value; j++) {
            squares.push([w, h]);
          }
        } else {
          values.push([w, h]);
        }
      } else {
        if (i !== 0) {
          for (let j = 0; j < quantities[i - 1].value; j++) {
            values.push([w, h]);
          }
        } else {
          values.push([w, h]);
        }
      }
    }
    printBin(values, 1, squares);
    clearBoard();
    checkPermutation(mostEfficientPer);
  });
});
