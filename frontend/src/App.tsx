import React, {useState, useEffect} from 'react';
import { Button, Container,Row,Col } from 'react-bootstrap';
import { Note as NoteModel } from './models/note'
import Note from './components/Note';
import styles from './styles/NotesPage.module.css';
import styleUtils from './styles/NotesPage.module.css';
import * as NotesApi from './network/notes_api';
import AddNote from './components/AddEditNotes';
import {FaPlus} from 'react-icons/fa'


function App() {
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

  const notesGrid = 
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
    <>
    <Container>
      <Button 
      onClick={() => setShowAddNote(true)}
      className='mb-4 mt-4'
      >
        < FaPlus />
      Add new note
    </Button>
    
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
      
    </Container>
    </>
  );
}

export default App;
