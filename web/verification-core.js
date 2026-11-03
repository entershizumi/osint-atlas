import {getPosition,getTimes} from './vendor/suncalc.js';
export function calculateSun({lat,lon,date,time,offset=0,height=1}){
 for(const [key,value,min,max] of [['Широта',lat,-90,90],['Долгота',lon,-180,180],['Смещение UTC',offset,-12,14],['Высота объекта',height,.01,10000]])if(!Number.isFinite(value)||value<min||value>max)throw Error(`${key}: значение вне допустимого диапазона.`);
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!/^\d{2}:\d{2}$/.test(time))throw Error('Укажите дату и время.');
 const naive=Date.parse(`${date}T${time}:00Z`);if(!Number.isFinite(naive)||new Date(naive).toISOString().slice(0,16)!==`${date}T${time}`)throw Error('Проверьте дату и время.');
 const instant=new Date(naive-offset*3600000),position=getPosition(instant,lat,lon),events=getTimes(instant,lat,lon,0,Math.round(offset*60));
 return {lat,lon,instant:instant.toISOString(),offset,height,azimuth:position.azimuth,altitude:position.altitude,shadowDirection:(position.azimuth+180)%360,shadowLength:position.altitude>0?height/Math.tan(position.altitude*Math.PI/180):null,events:Object.fromEntries(['dawn','sunrise','solarNoon','sunset','dusk'].map(key=>[key,events[key]?.toISOString()||null])),alwaysUp:!!events.alwaysUp,alwaysDown:!!events.alwaysDown};
}
export function inspectQR(data){
 const text=String(data),warnings=[];let kind='Текст',url=null,domain=null,coordinates=null;
 if(/^https?:\/\//i.test(text)){try{const parsed=new URL(text);domain=parsed.hostname;kind='Веб-ссылка';if(parsed.protocol==='http:')warnings.push('Используется HTTP без шифрования.');if(parsed.hostname.split('.').some(x=>x.startsWith('xn--')))warnings.push('Домен использует Punycode: проверьте его написание.');if(parsed.username||parsed.password)warnings.push('В адресе есть поле учётных данных перед символом @. Сверяйте настоящий домен.');else url=parsed.href;}catch{warnings.push('Адрес не удалось разобрать.');}}
 else if(/^WIFI:/i.test(text))kind='Настройки Wi-Fi';
 else if(/^BEGIN:VCARD/i.test(text))kind='Контакт vCard';
 else if(/^mailto:/i.test(text))kind='Email';
 else if(/^tel:|^SMSTO:/i.test(text))kind='Телефон / сообщение';
 else if(/^geo:/i.test(text)){kind='Координаты';const m=text.match(/^geo:([+-]?[\d.]+),([+-]?[\d.]+)/i);if(m){const lat=Number(m[1]),lon=Number(m[2]);if(Number.isFinite(lat)&&Number.isFinite(lon)&&Math.abs(lat)<=90&&Math.abs(lon)<=180)coordinates={lat,lon};}}
 return {text,kind,url,domain,coordinates,warnings};
}
