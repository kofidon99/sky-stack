import {createTabletop,createSnake,isTabletop} from './tabletop.js?v=20261007';
import {createExpansion,isExpansion} from './expansion.js?v=20261007';
export const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export function createGame(id,random=Math.random,options={}){
 if(isTabletop(id))return createTabletop(id,random,options);
 if(id==='snake')return createSnake(random);
 if(isExpansion(id))return createExpansion(id,random);
 const s={id,t:0,score:0,lives:3,done:false,won:false,message:'',flash:0,x:200,target:200,held:false,left:false,right:false,objects:[],spawn:0,distance:0,cooldown:0,round:0,enemy:0,shots:10,aim:200,ball:null};
 function ball(){s.ball={x:200,y:450,vx:(random()-.5)*160,vy:-260};}
 function servePin(){s.ball={x:350,y:510,vx:-80-random()*100,vy:-650};s.message='';}
 if(id==='pinball'){s.ball=null;s.message='Tap LAUNCH';}
 if(id==='tennis')ball();
 function finish(won,message){s.done=true;s.won=won;s.message=message;}
 function award(n,msg){s.score+=n;s.message=msg;s.flash=1.2;}
 function damage(){if(s.cooldown>0)return;s.lives--;s.cooldown=1.3;s.message='Watch the gap!';s.flash=1;if(s.lives<=0)finish(false,'Run complete');}
 function action(kind='main',down=true){if(s.done)return;if(id==='pinball'){if(kind==='launch'&&down&&!s.ball)servePin();if(kind==='left')s.left=down;if(kind==='right')s.right=down;}
 if(id==='soccer'&&down&&!s.ball&&s.shots>0&&s.cooldown<=0){s.ball={x:200,y:505,to:clamp(s.aim,65,335),p:0};s.shots--;}
 if(id==='rugby'&&down&&s.cooldown<=0){s.target=s.x<200?320:80;s.x=s.target;s.cooldown=.45;s.message='Pass complete';s.flash=.5;}
 if(id==='formula')s.held=down;
 }
 function update(dt){if(s.done)return;dt=clamp(dt,0,1/30);s.t+=dt;s.cooldown=Math.max(0,s.cooldown-dt);s.flash=Math.max(0,s.flash-dt);s.x+=(s.target-s.x)*Math.min(1,dt*15);
 if(id==='pinball'){
 const b=s.ball;if(!b)return;b.vy+=380*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;
 if(b.x<30){b.x=30;b.vx=Math.abs(b.vx)*.94;}if(b.x>370){b.x=370;b.vx=-Math.abs(b.vx)*.94;}if(b.y<38){b.y=38;b.vy=Math.abs(b.vy);}
 for(const [x,y,r] of [[125,175,30],[275,175,30],[200,280,36],[90,360,22],[310,360,22]]){const dx=b.x-x,dy=b.y-y,d=Math.hypot(dx,dy);if(d<r+10){const nx=d?dx/d:0,ny=d?dy/d:-1;b.x=x+nx*(r+11);b.y=y+ny*(r+11);const dot=b.vx*nx+b.vy*ny;b.vx-=2*dot*nx;b.vy-=2*dot*ny;b.vx+=nx*100;b.vy+=ny*100;award(100,'BUMPER +100');}}
 // Slingshots feed the ball toward the flippers, leaving a real central drain.
 if(b.y>400&&b.y<495){if(b.x<70){b.x=70;b.vx=Math.abs(b.vx)+65;}if(b.x>330){b.x=330;b.vx=-Math.abs(b.vx)-65;}}
 if(b.vy>0&&b.y>495&&b.y<535){if(b.x>=72&&b.x<198&&s.left){b.vy=-540;b.vx=(b.x-105)*3;award(10,'Nice save');}else if(b.x>202&&b.x<=328&&s.right){b.vy=-540;b.vx=(b.x-295)*3;award(10,'Nice save');}}
 b.vx=clamp(b.vx,-520,520);b.vy=clamp(b.vy,-720,720);
 if(b.y>615){s.lives--;s.ball=null;if(!s.lives)finish(false,'Table complete');else s.message='Ball lost · Tap LAUNCH';}
 }else if(id==='soccer'){
 s.keeper=200+Math.sin(s.t*(1.6+s.round*.12))*105;
 const b=s.ball;if(b){b.p+=dt*1.9;b.x=200+(b.to-200)*b.p;b.y=505-365*b.p;if(b.p>=1){if(Math.abs(b.to-s.keeper)>35)award(100,'GOAL! +100');else {s.message='Saved! Try the other corner';s.flash=1.2;}s.ball=null;s.round++;s.cooldown=.65;}}
 if(s.shots===0&&!s.ball&&s.cooldown<=0)finish(s.score>=600,s.score>=600?'Clinical finishing!':'Shootout complete');
 }else if(id==='tennis'){
 const b=s.ball;s.ai??=200;s.ai+=clamp(b.x-s.ai,-(125+s.score*.65)*dt,(125+s.score*.65)*dt);b.x+=b.vx*dt;b.y+=b.vy*dt;
 if(b.x<38||b.x>362){b.x=clamp(b.x,38,362);b.vx*=-1;}
 if(b.vy>0&&b.y>=510&&b.y<537&&Math.abs(b.x-s.x)<52){b.y=510;b.vy=-Math.min(470,Math.abs(b.vy)+18);b.vx=(b.x-s.x)*7;award(5,'Rally on');}
 if(b.vy<0&&b.y<=95&&b.y>68&&Math.abs(b.x-s.ai)<43){b.y=95;b.vy=Math.min(470,Math.abs(b.vy)+12);b.vx=(random()-.5)*340;}
 if(b.y>600||b.y<0){if(b.y<0){s.round++;award(100,'Point to you');}else{s.enemy++;s.message='Point to opponent';s.flash=1;}if(s.round===7||s.enemy===7)finish(s.round===7,s.round===7?'Match won!':'Match complete');else ball();}
 }else{
 const racing=id==='moto'||id==='formula',formula=id==='formula';const speed=formula?(s.held?95:205):id==='moto'?210+Math.min(s.distance*.012,90):160+Math.min(s.t*1.6,70);
 s.distance+=speed*dt;s.road=formula?200+Math.sin(s.distance/600)*55:200;
 if(formula&&Math.abs(s.x-s.road)>123){damage();}
 s.spawn-=dt;if(s.spawn<=0){s.spawn=formula?.85:id==='moto'?.67:.82;const lane=Math.floor(random()*3);const x=(s.road||200)+(lane-1)*90;s.objects.push({x,y:-40,type:racing&&random()<.3?'coin':'enemy',phase:random()*6});}
 for(const o of s.objects){o.y+=speed*dt;if(!racing)o.x+=Math.sin(s.t*2+o.phase)*dt*30;if(Math.abs(o.x-s.x)<(id==='moto'?24:31)&&Math.abs(o.y-480)<34&&!o.hit){o.hit=true;if(o.type==='coin')award(50,'RING +50');else damage();}if(o.y>560&&!o.passed){o.passed=true;if(!o.hit)award(racing?10:5,racing?'Clean overtake':'Defender beaten');}}
 s.objects=s.objects.filter(o=>o.y<660);
 const milestone=racing?(formula?2000:3000):1000;
 if(Math.floor(s.distance/milestone)>s.round){s.round++;award(racing?200:id==='rugby'?5:6,racing?'Lap complete':id==='rugby'?'TRY! +5':'TOUCHDOWN! +6');}
 if(racing&&s.distance>=(formula?6000:3000))finish(true,'Finish line!');if(!racing&&s.t>=60)finish(true,'Full time!');
 }
 }
 return {s,update,action,aim(x){s.target=clamp(x,45,355);s.aim=clamp(x,65,335);},finish};
}
