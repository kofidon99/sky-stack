import {renderTabletop} from './tabletop-render.js?v=20261007';
import {renderExpansion} from './expansion-render.js?v=20261007';
const colors={pinball:'#a580de',soccer:'#7dbb88',football:'#d79763',tennis:'#c8cf75',rugby:'#70b9b1',moto:'#9291cf',formula:'#de856d'};
export function render(ctx,s,{preview=false}={}){
 if(['chess','checkers','reversi','snake'].includes(s.id)){renderTabletop(ctx,s);return;}
 if(['brick','pong','goalie','airhockey','frog','lanes','defender','river','whack','bubbles','rhythm','targets','memory','connect4','tictac','merge','mines','maze','stack','simon','crowd'].includes(s.id)){renderExpansion(ctx,s);return;}
 const c=ctx;const W=400,H=600;c.save();c.clearRect(0,0,W,H);c.fillStyle='#142630';c.fillRect(0,0,W,H);
 const rect=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x,y,w,h);};
 const line=(x,y,X,Y,col='#ffffff75',w=2)=>{c.strokeStyle=col;c.lineWidth=w;c.beginPath();c.moveTo(x,y);c.lineTo(X,Y);c.stroke();};
 const circle=(x,y,r,col,stroke)=>{c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fillStyle=col;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=3;c.stroke();}};
 const text=(v,x,y,size=16,col='#fff')=>{c.fillStyle=col;c.font=`bold ${size}px Arial`;c.textAlign='center';c.fillText(v,x,y);};
 const person=(x,y,col,football=false)=>{c.save();c.translate(x,y);c.fillStyle='#0003';c.beginPath();c.ellipse(3,15,19,9,0,0,7);c.fill();rect(-13,-8,26,30,col);circle(0,-15,11,'#f0c5a0');rect(-20,-3,7,22,col);rect(13,-3,7,22,col);rect(-11,22,8,13,'#f7f0d6');rect(3,22,8,13,'#f7f0d6');if(football){circle(0,-17,12,col);line(-7,-15,7,-15,'#fff',3);}c.restore();};
 const car=(x,y,col,moto=false)=>{c.save();c.translate(x,y);if(moto){rect(-7,-30,14,60,'#111b22');rect(-13,-16,26,34,col);circle(0,-4,10,'#eceadf');line(-17,-12,17,-12,'#24333b',5);}else{rect(-23,-24,11,19,'#10191c');rect(12,-24,11,19,'#10191c');rect(-23,17,11,19,'#10191c');rect(12,17,11,19,'#10191c');rect(-11,-35,22,70,col);rect(-24,-28,48,7,col);rect(-24,29,48,7,col);circle(0,3,7,'#19232b');rect(-3,-28,6,18,'#f5eee2');}c.restore();};
 if(s.id==='pinball'){
 rect(18,18,364,564,'#262946');c.strokeStyle='#be9aff';c.lineWidth=5;c.strokeRect(23,23,354,554);
 for(let i=0;i<9;i++)circle(45+i*39,55,3,'#f3edbc');text('NEON',200,112,40,'#d5b7ff');text('P I N B A L L',200,137,10,'#b7bdde');
 for(const [x,y,r] of [[125,175,30],[275,175,30],[200,280,36],[90,360,22],[310,360,22]]){circle(x,y,r+7,'#161b37','#6e5c99');circle(x,y,r,colors.pinball,'#d8c0ff');circle(x-5,y-6,r*.55,'#c5a8ec');text('✦',x,y+8,24,'#f8f1df');}
 line(40,405,78,488,'#efbd8e',9);line(360,405,322,488,'#efbd8e',9);
 line(85,510,182,s.left?481:531,'#dff477',17);line(315,510,218,s.right?481:531,'#dff477',17);
 circle(85,510,10,'#fff6d1');circle(315,510,10,'#fff6d1');text('KEEP IT ALIVE',200,418,12,'#a4aacb');
 if(s.ball){circle(s.ball.x+3,s.ball.y+4,10,'#0004');circle(s.ball.x,s.ball.y,9,'#f0f4f5');circle(s.ball.x-3,s.ball.y-3,3,'#fff');}
 }else if(s.id==='soccer'){
 rect(0,0,400,95,'#253e37');for(let i=0;i<9;i++)for(let j=0;j<4;j++)circle(15+i*46,16+j*20,3,['#91a79b','#d3d9ae','#698775'][i%3]);
 for(let i=0;i<9;i++)rect(0,100+i*60,400,60,i%2?'#346b51':'#306349');
 rect(48,108,304,80,'#183f35');for(let x=48;x<=352;x+=19)line(x,108,x,188,'#cad7c750',1);for(let y=108;y<=188;y+=16)line(48,y,352,y,'#cad7c750',1);line(48,188,48,108,'#f4eee0',5);line(48,108,352,108,'#f4eee0',5);line(352,108,352,188,'#f4eee0',5);
 line(26,190,26,350);line(26,350,374,350);line(374,350,374,190);line(0,190,400,190);circle(200,475,4,'#e1dfc8');
 person(s.keeper||200,169,'#f1c45d');line((s.keeper||200)-30,169,(s.keeper||200)+30,169,'#f1c45d',9);
 if(!s.ball){c.setLineDash([5,10]);line(200,505,s.aim,145,'#e4f48c85',2);c.setLineDash([]);circle(s.aim,145,13,'#0000','#dff477');}
 const b=s.ball||{x:200,y:505};circle(b.x,b.y,12,'#f6f2df','#142f28');circle(b.x,b.y,5,'#253e37');text('THE SHOOTOUT',200,410,12,'#c4dcc6');
 }else if(s.id==='tennis'){
 rect(0,0,400,600,'#62775a');rect(32,42,336,516,'#b1b76d');rect(54,42,292,516,'#a4ab64');c.strokeStyle='#f5f0d6';c.lineWidth=3;c.strokeRect(32,42,336,516);c.strokeRect(65,42,270,516);c.strokeRect(65,155,270,290);line(200,155,200,445,'#f5f0d6',3);
 rect(24,294,352,12,'#263c3a');for(let x=24;x<380;x+=8)line(x,294,x,310,'#f9efd4',1);line(24,294,376,294,'#fff5d8',3);
 rect((s.ai||200)-40,79,80,12,'#243f44');rect(s.x-46,517,92,12,'#fff7dc');circle(s.x,535,9,'#de946b');if(s.ball){circle(s.ball.x+4,s.ball.y+5,8,'#0002');circle(s.ball.x,s.ball.y,7,'#effe6b');}text(`${s.round}  :  ${s.enemy}`,200,27,17,'#f2eed9');
 }else if(s.id==='football'||s.id==='rugby'){
 for(let i=-1;i<8;i++){const y=i*100+(s.distance%100);rect(0,y,400,100,i%2?'#315d50':'#2b5548');line(30,y,370,y,'#abc6ad70',2);if(s.id==='football'){text((i+2)*10,52,y+23,15,'#afc4ae');text((i+2)*10,348,y+23,15,'#afc4ae');for(let x=155;x<260;x+=90)line(x,y+25,x,y+35,'#abc6ad',2);}}
 line(25,0,25,600,'#dbe4c4',3);line(375,0,375,600,'#dbe4c4',3);
 const tryY=(s.distance%1000)-80;if(tryY<600){rect(26,tryY,348,65,'#90b79b');text(s.id==='rugby'?'TRY LINE':'END ZONE',200,tryY+39,22,'#204b41');}
 for(const o of s.objects)if(!o.hit)person(o.x,o.y,'#eab68a',s.id==='football');
 if(s.id==='rugby')person(s.x<200?320:80,455,'#87c8c2');
 if(s.cooldown<=0||Math.floor(s.t*12)%2===0)person(s.x,480,'#ddf477',s.id==='football');c.save();c.translate(s.x+15,487);c.rotate(.5);c.fillStyle='#f1debf';c.beginPath();c.ellipse(0,0,6,11,0,0,7);c.fill();c.restore();
 }else{
 const moto=s.id==='moto',center=s.road||200;rect(0,0,400,600,moto?'#24263e':'#577660');
 if(moto){for(let i=0;i<14;i++){const y=(i*57+s.distance*.7)%680-40;rect(9,y,18,30,'#626080');rect(374,y+10,16,24,'#626080');}}
 rect(center-143,0,286,600,moto?'#3b3d53':'#424c4d');for(let i=-1;i<12;i++){const y=i*64+s.distance%64;rect(center-151,y,8,32,'#f3e7d4');rect(center+143,y,8,32,'#f3e7d4');rect(center-151,y+32,8,32,moto?'#9b85c6':'#e29278');rect(center+143,y+32,8,32,moto?'#9b85c6':'#e29278');for(const x of [center-47,center+47])rect(x,y,3,30,'#d9d8c670');}
 for(const o of s.objects)if(!o.hit){if(o.type==='coin'){circle(o.x,o.y,11,'#e5c96d');circle(o.x,o.y,5,'#544b42');}else car(o.x,o.y,moto?'#b4a7d7':'#e6bba6',moto);}
 if(s.cooldown<=0||Math.floor(s.t*12)%2===0)car(s.x,480,'#ddf477',moto);
 if(s.held&&s.id==='formula'){rect(s.x-15,514,8,5,'#ff6657');rect(s.x+7,514,8,5,'#ff6657');}text(moto?'NIGHT RUN':`LAP ${Math.min(3,s.round+1)} / 3`,200,42,14,'#f2eee0');
 }
 if(s.flash>0&&!preview){rect(54,555,292,29,'#132830ed');text(s.message,200,575,13,'#e3f38f');}
 if(preview){const grad=c.createLinearGradient(0,400,0,600);grad.addColorStop(0,'#111b2200');grad.addColorStop(1,'#111b2266');c.fillStyle=grad;c.fillRect(0,0,400,600);}
 c.restore();
}
