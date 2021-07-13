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

request.onerror = function (e) {
    console.log(e.target.errorCode);
};

function checkDatabase() {
    console.log('Check DB invoked');

    let transaction = db.transaction(['BudgetStore'], 'readwrite');

    const store = transaction.objectStore('BudgetStore');

    const getAll = store.getAll();

    getAll.onsuccess = function () {
        if(getAll.result.length > 0) {
            fetch('/api/transaction/bulk', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                },
            })
        }
    }
}