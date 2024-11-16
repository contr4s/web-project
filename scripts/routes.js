document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('reportForm');
    const resultContainer = document.getElementById('resultContainer');

    loadTablesFromLocalStorage();

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const gymName = document.getElementById('gymName').value;

        const showRouteName = document.getElementById('showRouteName').checked;
        const showFirstTry = document.getElementById('showFirstTry').checked;
        const showDifficulty = document.getElementById('showDifficulty').checked;
        const showComment = document.getElementById('showComment').checked;

        generateTable(gymName, showRouteName, showFirstTry, showDifficulty, showComment);
    });

    function generateTable(gymName, showRouteName, showFirstTry, showDifficulty, showComment) {
        const tableContainer = document.createElement('div');
        tableContainer.classList.add('table-container');

        const tableInfo = document.createElement('div');
        tableInfo.classList.add('tableInfo');

        const tableName = document.createElement('h2');
        tableName.classList.add('tableName');
        tableName.textContent = gymName;

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');

        const addRowButton = document.createElement('button');
        addRowButton.classList.add('addRow');
        addRowButton.textContent = 'Добавить строку';

        const deleteTableButton = document.createElement('button');
        deleteTableButton.classList.add('deleteTable');
        deleteTableButton.textContent = 'Удалить таблицу';

        buttonContainer.appendChild(addRowButton);
        buttonContainer.appendChild(deleteTableButton);
        tableInfo.appendChild(tableName);
        tableInfo.appendChild(buttonContainer);

        const reportTable = document.createElement('table');
        reportTable.classList.add('reportTable');

        const headerRow = document.createElement('tr');
        const categoriesHeader = document.createElement('th');
        categoriesHeader.setAttribute('data-column', 'Категория трассы');
        categoriesHeader.textContent = 'Категория трассы';
        const attemptsHeader = document.createElement('th');
        attemptsHeader.setAttribute('data-column', 'Количество попыток');
        attemptsHeader.textContent = 'Количество попыток';

        headerRow.appendChild(categoriesHeader);
        headerRow.appendChild(attemptsHeader);

        if (showRouteName) {
            const routeNameHeader = document.createElement('th');
            routeNameHeader.setAttribute('data-column', 'Название трассы');
            routeNameHeader.textContent = 'Название трассы';
            headerRow.appendChild(routeNameHeader);
        }

        if (showFirstTry) {
            const firstTryHeader = document.createElement('th');
            firstTryHeader.setAttribute('data-column', 'Пройдена с первой попытки');
            firstTryHeader.textContent = 'Пройдена с первой попытки';
            headerRow.appendChild(firstTryHeader);
        }

        if (showDifficulty) {
            const difficultyHeader = document.createElement('th');
            difficultyHeader.setAttribute('data-column', 'Оценочная сложность');
            difficultyHeader.textContent = 'Оценочная сложность';
            headerRow.appendChild(difficultyHeader);
        }

        if (showComment) {
            const commentHeader = document.createElement('th');
            commentHeader.setAttribute('data-column', 'Комментарий');
            commentHeader.textContent = 'Комментарий';
            headerRow.appendChild(commentHeader);
        }

        headerRow.appendChild(document.createElement('th'));
        reportTable.appendChild(headerRow);
        tableContainer.appendChild(tableInfo);
        tableContainer.appendChild(reportTable);
        resultContainer.appendChild(tableContainer);

        const table = tableContainer.querySelector('.reportTable');
        addRowToTable(table, showRouteName, showFirstTry, showDifficulty, showComment);

        tableContainer.querySelector('.addRow').addEventListener('click', () => {
            addRowToTable(table, showRouteName, showFirstTry, showDifficulty, showComment);
            makeCellsEditable(table);
            saveTablesToLocalStorage();
        });

        tableContainer.querySelector('.deleteTable').addEventListener('click', () => {
            resultContainer.removeChild(tableContainer);
            saveTablesToLocalStorage();
        });

        makeCellsEditable(table);
        saveTablesToLocalStorage();
    }

    function addRowToTable(table, showRouteName, showFirstTry, showDifficulty, showComment) {
        const newRow = table.insertRow(-1);

        const categoryCell = newRow.insertCell();
        categoryCell.classList.add('editable');
        categoryCell.setAttribute('data-column', 'Категория трассы');

        const attemptsCell = newRow.insertCell();
        attemptsCell.classList.add('editable');
        attemptsCell.setAttribute('data-column', 'Количество попыток');

        if (showRouteName) {
            const routeNameCell = newRow.insertCell();
            routeNameCell.classList.add('editable');
            routeNameCell.setAttribute('data-column', 'Название трассы');
        }

        if (showFirstTry) {
            const firstTryCell = newRow.insertCell();
            firstTryCell.setAttribute('data-column', 'Пройдена с первой попытки');
        }

        if (showDifficulty) {
            const difficultyCell = newRow.insertCell();
            difficultyCell.classList.add('editable');
            difficultyCell.setAttribute('data-column', 'Оценочная сложность');
        }

        if (showComment) {
            const commentCell = newRow.insertCell();
            commentCell.classList.add('editable');
            commentCell.setAttribute('data-column', 'Комментарий');
        }

        const deleteButtonCell = newRow.insertCell();
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('deleteRow');
        deleteButton.textContent = 'Удалить';
        deleteButtonCell.appendChild(deleteButton);

        newRow.querySelector('.deleteRow').addEventListener('click', () => {
            table.deleteRow(newRow.rowIndex);
            saveTablesToLocalStorage();
        });

        makeCellsEditable(table);

        Array.from(newRow.cells).forEach(cell => {
            validateCell(cell);
        });
    }

    function makeCellsEditable(table) {
        const cells = table.querySelectorAll('.editable');

        cells.forEach(cell => {
            cell.addEventListener('dblclick', () => {
                let inputElement;

                switch (cell.dataset.column) {
                    case "Категория трассы":
                        inputElement = createSelect(['5b', '5c', '6a', '6b', '6c', '7a', '7b'], cell.innerText);
                        break;
                    case "Количество попыток":
                        inputElement = createInput('number', cell.innerText);
                        break;
                    case "Оценочная сложность":
                        inputElement = createSelect(['5b', '5c', '6a', '6b', '6c', '7a', '7b'], cell.innerText);
                        break;
                    case "Название трассы":
                    case "Комментарий":
                        inputElement = createInput('text', cell.innerText);
                        break;
                    default:
                        return;
                }

                cell.innerHTML = '';
                cell.appendChild(inputElement);

                inputElement.focus();

                inputElement.addEventListener('blur', () => {
                    cell.innerText = inputElement.value;
                    validateCell(cell);
                    saveTablesToLocalStorage();
                });

                inputElement.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                        inputElement.blur();
                    }
                });
            });

            cell.addEventListener('blur', () => {
                validateCell(cell);
                cell.setAttribute('contenteditable', 'false');
            });

            cell.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    cell.blur();
                }
            });
        });
    }

    function createInput(type, value) {
        const input = document.createElement('input');
        input.type = type;
        input.value = value;
        return input;
    }

    function createSelect(options, selectedValue) {
        const select = document.createElement('select');
        options.forEach(optionValue => {
            const option = document.createElement('option');
            option.value = optionValue;
            option.textContent = optionValue;
            if (optionValue === selectedValue) option.selected = true;
            select.appendChild(option);
        });
        return select;
    }

    function validateCell(cell) {
        const columnName = cell.dataset.column;

        switch (columnName) {
            case "Количество попыток":
                if (!cell.innerText || cell.innerText <= 0) {
                    cell.classList.add('invalid');
                } else {
                    cell.classList.remove('invalid');
                    const firstTryCell = Array.from(cell.parentNode.cells).find(cell => cell.dataset.column === "Пройдена с первой попытки");
                    if (firstTryCell) {
                        firstTryCell.innerText = (cell.innerText == 1) ? 'Да' : 'Нет';
                    }
                }
                break;

            case "Комментарий", "Пройдена с первой попытки":
                cell.classList.remove('invalid');
                break;

            default:
                if (!cell.innerText) {
                    cell.classList.add('invalid');
                } else {
                    cell.classList.remove('invalid');
                }
                break;
        }
    }

    function saveTablesToLocalStorage() {
        const tablesData = [];
        const containers = resultContainer.querySelectorAll('.table-container');

        containers.forEach(container => {
            const tableData = [];
            const rows = container.querySelectorAll('.reportTable tr');

            rows.forEach((row, index) => {
                if (index === 0) return;

                const rowData = {};

                Array.from(row.cells).forEach((cell) => {
                    const columnName = cell.dataset.column;
                    if (columnName) {
                        rowData[columnName] = cell.textContent;
                    }
                });

                tableData.push(rowData);
            });

            tablesData.push({ gymName: container.querySelector("h2").innerText, rows: tableData });
        });

        localStorage.setItem("tables", JSON.stringify(tablesData));
    }

    function loadTablesFromLocalStorage() {
        const savedTablesData = localStorage.getItem("tables");
        if (!savedTablesData) return;

        const tablesData = JSON.parse(savedTablesData);

        tablesData.forEach(tableInfo => {
            const tableContainer = document.createElement('div');
            tableContainer.classList.add('table-container');

            const tableInfoDiv = document.createElement('div');
            tableInfoDiv.classList.add('tableInfo');

            const tableName = document.createElement('h2');
            tableName.classList.add('tableName');
            tableName.textContent = tableInfo.gymName;

            const buttonContainer = document.createElement('div');
            buttonContainer.classList.add('button-container');

            const addRowButton = document.createElement('button');
            addRowButton.classList.add('addRow');
            addRowButton.textContent = 'Добавить строку';

            const deleteTableButton = document.createElement('button');
            deleteTableButton.classList.add('deleteTable');
            deleteTableButton.textContent = 'Удалить таблицу';

            buttonContainer.appendChild(addRowButton);
            buttonContainer.appendChild(deleteTableButton);
            tableInfoDiv.appendChild(tableName);
            tableInfoDiv.appendChild(buttonContainer);

            const reportTable = document.createElement('table');
            reportTable.classList.add('reportTable');

            const headerRow = reportTable.insertRow();

            const columnNames = Object.keys(tableInfo.rows[0] || {});
            columnNames.forEach(columnName => {
                if (columnName) {
                    const headerCell = document.createElement('th');
                    headerCell.setAttribute('data-column', columnName);
                    headerCell.textContent = columnName;
                    headerRow.appendChild(headerCell);
                }
            });

            headerRow.appendChild(document.createElement('th'));
            tableContainer.appendChild(tableInfoDiv);
            tableContainer.appendChild(reportTable);
            resultContainer.appendChild(tableContainer);

            const table = tableContainer.querySelector('.reportTable');
            tableInfo.rows.forEach(rowData => {
                addRowToTable(table,
                    columnNames.includes('Название трассы'),
                    columnNames.includes('Пройдена с первой попытки'),
                    columnNames.includes('Оценочная сложность'),
                    columnNames.includes('Комментарий'));

                Array.from(table.rows[table.rows.length - 1].cells).forEach((cell, index) => {
                    const columnName = cell.dataset.column;
                    if (rowData[columnName]) {
                        cell.innerText = rowData[columnName];
                    }
                });

                Array.from(table.rows[table.rows.length - 1].cells).forEach(cell => {
                    validateCell(cell);
                });
            });

            tableContainer.querySelector('.addRow').addEventListener('click', () => {
                addRowToTable(table,
                    columnNames.includes('Название трассы'),
                    columnNames.includes('Пройдена с первой попытки'),
                    columnNames.includes('Оценочная сложность'),
                    columnNames.includes('Комментарий'));
                makeCellsEditable(table);
                saveTablesToLocalStorage();
            });

            tableContainer.querySelector('.deleteTable').addEventListener('click', () => {
                resultContainer.removeChild(tableContainer);
                saveTablesToLocalStorage();
            });

            makeCellsEditable(table);
        });
    }
});