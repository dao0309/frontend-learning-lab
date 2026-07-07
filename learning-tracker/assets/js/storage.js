const storage = {
    /**
 * Recordの取得処理
 * @returns data Learning Records
 */
    getRecords() {
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
    },

    /**
     * Record追加処理
     * @param record Learning Record
     */
    addRecord(record) {
        const records = storage.getRecords();
        records.push(record);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
        searchRecord();
    },

    /**
     * Record削除処理
     * @param {*} id 
     */
    deleteRecord(id) {
        let records = storage.getRecords();
        records = records.filter(r => r.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
        renderRecords(records);
    },

    /**
     * 編集したLearning RecordをLocalStrageに保存
     * @returns 
     */
    saveEditedRecord() {
        const id = Number(document.getElementById("editId").value);
        const records = storage.getRecords();
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
        renderRecords(records);

    }
}