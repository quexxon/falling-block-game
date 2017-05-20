// Run function with document is ready
export function onReady(fn) {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

// Fisher-Yates shuffle
export function shuffle(a) {
  let len = a.length;

  return [...a.keys()].reduceRight((a, i) => {
    let rand = Math.floor(Math.random() * len);

    return (rand === i) ? a : swap(a, i, rand);
  }, a);
}

// immutably swap two values in an array
function swap(a, x, y) {
  let array = [...a];
  let tmp = array[x];

  array[x] = array[y];
  array[y] = tmp;

  return array;
}

// get median function execution time after n repetitions
function time(f, n = 100) {
  let times = [...Array(n).keys()].map(i => {
    let t0 = performance.now();
    f();
    let t1 = performance.now();

    return t1 - t0;
  });

  // return median time
  return times.sort()[Math.ceil(times.length / 2)];
}

// FPS Timer
class Timer {
  constructor() {
    this.elapsed = 0;
    this.last = null;
  }

  tick(now) {
    this.elapsed = (now - (this.last || now)) / 1000;
    this.last = now;
  }

  fps() {
    return 1 / this.elapsed;
  }
}

var timer = new Timer();

// Main Loop
(() => {
  function main (now) {
    requestAnimationFrame(main);
    timer.tick(now);
  }

  main();
})();
