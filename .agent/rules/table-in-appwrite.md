---
trigger: always_on
---

Appwrite uses tables as containers of rows. Each tables contains many rows
identical in structure. The terms tables and rows are used because the Appwrite
JSON REST API resembles the API of a traditional NoSQL database, making it
intuitive and user-friendly, even though Appwrite uses SQL under the hood.

That said, Appwrite is designed to support both SQL and NoSQL database adapters
like MariaDB, MySQL, or MongoDB in future versions.

You can also create tables programmatically using a Server SDK. Appwrite Server
SDKs require an API key. const sdk = require('node-appwrite');

// Init SDK const client = new sdk.Client();

const tablesDB = new sdk.TablesDB(client);

client .setEndpoint('https://<REGION>.cloud.appwrite.io/v1') // Your API
Endpoint .setProject('<PROJECT_ID>') // Your project ID
.setKey('919c2d18fb5d4...a2ae413da83346ad2') // Your secret API key ;

const promise = tablesDB.createTable({ databaseId: '<DATABASE_ID>', tableId:
'<TABLE_ID>', name: '<NAME>', columns: [ { key: 'email', type: 'email',
required: true }, { key: 'name', type: 'string', size: 255, required: true }, {
key: 'age', type: 'integer', required: false }, { key: 'score', type: 'float',
required: false }, { key: 'is_active', type: 'boolean', required: true }, { key:
'created_at', type: 'datetime', required: false }, { key: 'status', type:
'enum', elements: ['draft', 'published', 'archived'], required: true }, { key:
'ip_address', type: 'ip', required: false }, { key: 'website', type: 'url',
required: false }, { key: 'location', type: 'point', required: false }, { key:
'path', type: 'line', required: false }, { key: 'area', type: 'polygon',
required: false }, { key: 'related_items', type: 'relationship', relatedTableId:
'<RELATED_TABLE_ID>', relationType: 'manyToMany', twoWay: true, twoWayKey:
'items', onDelete: 'cascade', required: false } ], indexes: [ { key:
'idx_email', type: 'unique', attributes: ['email'] }, { key: 'idx_name', type:
'key', attributes: ['name'] }, { key: 'idx_name_fulltext', type: 'fulltext',
attributes: ['name'] } ] });

promise.then(function (response) { console.log(response); }, function (error) {
console.log(error); });
