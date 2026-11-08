
// ----------------------------
// Add New Row
// ----------------------------
window.addRow = function(button) {

    const headerCount =
        document.querySelectorAll(
            "#headerRow th"
        ).length - 1;

    const tbody =
        document.querySelector(
            "#dataTable tbody"
        );

    const row =
        document.createElement("tr");

    let html = "";

    for(let i = 0; i < headerCount; i++) {

        html += `
            <td>
                <input type="text">
            </td>
        `;
    }

    html += `
        <td>
            <button
                class="delete-btn"
                onclick="deleteRow(this)">
                ✕
            </button>
        </td>
    `;

    row.innerHTML = html;

    tbody.appendChild(row);
}
// ----------------------------
// Delete Row
// ----------------------------
window.deleteRow = function(button) {

    button.closest("tr").remove();
}

// ----------------------------
// Add Column
// ----------------------------
window.createDeleteButton = function(){
return `
<button
class="delete-btn"
onclick="deleteRow(this)">
✕
</button>
`;
};

window.addColumn = function(button) {

    const headerRow =
        document.getElementById(
            "headerRow"
        );

    const currentColumns =
        headerRow.querySelectorAll("th")
        .length - 1;

    const newHeader =
        document.createElement("th");

    newHeader.contentEditable = true;

newHeader.innerHTML = `
    <span contenteditable="true">
        Column ${currentColumns + 1}
    </span>

    <button
        class="delete-column-btn"
        onclick="deleteColumn(this)">
        ✕
    </button>
`;

    headerRow.insertBefore(
        newHeader,
        headerRow.lastElementChild
    );

    const rows =
        document.querySelectorAll(
            "#dataTable tbody tr"
        );

    rows.forEach(row => {

        const td =
            document.createElement("td");

        td.innerHTML =
            '<input type="text">';

        row.insertBefore(
            td,
            row.lastElementChild
        );
    });
    updateAxisDropdowns();
}

// ----------------------------
// Download CSV
// ----------------------------
window.downloadCSV = function() {

    let csv = "";

    const headers =
        document.querySelectorAll(
            "#headerRow th"
        );

    const headerValues = [];

    headers.forEach((header,index) => {

        if(index < headers.length - 1) {

            headerValues.push(
                '"' +
                header.querySelector("span")
    ? header.querySelector("span").textContent.trim()
    : header.textContent.trim() +
                '"'
            );

        }

    });

    csv +=
        headerValues.join(",") + "\n";

    const rows =
        document.querySelectorAll(
            "#dataTable tbody tr"
        );

    rows.forEach(row => {

        const inputs =
            row.querySelectorAll("input");

        const values = [];

        inputs.forEach(input => {

            values.push(
                '"' +
                input.value.replace(/"/g,'""') +
                '"'
            );

        });

        csv +=
            values.join(",") + "\n";

    });

    const blob =
        new Blob(
            [csv],
            {type:"text/csv"}
        );

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;

    a.download =
        "physics_data.csv";

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);
}

window.deleteColumn = function(button){

    const headerCells =
        document.querySelectorAll(
            "#headerRow th"
        );

    // leave at least one data column
    if(headerCells.length <= 2){
        return;
    }

    const th =
        button.closest("th");

    const columnIndex =
        th.cellIndex;

    document
        .querySelectorAll("#dataTable tr")
        .forEach(row => {

            if(row.cells[columnIndex]){
                row.deleteCell(columnIndex);
            }

        });
updateAxisDropdowns();
};
// ----------------------------
// Paste Excel Data
// ----------------------------

