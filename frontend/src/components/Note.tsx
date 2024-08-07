import React from 'react'
import styles from '../styles/Note.module.css'
import { Card } from 'react-bootstrap'
import { Note as NoteModel } from '../models/note'
import { formatDate } from '../utils/formatDate'
import styleUtils from './styles/utils.module.css'
import { MdDelete } from "react-icons/md";


interface NoteProps {
  note: NoteModel,
  onNoteClicked?: (note: NoteModel) => void,
  onDeleteNoteClicked: (note: NoteModel) => void,
  className?: string

}

const Note = ({note, onNoteClicked, className, onDeleteNoteClicked}: NoteProps) => {
    const { title, text, createdAt, updatedAt } = note;

    let createdUpdatedText: string;
    if (updatedAt > createdAt) {
      createdUpdatedText = 'Updated: ' + formatDate(updatedAt);
    } else {
      createdUpdatedText = 'Created: ' + formatDate(createdAt);
    }

  return (
    <Card className={`${styles.noteCard} ${className}`} onClick={() => onNoteClicked && onNoteClicked(note)}>
      <Card.Body>
        <Card.Title>
          {title} 
          <MdDelete 
          className='text-muted ms-auto'
          onClick={(e) => {
            onDeleteNoteClicked(note);
            e.stopPropagation();
          }}
          /> 
          </Card.Title> 
        <Card.Text className={styles.cardText}>{text}</Card.Text>
      </Card.Body>
      <Card.Footer>
        <small className="text-muted">{createdUpdatedText}</small>
      </Card.Footer>
    </Card>
  )
}

export default Note
