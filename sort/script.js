const n = 30;
const array = [];
const container = document.getElementById("container"); // Define the container element

init();

function init() {
    for (let i = 0; i < n; i++) {
        array[i] = Math.random();
    }
    showBars();
}

function play(sortAlgorithm) {
    const copy = [...array];
    let moves;
    if (sortAlgorithm === "mergeSort") {
        const result = mergeSort(copy);
        moves = result.moves;
    } else if (sortAlgorithm === "quickSort") {
        moves = quickSort(copy);
    } else if (sortAlgorithm === "bubbleSort") {
        moves = bubbleSort(copy);
    } else if (sortAlgorithm === "selectionSort") {
        moves = selectionSort(copy);
    }
    animate(moves);
}

function animate(moves) {
    if (moves.length == 0) {
        showBars();
        return;
    }

    const move = moves.shift();
    const [i, j] = move.indices;

    if (move.type == "swap") {
        [array[i], array[j]] = [array[j], array[i]];
    }

    showBars(move);
    setTimeout(function () {
        animate(moves);
    }, 50);
}

function selectionSort(array) {
    const moves = [];
    const n = array.length;

    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < n; j++) {
            moves.push({ indices: [j, minIndex], type: "comp" });
            if (array[j] < array[minIndex]) {
                minIndex = j;
            }
        }
        if (minIndex !== i) {
            moves.push({ indices: [i, minIndex], type: "swap" });
            [array[i], array[minIndex]] = [array[minIndex], array[i]];
        }
    }

    return moves;
}

function bubbleSort(array) {
    const moves = [];
    do {
        var swapped = false;
        for (let i = 1; i < array.length; i++) {
            moves.push({ indices: [i - 1, i], type: "comp" });
            if (array[i - 1] > array[i]) {
                swapped = true;
                moves.push({ indices: [i - 1, i], type: "swap" });
                [array[i - 1], array[i]] = [array[i], array[i - 1]];
            }
        }
    } while (swapped);
    return moves;
}

function mergeSort(array) {
  const moves = [];

  if (array.length <= 1) {
      return { array, moves };
  }

  const middle = Math.floor(array.length / 2);
  const left = array.slice(0, middle);
  const right = array.slice(middle);

  const leftResult = mergeSort(left);
  const rightResult = mergeSort(right);

  const mergedArray = merge(leftResult.array, rightResult.array, moves);

  return { array: mergedArray, moves };

  function merge(left, right, moves) {
      const result = [];
      let i = 0;
      let j = 0;

      while (i < left.length && j < right.length) {
          moves.push({ indices: [i + left.length, j + middle], type: "comp" });
          if (left[i] <= right[j]) {
              result.push(left[i]);
              i++;
          } else {
              result.push(right[j]);
              j++;
          }
      }

      while (i < left.length) {
          result.push(left[i]);
          i++;
      }

      while (j < right.length) {
          result.push(right[j]);
          j++;
      }

      return result;
  }
}


function quickSort(array) {
    const moves = [];
    qsort(array, 0, array.length - 1, moves);
    return moves;

    function qsort(array, low, high, moves) {
        if (low < high) {
            const pivotInfo = partition(array, low, high, moves);
            const pivot = pivotInfo.pivot;
            qsort(array, low, pivot - 1, moves);
            qsort(array, pivot + 1, high, moves);
        }
    }

    function partition(array, low, high, moves) {
        const pivot = array[high];
        let i = low - 1;

        for (let j = low; j < high; j++) {
            moves.push({ indices: [i, j], type: "comp" });
            if (array[j] < pivot) {
                i++;
                moves.push({ indices: [i, j], type: "swap" });
                [array[i], array[j]] = [array[j], array[i]];
            }
        }

        moves.push({ indices: [i + 1, high], type: "swap" });
        [array[i + 1], array[high]] = [array[high], array[i + 1]];

        return { pivot: i + 1 };
    }
}

function showBars(move) {
    container.innerHTML = "";
    for (let i = 0; i < array.length; i++) {
        const bar = document.createElement("div");
        bar.style.height = array[i] * 100 + "%";
        bar.classList.add("bar");

        if (move && move.indices.includes(i)) {
            bar.style.backgroundColor = move.type == "swap" ? "red" : "blue";
        }
        container.appendChild(bar);
    }
}
