import {Chess} from './vendor/chess.js?v=20261007';

export const tabletopIds = ['chess', 'checkers', 'reversi'];
export const isTabletop = id => tabletopIds.includes(id);
const directions = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
const inside = (r,c) => r>=0 && r<8 && c>=0 && c<8;
const square = i => 'abcdefgh'[i%8]+(8-Math.floor(i/8));
const index = sq => (8-Number(sq[1]))*8+'abcdefgh'.indexOf(sq[0]);
const values = {p:100,n:320,b:330,r:500,q:900,k:0};

export function reversiFlips(board,at,side) {
 if(board[at]) return [];
 const result=[],r=Math.floor(at/8),c=at%8;
 for(const [dr,dc] of directions){const line=[];let row=r+dr,col=c+dc;
  while(inside(row,col)&&board[row*8+col]===-side){line.push(row*8+col);row+=dr;col+=dc;}
  if(line.length&&inside(row,col)&&board[row*8+col]===side)result.push(...line);
 }
 return result;
}
export function reversiMoves(board,side){return board.flatMap((p,i)=>!p&&reversiFlips(board,i,side).length?[i]:[]);}

export function checkerMoves(board,side,forced=null) {
 const captures=[],steps=[];
 for(let from=0;from<64;from++){
  const p=board[from];if(Math.sign(p)!==side||(forced!==null&&from!==forced))continue;
  const r=Math.floor(from/8),c=from%8,rows=Math.abs(p)===2?[-1,1]:[-side];
  for(const dr of rows)for(const dc of [-1,1]){
   const nr=r+dr,nc=c+dc;if(!inside(nr,nc))continue;const near=nr*8+nc;
   if(!board[near]&&forced===null)steps.push({from,to:near});
   const jr=r+dr*2,jc=c+dc*2;
   if(Math.sign(board[near])===-side&&inside(jr,jc)&&!board[jr*8+jc])captures.push({from,to:jr*8+jc,capture:near});
  }
 }
 return captures.length?captures:forced!==null?[]:steps;
}

