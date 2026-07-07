/**
 * dateInputに今日の日付を入力
 */
function setDateToday() {
    const dateInput = document.getElementById("dateInput");

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    dateInput.value = `${year}-${month}-${day}`;

}


// ページが読み込まれたときにRecotdを読み込み
document.addEventListener('DOMContentLoaded', () => {
    const records = storage.getRecords();
    renderRecords(records);
    setDateToday();
});


const defaultRecords = [
    {
        id: 1,
        date: "2026-01-01",
        title: "Javascript",
        hours: 2,
        category: "Frontend",
        status: "Completed"
    }
]

const STORAGE_KEY = "study_records";


/**
 * Record一覧表示処理
 */
function renderRecords(records) {
    const tbody = document.getElementById("recordsBody");
    tbody.innerHTML = "";

    console.log(records);

    records.forEach(r => {
        const tr = document.createElement("tr");

        const statusClass =
            r.status === "Completed" ? "completed" : "pending";
        tr.innerHTML = `
            <td>${r.date}</td>
            <td>${r.title}</td>
            <td>${r.hours}h</td>
            <td>${r.category}</td>

            <td>
              <span class="badge ${statusClass}">
                ${r.status}
              </span>
            </td>

            <td class="actions">
              <button onclick="openEditModal(${r.id})">Edit</button>
             <button onclick="storage.deleteRecord(${r.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

/**
 * モーダル表示処理
 * @param {*} id 
 * @returns 
 */
function openEditModal(id) {
    const records = storage.getRecords();
    const record = records.find(r => r.id === id);

    if (!record) return;

    // マッピング
    document.getElementById("editId").value = record.id;
    document.getElementById("editDate").value = record.date;
    document.getElementById("editTitle").value = record.title;
    document.getElementById("editHours").value = record.hours;
    document.getElementById("editCategory").value = record.category;
    document.getElementById("editStatus").value = record.status;
    // モーダルを表示
    document.getElementById("editModal").classList.remove("hidden");
}

/**
 * モーダル非表示
 */
function closeModal() {
    document.getElementById("editModal").classList.add("hidden");

}

/**
 * 検索条件に合うRecordを取得
 */
function searchRecord() {
    let records = storage.getRecords();

    const searchText = document.getElementById("searchText").value;
    const searchTerm = document.getElementById("searchTerm").value;

    // searchTermの値によって絞り込む期間を決定
    const now = new Date();
    let searchTermDate = null;

    if (searchTerm === "thisWeek") {
        searchTermDate = new Date();
        searchTermDate.setDate(now.getDate() - now.getDay());
        searchTermDate.setHours(0, 0, 0, 0);
    } else if (searchTerm === "thisMonth") {
        searchTermDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    records = records.filter(r => {
        const date = new Date(r.date);

        const matchTitle = r.title.includes(searchText);
        const matchPeriod =
            searchTerm === "all" || date >= searchTermDate;

        return matchTitle && matchPeriod;
    });

    renderRecords(records);

}

/**
 * inputから取得したRecordをオブジェクトに変換する
 * @returns record Learning Record
 */
function handleAddRecord() {

    // IDを計算
    const records = storage.getRecords();
    let id = 1;
    if (records !== null) {
        id = calcNextId(records);
    }

    const record = {
        id: id,
        date: document.getElementById("dateInput").value,
        title: document.getElementById("titleInput").value,
        hours: Number(document.getElementById("hoursInput").value),
        category: document.getElementById("categoryInput").value,
        status: document.getElementById("statusInput").value
    }

    storage.addRecord(record);
}

/**
 * 今あるデータの次のIDを取得
 * @param records 
 * @returns maxId + 1 次のID
 */
function calcNextId(records) {
    if (records.length === 0) {
        return 1;
    }

    const maxId = Math.max(
        ...records.map(record => record.id)
    );
    return maxId + 1;
}