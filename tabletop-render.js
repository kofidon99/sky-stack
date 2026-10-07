const palettes={chess:['#dce0cd','#75918a','#b7d1bd'],checkers:['#e9d7bd','#886d65','#deb898'],reversi:['#426d66','#3c645f','#9fcfbe'],snake:['#243d33','#20382f','#c8e89d']};
export function renderTabletop(c,s){
 const [light,dark,accent]=palettes[s.id];c.save();c.fillStyle='#152830';c.fillRect(0,0,400,600);
 const text=(v,x,y,size=16,color='#f3efdf')=>{c.fillStyle=color;c.font=`600 ${size}px Arial`;c.textAlign='center';c.fillText(v,x,y);};
 const circle=(x,y,r,col)=>{c.fillStyle=col;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill();};
 text(s.id==='snake'?'S N A K E   G A R D E N':s.id==='chess'?'Q U I E T   C H E S S':s.id==='checkers'?'C R O W N   C H E C K E R S':'F L I P S I D E',200,42,17,accent);
 if(s.id==='snake'){
  text('A little longer. A little faster.',200,70,12,'#afc2b6');
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){c.fillStyle=(x+y)%2?light:dark;c.fillRect(24+x*22,112+y*22,22,22);}
  const f=s.food;if(f){circle(35+f.x*22,123+f.y*22,8,'#ec9b80');c.strokeStyle='#d6edaa';c.lineWidth=2;c.beginPath();c.moveTo(35+f.x*22,115+f.y*22);c.lineTo(38+f.x*22,111+f.y*22);c.stroke();}
  [...s.snake].reverse().forEach((p,i)=>{c.fillStyle=i===s.snake.length-1?'#e1f6a0':'#a4ca84';c.beginPath();c.roundRect(25+p.x*22,113+p.y*22,20,20,5);c.fill();});
  const h=s.snake[0],x=35+h.x*22,y=123+h.y*22;for(const n of [-1,1])circle(x+s.dir.x*4+(s.dir.y?n*4:0),y+s.dir.y*4+(s.dir.x?n*4:0),2,'#244633');
  text(`${s.round} snacks  ·  ${s.snake.length} segments`,200,507,16,accent);text('Swipe anywhere on the garden',200,539,12,'#a9c0b1');text('or use the direction buttons below',200,560,12,'#a9c0b1');c.restore();return;
 }
 text(s.message,200,76,15,accent);
 for(let i=0;i<64;i++){
  const r=Math.floor(i/8),col=i%8,x=20+col*45,y=110+r*45;
  c.fillStyle=(r+col)%2?dark:light;c.fillRect(x,y,45,45);
  if(s.lastMove.includes(i)){c.fillStyle='#edf59430';c.fillRect(x,y,45,45);}
  if(s.selected===i){c.fillStyle='#f0ed8999';c.fillRect(x,y,45,45);}
  if(s.legal.includes(i))circle(x+22.5,y+22.5,s.board[i]?19:6,s.board[i]?'#e4eeab99':'#dcefac99');
  if(i===s.cursor){c.strokeStyle='#fff7c577';c.lineWidth=2;c.strokeRect(x+3,y+3,39,39);}
  const p=s.board[i];if(!p)continue;
  if(s.id==='chess'){
   // Filled and outlined standard chess symbols retain their silhouettes on both squares.
   const symbols={k:'♚',q:'♛',r:'♜',b:'♝',n:'♞',p:'♟'};c.font='36px "Segoe UI Symbol", "DejaVu Sans", serif';c.textAlign='center';c.lineWidth=1.5;c.strokeStyle=p.side===1?'#354740':'#101e20';c.fillStyle=p.side===1?'#fff9e5':'#233c3e';c.strokeText(symbols[p.type],x+22.5,y+35);c.fillText(symbols[p.type],x+22.5,y+35);
  }else{
   const ivory=s.id==='reversi'?p===-1:p>0;circle(x+23,y+25,17,'#10272d55');circle(x+22.5,y+22,17,ivory?'#f3e5c9':s.id==='checkers'?'#dc987c':'#182e32');circle(x+22.5,y+20,12,ivory?'#fff1d6':s.id==='checkers'?'#e8ab8d':'#2b4648');
   if(s.id==='checkers'&&Math.abs(p)===2)text('K',x+22.5,y+28,18,ivory?'#7c6551':'#553d36');
  }
 }
 for(let i=0;i<8;i++){text('abcdefgh'[i],42.5+i*45,490,11,'#9cb5b1');text(8-i,10,138+i*45,10,'#9cb5b1');}
 if(s.promotion){text('PROMOTE TO',200,516,10,accent);['QUEEN','ROOK','BISHOP','KNIGHT'].forEach((name,i)=>{c.fillStyle='#35504e';c.beginPath();c.roundRect(24+i*88,530,82,42,8);c.fill();text(name,65+i*88,556,11);});}
 else if(s.id==='reversi'){
  circle(119,527,8,'#243f43');circle(252,527,8,'#f3e5c9');text(s.board.filter(p=>p===1).length,150,533,21);text(s.board.filter(p=>p===-1).length,283,533,21);text(s.notice||'A corner changes everything.',200,570,12,'#9db9b2');
 }else{
  const info=s.id==='chess'?'Tap a piece, then a highlighted square.':s.forced!==null?'Keep jumping with the selected piece.':s.moves?.some(m=>m.capture!==undefined)?'Capture available · you must take it.':'Reach the far side to crown a king.';
  text(info,200,529,12,'#adc2b9');text(s.mode==='local'?'PASS & PLAY · TWO PEOPLE':'SOLO · YOU PLAY '+(s.id==='chess'?'WHITE':'IVORY'),200,567,10,accent);
 }
 c.restore();
}