export function createTabletop(id,random=Math.random,{mode='cpu'}={}) {
 const s={id,mode,t:0,score:0,lives:0,x:200,target:200,distance:0,done:false,won:false,message:'',flash:0,round:0,board:Array(64).fill(0),turn:1,selected:null,legal:[],lastMove:[],forced:null,promotion:null,aiWait:.55,cursor:52,quiet:0};
 const chess=id==='chess'?new Chess():null, repetitions=new Map();
 if(id==='checkers')for(let i=0;i<64;i++){const r=Math.floor(i/8);if((r+i%8)%2===1)s.board[i]=r<3?-1:r>4?1:0;}
 if(id==='reversi'){s.board[27]=-1;s.board[28]=1;s.board[35]=1;s.board[36]=-1;}
 const humanTurn=()=>s.mode==='local'||s.turn===1;
 function finish(winner,message){s.done=true;s.won=winner===1;s.message=message;s.legal=[];s.selected=null;s.score=id==='reversi'?s.board.filter(p=>p===1).length*10+(winner===1?500:0):Math.max(0,s.score)+(winner===1?1000:winner===0?100:0);}
 function syncChess(){s.board=chess.board().flat().map(p=>p?{type:p.type,side:p.color==='w'?1:-1}:null);s.turn=chess.turn()==='w'?1:-1;s.check=chess.isCheck();
  if(chess.isCheckmate())finish(-s.turn,`${s.turn===1?'Black':'White'} wins by checkmate`);
  else if(chess.isDraw())finish(0,chess.isStalemate()?'Draw by stalemate':chess.isThreefoldRepetition()?'Draw by repetition':chess.isInsufficientMaterial()?'Draw: insufficient material':'Draw: fifty-move rule');
 }
 function refresh(){
  if(id==='chess')syncChess();
  else if(id==='checkers'){
   s.moves=checkerMoves(s.board,s.turn,s.forced);
   if(!s.moves.length)finish(-s.turn,`${s.turn===1?'Coral':'Ivory'} wins`);
   if(!s.done&&s.quiet>=80)finish(0,'Draw: 80 quiet turns');
  }else{
   s.legal=reversiMoves(s.board,s.turn);
   if(!s.legal.length){s.turn*=-1;s.legal=reversiMoves(s.board,s.turn);s.notice='No legal move · turn passed';
    if(!s.legal.length){const sum=s.board.reduce((a,b)=>a+b,0);finish(Math.sign(sum),sum===0?'Draw: 32 discs each':`${sum>0?'Dark':'Ivory'} wins`);}
   }
  }
  if(!s.done){const who=id==='reversi'?(s.turn===1?'Dark':'Ivory'):id==='checkers'?(s.turn===1?'Ivory':'Coral'):(s.turn===1?'White':'Black');s.message=humanTurn()?`${who} to move${s.check?' · CHECK':''}${s.forced!==null?' · continue jump':''}`:'Computer is thinking…';}
 }
 function completeTurn(){s.round++;s.selected=null;s.legal=[];s.aiWait=.55;refresh();
  if(id==='checkers'&&!s.done&&s.forced===null){const key=s.board.join(',')+':'+s.turn;const n=(repetitions.get(key)||0)+1;repetitions.set(key,n);if(n>=3)finish(0,'Draw by repetition');}
 }
 function moveChess(move){const played=chess.move(move);s.lastMove=[index(played.from),index(played.to)];if(played.color==='w'&&played.captured)s.score+=values[played.captured];s.promotion=null;completeTurn();}
 function moveChecker(move){let p=s.board[move.from];s.board[move.from]=0;s.board[move.to]=p;s.lastMove=[move.from,move.to];
  if(move.capture!==undefined){s.board[move.capture]=0;if(s.turn===1)s.score+=100;s.quiet=0;}else s.quiet++;
  const row=Math.floor(move.to/8),promoted=Math.abs(p)===1&&((p===1&&row===0)||(p===-1&&row===7));
  if(promoted){s.board[move.to]=p*2;s.quiet=0;}
  const next=move.capture!==undefined&&!promoted?checkerMoves(s.board,s.turn,move.to):[];
  if(next.length){s.forced=move.to;s.selected=move.to;s.moves=next;s.legal=next.map(m=>m.to);s.aiWait=.4;refresh();}
  else{s.forced=null;s.turn*=-1;completeTurn();}
 }
 function moveReversi(at){const flips=reversiFlips(s.board,at,s.turn);if(!flips.length)return;s.notice='';s.board[at]=s.turn;for(const i of flips)s.board[i]=s.turn;s.lastMove=[at];s.turn*=-1;completeTurn();s.score=s.done?s.score:s.board.filter(p=>p===1).length*10;}
 function select(at){if(s.done||!humanTurn()||s.promotion||at<0||at>=64)return;s.cursor=at;
  if(id==='reversi'){if(s.legal.includes(at))moveReversi(at);return;}
  if(id==='chess'){
   if(s.selected!==null&&s.legal.includes(at)){
    const from=square(s.selected),to=square(at),moves=chess.moves({square:from,verbose:true}).filter(m=>m.to===to);
    if(moves.some(m=>m.promotion)){s.promotion={from,to};s.message='Choose your promotion';return;}
    moveChess({from,to});return;
   }
   const piece=s.board[at];s.selected=piece?.side===s.turn?at:null;s.legal=s.selected===null?[]:chess.moves({square:square(at),verbose:true}).map(m=>index(m.to));
  }else{
   const move=s.moves.find(m=>m.from===s.selected&&m.to===at);if(move){moveChecker(move);return;}
   if(s.forced!==null)return;
   s.selected=Math.sign(s.board[at])===s.turn?at:null;s.legal=s.moves.filter(m=>m.from===s.selected).map(m=>m.to);
  }
 }
 function evaluate(){let total=0;for(const p of chess.board().flat())if(p)total+=(p.color==='b'?1:-1)*values[p.type];return total;}
 function computer(){
  if(id==='chess'){
   // Two-ply material search. Deliberately a casual opponent, not an analysis engine.
   let best=-Infinity,choice;const moves=chess.moves({verbose:true});
   for(const m of moves){chess.move(m);let value=evaluate();if(chess.isCheckmate())value=100000;else{let reply=Infinity;for(const r of chess.moves({verbose:true})){chess.move(r);reply=Math.min(reply,chess.isCheckmate()?-100000:evaluate());chess.undo();}if(reply!==Infinity)value=reply;}
    chess.undo();value+=random()*3;if(value>best){best=value;choice=m;}}
   if(choice)moveChess(choice);
  }else if(id==='checkers'){
   const moves=s.moves.map(m=>({m,value:(m.capture!==undefined?20:0)+(Math.floor(m.to/8)===7?12:0)+random()*3})).sort((a,b)=>b.value-a.value);if(moves.length)moveChecker(moves[0].m);
  }else{
   const options=s.legal.map(at=>{const r=Math.floor(at/8),c=at%8,corner=[0,7,56,63].includes(at),edge=r===0||r===7||c===0||c===7;let penalty=0;for(const k of [0,7,56,63])if(!s.board[k]&&Math.abs(r-Math.floor(k/8))<=1&&Math.abs(c-k%8)<=1&&!corner)penalty=35;return {at,value:reversiFlips(s.board,at,s.turn).length+(corner?100:edge?8:0)-penalty+random()};}).sort((a,b)=>b.value-a.value);if(options.length)moveReversi(options[0].at);
  }
 }
 refresh();
 if(id==='checkers')repetitions.set(s.board.join(',')+':'+s.turn,1);
 return {s,chess,select,refresh,aim(){},action(kind,down=true){if(!down||s.done||!humanTurn())return;if(s.promotion&&['q','r','b','n'].includes(kind)){moveChess({...s.promotion,promotion:kind});return;}if(kind==='main')select(s.cursor);},
  key(key){if(!humanTurn())return;const dirs={ArrowLeft:-1,ArrowRight:1,ArrowUp:-8,ArrowDown:8};if(key in dirs)s.cursor=Math.max(0,Math.min(63,s.cursor+dirs[key]));else if(key==='Enter'||key===' ')select(s.cursor);else this.action(key);},
  tap(x,y){if(s.promotion&&y>=520&&y<=578){const n=Math.floor((x-24)/88);if(n>=0&&n<4)this.action(['q','r','b','n'][n]);return;}const col=Math.floor((x-20)/45),row=Math.floor((y-110)/45);if(inside(row,col))select(row*8+col);},
  update(dt){if(s.done)return;s.t+=dt;if(!humanTurn()){s.aiWait-=dt;if(s.aiWait<=0)computer();}},finish};
}

