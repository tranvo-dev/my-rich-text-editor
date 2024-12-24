// Register Quill 
const quill = new Quill('#editor', {
    theme: 'snow',
    modules:{
        toolbar: '#customToolbar',
        table: true
    }
});

const tableButton = document.getElementById('customTableBtn');
const tableTooltip = document.getElementById('tableTooltip');
const gridContainer = document.getElementById('grid');
const gridDimensions = document.getElementById('gridDimensions');

let latestSelection = { index: 0, length: 0 };

const createGrid = (rows, cols) => {
    gridContainer.innerHTML = ''; // Clear existing grid
    gridContainer.style.gridTemplateColumns = `repeat(${cols}, 20px)`;
    for(let row = 1; row <= rows; row++){
        for(let col = 1; col <= cols; col++){
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            gridContainer.appendChild(cell);
        }
    }
};

createGrid(10, 10);

function showTheGridTooltip(event){
    event.stopPropagation();
    tableTooltip.style.display = tableTooltip.style.display === 'none' ? 'block' : 'none';
    latestSelection = quill.getSelection() !== null ? quill.getSelection() : { index: 0, length: 0 };
}

tableButton.addEventListener('click', showTheGridTooltip);


function handleMouseOverCells(event) {
    if(event.target.classList.contains('cell')) {
        const hoveredRow = Number.parseInt(event.target.dataset.row);
        const hoveredCol = Number.parseInt(event.target.dataset.col);

        // Highlight cells up to the hovered cell
        document.querySelectorAll('.cell').forEach(function(cell) {
            const cellRow = Number.parseInt(cell.dataset.row);
            const cellCol = Number.parseInt(cell.dataset.col);

            if(cellRow <= hoveredRow && cellCol <= hoveredCol) {
                cell.classList.add('highlighted');
            } else{
                cell.classList.remove('highlighted');
            }
        });

        // Update dimensions text
        gridDimensions.textContent = `${hoveredRow} × ${hoveredCol}`;
    }
}

gridContainer.addEventListener('mouseover', handleMouseOverCells);

function handleClicksOnCells(event) {
    if (event.target.classList.contains('cell')) {
        const rows = Number.parseInt(event.target.dataset.row);
        const cols = Number.parseInt(event.target.dataset.col);
        insertTable(rows, cols);
        tableTooltip.style.display = 'none';
    }
}

gridContainer.addEventListener('click', handleClicksOnCells);

const resetTooltip = (event) => {
    if (!tableTooltip.contains(event.target) && event.target !== tableButton) {
        document.querySelectorAll('.cell').forEach(cell => {
            cell.classList.remove('highlighted');
        });
        gridDimensions.textContent = '0 x 0';
        tableTooltip.style.display = 'none';
    }
}

document.addEventListener('click', resetTooltip);

function insertTable(rows, columns) {
    quill.setSelection(latestSelection);
    quill.getModule('table').insertTable(rows, columns);
}