import React, { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileArrowDown, faPrint, faExpand, faFilter, faFileCirclePlus, faFilePen } from '@fortawesome/free-solid-svg-icons'
import '../Iconbar/Iconbar.css'
import * as XLSX from 'xlsx';
import ReactToPrint from 'react-to-print'

function Iconbar({ tableRef, searchRef }) {

    // Exporting file function
    const handleExport = () => {
        if (tableRef.current) {
            const table = tableRef.current;
            const rows = Array.from(table.rows);
            const data = rows.map(row =>
                Array.from(row.cells).slice(0, -2).map(cell => cell.innerText)
            );
            const ws = XLSX.utils.aoa_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

            const now = new Date();
            const currentDate = now.toISOString().slice(0, 10);
            const currentTime = now.toTimeString().slice(0, 8).replace(/:/g, '-');
            const filename = `${currentDate}_${currentTime}_stockTaker.-file.xlsx`;
            XLSX.writeFile(wb, filename);
        }
    };

    // Full Screen mode function
    useEffect(() => {
        const handleFullscreenChange = () => {
            const table = tableRef.current;
            const isFullScreen = document.fullscreenElement;
            if (!isFullScreen) {
                table.classList.remove('fullscreen');
            }
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, [tableRef]);

    const handleFullScreen = () => {
        const table = tableRef.current;
        const isFullScreen = document.fullscreenElement;
        if (!isFullScreen) {
            table.requestFullscreen();
            table.classList.add('fullscreen');
        } else {
            document.exitFullscreen();
            table.classList.remove('fullscreen');
        }
    }

    // Filter function for the table 
    const handleFilter = () => {
        const filter = searchRef.current;
        filter.focus();
    }

    return (
        <div className='icon-container'>
            <nav>
                <button onClick={handleExport}><FontAwesomeIcon icon={faFileArrowDown} className='icon' /></button>
                <ReactToPrint trigger={() => (<button><FontAwesomeIcon icon={faPrint} className='icon' /></button>)} content={() => tableRef.current} />
                <button><FontAwesomeIcon icon={faFileCirclePlus} className='icon' /></button>
                <button><FontAwesomeIcon icon={faFilePen} className='icon' /></button>
                <button onClick={handleFilter}><FontAwesomeIcon icon={faFilter} className='icon' /></button>
                <button onClick={handleFullScreen}><FontAwesomeIcon icon={faExpand} className='icon' /></button>
            </nav>
        </div>

    )
}

export default Iconbar
