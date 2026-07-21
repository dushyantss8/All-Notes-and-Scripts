function demo(flag) {
  if (flag) {
    var x = 'var';
    let y = 'let';
  }
  console.log(x); // 'var'
  // console.log(y); // ReferenceError
}
demo(true);