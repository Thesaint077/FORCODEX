type Kind = 'verify' | 'reset';
type Config = {apiKey:string;from:string;origin:string};

export function emailConfig():Config {
  const apiKey=process.env.RESEND_API_KEY;
  const from=process.env.EMAIL_FROM;
  const origin=process.env.APP_URL;
  if(process.env.EMAIL_PROVIDER!=='resend'||!apiKey||!from||!origin)
    throw new Error('Email delivery is not configured. Please contact CreatorBridge support.');
  if(/[\r\n]/.test(from)||!/@[^\s<>]+\.[^\s<>]+/.test(from))throw new Error('Email sender configuration is invalid.');
  const url=new URL(origin);
  if(url.username||url.password||url.search||url.hash||url.pathname!=='/'||
    (url.protocol!=='https:'&&!(process.env.NODE_ENV!=='production'&&url.protocol==='http:'&&['localhost','127.0.0.1'].includes(url.hostname))))
    throw new Error('Email links require a trusted application origin.');
  return {apiKey,from,origin:url.origin};
}

const escape=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
export async function sendAuthEmail(kind:Kind,to:string,token:string,key:string,config=emailConfig(),request:typeof fetch=fetch){
  const url=config.origin+'/'+kind+'?token='+encodeURIComponent(token);
  const title=kind==='verify'?'Verify your CreatorBridge email':'Reset your CreatorBridge password';
  const label=kind==='verify'?'Verify email':'Reset password';
  const message=kind==='verify'?'Confirm your email address to continue using CreatorBridge.':'Use the link below to choose a new password.';
  const text=`${title}\n\n${message}\n\n${url}\n\nThis link expires in one hour and can only be used once. If you did not request this, ignore this email.\n\nCreatorBridge`;
  const html=`<!doctype html><html lang="en"><body style="margin:0;background:#FCFBF7;font-family:Arial,sans-serif;color:#163B36"><table role="presentation" width="100%"><tr><td style="padding:40px 20px"><table role="presentation" width="100%" style="max-width:560px;margin:auto"><tr><td><p style="font-size:20px;font-weight:bold">creatorbridge</p><div style="height:2px;background:#B88C47"></div><h1 style="font-family:Georgia,serif;font-size:30px;line-height:1.2">${title}</h1><p style="font-size:16px;line-height:1.6">${message}</p><p style="margin:28px 0"><a href="${escape(url)}" style="display:inline-block;background:#163B36;color:#FCFBF7;padding:15px 24px;border-radius:4px;text-decoration:none">${label}</a></p><p style="font-size:14px;line-height:1.6">This link expires in one hour and can only be used once. If you did not request this, ignore this email.</p><p style="font-size:14px;line-height:1.6">If the button does not work, copy this link:<br><a href="${escape(url)}" style="color:#163B36;word-break:break-all">${escape(url)}</a></p></td></tr></table></td></tr></table></body></html>`;
  let response:Response;
  try {response=await request('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+config.apiKey,'Content-Type':'application/json','Idempotency-Key':key},body:JSON.stringify({from:config.from,to:[to],subject:title,text,html}),signal:AbortSignal.timeout(10000)});}
  catch {throw new Error('Email delivery is temporarily unavailable. Please try again later.');}
  if(!response.ok)throw new Error('Email delivery is temporarily unavailable. Please try again later.');
  const result:unknown=await response.json().catch(()=>null);
  if(!result||typeof result!=='object'||!('id' in result)||typeof result.id!=='string')throw new Error('Email delivery could not be confirmed. Please try again later.');
  return result.id;
}
