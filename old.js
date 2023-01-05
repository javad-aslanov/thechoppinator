// function compute(empty_spaces, rectangles, big_piece) {
//   if (empty_spaces.length == 0) {
//     // horizontal case

//     // max area horizontally, index of the max area rectangle in the rectangles array in the horizontal case
//     const [maxarea_horizontal, index_horizontal] = max_area(rectangles);
//     const result_horizontal = place_top_left(maxarea_horizontal, big_piece, 0);

//     const empty_space_horizontal = result_horizontal[0];
//     const big_piece_horizontal = result_horizontal[1];

//     // delete the max area rectangle from the remaining rectangles as it was already processed

//     let newrectangles_horizontal = [...rectangles];
//     newrectangles_horizontal.splice(index_horizontal, 1);

//     compute(
//       empty_space_horizontal,
//       newrectangles_horizontal,
//       big_piece_horizontal
//     );

//     // vertical case

//     // max area vertically, index of the max area in the rectangles array in the vertical case
//     const [maxarea_vertical, index_vertical] = max_area(rectangles);
//     const result_vertical = place_top_left(maxarea_vertical, big_piece, 1);
//     const empty_space_vertical = result_vertical[0];
//     const big_piece_vertical = result_vertical[1];

//     // delete the max area rectangle from the remaining rectangles as it was already processed

//     let newrectangles_vertical = [...rectangles];

//     newrectangles_vertical.splice(index_vertical, 1);

//     compute(empty_space_vertical, newrectangles_vertical, big_piece_vertical);
//   } else {
//   }
// }

// function max_area(array) {
//   let max = [0, 0];
//   let index = 0;
//   for (let i = 0; i < array.length; i++) {
//     if (array[i][0] * array[i][1] > max[0] * max[1]) {
//       max = array[i];
//       index = i;
//     }
//   }

//   return [max, index];
// }

// function place_top_left(arr, big_piece, direction) {
//   let case1, case2;
//   // if it's a square, direction doesn't matter.
//   // but, the direction we take the empty space in does

//   if (arr[0] == arr[1]) {
//     // draw maxrect
//     ctx.fillStyle = "rgb(200,0,0)";
//     ctx.fillRect(0, 0, arr[0] * 50, arr[1] * 50);
//     if (direction == 0) {
//       return [
//         [big_piece[0] - arr[0], arr[1]],
//         [big_piece[0], big_piece[1] - arr[1]],
//       ];
//     } else {
//       return [
//         [arr[0], big_piece[1] - arr[1]],
//         [big_piece[0] - arr[0], big_piece[1]],
//       ];
//     }
//   }

//   if (direction == 0) {
//     // width first
//     if (arr[1] > arr[0]) {
//       arr = arr.reverse();
//     }
//     case1 = [
//       [big_piece[0] - arr[0], arr[1]],
//       [big_piece[0], big_piece[1] - arr[1]],
//     ];
//     // if no width or height, then no empty space
//     if (case1[0] == 0 || case1[1] == 0) {
//       return [
//         [0, 0],

//         [big_piece[0], big_piece[1] - arr[1]],
//       ];
//     }

//     // draw maxrect

//     return case1;
//   } else {
//     // height first
//     if (arr[0] > arr[1]) {
//       arr = arr.reverse();
//     }

//     case2 = [
//       [arr[0], big_piece[1] - arr[1]],
//       // space left, since height doesnt change (because the rest is waste) only width does
//       [big_piece[0] - arr[0], big_piece[1]],
//     ];

//     // if no width or height, then no empty space
//     if (case2[0] == 0 || case2[1] == 0) {
//       return [
//         [0, 0],
//         [big_piece[0] - arr[0], big_piece[1]],
//       ];
//     }

//     // draw maxrect

//     //draw empty spaces

//     return case2;
//   }
// }
// compute(
//   [],
//   [
//     [3, 8],
//     [1, 2],
//     [5, 5],
//     [7, 8],
//   ],
//   [10, 12]
// );