window.pasteData = function(button) {

    const text =
        document.getElementById(
            "pasteBox"
        ).value.trim();

    if(!text) return;

    const lines =
        text.split("\n");

    const firstRow =
        lines[0].split("\t");

    const hasHeaders =
        looksLikeHeaders(firstRow);

    const headerRow =
        document.getElementById(
            "headerRow"
        );

    // Remove existing headers
    headerRow.innerHTML = "";

    if(hasHeaders){

        firstRow.forEach(header => {

            const th =
                document.createElement("th");

            th.innerHTML = `
    <span contenteditable="true">
        ${header.trim()}
    </span>

    <button
        class="delete-column-btn"
        onclick="deleteColumn(this)">
        ✕
    </button>
`;

            headerRow.appendChild(th);

        });

        lines.shift();

    }
    else{

        firstRow.forEach((_,index) => {

            const th =
                document.createElement("th");

            th.innerHTML = `
    <span contenteditable="true">
        Column ${index + 1}
    </span>

    <button
        class="delete-column-btn"
        onclick="deleteColumn(this)">
        ✕
    </button>
`;

            headerRow.appendChild(th);

        });

    }

    // Add Delete Header

    const deleteHeader =
        document.createElement("th");

    deleteHeader.textContent =
        "Delete";

    headerRow.appendChild(
        deleteHeader
    );

    // Clear table body

    const tbody =
        document.querySelector(
            "#dataTable tbody"
        );

    tbody.innerHTML = "";

    // Add data rows

    lines.forEach(line => {

        const values =
            line.split("\t");

        const row =
            document.createElement("tr");

        let html = "";

        values.forEach(value => {

            html += `
                <td>
                    <input
                        type="text"
                        value="${value}">
                </td>
            `;

        });

        html += `
    <td>
        ${createDeleteButton()}
    </td>
`;
        row.innerHTML = html;

        tbody.appendChild(row);

    });
updateAxisDropdowns();
};
// ----------------------------
// Auto-Paste From Clipboard
// ----------------------------
window.updateAxisDropdowns = function(){

    const xSelect =
        document.getElementById(
            "xAxisSelect"
        );

    const ySelect =
        document.getElementById(
            "yAxisSelect"
        );

    xSelect.innerHTML = "";
    ySelect.innerHTML = "";

    const headers =
        document.querySelectorAll(
            "#headerRow th"
        );

    headers.forEach((header,index)=>{

        // Skip Delete column

        if(index === headers.length - 1){
            return;
        }

        const optionX =
            document.createElement("option");

        const optionY =
            document.createElement("option");

        const label =
            header.querySelector("span")
            ? header.querySelector("span")
                .textContent.trim()
            : header.textContent.trim();

        optionX.value = index;
        optionY.value = index;

        optionX.textContent = label;
        optionY.textContent = label;

        xSelect.appendChild(optionX);
        ySelect.appendChild(optionY);

    });

    if(ySelect.options.length > 1){

        ySelect.selectedIndex = 1;

    }

};

window.addEventListener("DOMContentLoaded", () => {
    enableSpreadsheetNavigation();

    const pasteBox =
        document.getElementById("pasteBox");

    if (!pasteBox) return;

    pasteBox.addEventListener("paste", (e) => {
        e.preventDefault();

        const text =
            e.clipboardData.getData("text");

        pasteBox.value = text;

        setTimeout(pasteData, 50);
    });

    updateAxisDropdowns();
});
function looksLikeHeaders(values){

    return values.some(value =>
        isNaN(Number(value.trim()))
    );

};
let chart;

