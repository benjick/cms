var bs = require("browser-sync").create();
var cp = require('child_process');

bs.watch("*.html").on("change", bs.reload);

bs.watch("src/*.js", function (event, file) {
  if (event === "change") {
    const res = cp.spawnSync('npm', ['run', 'build']);
    if (res.status === 0) {
      console.log('Recompiled JS');
      bs.reload();
    }
  }
});

bs.init({
    server: "./"
});
