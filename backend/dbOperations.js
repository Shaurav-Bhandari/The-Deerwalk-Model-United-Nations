const { Pool } = require('pg');
const fs = require('fs');
const { Parser } = require('json2csv');

// Load environment variables
require('dotenv').config();

// Log database configuration for debugging
console.log('Database config:', {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD ? '[REDACTED]' : undefined,
  port: process.env.DB_PORT,
});

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function clearDatabase() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM "Executive"');
    await client.query('DELETE FROM "Delegate"');
    await client.query('DELETE FROM "User"');
    await client.query('ALTER SEQUENCE "User_id_seq" RESTART WITH 1');
    await client.query('ALTER SEQUENCE "Delegate_id_seq" RESTART WITH 1');
    await client.query('ALTER SEQUENCE "Executive_id_seq" RESTART WITH 1');
    await client.query('COMMIT');
    console.log('Database cleared successfully');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error clearing database:', err);
  } finally {
    client.release();
  }
}

async function connectAndListen() {
  const client = await pool.connect();
  try {
    // Create a trigger function and trigger for both Delegate and Executive tables
    await client.query(`
      CREATE OR REPLACE FUNCTION notify_new_entry()
      RETURNS trigger AS $$
      BEGIN
        PERFORM pg_notify('new_entry', TG_TABLE_NAME || ',' || NEW.id::text);
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      DROP TRIGGER IF EXISTS new_delegate_trigger ON "Delegate";
      CREATE TRIGGER new_delegate_trigger
      AFTER INSERT ON "Delegate"
      FOR EACH ROW EXECUTE FUNCTION notify_new_entry();

      DROP TRIGGER IF EXISTS new_executive_trigger ON "Executive";
      CREATE TRIGGER new_executive_trigger
      AFTER INSERT ON "Executive"
      FOR EACH ROW EXECUTE FUNCTION notify_new_entry();
    `);

    // Listen for notifications
    client.on('notification', async (msg) => {
      if (msg.channel === 'new_entry') {
        const [table, id] = msg.payload.split(',');
        console.log(`New entry added to ${table}, exporting table...`);
        await exportTableToCSV(table, `${table.toLowerCase()}_export.csv`);
      }
    });

    await client.query('LISTEN new_entry');
  } catch (err) {
    console.error('Error in connectAndListen:', err);
  } finally {
    client.release();
  }
}


// Load environment variables
require('dotenv').config();


async function exportTableToCSV(tableName, outputFile) {
  const client = await pool.connect();
  try {
    const res = await client.query(`SELECT * FROM "${tableName}"`);
    const fields = Object.keys(res.rows[0]);
    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse(res.rows);
    fs.writeFileSync(outputFile, csv);
    console.log(`Table ${tableName} exported to ${outputFile}`);
  } catch (err) {
    console.error(`Error exporting table ${tableName} to CSV:`, err);
  } finally {
    client.release();
  }
}

async function exportAllTablesToCSV() {
  const tables = ['User', 'Delegate', 'Executive'];
  for (const table of tables) {
    await exportTableToCSV(table, `${table.toLowerCase()}_export.csv`);
  }
  console.log('All tables exported to CSV');
}

async function insertUser(userData) {
  const client = await pool.connect();
  try {
    const currentTime = new Date();
    const result = await client.query(
      'INSERT INTO "User" ("fullName", email, "contactInfo", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [userData.fullName, userData.email, userData.contactInfo, currentTime, currentTime]
    );
    return result.rows[0].id;
  } catch (err) {
    console.error('Error inserting user:', err);
    throw err;
  } finally {
    client.release();
  }
}


async function insertDelegate(userId, delegateData) {
  const client = await pool.connect();
  try {
    console.log('Inserting delegate with data:', { userId, ...delegateData });
    const currentTime = new Date();
    const query = `
      INSERT INTO "Delegate" ("userId", institute, address, grade, "munExperience", "primaryCommittee", "secondaryCommittee", "foodPreference", "paymentMethod", "transactionRecipt", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id
    `;
    const values = [
      userId,
      delegateData.institute,
      delegateData.address,
      delegateData.grade,
      delegateData.munExperience,
      delegateData.primaryCommittee,
      delegateData.secondaryCommittee,
      delegateData.foodPreference,
      delegateData.paymentMethod,
      delegateData.transactionReceipt,
      currentTime,
      currentTime
    ];
    
    const res = await client.query(query, values);
    console.log('Delegate inserted successfully, returned ID:', res.rows[0].id);
    return res.rows[0].id;
  } catch (err) {
    console.error('Error inserting delegate:', err);
    throw err;
  } finally {
    client.release();
  }
}

async function insertExecutive(userId, executiveData) {
  const client = await pool.connect();
  try {
    console.log('Inserting executive with data:', { userId, ...executiveData });
    const currentTime = new Date();
    const query = `
      INSERT INTO "Executive" ("userId", committee, position, "cvUrl", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;
    const values = [
      userId,
      executiveData.committee,
      executiveData.position,
      executiveData.cvUrl,
      currentTime,
      currentTime
    ];
    
    const res = await client.query(query, values);
    console.log('Executive inserted successfully, returned ID:', res.rows[0].id);
    return res.rows[0].id;
  } catch (err) {
    console.error('Error inserting executive:', err);
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  exportAllTablesToCSV,
  insertUser,
  insertDelegate,
  insertExecutive
};