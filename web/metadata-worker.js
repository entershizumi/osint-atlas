import exifr from './vendor/exifr.js';
import {PDFDocument} from './vendor/pdf-lib.js';
import {unzipSync,strFromU8} from './vendor/fflate.js';
const LIMIT=25*1024*1024;
function clean(value){if(value instanceof Date)return value.toISOString();if(ArrayBuffer.isView(value))return `[Бинарные данные: ${value.byteLength} байт]`;if(Array.isArray(value))return value.slice(0,60).map(clean).join(', ');if(value&&typeof value==='object')return JSON.stringify(value).slice(0,4000);return String(value??'').slice(0,4000);}
export async function extractMetadata(bytes,name){if(bytes.byteLength>LIMIT)throw Error('Максимальный размер файла — 25 МБ.');const ext=name.toLowerCase().split('.').pop();let values={},xml=null,kind='';
 if(['jpg','jpeg','tif','tiff','png','heic','heif','avif'].includes(ext)){kind='EXIF / XMP / IPTC';values=await exifr.parse(bytes,{tiff:true,exif:true,gps:true,xmp:true,iptc:true,icc:false,jfif:true,ihdr:true,reviveValues:false})||{};}
 else if(ext==='pdf'){kind='PDF · свойства документа (Info)';const pdf=await PDFDocument.load(bytes,{updateMetadata:false,ignoreEncryption:false,throwOnInvalidObject:true});for(const [key,method] of [['Title','getTitle'],['Author','getAuthor'],['Subject','getSubject'],['Creator','getCreator'],['Producer','getProducer'],['Keywords','getKeywords'],['CreationDate','getCreationDate'],['ModificationDate','getModificationDate']]){try{const value=pdf[method]();if(value!==undefined)values[key]=value;}catch{values[key]='Не удалось прочитать поле';}}values.PageCount=pdf.getPageCount();}
 else if(['docx','xlsx','pptx','odt','ods','odp'].includes(ext)){kind='Свойства Office / OpenDocument';let count=0;const wanted=new Set(['docProps/core.xml','docProps/app.xml','docProps/custom.xml','meta.xml']);const zip=unzipSync(bytes,{filter:file=>{if(++count>12000)throw Error('Слишком много записей в документе.');if(!wanted.has(file.name))return false;if(file.originalSize>512*1024)throw Error('Блок метаданных превышает допустимый размер.');return true;}});xml=Object.entries(zip).map(([path,data])=>({path,text:strFromU8(data)}));}
 else throw Error('Поддерживаются JPG, TIFF, PNG, HEIC/AVIF, PDF, DOCX, XLSX, PPTX, ODT, ODS и ODP. Старые DOC/XLS и видео пока не поддерживаются.');
 const gps=Number.isFinite(values.latitude)&&Number.isFinite(values.longitude)?{lat:values.latitude,lon:values.longitude}:null;
 const entries=Object.entries(values).filter(([,v])=>v!==undefined&&v!==null&&clean(v)!=='').slice(0,350).map(([key,value])=>({key,value:clean(value)}));
 return {name,kind,gps,entries,xml};
}
if(typeof self!=='undefined'&&typeof self.postMessage==='function'&&!('document' in self))self.onmessage=async e=>{try{self.postMessage({ok:true,result:await extractMetadata(new Uint8Array(e.data.bytes),e.data.name)});}catch(error){self.postMessage({ok:false,error:/encrypt/i.test(error.message)?'PDF защищён шифрованием. Снимите защиту в своём редакторе и попробуйте снова.':error.message});}};
