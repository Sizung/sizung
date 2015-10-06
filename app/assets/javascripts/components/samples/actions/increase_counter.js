const INCREASE_COUNTER = 'INCREASE_COUNTER';

window.increaseCounter = function increaseCounter(steps) {
  console.log('increase counter');
  return {
    type: INCREASE_COUNTER,
    steps: steps
  }
};