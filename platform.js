// The YouTube build loads the official SDK before this module. The public demo
// deliberately uses a separate storage and lifecycle path.
export function createPlatform({sdk=globalThis.ytgame,storage,onPause=()=>{},onResume=()=>{},onAudio=()=>{},onStatus=()=>{}}={}){
 const youtube=!!sdk?.IN_PLAYABLES_ENV;let loaded=false,data={version:1,best:{}},chain=Promise.resolve();
 function parse(raw){try{const v=JSON.parse(raw||'{}');const best={};for(const [k,n] of Object.entries(v?.best||{})){if(Number.isSafeInteger(n)&&n>=0)best[k]=n;}return {version:1,best};}catch{return {version:1,best:{}};}}
 if(!youtube&&storage===undefined){try{storage=globalThis.localStorage;}catch{storage=null;}}
 return {youtube,
 firstFrame(){if(youtube)sdk.game.firstFrameReady();},
 async init(){if(youtube){sdk.system.onPause(onPause);sdk.system.onResume(onResume);onAudio(sdk.system.isAudioEnabled());sdk.system.onAudioEnabledChange(onAudio);try{data=parse(await sdk.game.loadData());loaded=true;}catch{onStatus('Cloud save unavailable. Scores are session-only.');}}else{try{data=parse(storage.getItem('pocket-sports-v1'));}catch{onStatus('Storage unavailable. Scores are session-only.');}loaded=true;}
 return data;},
 ready(){if(youtube)sdk.game.gameReady();},
 best(id){return data.best[id]||0;},
 record(id,score){data.best[id]=Math.max(data.best[id]||0,Math.floor(score));const snapshot=JSON.stringify(data),best=data.best[id];
 chain=chain.catch(()=>{}).then(async()=>{if(youtube){if(!loaded)return;try{await sdk.game.saveData(snapshot);await sdk.engagement.sendScore({value:best});onStatus('Best score saved');}catch{onStatus('Could not sync score. Best score kept this session.');}}else{try{storage.setItem('pocket-sports-v1',snapshot);onStatus('Best score saved on this device');}catch{onStatus('Best score kept this session');}}});return chain;}
 };
}
