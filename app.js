import Jo from "./joRenderer.js";
window.Jo = Jo;
//todo fix multiple partials fetch

Jo.render({
  path: "casa",
  parent: document.getElementById("root"),
  locals: {"time": + new Date()}
}).then(()=>{
  Jo.render({
    path: "casa",
    parent: document.getElementById("root"),
    locals: {"time": + new Date()},
    method: "append"
  }).then(()=>{
  });
});