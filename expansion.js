export const expansionIds=['brick','pong','goalie','airhockey','frog','lanes','defender','river','whack','bubbles','rhythm','targets','memory','connect4','tictac','merge','mines','maze','stack','simon','crowd'];
export const isExpansion=id=>expansionIds.includes(id);
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n)), hit=(a,b,r)=>Math.hypot(a.x-b.x,a.y-b.y)<r;
const win3=b=>[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]].find(l=>b[l[0]]&&b[l[0]]===b[l[1]]&&b[l[1]]===b[l[2]]);
const win4=b=>{for(let r=0;r<6;r++)for(let c=0;c<7;c++)for(const [dr,dc] of [[0,1],[1,0],[1,1],[1,-1]]){const v=b[r*7+c];if(v&&[1,2,3].every(k=>b[(r+dr*k)*7+c+dc*k]===v))return v;}return 0;};
function shuffled(n,rnd){const a=[...Array(n).keys()];for(let i=n-1;i;i--){const j=Math.floor(rnd()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export function createExpansion(id,rnd=Math.random){
 const s={id,t:0,score:0,lives:3,distance:0,done:false,won:false,message:'',flash:0,x:200,target:200,round:0,enemy:0,objects:[],cooldown:0,board:[],selected:[],mode:false,aiWait:0,phase:'play'};
 const end=(won,msg)=>{s.done=true;s.won=won;s.message=msg;};
 const spawnTarget=()=>{s.targetObj={x:55+rnd()*290,y:150+rnd()*330,r:20+rnd()*12,life:1.25};};
 const resetBall=()=>{s.ball={x:200,y:id==='airhockey'?300:420,vx:(rnd()-.5)*180,vy:id==='goalie'?220:-250};};
 if(['brick','pong','goalie','airhockey'].includes(id)){s.x=200;s.target=200;resetBall();if(id==='brick')s.bricks=Array.from({length:30},(_,i)=>({x:42+(i%6)*53,y:90+Math.floor(i/6)*26,on:true}));}
 if(['frog','river'].includes(id)){s.player={x:2,y:5};s.rows=Array.from({length:5},(_,r)=>({dir:r%2?1:-1,offset:rnd()*5,speed:.8+rnd()*.8}));}
 if(['lanes','defender'].includes(id)){s.lane=1;s.spawn=.2;}
 if(['whack','targets'].includes(id))spawnTarget();
 if(id==='bubbles')s.spawn=0;
 if(id==='rhythm'){s.beat=0;s.pulse=1;s.phase='wait';}
 if(id==='memory')s.board=shuffled(16,rnd).map(n=>({v:n%8,open:false,done:false}));
 if(id==='connect4')s.board=Array(42).fill(0);
 if(id==='tictac')s.board=Array(9).fill(0);
 if(id==='merge'){s.board=Array(16).fill(0);addTile();addTile();}
 if(id==='mines'){const mines=new Set(shuffled(64,rnd).slice(0,8));s.board=Array.from({length:64},(_,i)=>({mine:mines.has(i),open:false,flag:false,n:0}));for(let i=0;i<64;i++)s.board[i].n=neighbors(i,8).filter(j=>mines.has(j)).length;}
 if(id==='maze')makeMaze();
 if(id==='stack'){s.blocks=[{x:100,w:200,y:535}];s.mover={x:20,w:110,dir:1,y:505};}
 if(id==='simon'){s.sequence=[Math.floor(rnd()*4)];s.input=0;s.phase='show';s.clock=0;s.showIndex=0;s.lit=-1;}
 if(id==='crowd'){s.count=8;s.x=200;s.target=200;s.spawn=.45;s.nextEnemy=650;s.finish=3200;s.objects=[];}
 function neighbors(i,w){const r=Math.floor(i/w),c=i%w,a=[];for(let y=-1;y<=1;y++)for(let x=-1;x<=1;x++)if((x||y)&&r+y>=0&&c+x>=0&&r+y<w&&c+x<w)a.push((r+y)*w+c+x);return a;}
 function addTile(){const empty=s.board.flatMap((v,i)=>v?[]:[i]);if(empty.length)s.board[empty[Math.floor(rnd()*empty.length)]]=rnd()<.9?2:4;}
 function makeMaze(){const w=9;s.maze=Array(w*w).fill(15);const seen=new Set([0]),stack=[0];while(stack.length){const a=stack.at(-1),r=Math.floor(a/w),c=a%w,opts=[];if(r>0&&!seen.has(a-w))opts.push([a-w,1,4]);if(c<w-1&&!seen.has(a+1))opts.push([a+1,2,8]);if(r<w-1&&!seen.has(a+w))opts.push([a+w,4,1]);if(c>0&&!seen.has(a-1))opts.push([a-1,8,2]);if(!opts.length){stack.pop();continue;}const [b,wa,wb]=opts[Math.floor(rnd()*opts.length)];s.maze[a]&=~wa;s.maze[b]&=~wb;seen.add(b);stack.push(b);}s.cell=0;}
 function gridTap(x,y,cols,rows,top=120){const c=Math.floor((x-25)/(350/cols)),r=Math.floor((y-top)/(350/cols));return c>=0&&c<cols&&r>=0&&r<rows?r*cols+c:-1;}
 function cpuMove(){if(id==='tictac'){const empty=s.board.flatMap((v,i)=>v?[]:[i]);let choice=-1;for(const who of [-1,1]){for(const i of empty){s.board[i]=who;const wins=!!win3(s.board);s.board[i]=0;if(wins){choice=i;break;}}if(choice>=0)break;}if(choice<0&&empty.length)choice=empty[Math.floor(rnd()*empty.length)];if(choice>=0)s.board[choice]=-1;const w=win3(s.board);if(w)end(w===1,w===1?'Three in a row!':'Computer wins');else if(!s.board.includes(0))end(false,'Draw');}
  if(id==='connect4'){const cols=[...Array(7).keys()].filter(c=>!s.board[c]);const c=cols[Math.floor(rnd()*cols.length)];if(c!==undefined)drop(c,-1);}}
 function drop(c,who){for(let r=5;r>=0;r--)if(!s.board[r*7+c]){s.board[r*7+c]=who;break;}const w=win4(s.board);if(w)end(w===1,w===1?'Four forward!':'Computer connects four');else if(!s.board.includes(0))end(false,'Board filled · draw');}
 function move2048(dir){const before=s.board.join(','),lines=[];for(let k=0;k<4;k++){const ix=[];for(let n=0;n<4;n++)ix.push(dir==='left'?k*4+n:dir==='right'?k*4+3-n:dir==='up'?n*4+k:(3-n)*4+k);lines.push(ix);}for(const ix of lines){let a=ix.map(i=>s.board[i]).filter(Boolean);for(let i=0;i<a.length-1;i++)if(a[i]===a[i+1]){a[i]*=2;s.score+=a[i];a.splice(i+1,1);}while(a.length<4)a.push(0);ix.forEach((p,i)=>s.board[p]=a[i]);}if(before!==s.board.join(','))addTile();if(s.board.includes(2048))end(true,'2048 reached!');else if(!s.board.includes(0)&&['left','right','up','down'].every(d=>!can2048(d)))end(false,'No more moves');}
 function can2048(dir){const b=s.board.slice();for(let r=0;r<4;r++)for(let c=0;c<4;c++){const j=(r+(dir==='down'?1:dir==='up'?-1:0))*4+c+(dir==='right'?1:dir==='left'?-1:0);if(j>=0&&j<16&&(b[j]===0||b[j]===b[r*4+c]))return true;}return false;}
 function moveGrid(dir){const d={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[dir];if(!d)return;if(id==='merge'){move2048(dir);return;}if(id==='maze'){const bit={up:1,right:2,down:4,left:8}[dir];if(!(s.maze[s.cell]&bit)){s.cell+=d[1]*9+d[0];if(s.cell===80){s.round++;s.score+=250;if(s.round===3)end(true,'All mazes solved');else makeMaze();}}return;}if(['frog','river'].includes(id)){s.player.x=clamp(s.player.x+d[0],0,4);s.player.y=clamp(s.player.y+d[1],0,5);if(s.player.y===0){s.round++;s.score+=100;s.player={x:2,y:5};if(s.round===5)end(true,'Five crossings complete');}}}
 function tap(x,y){if(s.done)return;
  if(['whack','targets'].includes(id)){s.targetObj.life--;const landed=hit({x,y},s.targetObj,s.targetObj.r);if(landed){const d=Math.hypot(x-s.targetObj.x,y-s.targetObj.y);s.score+=id==='targets'?Math.max(10,100-Math.floor(d*3)):100;}if(id==='targets'){s.round++;if(s.round===10)end(true,'Ten shots complete');else spawnTarget();}else if(landed){s.round++;spawnTarget();}return;}
  if(id==='bubbles'){const o=s.objects.find(o=>!o.hit&&hit({x,y},o,o.r));if(o){o.hit=true;s.score+=o.gold?50:10;}return;}
  if(id==='rhythm'){const quality=Math.abs(s.pulse-.5);s.score+=quality<.08?100:quality<.18?50:10;s.round++;s.pulse=1;s.phase='wait';if(s.round===30)end(true,'Thirty beats complete');return;}
  if(id==='memory'){const i=gridTap(x,y,4,4,130);if(i<0||s.board[i].open||s.board[i].done||s.selected.length===2)return;s.board[i].open=true;s.selected.push(i);if(s.selected.length===2)s.cooldown=.65;return;}
  if(id==='tictac'){const i=gridTap(x,y,3,3,150);if(i>=0&&!s.board[i]){s.board[i]=1;if(win3(s.board))end(true,'Three in a row!');else{s.aiWait=.35;}}return;}
  if(id==='connect4'){const c=Math.floor((x-25)/50);if(c>=0&&c<7&&!s.board[c]){drop(c,1);if(!s.done)s.aiWait=.35;}return;}
  if(id==='mines'){const i=gridTap(x,y,8,8,120);if(i<0)return;const cell=s.board[i];if(s.mode){cell.flag=!cell.flag;return;}if(cell.flag)return;if(cell.mine){cell.open=true;end(false,'Mine found');return;}const open=i=>{const q=[i],seen=new Set();while(q.length){const j=q.pop();if(seen.has(j)||s.board[j].flag||s.board[j].mine)continue;seen.add(j);s.board[j].open=true;if(!s.board[j].n)q.push(...neighbors(j,8));}};open(i);s.score=s.board.filter(c=>c.open).length*10;if(s.board.filter(c=>!c.mine&&c.open).length===56)end(true,'Field cleared');return;}
  if(id==='stack'){dropStack();return;}if(id==='simon'&&s.phase==='input'){const col=x<200?0:1,row=y<330?0:1,i=row*2+col;s.lit=i;s.flash=.18;if(i!==s.sequence[s.input])end(false,'Signal lost');else if(++s.input===s.sequence.length){s.score+=s.sequence.length*20;s.sequence.push(Math.floor(rnd()*4));s.phase='show';s.clock=-.6;s.showIndex=0;}return;}
  if(id==='lanes'){s.lane=clamp(s.lane+(x<200?-1:1),0,2);return;}
 }
 function dropStack(){const prev=s.blocks.at(-1),left=Math.max(prev.x,s.mover.x),right=Math.min(prev.x+prev.w,s.mover.x+s.mover.w),w=right-left;if(w<4){end(false,'Tower complete');return;}s.blocks.push({x:left,w,y:s.mover.y});s.score+=Math.floor(w);s.round++;if(s.round===20){end(true,'Skyline complete');return;}if(s.blocks.length>12)s.blocks.shift();s.mover={x:s.mover.dir>0?20:380-w,w,dir:-s.mover.dir,y:505};}
 function aim(x){s.target=clamp(x,35,365);if(['brick','pong','goalie','airhockey','defender','crowd'].includes(id))s.x=s.target;}
 function swipe(dx,dy){if(Math.hypot(dx,dy)<12)return;const d=Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up';if(id==='lanes')s.lane=clamp(s.lane+(d==='right'?1:d==='left'?-1:0),0,2);else moveGrid(d);}
 function action(kind,down=true){if(!down||s.done)return;if(id==='mines'&&kind==='main')s.mode=!s.mode;else if(id==='rhythm'&&kind==='main')tap(200,300);else if(id==='stack'&&kind==='main')dropStack();}
 function key(k){const m={ArrowLeft:'left',a:'left',ArrowRight:'right',d:'right',ArrowUp:'up',w:'up',ArrowDown:'down',s:'down'}[k];if(m)swipe(m==='left'?-30:m==='right'?30:0,m==='up'?-30:m==='down'?30:0);else if(k===' ')action('main');}
 function update(dt){if(s.done)return;s.t+=dt;s.cooldown=Math.max(0,s.cooldown-dt);s.flash=Math.max(0,s.flash-dt);
  if(s.aiWait>0&&(s.aiWait-=dt)<=0)cpuMove();
  if(id==='brick'){const b=s.ball;b.x+=b.vx*dt;b.y+=b.vy*dt;if(b.x<20||b.x>380)b.vx*=-1;if(b.y<50)b.vy=Math.abs(b.vy);if(b.y>500&&b.y<530&&Math.abs(b.x-s.x)<58){b.vy=-Math.abs(b.vy);b.vx+=(b.x-s.x)*2;}for(const a of s.bricks)if(a.on&&Math.abs(b.x-a.x)<24&&Math.abs(b.y-a.y)<13){a.on=false;b.vy*=-1;s.score+=10;}if(!s.bricks.some(a=>a.on))end(true,'Wall cleared');if(b.y>620){s.lives--;if(!s.lives)end(false,'Out of balls');else resetBall();}}
  if(id==='pong'){const b=s.ball;s.ai??=200;s.ai+=(b.x-s.ai)*dt*2;b.x+=b.vx*dt;b.y+=b.vy*dt;if(b.x<18||b.x>382)b.vx*=-1;if(b.y>520&&Math.abs(b.x-s.x)<55)b.vy=-Math.abs(b.vy);if(b.y<80&&Math.abs(b.x-s.ai)<48)b.vy=Math.abs(b.vy);if(b.y<0||b.y>600){if(b.y<0)s.round++;else s.enemy++;if(s.round===5||s.enemy===5)end(s.round===5,s.round===5?'Match won':'Computer wins');else resetBall();}}
  if(id==='goalie'){const b=s.ball;b.x+=b.vx*dt;b.y+=b.vy*dt;if(b.x<35||b.x>365)b.vx*=-1;if(b.y>510){if(Math.abs(b.x-s.x)<60){s.score+=100;s.round++;}else s.lives--;if(s.round===10)end(true,'Ten saves!');else if(!s.lives)end(false,'Three goals conceded');else{s.ball={x:40+rnd()*320,y:90,vx:(rnd()-.5)*130,vy:190+rnd()*80};}}}
  if(id==='airhockey'){const b=s.ball;s.ai??=200;s.ai+=(b.x-s.ai)*dt*2.5;b.x+=b.vx*dt;b.y+=b.vy*dt;if(b.x<25||b.x>375)b.vx*=-1;if(b.y>430&&Math.abs(b.x-s.x)<65)b.vy=-Math.abs(b.vy)-20;if(b.y<170&&Math.abs(b.x-s.ai)<60)b.vy=Math.abs(b.vy)+20;if(b.y<30||b.y>570){if(b.y<30)s.round++;else s.enemy++;if(s.round===5||s.enemy===5)end(s.round===5,s.round===5?'Table won':'Computer wins');else resetBall();}}
  if(['frog','river'].includes(id)){for(const [r,row] of s.rows.entries()){row.offset=(row.offset+row.dir*row.speed*dt+5)%5;const y=4-r;if(s.player.y===y&&id==='frog'){const car=Math.round(row.offset)%5;if(s.player.x===car){s.lives--;s.player={x:2,y:5};if(!s.lives)end(false,'Traffic wins');}}if(s.player.y===y&&id==='river'){const stone=Math.round(row.offset)%5;if(Math.abs(s.player.x-stone)>0){s.lives--;s.player={x:2,y:5};if(!s.lives)end(false,'Into the river');}}}}
  if(['lanes','defender'].includes(id)){s.spawn-=dt;if(s.spawn<=0){s.spawn=id==='defender'?.55:.72;s.objects.push({lane:Math.floor(rnd()*3),y:-20,hp:id==='defender'?1:0});}for(const o of s.objects)o.y+=(id==='defender'?75:150)*dt;if(id==='defender'){s.shot=(s.shot||0)-dt;if(s.shot<=0){s.shot=.28;const o=s.objects.filter(o=>Math.abs((80+o.lane*120)-s.x)<40).sort((a,b)=>b.y-a.y)[0];if(o){o.hp--;if(!o.hp){o.dead=true;s.score+=20;}}}if(s.objects.some(o=>!o.dead&&o.y>500&&Math.abs((80+o.lane*120)-s.x)<35)){s.lives--;s.objects=[];if(!s.lives)end(false,'Defence broken');}if(s.score>=500)end(true,'Five waves cleared');}else{if(s.objects.some(o=>o.y>470&&o.y<540&&o.lane===s.lane)){s.lives--;s.objects=[];if(!s.lives)end(false,'Run complete');}if(s.t>=60)end(true,'One minute clean');s.score=Math.floor(s.t*10);}s.objects=s.objects.filter(o=>!o.dead&&o.y<640);}
  if(['whack','targets'].includes(id)){s.targetObj.life-=dt;if(s.targetObj.life<=0){if(id==='whack'){s.lives--;if(!s.lives)end(false,'Five escaped');else spawnTarget();}else{spawnTarget();}}}
  if(id==='bubbles'){s.spawn-=dt;if(s.spawn<=0){s.spawn=.35;s.objects.push({x:30+rnd()*340,y:610,r:12+rnd()*14,vy:45+rnd()*55,gold:rnd()<.12});}for(const o of s.objects)o.y-=o.vy*dt;s.objects=s.objects.filter(o=>!o.hit&&o.y>-40);if(s.t>=45)end(true,'Parade complete');}
  if(id==='rhythm'){s.pulse-=dt*.7;if(s.pulse<0){s.round++;s.pulse=1;if(s.round===30)end(true,'Thirty beats complete');}}
  if(id==='memory'&&s.selected.length===2&&s.cooldown<=0){const [a,b]=s.selected;if(s.board[a].v===s.board[b].v){s.board[a].done=s.board[b].done=true;s.score+=100;}else{s.board[a].open=s.board[b].open=false;}s.selected=[];s.round++;if(s.board.every(x=>x.done))end(true,'All pairs found');}
  if(id==='stack'){s.mover.x+=s.mover.dir*(110+s.round*8)*dt;if(s.mover.x<20||s.mover.x+s.mover.w>380)s.mover.dir*=-1;s.mover.x=clamp(s.mover.x,20,380-s.mover.w);}
  if(id==='simon'&&s.phase==='show'){s.clock+=dt;if(s.clock>=.65){s.clock=0;s.lit=s.showIndex<s.sequence.length?s.sequence[s.showIndex++]:-1;if(s.showIndex>s.sequence.length){s.phase='input';s.input=0;s.lit=-1;}}}
  if(id==='crowd'){
   const speed=145;s.distance+=speed*dt;s.spawn-=dt;
   if(s.spawn<=0&&s.distance<s.finish-500){s.spawn=1.25;const level=Math.floor(s.distance/500),a=2+level+Math.floor(rnd()*5),mult=rnd()<.36?2:0;s.objects.push({type:'gates',y:-45,left:{op:'+',n:a},right:mult?{op:'×',n:2}:{op:'+',n:a+3},used:false});}
   if(s.distance>=s.nextEnemy&&s.nextEnemy<s.finish-300){const strength=6+Math.floor(s.nextEnemy/350);s.objects.push({type:'rivals',y:-80,n:strength,used:false});s.nextEnemy+=720;}
   if(s.distance>=s.finish-260&&!s.bossSpawned){s.bossSpawned=true;s.objects.push({type:'titan',y:-120,n:42,used:false});}
   for(const o of s.objects){o.y+=speed*dt;if(o.used)continue;if(o.y>430){o.used=true;if(o.type==='gates'){const gate=s.x<200?o.left:o.right;s.count=gate.op==='×'?Math.min(99,s.count*gate.n):Math.min(99,s.count+gate.n);s.score+=gate.op==='×'?100:gate.n*10;s.message=`${gate.op}${gate.n} · squad ${s.count}`;s.flash=.8;}else{const before=s.count;s.count-=o.n;s.score+=Math.min(before,o.n)*25;s.message=o.type==='titan'?'Titan clash!':`Rivals −${o.n}`;s.flash=1;if(s.count<=0){s.count=0;end(false,o.type==='titan'?'The titan held the bridge':'The squad was stopped');}else if(o.type==='titan'){s.score+=s.count*100;end(true,`Titan defeated with ${s.count} runners`);}}}}
   s.objects=s.objects.filter(o=>o.y<650);
  }
 }
 return {s,update,aim,tap,swipe,action,key};
}