window.plotData = function(button){

    const xColumn =
        Number(
            document.getElementById(
                "xAxisSelect"
            ).value
        );

    const yColumn =
        Number(
            document.getElementById(
                "yAxisSelect"
            ).value
        );

    const rows =
        document.querySelectorAll(
            "#dataTable tbody tr"
        );

    let dataPoints = [];

    rows.forEach(row=>{

        const inputs =
            row.querySelectorAll("input");

        if(
            inputs.length >
            Math.max(
                xColumn,
                yColumn
            )
        ){

            const x =
                parseFloat(
                    inputs[xColumn].value
                );

            const y =
                parseFloat(
                    inputs[yColumn].value
                );

            if(
                !isNaN(x) &&
                !isNaN(y)
            ){

                dataPoints.push({
                    x:x,
                    y:y
                });

            }

        }

    });

    const ctx =
        document
        .getElementById(
            "chartCanvas"
        )
        .getContext("2d");

    if(chart){

        chart.destroy();

    }

    const headers =
        document.querySelectorAll(
            "#headerRow th"
        );

    const xLabel =
        headers[xColumn]
        .querySelector("span")
        .textContent;

    const yLabel =
        headers[yColumn]
        .querySelector("span")
        .textContent;

    chart = new Chart(ctx,{

        type:"scatter",

        data:{

            datasets:[{

                label:
                    yLabel +
                    " vs " +
                    xLabel,

                data:dataPoints,

                backgroundColor:
                    "#ff7a00",

                borderColor:
                    "#ff7a00"

            }]

        },

        options:{

            responsive:true,

            scales:{

                x:{

                    title:{

                        display:true,

                        text:xLabel

                    }

                },

                y:{

                    title:{

                        display:true,

                        text:yLabel

                    }

                }

            }

        }

    });

};
function enableSpreadsheetNavigation(){

    document.addEventListener("keydown", function(e){

        const current =
            document.activeElement;

        if(current.tagName !== "INPUT"){
            return;
        }

        const row =
            current.closest("tr");

        const cell =
            current.closest("td");

        const rowIndex =
            row.rowIndex - 1;

        const cellIndex =
            cell.cellIndex;

        const rows =
            document.querySelectorAll(
                "#dataTable tbody tr"
            );

        let target = null;

        switch(e.key){

            case "ArrowRight":

                if(
                    row.cells[cellIndex + 1]
                ){

                    target =
                        row.cells[
                            cellIndex + 1
                        ].querySelector(
                            "input"
                        );

                }

                break;

            case "ArrowLeft":

                if(
                    row.cells[cellIndex - 1]
                ){

                    target =
                        row.cells[
                            cellIndex - 1
                        ].querySelector(
                            "input"
                        );

                }

                break;

            case "ArrowDown":

                if(
                    rows[rowIndex + 1]
                ){

                    target =
                        rows[rowIndex + 1]
                        .cells[cellIndex]
                        ?.querySelector(
                            "input"
                        );

                }

                break;

            case "ArrowUp":

                if(
                    rows[rowIndex - 1]
                ){

                    target =
                        rows[rowIndex - 1]
                        .cells[cellIndex]
                        ?.querySelector(
                            "input"
                        );

                }

                break;

           case "Enter":

    e.preventDefault();

    // Last row?
    if(rowIndex === rows.length - 1){

        addRow();

    }

    const updatedRows =
        document.querySelectorAll(
            "#dataTable tbody tr"
        );

    target =
        updatedRows[rowIndex + 1]
        ?.cells[cellIndex]
        ?.querySelector("input");

    break;

        }

        if(target){

            e.preventDefault();

            target.focus();

            target.select();

        }

    });

};
window.clearGraph = function(button){

    if(chart){

        chart.destroy();

        chart = null;

    }

};
window.resetWorksheet = function(button){

    if(!confirm(
        "Clear all data and reset worksheet?"
    )){
        return;
    }

    // Remove graph

    if(chart){

        chart.destroy();

        chart = null;

    }

    // Restore headers

    document.getElementById(
        "headerRow"
    ).innerHTML = `

        <th>
            <span contenteditable="true">
                X Value
            </span>

            <button
                class="delete-column-btn"
                onclick="deleteColumn(this)">
                ✕
            </button>
        </th>

        <th>
            <span contenteditable="true">
                Y Value
            </span>

            <button
                class="delete-column-btn"
                onclick="deleteColumn(this)">
                ✕
            </button>
        </th>

        <th>
            Delete
        </th>

    `;

    // Remove data

    const tbody =
        document.querySelector(
            "#dataTable tbody"
        );

    tbody.innerHTML = "";

    // Create 3 blank rows

    addRow();
    addRow();
    addRow();

    // Refresh graph dropdowns

    updateAxisDropdowns();

    // Clear paste area

    const pasteBox =
        document.getElementById(
            "pasteBox"
        );

    if(pasteBox){

        pasteBox.value = "";

    }

};
window.loadSampleData = function(button){

    // Clear existing graph

    if(chart){

        chart.destroy();

        chart = null;

    }

    // Reset headers

    const headerRow =
        document.getElementById(
            "headerRow"
        );

    headerRow.innerHTML = `

        <th>

    <div class="header-cell">

        <span contenteditable="true">
            Time (s)
        </span>

        <button
            class="delete-column-btn"
            onclick="deleteColumn(this)">
            ✕
        </button>

    </div>

</th>

<th>

    <div class="header-cell">

        <span contenteditable="true">
            Position (m)
        </span>

        <button
            class="delete-column-btn"
            onclick="deleteColumn(this)">
            ✕
        </button>

    </div>

</th>

        <th>
            Delete
        </th>

    `;

    // Sample linear data

    const data = [

        [0,0],
        [1,5],
        [2,10],
        [3,15],
        [4,20],
        [5,25],
        [6,30]

    ];

    const tbody =
        document.querySelector(
            "#dataTable tbody"
        );

    tbody.innerHTML = "";

    data.forEach(values => {

        const row =
            document.createElement("tr");

        row.innerHTML = `

            <td>
                <input
                    type="text"
                    value="${values[0]}">
            </td>

            <td>
                <input
                    type="text"
                    value="${values[1]}">
            </td>

            <td>
                <button
                    class="delete-btn"
                    onclick="deleteRow(this)">
                    ✕
                </button>
            </td>

        `;

        tbody.appendChild(row);

    });

    updateAxisDropdowns();

};
console.log("CUSTOM JS LOADED");