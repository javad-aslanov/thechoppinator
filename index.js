let maxbp = [];
let minNumOfEmpty = Infinity;
let mostEfficientPer = null;
let bins = [];

const roundToHundredth = (value) => {
  return Number(value.toFixed(2));
};

function uniqueId() {
  return parseInt(
    Math.ceil(Math.random() * Date.now())
      .toPrecision(16)
      .toString()
      .replace(".", "")
  );
}

function getNPermutations(repeatedArr) {
  const arr = [];
  const permutations = [];
  for (let index = 0; index < repeatedArr.length; index++) {
    const el = repeatedArr[index];
    const quantity = el.quantity;
    const value = el.value;
    for (let j = 0; j < quantity; j++) {
      arr.push(value);
    }
  }
  permutations.push(arr);
  for (let i = 0; i < arr.length; i++) {
    arr[i].reverse();
    permutations.push(arr);
  }
  return permutations;
}

function calculateBestPermutation(
  distinctArr,
  squaresArr,
  repeatedArr,
  bigpiece
) {
  let constReps = getNPermutations(repeatedArr);
  bigpiece = [bigpiece];

  let permutationsOfDistincts = [];

  permutationsOfDistincts = printBin(distinctArr, 0, permutationsOfDistincts);

  // squares may and may not exist, it doesn't really matter since permutations don't change (squares don't flip)

  // if distinct permutations (of quantity 1) exist and repeated ones don't

  if (permutationsOfDistincts === undefined && constReps.length !== 0) {
    for (let i = 0; i < constReps.length; i++) {
      const permutation = bigpiece.concat(constReps[i]).concat(squaresArr);
      let permutationResult = checkPermutation(permutation);
      if (permutationResult < minNumOfEmpty) {
        minNumOfEmpty = permutationResult;
        mostEfficientPer = permutation;
      }
    }
  }

  // if distinct permutations don't exist and repeated ones do.

  if (permutationsOfDistincts === undefined && constReps.length > 0) {
    for (let i = 0; i < constReps.length; i++) {
      const permutation = bigpiece.concat(constReps[i]).concat(squaresArr);
      let permutationResult = checkPermutation(permutation);
      if (permutationResult < minNumOfEmpty) {
        minNumOfEmpty = permutationResult;
        mostEfficientPer = permutation;
      }
    }
  }

  // if both of them exist

  if (permutationsOfDistincts !== undefined && constReps.length !== 0) {
    for (let i = 0; i < constReps.length; i++) {
      for (let j = 0; j < permutationsOfDistincts.length; j++) {
        const permutation = bigpiece
          .concat(constReps[i])
          .concat(permutationsOfDistincts[j])
          .concat(squaresArr);
        let permutationResult = checkPermutation(permutation);
        if (permutationResult < minNumOfEmpty) {
          minNumOfEmpty = permutationResult;
          mostEfficientPer = permutation;
        }
      }
    }
  }
}

function printBin(arr, iterations, finalArr) {
  if (iterations == arr.length) return;
  else {
    const temp = JSON.parse(JSON.stringify(arr));
    temp[iterations].reverse();
    finalArr.push(arr);
    finalArr.push(temp);
    printBin(arr, iterations + 1);
    printBin(temp, iterations + 1);
  }
  return finalArr;
}

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
    this.topLeft = topLeft.map((x) => roundToHundredth(x));
  }

  setTopRight(topRight) {
    this.topRight = topRight.map((x) => roundToHundredth(x));
  }
  setBottomLeft(bottomLeft) {
    this.bottomLeft = bottomLeft.map((x) => roundToHundredth(x));
  }
  setBottomRight(bottomRight) {
    this.bottomRight = bottomRight.map((x) => roundToHundredth(x));
  }
  setWidth(width) {
    this.width = roundToHundredth(width);
  }

  setHeight(height) {
    this.height = roundToHundredth(height);
  }

  setIsEmpty(isEmpty) {
    this.isEmpty = isEmpty;
  }
  setArea(area) {
    this.area = roundToHundredth(area);
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

  let area = bigpiece.area;

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
        bigpiece.setHeight(bigpiece.height - maxAreaRect.height);
        // new bigpiece area
        bigpiece.recalcArea();

        // move it down
        bigpiece.setTopLeft(maxAreaRect.bottomLeft);
        // logic i can't explain. only draw
        bigpiece.setTopRight([
          bigpiece.topRight[constants.x],
          maxAreaRect.bottomRight[constants.y],
        ]);
      } else {
        bigpiece.setWidth(bigpiece.width - maxAreaRect.width);
        bigpiece.recalcArea();

        bigpiece.setTopLeft(maxAreaRect.topRight);
        bigpiece.setBottomLeft([
          maxAreaRect.topRight[constants.x],
          bigpiece.bottomLeft[constants.y],
        ]);
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
    const oldarr = [];
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
    if (minel === null) {
      console.log(rect.allvalues(), "rect");
      console.log("empty spaces");
      empty_spaces.forEach((x) => console.log(x.allvalues()));
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
    area = bigpiece.area;
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
      parseFloat(array[i][0]),
      parseFloat(array[i][1]),
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
        <label for="width" class="form-label">Width</label>
        <input id="width form-control" class="width form-control" type="number" name="mytext[]"/>
        <label for="height" class="form-label">Height</label>
        <input id="height "class="height form-control"  type="number" name="mytext[]"/>
        <label for="quantity" class="form-label">Quantity</label>
        <input id="quantity" class="quantity form-control"  type="number" name="mytext[]"/>
        <button class="delete btn btn-danger">Delete</button></div>`
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
    // extract all the inputted data
    let widths = document.getElementsByClassName("width");
    let heights = document.getElementsByClassName("height");
    let quantities = document.getElementsByClassName("quantity");

    e.preventDefault();
    $(wrapper).on("click", ".clearbtn", function (e) {
      e.preventDefault();
      location.reload();
    });

    // shuffle the widths and heights ....

    // all possible permutations with shuffling of all arrays excluding the stock.

    const distinctArr = [];
    const repeatedArr = [];
    const squares = [];
    let bigpiece = undefined;
    for (let i = 0; i < widths.length; i++) {
      const w = parseFloat(widths[i].value);
      const h = parseFloat(heights[i].value);
      if (w === h) {
        if (i !== 0) {
          const quantity = quantities[i - 1].value;
          for (let index = 0; index < parseInt(quantity); index++) {
            squares.push([w, h]);
          }
        } else {
          bigpiece = [w, h];
        }
      } else {
        if (i !== 0) {
          const quantity = quantities[i - 1].value;
          if (quantity > 1) {
            repeatedArr.push({ quantity: parseInt(quantity), value: [w, h] });
          } else {
            distinctArr.push([w, h]);
          }
        } else {
          bigpiece = [w, h];
        }
      }
    }
    calculateBestPermutation(distinctArr, squares, repeatedArr, bigpiece);
    clearBoard();
    checkPermutation(mostEfficientPer);
    bparea = bigpiece[0] * bigpiece[1];

    // most efficient per(mutation) area
    marea =
      mostEfficientPer.reduce(
        (accumulator, currentValue) =>
          accumulator + currentValue[0] * currentValue[1],
        0
      ) - bparea;

    document.getElementById(
      "boardyield"
    ).innerText = `Board Area: ${bparea}, Area used: ${marea}, Total Yield: ${
      (marea / bparea) * 100
    }%`;
  });
});
