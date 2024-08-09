import React, {useState, useEffect} from 'react';
import { Button, Row,Col, Spinner, Alert } from 'react-bootstrap';
import AddNote from './AddEditNotes';
import {FaPlus} from 'react-icons/fa'
import * as NotesApi from '../network/notes_api';
import { Note as NoteModel } from '../models/note'
import styles from '../styles/NotesPage.module.css';
import Note from './Note';

 
const NotesPageLoggedInView = () => {
    const [notes, setNotes] = useState<NoteModel[]>([]);
  const [notesLoading, setNotesLoading] = useState(true);
  const [notesLoadingError, setNotesLoadingError] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<NoteModel|null>(null);

  useEffect(() => {

    async function fetchNotes() {
      try {
        setNotesLoadingError(false);
        setNotesLoading(true);
        const notes = await NotesApi.fetchNotes();
        setNotes(notes);
      } catch (error) {
        console.error(error);
        setNotesLoadingError(true);
      } finally {
        setNotesLoading(false); 
      }
    }
    fetchNotes();
  }, []);

  async function deleteNote(note: NoteModel){
    try {
      await NotesApi.deleteNote(note._id)
      setNotes(notes.filter(existingNote => existingNote._id !== note._id));
    } catch (error) {
      console.error(error)
      alert(error);
    }

  }

  const notesGrid: JSX.Element = 
    <Row xs={1} md={2} xl={3} className='g-4'>
            {notes.map((note) => {
            return <Col key={note._id}>
                <Note 
                onNoteClicked={(note) => setNoteToEdit(note)}
                note={note} 
                className={styles.note} 
                onDeleteNoteClicked={deleteNote}
                />
            </Col>;
            })}
            
        </Row>


  return (
    <div>
         <Button
            onClick={() => setShowAddNote(true)}
            className="mb-4 mt-4"
          >
            <FaPlus /> Add new note
          </Button>
      {notesLoading && (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      {notesLoadingError && (
        // eslint-disable-next-line react/jsx-no-undef
        <Alert variant="danger" className="text-center">
          Something went wrong. Please refresh the page.
        </Alert>
      )}
      {!notesLoading && !notesLoadingError && 
      <>
      
      {notes.length > 0 ? notesGrid :  <p className="text-center">You don't have any notes yet</p>}
      </>
      }
      {showAddNote && (
          <AddNote 
          onDismiss={() => setShowAddNote(false)}
          onNoteSaved={(newNote) => {
            setNotes([...notes, newNote]);
            setShowAddNote(false);
          }}
          />
        )}
        {
          noteToEdit && (
            <AddNote 
            NoteToEdit={noteToEdit}
            onDismiss={() => setNoteToEdit(null)}
            onNoteSaved={(updatedNote) => {
              setNotes(notes.map(existingNote => existingNote._id === updatedNote._id ? updatedNote : existingNote)); 
                setNoteToEdit(null);
            }}
            />
          )
        }

    </div>
  )
}

export default NotesPageLoggedInView