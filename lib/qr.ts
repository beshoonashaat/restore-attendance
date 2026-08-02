import QRCode from 'qrcode';
export async function qrDataUrl(url:string){return QRCode.toDataURL(url,{errorCorrectionLevel:'H',margin:1,scale:8,color:{dark:'#0b2a4d',light:'#f4ecd7'}})}
export function cardUrl(uuid:string){return `${process.env.NEXT_PUBLIC_APP_URL||'http://localhost:3000'}/card/${uuid}`}
