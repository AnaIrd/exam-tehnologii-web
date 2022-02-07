import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { getBooks, saveBook, addBook, deleteBook } from '../actions'

import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'

import { useParams } from 'react-router-dom'

import validator from 'validator'

const bookSelector = state => state.book.bookList

function BookList() {
    const { virtualShelfId } = useParams()

    const [titlu, setTitlu] = useState('')
    const [gen_literar, setGenLiterar] = useState('')
    const [url, setUrl] = useState('')

    const [isDialogShown, setIsDialogShown] = useState(false)
    const [isNewRecord, setIsNewRecord] = useState(true)
    const [selectedBook, setSelectedBook] = useState(null)

    const dispatch = useDispatch()

    const books = useSelector(bookSelector)

    // GET
    useEffect(() => {
        dispatch(getBooks(virtualShelfId))
    }, [virtualShelfId])


    // modala
    const hideDialog = () => {
        setIsDialogShown(false)
    }

    // PUT
    const handleEditeaza = (rowData) => {
        setSelectedBook(rowData.id)
        setTitlu(rowData.titlu)
        setGenLiterar(rowData.gen_literar)
        setUrl(rowData.url)

        setIsDialogShown(true)
        setIsNewRecord(false)
    }

    // POST
    const handleAdauga = () => {
        setIsDialogShown(true)
        setIsNewRecord(true)

        setTitlu('')
        setGenLiterar('')
        setUrl('')
    }

    // DELETE
    const handleSterge = (rowData) => {
        if (window.confirm("Sigur doriti sa stergeti cartea?"))
            dispatch(deleteBook(virtualShelfId, rowData.id))
    }

    // salvare date adaugate/editate
    const handleSalveaza = () => {
        if (isNewRecord) {
            if (titlu.length >= 5 && validator.isURL(url))
                dispatch(addBook(virtualShelfId, { titlu, gen_literar, url }))
            else
                if (titlu.length < 5)
                    alert('Titlul trebuie sa aiba cel putin 5 caractere!')
                else
                    alert('URL-ul nu este valid!')
        } else
            if (titlu.length >= 5 && validator.isURL(url))
                dispatch(saveBook(virtualShelfId, selectedBook, { titlu, gen_literar, url }))
            else
                if (titlu.length < 5)
                    alert('Titlul trebuie sa aiba cel putin 5 caractere!')
                else
                    alert('URL-ul nu este valid!')

        if (titlu.length >= 5 && validator.isURL(url)) {
            setIsDialogShown(false)
            setIsNewRecord(true)

            setTitlu('')
            setGenLiterar('')
            setUrl('')
        }
    }

    const tableFooter = (
        <div>
            <Button label='Adauga' icon='pi pi-plus' onClick={handleAdauga} />
        </div>
    )

    const dialogFooter = (
        <div>
            <Button label='Salveaza' icon='pi pi-save' onClick={handleSalveaza} />
        </div>
    )

    const optiuniButoane = (rowData) => (
        <div>
            <Button label='Editeaza' icon='pi pi-pencil' onClick={() => { handleEditeaza(rowData) }} />
            <Button label='Sterge' icon='pi pi-trash' className='p-button p-button-danger' onClick={() => { handleSterge(rowData) }} />
        </div>
    )

    // valori pt dropdown
    const genuri = [
        { label: 'COMEDY', value: 'COMEDY' },
        { label: 'TRAGEDY', value: 'TRAGEDY' },
        { label: 'ROMANCE', value: 'ROMANCE' },
        { label: 'SF', value: 'SF' },
        { label: 'POETRY', value: 'POETRY' }
    ]

    return (
        <div>
            <h1>Cartile din biblioteca cu id-ul {virtualShelfId}</h1>
            <DataTable
                value={books}
                footer={tableFooter}>

                <Column header='Titlu' field='titlu' />
                <Column header='Gen literar' field='gen_literar' />
                <Column header='URL' field='url' />
                <Column body={optiuniButoane} />

            </DataTable>
            <Dialog header="Carte" onHide={hideDialog} visible={isDialogShown} footer={dialogFooter}>
                <div>
                    <InputText placeholder='Introduceti titlul' onChange={(evt) => setTitlu(evt.target.value)} value={titlu} />
                    <InputText placeholder='Introduceti URL' onChange={(evt) => setUrl(evt.target.value)} value={url} />
                    <Dropdown value={gen_literar} options={genuri} onChange={(evt) => setGenLiterar(evt.value)} placeholder='Alegeti genul literar' />
                </div>
            </Dialog>
        </div>
    )
}

export default BookList