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
    renderRecords();
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
 * Recordの取得処理
 * @returns data Learning Records
 */
function getRecords() {
    const raw = localStorage.getItem(STORAGE_KEY);

    // データが存在しない場合、初期データをlocalstorageに保存して表示
    if (!raw) {
        localStorage.setItem(
            STORAGE_KEY, JSON.stringify(defaultRecords)
        );

        return defaultRecords;
    }

    const data = JSON.parse(raw);

    // 配列でない場合、初期データをlocalstorageに保存して表示
    if (!Array.isArray(data)) {
        localStorage.setItem(
            STORAGE_KEY, JSON.stringify(defaultRecords)
        );
        return defaultRecords;
    }
    return data;
}

/**
 * Recordの保存処理
 * @param records Learning Records
 */
function saveRecords(records) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

/**
 * Record一覧表示処理
 */
function renderRecords() {
    const tbody = document.getElementById("recordsBody");
    tbody.innerHTML = "";

    const records = getRecords();
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
             <button onclick="deleteRecord(${r.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}



/**
 * Record追加処理
 * @param record Learning Record
 */
function addRecord(record) {
    const records = getRecords();
    records.push(record);
    saveRecords(records);
    renderRecords();
}

/**
 * Record削除処理
 * @param {*} id 
 */
function deleteRecord(id) {
    let records = getRecords();
    records = records.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    renderRecords();
}

/**
 * 編集したLearning RecordをLocalStrageに保存
 * @returns 
 */
function saveEditedRecord() {
    const id = Number(document.getElementById("editId").value);
    const records = getRecords();
    const index = records.findIndex(r => r.id === id);

    if (index === -1) return;

    records[index] = {
        ...records[index],
        date: document.getElementById("editDate").value,
        title: document.getElementById("editTitle").value,
        hours: Number(document.getElementById("editHours").value),
        category: document.getElementById("editCategory").value,
        status: document.getElementById("editStatus").value
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));

    closeModal();
    renderRecords();

}

/**
 * モーダル表示処理
 * @param {*} id 
 * @returns 
 */
function openEditModal(id) {
    const records = getRecords();
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
 * inputから取得したRecordをオブジェクトに変換する
 * @returns record Learning Record
 */
function handleAddRecord() {

    // IDを計算
    const records = getRecords();
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

    addRecord(record);
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