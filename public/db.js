let db;
let budgetVersion;

const request = indexedDB.open('BudgetDB', budgetVersion || 1);

request.onupgradeneeded = function (e) {
    console.log('Upgrade needed in IndexDB');

    const { oldVersion } = e;
    const newVersion = e.newVersion || db.version;

    console.log(`DB upgraded from version ${oldVersion} to ${newVersion}!`);

    db = e.target.result;

    if(db.objectStoreNames.length === 0)
    db.createObjectStore('BudgetStore', { autoIncrement: true});
};