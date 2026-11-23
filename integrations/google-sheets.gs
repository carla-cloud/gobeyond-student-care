// Bind this script to the workbook's Responses tab. See README.md for setup.
function doPost(e) {
  let lock;
  let locked = false;
  try {
    const request = JSON.parse(e.postData.contents);
    const properties = PropertiesService.getScriptProperties();
    const secret = properties.getProperty('SHEET_APPS_SCRIPT_SECRET');
    const issuedAt = Number(request.issuedAt);
    if (!secret || typeof request.payload !== 'string' || request.payload.length > 12000 ||
        !Number.isSafeInteger(issuedAt) || Math.abs(Date.now() - issuedAt) > 300000) {
      return result_(false);
    }
    const expected = Utilities.base64EncodeWebSafe(
      Utilities.computeHmacSha256Signature(issuedAt + '.' + request.payload, secret)
    ).replace(/=+$/, '');
    if (!equal_(expected, request.signature)) return result_(false);

    const event = JSON.parse(request.payload);
    const record = event.record;
    if (event.kind !== 'feedback' || !record || !/^[0-9a-f-]{36}$/i.test(record.id) ||
        event.id !== 'feedback:' + record.id) return result_(false);

    lock = LockService.getScriptLock();
    lock.waitLock(5000);
    locked = true;
    const sheet = SpreadsheetApp.openById(properties.getProperty('SPREADSHEET_ID')).getSheetByName('Responses');
    const lastRow = sheet.getLastRow();
    if (lastRow < 1 || sheet.getRange('L1').getValue() !== 'Response ID') return result_(false);
    const existing = lastRow > 1
      ? sheet.getRange(2, 12, lastRow - 1, 1).createTextFinder(record.id).matchEntireCell(true).findNext()
      : null;
    if (!existing) {
      const cells = [record.created_at, record.name, record.destination, record.week, record.kind,
        record.mood, record.need, record.topic, record.note, record.priority, record.status, record.id];
      // Force all incoming text to remain literal, including text beginning with "=".
      sheet.appendRow(cells.map(value => value == null ? '' : typeof value === 'number' ? value : "'" + value));
      SpreadsheetApp.flush();
    }
    return result_(true);
  } catch (error) {
    return result_(false);
  } finally {
    if (locked) lock.releaseLock();
  }
}

function equal_(expected, actual) {
  if (typeof actual !== 'string' || expected.length !== actual.length) return false;
  let difference = 0;
  for (let index = 0; index < expected.length; index++) {
    difference |= expected.charCodeAt(index) ^ actual.charCodeAt(index);
  }
  return difference === 0;
}

function result_(ok) {
  return ContentService.createTextOutput(JSON.stringify({ok})).setMimeType(ContentService.MimeType.JSON);
}
