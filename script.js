let array = [];
let delay = 100;

const barsContainer = document.getElementById('bars');
const arrayDisplay = document.getElementById('arrayValues');
const sizeSlider = document.getElementById('size');
const speedSlider = document.getElementById('speed');
const algoSelect = document.getElementById('algorithm');

document.getElementById('generate').addEventListener('click', generateArray);
document.getElementById('sort').addEventListener('click', startSort);
speedSlider.addEventListener('input', () => delay = speedSlider.value);

// 🧮 Update Array Text Below Bars
function updateArrayDisplay() {
  arrayDisplay.textContent = `[ ${array.join(', ')} ]`;
}

function generateArray() {
  barsContainer.innerHTML = '';
  array = [];
  for (let i = 0; i < sizeSlider.value; i++) {
    const value = Math.floor(Math.random() * 300) + 10;
    array.push(value);
    const bar = document.createElement('div');
    bar.classList.add('bar');
    bar.style.height = `${value}px`;
    barsContainer.appendChild(bar);
  }
  updateArrayDisplay();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 🫧 Bubble Sort
async function bubbleSort() {
  const bars = document.getElementsByClassName('bar');
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      bars[j].style.background = '#facc15';
      bars[j + 1].style.background = '#f87171';
      if (array[j] > array[j + 1]) {
        await swap(bars[j], bars[j + 1], j, j + 1);
      }
      await sleep(delay);
      bars[j].style.background = '#22d3ee';
      bars[j + 1].style.background = '#22d3ee';
    }
    bars[array.length - i - 1].style.background = '#4ade80';
  }
}

// 💠 Selection Sort
async function selectionSort() {
  const bars = document.getElementsByClassName('bar');
  for (let i = 0; i < array.length; i++) {
    let min = i;
    bars[i].style.background = '#a78bfa';
    for (let j = i + 1; j < array.length; j++) {
      bars[j].style.background = '#f87171';
      await sleep(delay);
      if (array[j] < array[min]) min = j;
      bars[j].style.background = '#22d3ee';
    }
    if (min !== i) await swap(bars[i], bars[min], i, min);
    bars[i].style.background = '#4ade80';
  }
}

// ✨ Insertion Sort
async function insertionSort() {
  const bars = document.getElementsByClassName('bar');
  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;
    bars[i].style.background = '#facc15';
    await sleep(delay);
    while (j >= 0 && array[j] > key) {
      bars[j + 1].style.height = bars[j].style.height;
      array[j + 1] = array[j];
      j--;
      await sleep(delay);
      updateArrayDisplay();
    }
    array[j + 1] = key;
    bars[j + 1].style.height = `${key}px`;
    bars[i].style.background = '#4ade80';
    updateArrayDisplay();
  }
}

// 🧩 Merge Sort
async function mergeSort(start = 0, end = array.length - 1) {
  if (start >= end) return;
  const mid = Math.floor((start + end) / 2);
  await mergeSort(start, mid);
  await mergeSort(mid + 1, end);
  await merge(start, mid, end);
}

async function merge(start, mid, end) {
  const bars = document.getElementsByClassName('bar');
  let temp = [];
  let i = start, j = mid + 1;
  while (i <= mid && j <= end) {
    bars[i].style.background = '#60a5fa';
    bars[j].style.background = '#60a5fa';
    await sleep(delay);
    if (array[i] < array[j]) temp.push(array[i++]);
    else temp.push(array[j++]);
  }
  while (i <= mid) temp.push(array[i++]);
  while (j <= end) temp.push(array[j++]);
  for (let k = start; k <= end; k++) {
    array[k] = temp[k - start];
    bars[k].style.height = `${array[k]}px`;
    bars[k].style.background = '#4ade80';
    await sleep(30);
  }
  updateArrayDisplay();
}

// ⚡ Quick Sort
async function quickSort(start = 0, end = array.length - 1) {
  if (start >= end) return;
  let index = await partition(start, end);
  await Promise.all([
    quickSort(start, index - 1),
    quickSort(index + 1, end)
  ]);
}

async function partition(start, end) {
  const bars = document.getElementsByClassName('bar');
  let pivot = array[end];
  bars[end].style.background = '#facc15';
  let i = start;
  for (let j = start; j < end; j++) {
    bars[j].style.background = '#f87171';
    await sleep(delay);
    if (array[j] < pivot) {
      await swap(bars[i], bars[j], i, j);
      i++;
    }
    bars[j].style.background = '#22d3ee';
  }
  await swap(bars[i], bars[end], i, end);
  bars[i].style.background = '#4ade80';
  return i;
}

// 🪄 Utility
async function swap(bar1, bar2, i, j) {
  let tempHeight = bar1.style.height;
  bar1.style.height = bar2.style.height;
  bar2.style.height = tempHeight;
  [array[i], array[j]] = [array[j], array[i]];
  updateArrayDisplay();
  await sleep(delay);
}

// 🎬 Start Sorting
async function startSort() {
  disableUI(true);
  const algo = algoSelect.value;
  if (algo === 'bubble') await bubbleSort();
  else if (algo === 'selection') await selectionSort();
  else if (algo === 'insertion') await insertionSort();
  else if (algo === 'merge') await mergeSort();
  else if (algo === 'quick') await quickSort();
  disableUI(false);
}

function disableUI(state) {
  document.getElementById('generate').disabled = state;
  document.getElementById('sort').disabled = state;
  sizeSlider.disabled = state;
  algoSelect.disabled = state;
}

generateArray();
