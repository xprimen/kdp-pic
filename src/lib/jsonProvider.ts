"use server";
import path from "path";
import fsPromises from "fs/promises";

export async function getLocalData(table: string | undefined) {
  const filePath = path.join(process.cwd(), "db-sample/db.json");
  const jsonData = await fsPromises.readFile(filePath, "utf-8");
  const objectDB = JSON.parse(jsonData);

  if (table) {
    return objectDB[table];
  } else {
    return objectDB;
  }
}
