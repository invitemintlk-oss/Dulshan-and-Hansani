// @ts-nocheck
/**
 * Dulshan & Hashini — Wedding RSVP & Wishes backend (Google Apps Script)
 *
 * Spreadsheet:
 * https://docs.google.com/spreadsheets/d/10FkzcIt58XXUDPWUDzwinK4Lj9maWufTxwcqW5II5hc/edit
 *
 * SETUP
 * 1. Open the spreadsheet → Extensions → Apps Script.
 * 2. Replace everything in Code.gs with this file and click Save.
 * 3. Select the `setup` function in the toolbar and click Run (approve the permissions once).
 *    This creates the "RSVP" and "Wishes" sheets with styled headers.
 * 4. Deploy → New deployment → type "Web app"
 *      Execute as:      Me
 *      Who has access:  Anyone
 *    Copy the Web app URL (ends in /exec) into GOOGLE_SCRIPT_URL in src/config.ts.
 * 5. After any later change to this script: Deploy → Manage deployments → Edit → Version: New version.
 *
 * Sheets are also created automatically on the first submission if they are missing,
 * and missing header rows are restored automatically.
 */

const SPREADSHEET_ID = '10FkzcIt58XXUDPWUDzwinK4Lj9maWufTxwcqW5II5hc';
const TIME_ZONE = 'Asia/Colombo';

const SHEETS = {
  RSVP: {
    name: 'RSVP',
    headers: ['Timestamp', 'Invited As', 'Full Name', 'Attending', 'No. of Guests', 'Phone', 'Notes'],
    widths: [170, 200, 220, 110, 120, 140, 320],
    headerColor: '#f5c518',
  },
  Wishes: {
    name: 'Wishes',
    headers: ['Timestamp', 'Invited As', 'Name', 'Wish'],
    widths: [170, 200, 220, 520],
    headerColor: '#ffe266',
  },
};

/** Run once from the Apps Script editor to create both sheets and authorize the script. */
function setup() {
  const ss = getSpreadsheet_();
  Object.keys(SHEETS).forEach(function (key) {
    getOrCreateSheet_(ss, SHEETS[key]);
  });
  // Remove the empty default sheet if it is still there.
  const defaultSheet = ss.getSheetByName('Sheet1');
  if (defaultSheet && ss.getSheets().length > 1 && defaultSheet.getLastRow() === 0) {
    ss.deleteSheet(defaultSheet);
  }
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);

    const data = parseBody_(e);
    const type = String(data.type || '').trim();
    const ss = getSpreadsheet_();
    const now = Utilities.formatDate(new Date(), TIME_ZONE, 'yyyy-MM-dd HH:mm:ss');

    if (type === 'RSVP') {
      const name = clean_(data.name);
      if (!name) throw new Error('Name is required.');
      const attending = clean_(data.attending) || 'Yes';
      const guests = attending === 'No' ? 0 : Number(data.guests) || 1;

      const sheet = getOrCreateSheet_(ss, SHEETS.RSVP);
      sheet.appendRow([now, clean_(data.invitedAs), name, attending, guests, clean_(data.phone), clean_(data.notes)]);
    } else if (type === 'Wishes') {
      const name = clean_(data.name);
      const message = clean_(data.message);
      if (!name || !message) throw new Error('Name and message are required.');

      const sheet = getOrCreateSheet_(ss, SHEETS.Wishes);
      sheet.appendRow([now, clean_(data.invitedAs), name, message]);
    } else {
      throw new Error("Invalid type. Must be 'RSVP' or 'Wishes'.");
    }

    return json_({ result: 'success' });
  } catch (error) {
    return json_({ result: 'error', error: String(error && error.message ? error.message : error) });
  } finally {
    lock.releaseLock();
  }
}

/** Health check: open the /exec URL in a browser to confirm the deployment works. */
function doGet() {
  return json_({ result: 'ok', service: 'Dulshan & Hashini Wedding RSVP', sheets: Object.keys(SHEETS) });
}

// ───────────────────────── helpers ─────────────────────────

function getSpreadsheet_() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

/** Returns the sheet, creating it and/or its header row when missing. */
function getOrCreateSheet_(ss, config) {
  let sheet = ss.getSheetByName(config.name);
  if (!sheet) sheet = ss.insertSheet(config.name);

  const cols = config.headers.length;
  const headerRange = sheet.getRange(1, 1, 1, cols);
  const current = headerRange.getValues()[0];
  const hasHeaders = config.headers.every(function (h, i) {
    return current[i] === h;
  });

  if (!hasHeaders) {
    if (sheet.getLastRow() > 0 && current.some(function (v) { return v !== ''; })) {
      // Existing data without our headers: push it down rather than overwrite it.
      sheet.insertRowBefore(1);
    }
    sheet.getRange(1, 1, 1, cols).setValues([config.headers]);
    styleHeader_(sheet, config);
  }
  return sheet;
}

function styleHeader_(sheet, config) {
  const cols = config.headers.length;
  sheet
    .getRange(1, 1, 1, cols)
    .setFontWeight('bold')
    .setFontColor('#3d2f06')
    .setBackground(config.headerColor)
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');
  sheet.setRowHeight(1, 32);
  sheet.setFrozenRows(1);
  config.widths.forEach(function (w, i) {
    sheet.setColumnWidth(i + 1, w);
  });
  // Wrap long text columns (last column) for readability.
  sheet.getRange(1, cols, sheet.getMaxRows(), 1).setWrap(true);
}

/** Supports application/x-www-form-urlencoded (used by the website) and JSON bodies. */
function parseBody_(e) {
  if (!e) return {};
  if (e.postData && e.postData.type === 'application/json') {
    try {
      return JSON.parse(e.postData.contents || '{}');
    } catch (err) {
      return {};
    }
  }
  return e.parameter || {};
}

/** Trims, limits length and neutralises spreadsheet formula injection. */
function clean_(value) {
  let text = String(value == null ? '' : value).trim().slice(0, 1000);
  if (/^[=+\-@]/.test(text)) text = "'" + text;
  return text;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
