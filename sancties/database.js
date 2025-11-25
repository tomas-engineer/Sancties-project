import Database from "better-sqlite3";
import path from "path";

const databasePath = path.join(process.cwd(), "database.db");

const connect = () => {
   const db = new Database(databasePath);
   db.pragma("foreign_keys = ON");
   return db;
};

const create = (db) => {
   db.prepare(`DROP TABLE IF EXISTS Straffen`).run();
   db.prepare(`DROP TABLE IF EXISTS Leerlingen`).run();
   db.prepare(`DROP TABLE IF EXISTS Sancties`).run();

   db.prepare(
      `
        CREATE TABLE Sancties (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            naam TEXT,
            niveau INTEGER
        )
    `
   ).run();

   db.prepare(
      `
        CREATE TABLE Leerlingen (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            naam TEXT
        )
    `
   ).run();

   db.prepare(
      `
        CREATE TABLE Straffen (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            "Leerling ID" INTEGER,
            "Sanctie ID" INTEGER,
            FOREIGN KEY("Leerling ID") REFERENCES Leerlingen(ID),
            FOREIGN KEY("Sanctie ID") REFERENCES Sancties(ID)
        )
    `
   ).run();

   console.log("Tables created with foreign key constraints.");
};

export function seed() {
   const db = connect();
   create(db);

   const sancties = [
      ["Te laat komen", 1],
      ["Ongeoorloofd afwezig", 2],
      ["Spijbelen", 3],
      ["Onbeleefd gedrag", 2],
      ["Schade aan schoolmateriaal", 3],
   ];
   const insertSanctie = db.prepare(
      `INSERT INTO Sancties (naam, niveau) VALUES (?, ?)`
   );
   sancties.forEach((s) => insertSanctie.run(s[0], s[1]));

   const leerlingen = ["Tomas", "Anna", "Jeroen", "Sofie", "Lucas"];
   const insertLeerling = db.prepare(
      `INSERT INTO Leerlingen (naam) VALUES (?)`
   );
   leerlingen.forEach((name) => insertLeerling.run(name));

   const straffen = [
      [1, 2],
      [2, 1],
      [3, 3],
      [4, 4],
      [5, 5],
   ];

   const insertStraffen = db.prepare(
      `INSERT INTO Straffen ("Leerling ID", "Sanctie ID") VALUES (?, ?)`
   );
   straffen.forEach((s) => insertStraffen.run(s[0], s[1]));

   console.log("Test data inserted successfully with FK constraints.");
   db.close();
}

export function FetchLeerlingen() {
   const db = connect();

   const stmt = db.prepare(`
        SELECT 
            l.ID as leerlingID,
            l.naam as leerlingNaam,
            s.ID as sanctieID,
            s.naam as sanctieNaam,
            s.niveau as sanctieNiveau
        FROM Leerlingen l
        LEFT JOIN Straffen st ON st."Leerling ID" = l.ID
        LEFT JOIN Sancties s ON s.ID = st."Sanctie ID"
        ORDER BY l.ID
    `);

   const rows = stmt.all();
   db.close();

   const result = [];
   const map = new Map();

   rows.forEach((row) => {
      if (!map.has(row.leerlingID)) {
         map.set(row.leerlingID, {
            ID: row.leerlingID,
            naam: row.leerlingNaam,
            sancties: [],
         });
         result.push(map.get(row.leerlingID));
      }

      if (row.sanctieID !== null) {
         map.get(row.leerlingID).sancties.push({
            ID: row.sanctieID,
            naam: row.sanctieNaam,
            niveau: row.sanctieNiveau,
         });
      }
   });

   return result;
}

export function DeleteLeerling(id) {
   const db = connect();

   try {
      const stmt = db.prepare(`DELETE FROM Leerlingen WHERE ID = ?`);
      const result = stmt.run(id);

      db.close();

      return result.changes > 0;
   } catch (error) {
      db.close();
      console.error("Delete error:", error);
      return false;
   }
}

export function FetchSancties() {
   const db = connect();

   const stmt = db.prepare("SELECT * FROM Sancties");
   const rows = stmt.all();

   db.close();

   return rows;
}