export function createSnake(random=Math.random){
 const s={id:'snake',t:0,score:0,lives:1,x:200,target:200,distance:0,done:false,won:false,message:'',flash:0,round:0,snake:[{x:7,y:8},{x:6,y:8},{x:5,y:8}],dir:{x:1,y:0},queue:[],food:null,clock:0,cursor:0};
 function food(){const empty=[];for(let y=0;y<16;y++)for(let x=0;x<16;x++)if(!s.snake.some(p=>p.x===x&&p.y===y))empty.push({x,y});if(!empty.length){s.done=true;s.won=true;s.message='Perfect run · board filled';return;}s.food=empty[Math.min(empty.length-1,Math.floor(random()*empty.length))];}
 const dirs={up:{x:0,y:-1},down:{x:0,y:1},left:{x:-1,y:0},right:{x:1,y:0}};
 function action(kind,down=true){if(!down||s.done||!dirs[kind]||s.queue.length>=2)return;const d=dirs[kind],last=s.queue.at(-1)||s.dir;if((d.x===-last.x&&d.y===-last.y)||(d.x===last.x&&d.y===last.y))return;s.queue.push(d);}
 food();return {s,aim(){},action,key(key){const names={ArrowUp:'up',w:'up',ArrowDown:'down',s:'down',ArrowLeft:'left',a:'left',ArrowRight:'right',d:'right'};action(names[key]);},swipe(dx,dy){if(Math.hypot(dx,dy)<12)return;action(Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up');},
 update(dt){if(s.done)return;s.t+=dt;s.clock+=dt;const interval=Math.max(.085,.22-s.round*.006);if(s.clock<interval)return;s.clock-=interval;if(s.queue.length)s.dir=s.queue.shift();const head={x:s.snake[0].x+s.dir.x,y:s.snake[0].y+s.dir.y},eat=head.x===s.food.x&&head.y===s.food.y;const body=eat?s.snake:s.snake.slice(0,-1);
 if(head.x<0||head.y<0||head.x>=16||head.y>=16||body.some(p=>p.x===head.x&&p.y===head.y)){s.done=true;s.message='Run complete';s.lives=0;return;}
 s.snake.unshift(head);if(eat){s.score+=10;s.round++;food();}else s.snake.pop();
 }};
}
