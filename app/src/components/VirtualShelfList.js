import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { getVirtualShelves, saveVirtualShelf, deleteVirtualShelf, addVirtualShelf, exportVirtualShelves, importVirtualShelves } from "../actions";

import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Calendar } from 'primereact/calendar'

import { FilterMatchMode } from 'primereact/api'

const virtualShelfSelector = state => state.virtualShelf.virtualShelfList
const virtualShelfCountSelector = state => state.virtualShelf.count



function VirtualShelfList() {

    const [descriere, setDescriere] = useState('')

    const [isDialogShown, setIsDialogShown] = useState(false) 
    const [isNewRecord, setIsNewRecord] = useState(true)
    const [selectedVirtualShelf, setSelectedVirtualShelf] = useState(null)

    // pentru filtrare
    const [filterString, setFilterString] = useState('')

    // pentru sortare
    const [sortOrder, setSortOrder] = useState(1)
    const [sortField, setSortField] = useState('')

    // pentru filtrare
    const [filters, setFilters] = useState({
        descriere: { value: null, matchMode: FilterMatchMode.CONTAINS },
        data: { value: null, matchMode: FilterMatchMode.EQUALS }
    })

    // pentru paginare
    const [page, setPage] = useState(0)
    const [first, setFirst] = useState(0)

    // ---- FILTRARE
    const handleFiltru = (evt) => {
        const filtreVechi = filters
        filtreVechi[evt.field] = evt.constraints.constraints[0]
        setFilters({ ...filtreVechi })
    }

    const handleStergeFiltru = (evt) => {
        setFilters({
            descriere: { value: null, matchMode: FilterMatchMode.CONTAINS },
            data: { value: null, matchMode: FilterMatchMode.EQUALS }
        })
    }

    useEffect(() => {
        const keys = Object.keys(filters)
        const computeFilterString = keys.map(e => {
            return {
                key: e,
                value: filters[e].value
            }
        }).filter(e => e.value).map(e => `${e.key}=${e.value}`).join('&')
        setFilterString(computeFilterString)
    }, [filters])

    const virtualShelves = useSelector(virtualShelfSelector)
    const count = useSelector(virtualShelfCountSelector)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getVirtualShelves(filterString, page, 4, sortField, sortOrder))
    }, [filterString, page, sortField, sortOrder])

    // modala de adaugare/editare
    const hideDialog = () => {
        setIsDialogShown(false)
    }

    // POST
    const handleAdauga = () => {
        setIsDialogShown(true)
        setIsNewRecord(true)

        setDescriere('')
    }

    // PUT
    const handleEditeaza = (rowData) => {
        setSelectedVirtualShelf(rowData.id)
        setDescriere(rowData.descriere)

        setIsDialogShown(true)
        setIsNewRecord(false)
    }

    // DELETE
    const handleSterge = (rowData) => {
        if (window.confirm("Sigur doriti sa stergeti biblioteca?"))
            dispatch(deleteVirtualShelf(rowData.id))
    }

    // salvare date adaugate/editate
    const handleSalveaza = () => {
        if (isNewRecord) {
            if (descriere.length >= 3)
                dispatch(addVirtualShelf({ descriere }))
            else alert('Descrierea trebuie sa aiba cel putin 3 caractere!')
        } else {
            if (descriere.length >= 3)
                dispatch(saveVirtualShelf(selectedVirtualShelf, { descriere }))
            else alert('Descrierea trebuie sa aiba cel putin 3 caractere!')
        }

        if (descriere.length >= 3) {
            setIsDialogShown(false)
            setIsNewRecord(true)
            setDescriere('')
        }

    }

    const tableFooter = (
        <div>
            <Button label='Adauga' icon='pi pi-plus' onClick={handleAdauga} />
            <Button label='Exporta date' className="p-button-secondary" onClick={() => dispatch(exportVirtualShelves())} />
            <Button label='Importa date' className="p-button-secondary" onClick={() => { dispatch(importVirtualShelves()); window.location.reload() }} />
        </div>
    )

    // buton modala
    const dialogFooter = (
        <div>
            <Button label='Salveaza' icon='pi pi-save' onClick={handleSalveaza} />
        </div>
    )

    const optiuniButoane = (rowData) => (
        <div>
            <Button label='Editeaza' icon='pi pi-pencil' onClick={() => handleEditeaza(rowData)} />
            <Button label='Sterge' icon='pi pi-trash' className='p-button p-button-danger' onClick={() => handleSterge(rowData)} />
            <Button label='Detalii' className='p-button-info' onClick={() => window.location = `/#/virtualShelves/${rowData.id}/books`} />
        </div>
    )

    // PAGINARE
    const handlePageChange = (evt) => {
        setPage(evt.page)
        setFirst(evt.page * 2)
    }

    // SORTARE
    const handleSortare = (evt) => {
        console.warn(evt)
        setSortField(evt.sortField)
        setSortOrder(evt.sortOrder)
    }

    return (
        <div>
            <h1>Lista bibliotecilor virtuale</h1>
            <DataTable
                value={virtualShelves}
                footer={tableFooter}

                lazy

                paginator
                onPage={handlePageChange}
                first={first}
                rows={4}
                totalRecords={count}

                onSort={handleSortare}
                sortField={sortField}
                sortOrder={sortOrder}
            >

                <Column header='Descriere' field='descriere' filter filterField='descriere' onFilterApplyClick={handleFiltru} onFilterClear={handleStergeFiltru} sortable />
                <Column header='Data' field='data' filter filterField='data' onFilterApplyClick={handleFiltru} onFilterClear={handleStergeFiltru} />

                <Column body={optiuniButoane} />

            </DataTable>

            <Dialog header="Biblioteca virtuala" onHide={hideDialog} visible={isDialogShown} footer={dialogFooter}>
                <div>
                    <InputText placeholder='Introduceti descrierea' onChange={(evt) => setDescriere(evt.target.value)} value={descriere} />
                </div>
            </Dialog>
        </div>
    )
}

export default VirtualShelfList;