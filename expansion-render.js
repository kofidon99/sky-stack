export function renderExpansion(c,s){
 const rect=(x,y,w,h,col,r=0)=>{c.fillStyle=col;c.beginPath();r?c.roundRect(x,y,w,h,r):c.rect(x,y,w,h);c.fill();},circle=(x,y,r,col)=>{c.fillStyle=col;c.beginPath();c.arc(x,y,r,0,7);c.fill();},text=(v,x,y,z=16,col='#f6f1df')=>{c.fillStyle=col;c.font=`700 ${z}px Arial`;c.textAlign='center';c.fillText(v,x,y);},line=(x,y,X,Y,col='#fff',w=2)=>{c.strokeStyle=col;c.lineWidth=w;c.beginPath();c.moveTo(x,y);c.lineTo(X,Y);c.stroke();};
 c.fillStyle='#142630';c.fillRect(0,0,400,600);const accent='#dff66a';text(s.id.toUpperCase().replaceAll('_',' '),200,42,14,accent);
 if(['brick','pong','goalie','airhockey'].includes(s.id)){
  rect(25,65,350,500,s.id==='goalie'?'#396b53':s.id==='airhockey'?'#dce8e1':'#223842',18);line(25,300,375,300,'#ffffff55');
  if(s.id==='brick')for(const b of s.bricks)if(b.on)rect(b.x-23,b.y-10,46,20,['#e99b83','#eacb78','#9bc9bd'][Math.floor((b.y-90)/26)%3],5);
  if(s.id==='goalie'){line(45,430,355,430,'#fff',5);for(let x=45;x<356;x+=25)line(x,430,x,560,'#ffffff44',1);rect(s.x-52,490,104,18,'#dff66a',8);}
  if(s.id==='pong'){rect((s.ai||200)-45,82,90,13,'#eea482',7);rect(s.x-50,510,100,13,accent,7);text(`${s.round}  :  ${s.enemy}`,200,330,32);}
  if(s.id==='airhockey'){circle(s.ai||200,130,30,'#ef9d88');circle(s.x,470,32,accent);rect(140,65,120,10,'#142630');rect(140,555,120,10,'#142630');text(`${s.round}  :  ${s.enemy}`,200,330,26,'#627b79');}
  if(s.id==='brick')rect(s.x-52,520,104,15,accent,7);if(s.ball)circle(s.ball.x,s.ball.y,s.id==='airhockey'?13:9,'#fff2d3');
 }
 if(['frog','river'].includes(s.id)){
  rect(25,85,350,450,s.id==='frog'?'#456754':'#346b73',16);for(let r=0;r<5;r++){const y=130+r*75;rect(25,y,350,62,s.id==='frog'?'#34484b':'#438596');const row=s.rows[r],p=Math.round(row.offset)%5,x=60+p*70;if(s.id==='frog')rect(x-27,y+16,54,28,'#e8a080',7);else circle(x,y+31,23,'#d9c799');}for(let x=0;x<5;x++)circle(60+x*70,510,17,'#8cbd83');circle(60+s.player.x*70,105+s.player.y*75,17,accent);text(`${s.round} / 5 crossings`,200,570,14);}
 if(['lanes','defender'].includes(s.id)){
  rect(25,70,350,500,s.id==='defender'?'#252948':'#3c4547',14);for(const x of [140,260])for(let y=80;y<560;y+=45)rect(x,y,4,24,'#ffffff55');for(const o of s.objects){const x=80+o.lane*120;rect(x-20,o.y-20,40,40,s.id==='defender'?'#d58cbd':'#e6a184',8);}const px=s.id==='lanes'?80+s.lane*120:s.x;rect(px-22,485,44,58,accent,12);if(s.id==='defender')for(let y=440;y>60;y-=55)rect(px-2,y,4,15,'#b4f6ff');text(s.id==='lanes'?`${Math.max(0,Math.ceil(60-s.t))} seconds`:`${s.score} / 500`,200,585,13);}
 if(['whack','targets'].includes(s.id)){rect(25,80,350,470,'#29433c',18);if(s.targetObj){for(let r=s.targetObj.r*1.7;r>4;r-=8)circle(s.targetObj.x,s.targetObj.y,r,r%16?'#f3dfc5':'#e99c83');if(s.id==='whack'){circle(s.targetObj.x,s.targetObj.y,s.targetObj.r,'#a9795d');circle(s.targetObj.x-8,s.targetObj.y-4,3,'#172b2c');circle(s.targetObj.x+8,s.targetObj.y-4,3,'#172b2c');}}text(s.id==='targets'?`${s.round} / 10 shots`:`${s.lives} misses left`,200,580,14);}
 if(s.id==='bubbles'){for(const o of s.objects){circle(o.x,o.y,o.r,o.gold?'#f1d56e':'#dc91b7');circle(o.x-o.r*.3,o.y-o.r*.3,o.r*.25,'#ffffff99');}text(`${Math.max(0,Math.ceil(45-s.t))} seconds`,200,575,14);}
 if(s.id==='rhythm'){circle(200,300,130,'#263b45');circle(200,300,110*s.pulse+25,'#b197db55');c.strokeStyle=accent;c.lineWidth=8;c.beginPath();c.arc(200,300,55,0,7);c.stroke();circle(200,300,32,'#dff66a');text(`${s.round} / 30`,200,500,20);text('TAP ON THE RING',200,545,12,'#aabfc2');}
 if(['memory','connect4','tictac','merge','mines'].includes(s.id)){
  const cfg=s.id==='connect4'?[7,6,50,25,125]:s.id==='tictac'?[3,3,110,35,145]:s.id==='mines'?[8,8,43.75,25,115]:[4,4,82.5,35,125], [cols,rows,size,left,top]=cfg;
  for(let r=0;r<rows;r++)for(let q=0;q<cols;q++){const i=r*cols+q,x=left+q*size,y=top+r*size,v=s.board[i];rect(x+2,y+2,size-4,size-4,(r+q)%2?'#375450':'#41605a',7);
   if(s.id==='memory'&&(v.open||v.done)){circle(x+size/2,y+size/2,size*.28,['#e9a384','#e6cf79','#9cc8be','#b7a0df'][v.v%4]);text(v.v+1,x+size/2,y+size*.62,17,'#243739');}
   if(s.id==='connect4'&&v)circle(x+size/2,y+size/2,size*.36,v===1?accent:'#ed9a84');
   if(s.id==='tictac'&&v)text(v===1?'X':'O',x+size/2,y+size*.72,60,v===1?accent:'#ed9a84');
   if(s.id==='merge'&&v){rect(x+6,y+6,size-12,size-12,['#d6bd91','#e5a889','#cf8b78','#a898d3'][Math.min(3,Math.log2(v)-1)],8);text(v,x+size/2,y+size*.6,v>999?18:24,'#203336');}
   if(s.id==='mines'){if(v.open){rect(x+2,y+2,size-4,size-4,v.mine?'#e58d82':'#c6d1c4',5);if(v.mine)text('✹',x+size/2,y+size*.68,25,'#233638');else if(v.n)text(v.n,x+size/2,y+size*.67,18,'#34545b');}else if(v.flag)text('⚑',x+size/2,y+size*.69,22,accent);}
  }if(s.id==='mines')text(s.mode?'FLAG MODE ON':'REVEAL MODE',200,500,14,s.mode?accent:'#aac0be');
 }
 if(s.id==='maze'){const size=38,ox=29,oy=120;for(let i=0;i<81;i++){const r=Math.floor(i/9),q=i%9,x=ox+q*size,y=oy+r*size,w=s.maze[i];rect(x,y,size,size,(r+q)%2?'#263e39':'#29443d');if(w&1)line(x,y,x+size,y,'#c6d9ab',3);if(w&2)line(x+size,y,x+size,y+size,'#c6d9ab',3);if(w&4)line(x,y+size,x+size,y+size,'#c6d9ab',3);if(w&8)line(x,y,x,y+size,'#c6d9ab',3);}circle(ox+(s.cell%9)*size+19,oy+Math.floor(s.cell/9)*size+19,10,accent);circle(ox+8*size+19,oy+8*size+19,12,'#efb26f');text(`${s.round} / 3 mazes`,200,520,14);}
 if(s.id==='stack'){for(const [i,b] of s.blocks.entries())rect(b.x,b.y-(s.blocks.length-1-i)*30,b.w,26,['#e89c83','#e5c878','#94c5b8'][i%3],4);rect(s.mover.x,s.mover.y,s.mover.w,26,accent,4);text(`${s.round} blocks`,200,565,16);}
 if(s.id==='simon'){const cols=['#de786f','#d6bd63','#6ab59b','#6d86c9'];for(let i=0;i<4;i++){const x=i%2?205:45,y=i>1?310:150;rect(x,y,150,150,s.lit===i?accent:cols[i],18);}text(s.phase==='show'?'WATCH':'REPEAT',200,520,18,accent);text(`${s.sequence.length} signals`,200,555,13);}
 if(s.id==='crowd'){
  rect(0,65,400,535,'#3d8390');for(let y=80;y<590;y+=34){line(0,y,400,y+12,'#a9dce033',2);}
  rect(48,65,304,535,'#686d72');rect(55,65,6,535,'#f2e1bf');rect(339,65,6,535,'#f2e1bf');for(let y=75;y<600;y+=50){line(63,y,337,y,'#ffffff18',2);}
  for(const o of s.objects){if(o.type==='gates'){for(const [side,g] of [[0,o.left],[1,o.right]]){const x=side?205:65;rect(x,o.y,130,58,side?'#63a9dd':'#70c397',8);text(`${g.op}${g.n}`,x+65,o.y+39,28,'#fff');}}else if(o.type==='rivals'){text(o.n,200,o.y-12,16,'#ffe2d2');for(let i=0;i<Math.min(o.n,24);i++){const col=i%6,row=Math.floor(i/6);circle(155+col*18,o.y+row*18,7,'#e28a78');}}else{circle(200,o.y+25,45,'#342e48');circle(184,o.y+10,7,'#f0a077');circle(216,o.y+10,7,'#f0a077');text(`TITAN ${o.n}`,200,o.y+90,16,'#fff0d8');}}
  const shown=Math.min(s.count,36);for(let i=0;i<shown;i++){const cols=Math.min(6,Math.ceil(Math.sqrt(shown))),row=Math.floor(i/cols),col=i%cols,x=s.x+(col-(cols-1)/2)*17,y=505-row*17;circle(x,y,7,i%3===0?'#dff66a':i%3===1?'#f4b36e':'#88d0c0');circle(x,y-7,3,'#f4d2b7');}
  text(`${s.count}`,s.x,548,20,'#fff');const progress=Math.min(1,s.distance/s.finish);rect(75,572,250,9,'#23373b',5);rect(75,572,250*progress,9,accent,5);text('TITAN',340,581,9,'#eac2ae');
 }
}
