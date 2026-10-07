import {mkdir,copyFile} from 'node:fs/promises';
await mkdir('site/vendor',{recursive:true});
await Promise.all(["app.js","catalog.js","engine.js","platform.js","render.js","style.css","tabletop.js","tabletop-render.js","expansion.js","expansion-render.js","expansion-catalog.js","vendor/chess.js","vendor/chess-LICENSE.txt","index.html",".nojekyll"].map(f=>copyFile(f,'site/'+f)));
