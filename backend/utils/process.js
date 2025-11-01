import xlsx from "xlsx";
import fs from "fs";

const workbook = xlsx.readFile("7C5D1C90.xlsx");
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(sheet);
fs.writeFileSync("portfolio.json", JSON.stringify(data, null, 2));
