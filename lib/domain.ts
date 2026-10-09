import {Booking,User} from './models';
export const categories=['Beauty and personal care','Fashion and lifestyle','Food and hospitality'];
export const services=['Content production','Sponsored distribution'];
export function fee(amount:number,bps=1500){if(!Number.isSafeInteger(amount)||amount<=0||!Number.isInteger(bps)||bps<0||bps>10000)throw new Error('Invalid price');const value=Math.round(amount*bps/10000);if(!Number.isSafeInteger(value)||!Number.isSafeInteger(amount+value))throw new Error('Price too large');return value;}
export function naira(kobo:number|string){return new Intl.NumberFormat('en-NG',{style:'currency',currency:'NGN',maximumFractionDigits:2}).format(Number(kobo)/100);}
export function allowedMember(role:string,action:string){const permissions:Record<string,string[]>={read:['owner','editor','approver','finance','viewer'],brief:['owner','editor'],accept:['owner','approver'],sign:['owner','approver'],fund:['owner','finance'],approve:['owner','approver'],dispute:['owner','approver']};return permissions[action]?.includes(role)??false;}
export function guardTransition(b:Booking,action:string,user:User){
 if(b.disputed&&['fund','submit','approve','payout'].includes(action))throw new Error('This booking has an open exception.');
 if(action==='fund'&&(!b.brand_signed_at||!b.creator_signed_at))throw new Error('Both parties must accept the contract first.');
 if(action==='submit'&&(b.creator_id!==user.id||b.funding!=='funded'||!['in_production','revision_requested'].includes(b.delivery)))throw new Error('Only the assigned creator can submit funded work.');
 if(action==='approve'&&b.delivery!=='in_review')throw new Error('Only a submitted version can be accepted.');
 if(action==='revision'&&(b.delivery!=='in_review'||b.revision_count>=2))throw new Error('Revision unavailable; two included rounds maximum.');
 if(action==='payout'&&(b.delivery!=='accepted'||b.funding!=='funded'||b.compliance!=='sandbox_cleared'))throw new Error('Accepted delivery and sandbox compliance review are required.');
}
export function nextAction(b:Booking){if(b.disputed)return 'Operations is reviewing an exception';if(!b.brand_signed_at||!b.creator_signed_at)return 'Both parties accept the contract';if(b.funding!=='funded')return 'Brand confirms simulated funding';if(b.delivery==='in_production'||b.delivery==='revision_requested')return 'Creator submits the next version';if(b.delivery==='in_review')return 'Brand reviews the submitted version';if(b.compliance!=='sandbox_cleared')return 'Operations reviews sandbox compliance';if(b.payout!=='paid')return 'Brand simulates creator payout';return 'Booking complete · sandbox only';}
