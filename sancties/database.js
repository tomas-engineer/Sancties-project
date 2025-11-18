import Database from 'better-sqlite3';
import path from 'path';

const databasePath = path.join(process.cwd(), 'database.db');

const connect = () => {
    const db = new Database(databasePath);
    // Enable foreign keys in SQLite
    db.pragma('foreign_keys = ON');
    return db;
};

const create = (db) => {
    db.prepare(`DROP TABLE IF EXISTS Straffen`).run();
    db.prepare(`DROP TABLE IF EXISTS Leerlingen`).run();
    db.prepare(`DROP TABLE IF EXISTS Sancties`).run();

    // ---- Create tables with FK constraints ----
    db.prepare(`
        CREATE TABLE Sancties (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            naam TEXT,
            niveau INTEGER
        )
    `).run();

    db.prepare(`
        CREATE TABLE Leerlingen (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            naam TEXT
        )
    `).run();

    db.prepare(`
        CREATE TABLE Straffen (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            "Leerling ID" INTEGER,
            "Sanctie ID" INTEGER,
            FOREIGN KEY("Leerling ID") REFERENCES Leerlingen(ID),
            FOREIGN KEY("Sanctie ID") REFERENCES Sancties(ID)
        )
    `).run();

    console.log('Tables created with foreign key constraints.');
};

export function seed() {
    const db = connect();
    create(db);

    // ---- Insert into Sancties ----
    const sancties = [
        ['Te laat komen', 1],
        ['Ongeoorloofd afwezig', 2],
        ['Spijbelen', 3],
        ['Onbeleefd gedrag', 2],
        ['Schade aan schoolmateriaal', 3],
    ];
    const insertSanctie = db.prepare(`INSERT INTO Sancties (naam, niveau) VALUES (?, ?)`);
    sancties.forEach(s => insertSanctie.run(s[0], s[1]));

    // ---- Insert into Leerlingen ----
    const leerlingen = ['Tomas', 'Anna', 'Jeroen', 'Sofie', 'Lucas'];
    const insertLeerling = db.prepare(`INSERT INTO Leerlingen (naam) VALUES (?)`);
    leerlingen.forEach(name => insertLeerling.run(name));

    // ---- Insert into Straffen ----
    const straffen = [
        [1, 2],
        [2, 1],
        [3, 3],
        [4, 4],
        [5, 5],
    ];

    const insertStraffen = db.prepare(`INSERT INTO Straffen ("Leerling ID", "Sanctie ID") VALUES (?, ?)`);
    straffen.forEach(s => insertStraffen.run(s[0], s[1]));

    console.log('Test data inserted successfully with FK constraints.');
    db.close();
};