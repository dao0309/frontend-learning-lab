const studyRecords = [
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

function getRecords(){
    // return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    return studyRecords;
}

function saveRecords(){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function renderRecords() {
    const tbody = document.createElement("tbody");
    list.innerHTML = "";

    const records = getRecords();

    records.forEach(r => {
        const tr = document.createElement("tr");

        const statusClass =
            r.status === "Completed" ? "completed" : "pending";
        tr.innerHTML = `
          <tr>
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
              <button>Edit</button>
             <button>Delete</button>
            </td>
          </tr>
        `
    });
}

function addRecord(record){
    const records = getRecords();
    records.push(record);
    saveRecords(records);
    renderRecords();
}

function deleteRecord(id) {
    let records = getRecords;
    records = records.filter(r => r.id !== id);
    saveRecords();
}

function UpdateRecord(updated) {
    let records = getRecords();
    records = records.map(r =>
        r.id === updated.id ? updated : r
    );

    saveRecords(records);
    renderRecords();

}