import { WritingOptions } from 'xlsx';
import * as XLSX from 'xlsx';

export function sheet2blob(sheet): Blob {
  const workbook = {
    SheetNames: ['sheet1'],
    Sheets: {
      sheet1: sheet
    }
  };

  const wopts: WritingOptions = {
    bookType: 'xlsx',
    bookSST: false,
    type: 'binary'
  };
  const wbout = XLSX.write(workbook, wopts);
  const blob = new Blob([s2ab(wbout)], {
    type: 'application/octet-stream'
  });
  function s2ab(s: any): ArrayBuffer {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) { view[i] = s.charCodeAt(i) & 0xFF; }
    return buf;
  }
  return blob;
}

export function startToDownload(url, saveName): void {
  if (typeof url === 'object' && url instanceof Blob) {
  url = URL.createObjectURL(url);
  }
  const aLink = document.createElement('a');
  aLink.href = url;
  aLink.download = saveName || '';
  let event;
  if (window.MouseEvent) {
    event = new MouseEvent('click');
  }
  else {
    event = document.createEvent('MouseEvents');
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
  }
  aLink.dispatchEvent(event);
}
