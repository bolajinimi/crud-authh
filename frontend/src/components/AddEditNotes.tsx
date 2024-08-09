import {Modal, Form, Button} from 'react-bootstrap';
import {useForm} from 'react-hook-form';
import {Note} from '../models/note';
import { NoteInput } from '../network/notes_api';
import * as NotesApi from '../network/notes_api'
import TextInputField from './form/TextInputField';


interface AddEditNotesProps {
    NoteToEdit?: Note,
    onDismiss: () => void,
    onNoteSaved: (note: Note) => void,
}


const AddEditNotes = ({  NoteToEdit, onDismiss, onNoteSaved}: AddEditNotesProps) => {

    const {register, handleSubmit, formState: { errors, isSubmitting}} = useForm<NoteInput>({
        defaultValues: {
            title: NoteToEdit?.title || '',
            text: NoteToEdit?.text || '',
        }
    }
    );
    async function onSubmit(input: NoteInput) {
        try {
            let noteResponse: Note;

            if (NoteToEdit) {
                noteResponse = await NotesApi.updateNote(NoteToEdit._id, input);
            } else {
                noteResponse = await NotesApi.createNote(input);
            }
            
            onNoteSaved(noteResponse);
        } catch (error) {
            console.error(error);
            alert(error)
        }
    }

  return (
    <Modal show onHide={onDismiss} >
        <Modal.Header closeButton>
            <Modal.Title>
                {NoteToEdit ? 'Edit Note' : 'Add Note'}
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form id='addEditNoteForm' onSubmit={handleSubmit(onSubmit)}>
                <TextInputField
                    name="title"
                    label='Title'
                    type='text'
                    placeholder='Title'
                    register={register}
                    registerOptions={{required: "Required"}}
                    error={errors.title}
                
                />
                <TextInputField
                    name="text"
                    label='Text'
                    as='textarea'
                    rows={5}
                    placeholder='Text'
                    register={register}
                />
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button
            type="submit"
            form="addEditNoteForm"
            disabled={isSubmitting}
            >
                Save
            </Button>

        </Modal.Footer>
    </Modal>
  )
}

export default AddEditNotes;
