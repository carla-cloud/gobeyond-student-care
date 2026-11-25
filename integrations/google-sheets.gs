// Bind this script to the workbook. See README.md for setup.
// "Responses" receives weekly check-ins and messages (columns A-L, plus M-Q for the five
// "How are these things going?" answers). "Final feedback" receives the end-of-journey form.
const SHEETS = {
  'feedback': {
    name: 'Responses', idColumn: 12, header: 'L1',
    cells: record => [record.created_at, record.name, record.destination, record.week, record.kind,
      record.mood, record.need, record.topic, record.note, record.priority, record.status, record.id,
      record.studies, record.housing, record.social, record.health, record.money]
  },
  'final-feedback': {
    name: 'Final feedback', idColumn: 25, header: 'Y1',
    cells: record => [record.submitted_at, record.name, record.destination, record.end_date, record.overall,
      record.recommend, record.housing_type, record.housing, record.housing_comment, record.school,
      record.school_comment, record.social, record.social_comment, record.local_support,
      record.local_support_comment, record.team_support, record.team_support_comment, record.travel,
      record.best, record.improve, record.advice, record.share_consent ? 'yes' : 'no',
      record.future_contact == null ? '' : record.future_contact ? 'yes' : 'no', record.language, record.id]
  }
};

function doPost(e) {
  let lock;
  let locked = false;
  try {
    const request = JSON.parse(e.postData.contents);
    const properties = PropertiesService.getScriptProperties();
    const secret = properties.getProperty('SHEET_APPS_SCRIPT_SECRET');
    const issuedAt = Number(request.issuedAt);
    if (!secret || typeof request.payload !== 'string' || request.payload.length > 24000 ||
        !Number.isSafeInteger(issuedAt) || Math.abs(Date.now() - issuedAt) > 300000) {
      return result_(false);
    }
    const expected = Utilities.base64EncodeWebSafe(
      Utilities.computeHmacSha256Signature(issuedAt + '.' + request.payload, secret)
    ).replace(/=+$/, '');
    if (!equal_(expected, request.signature)) return result_(false);

    const event = JSON.parse(request.payload);
    const record = event.record;
    const target = SHEETS[event.kind];
    if (!target || !record || !/^[0-9a-f-]{36}$/i.test(record.id) ||
        event.id !== event.kind + ':' + record.id) return result_(false);

    lock = LockService.getScriptLock();
    lock.waitLock(5000);
    locked = true;
    const sheet = SpreadsheetApp.openById(properties.getProperty('SPREADSHEET_ID')).getSheetByName(target.name);
    if (!sheet) return result_(false);
    const lastRow = sheet.getLastRow();
    if (lastRow < 1 || sheet.getRange(target.header).getValue() !== 'Response ID') return result_(false);
    const existing = lastRow > 1
      ? sheet.getRange(2, target.idColumn, lastRow - 1, 1).createTextFinder(record.id).matchEntireCell(true).findNext()
      : null;
    if (!existing) {
      // Force all incoming text to remain literal, including text beginning with "=".
      sheet.appendRow(target.cells(record).map(value => value == null ? '' : typeof value === 'number' ? value : "'" + value));
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
