const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function generateDump() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 3306
    });

    let dump = `-- ============================================
-- DUMP DE LA BASE DE DONNÉES LEGENDRE LOGISTIQUE
-- Généré le: ${new Date().toLocaleString('fr-FR')}
-- ============================================

SET FOREIGN_KEY_CHECKS = 0;

`;

    try {
        // Récupérer les tables
        const [tables] = await pool.query(`
            SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_SCHEMA = ?
        `, [process.env.DB_NAME]);

        for (const { TABLE_NAME } of tables) {
            console.log(`Dumping table: ${TABLE_NAME}`);

            // Ajouter DROP TABLE
            dump += `\n-- ============================================\n`;
            dump += `-- Table: ${TABLE_NAME}\n`;
            dump += `-- ============================================\n`;
            dump += `DROP TABLE IF EXISTS \`${TABLE_NAME}\`;\n\n`;

            // Récupérer CREATE TABLE
            const [createTable] = await pool.query(`SHOW CREATE TABLE \`${TABLE_NAME}\``);
            dump += createTable[0]['Create Table'] + ';\n\n';

            // Récupérer les données
            const [rows] = await pool.query(`SELECT * FROM \`${TABLE_NAME}\``);
            
            if (rows.length > 0) {
                dump += `-- Données de ${TABLE_NAME}\n`;
                const columns = Object.keys(rows[0]).map(col => `\`${col}\``).join(', ');
                
                for (const row of rows) {
                    const values = Object.values(row).map(val => {
                        if (val === null) return 'NULL';
                        if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
                        if (typeof val === 'boolean') return val ? '1' : '0';
                        if (val instanceof Date) return `'${val.toISOString().slice(0, 19).replace('T', ' ')}'`;
                        return val;
                    }).join(', ');
                    
                    dump += `INSERT INTO \`${TABLE_NAME}\` (${columns}) VALUES (${values});\n`;
                }
                dump += '\n';
            }
        }

        dump += 'SET FOREIGN_KEY_CHECKS = 1;\n';

        // Écrire dans un fichier
        const dumpPath = path.join(__dirname, `dump_${new Date().toISOString().split('T')[0]}.sql`);
        fs.writeFileSync(dumpPath, dump);

        console.log(`\n✅ Dump généré avec succès: ${dumpPath}`);
        console.log(`📊 Taille: ${(dump.length / 1024).toFixed(2)} KB`);

    } catch (err) {
        console.error('❌ Erreur dump:', err.message);
    } finally {
        await pool.end();
        process.exit(0);
    }
}

generateDump();
