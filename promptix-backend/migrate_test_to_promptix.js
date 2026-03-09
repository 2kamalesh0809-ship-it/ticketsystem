const mongoose = require('mongoose');

// Source and Destination URIs
const SOURCE_URI = 'mongodb+srv://kamalesh0809:Geethaamma0809@cluster0.nrlmzup.mongodb.net/test?appName=Cluster0';
const DEST_URI = 'mongodb+srv://kamalesh0809:Geethaamma0809@cluster0.nrlmzup.mongodb.net/PROMPTIX?appName=Cluster0';

async function migrateData() {
    try {
        console.log('--- Starting Data Migration from "test" to "PROMPTIX" ---');

        // Connect to Source
        const sourceConn = await mongoose.createConnection(SOURCE_URI).asPromise();
        console.log('Connected to source database: "test"');

        // Connect to Destination
        const destConn = await mongoose.createConnection(DEST_URI).asPromise();
        console.log('Connected to destination database: "PROMPTIX"');

        const collections = ['users', 'customers', 'tickets', 'calllogs'];

        for (const colName of collections) {
            console.log(`\nMigrating collection: ${colName}...`);

            const sourceModel = sourceConn.model(colName, new mongoose.Schema({}, { strict: false }), colName);
            const destModel = destConn.model(colName, new mongoose.Schema({}, { strict: false }), colName);

            const documents = await sourceModel.find({});
            console.log(`Found ${documents.length} documents in source "${colName}".`);

            if (documents.length > 0) {
                // Remove existing ones in destination to avoid duplicates if re-run
                // (Optional: depending on if we want a clean merge)
                // await destModel.deleteMany({}); 

                // Filter out documents that already exist in destination
                const existingDocs = await destModel.find({});
                const existingIds = new Set(existingDocs.map(d => d._id.toString()));

                const docsToInsert = documents.filter(d => !existingIds.has(d._id.toString()));

                if (docsToInsert.length > 0) {
                    await destModel.insertMany(docsToInsert);
                    console.log(`Successfully migrated ${docsToInsert.length} new documents to "${colName}".`);
                } else {
                    console.log(`No new documents to migrate for "${colName}".`);
                }
            }
        }

        console.log('\n--- Migration Complete! ---');
        await sourceConn.close();
        await destConn.close();
        process.exit(0);

    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrateData();
