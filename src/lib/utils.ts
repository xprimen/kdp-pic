import { QueryClient } from "@tanstack/react-query";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const queryClient = new QueryClient();

export function decodeToken<T>(
  token: string
): T & { iat: number; exp: number } {
  let base64Url = token.split(".")[1]; // token you get
  let base64 = base64Url.replace("-", "+").replace("_", "/");
  let decodedData = JSON.parse(
    Buffer.from(base64, "base64").toString("binary")
  );

  return decodedData;
}

export function terbilang(nilai: number = 0): string {
  // deklarasi variabel nilai sebagai angka matemarika
  // Objek Math bertujuan agar kita bisa melakukan tugas matemarika dengan javascript
  nilai = Math.floor(Math.abs(nilai));

  // deklarasi nama angka dalam bahasa indonesia
  var huruf = [
    "",
    "Satu",
    "Dua",
    "Tiga",
    "Empat",
    "Lima",
    "Enam",
    "Tujuh",
    "Delapan",
    "Sembilan",
    "Sepuluh",
    "Sebelas",
  ];

  // menyimpan nilai default untuk pembagian
  var bagi = 0;
  // deklarasi variabel penyimpanan untuk menyimpan proses rumus terbilang
  var penyimpanan = "";

  // rumus terbilang
  if (nilai < 12) {
    penyimpanan = " " + huruf[nilai];
  } else if (nilai < 20) {
    penyimpanan = terbilang(Math.floor(nilai - 10)) + " Belas";
  } else if (nilai < 100) {
    bagi = Math.floor(nilai / 10);
    penyimpanan = terbilang(bagi) + " Puluh" + terbilang(nilai % 10);
  } else if (nilai < 200) {
    penyimpanan = " Seratus" + terbilang(nilai - 100);
  } else if (nilai < 1000) {
    bagi = Math.floor(nilai / 100);
    penyimpanan = terbilang(bagi) + " Ratus" + terbilang(nilai % 100);
  } else if (nilai < 2000) {
    penyimpanan = " Seribu" + terbilang(nilai - 1000);
  } else if (nilai < 1000000) {
    bagi = Math.floor(nilai / 1000);
    penyimpanan = terbilang(bagi) + " Ribu" + terbilang(nilai % 1000);
  } else if (nilai < 1000000000) {
    bagi = Math.floor(nilai / 1000000);
    penyimpanan = terbilang(bagi) + " Juta" + terbilang(nilai % 1000000);
  } else if (nilai < 1000000000000) {
    bagi = Math.floor(nilai / 1000000000);
    penyimpanan = terbilang(bagi) + " Miliar" + terbilang(nilai % 1000000000);
  } else if (nilai < 1000000000000000) {
    bagi = Math.floor(nilai / 1000000000000);
    penyimpanan =
      terbilang(nilai / 1000000000000) +
      " Triliun" +
      terbilang(nilai % 1000000000000);
  }

  // mengambalikan nilai yang ada dalam variabel penyimpanan
  return penyimpanan;
}

export const numberToString = (
  number: number,
  separator: "." | "," = "."
): string => {
  const number_string = number.toString(),
    divided = number_string.length % 3;
  let numbering = number_string.slice(0, divided),
    thousand = number_string.slice(divided).match(/\d{3}/g);

  if (thousand) {
    const separators = divided ? separator : "";
    numbering += separators + thousand.join(separator);
    return numbering;
  }

  return String(number);
};
