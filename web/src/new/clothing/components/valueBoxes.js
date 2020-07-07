let nameBox = document.getElementById('nameBox');
let valueBox = document.getElementById('valueBox');
let obtainedBox = document.getElementById('obtainedBox');
let cataloggable = document.getElementById('cataloggable');

let boxArr = [nameBox, valueBox, obtainedBox];

for (let b = 0; b < boxArr.length; b++) { boxArr[b].addEventListener('keyup', function() { update() }) }
cataloggable.addEventListener('click', function() { update() })