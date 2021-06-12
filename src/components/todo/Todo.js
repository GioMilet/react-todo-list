import { Button, Input, List, ListItem, ListItemAvatar, ListItemText, Modal } from '@material-ui/core';
import db from '../../firebase';
import './Todo.css';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import firebase from 'firebase';

function Todo(props) {


    const [open, setOpen] = useState(false);
    const [input, setInput] = useState();
    const [isDone, setIsDone] = useState();

    const useStyles = makeStyles((theme) => ({
        paper: {
            position: 'absolute',
            width: 400,
            height: 300,
            backgroundColor: theme.palette.background.paper,
            border: '2px solid #000',
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3)
        },

        isDone: {
            textDecoration: 'line-through',
        },

        isNotDone: {
            textDecoration: 'none',
        }
    }))

    var status;
    var time;
    const classes = useStyles();

    // Function that return the date
    const getTime = (currentTime) => {
        var newTime = currentTime.seconds * 1000;
        var date = new Date(newTime);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();

        // here we create a variable and store the month with a 2 digits format
        var checkedMonth = month < 10 ? '0' + month : month

        return "le " + day + "/" + checkedMonth + "/" + year + " à " + hour + ":" + minute;
    }

    // condition to check the status of a task and display a different message based on it
    if (props.task.updated_at && props.task.isDone === true) {
        time = getTime(props.task.updated_at)
        status = `Terminé ${time}`;
    } else if (props.task.updated_at) {
        time = getTime(props.task.updated_at)
        status = `Modifié ${time}`
    } else if (props.task.created_at) {
        time = getTime(props.task.created_at)
        status = `Ajouté ${time}`
    }

    // Delete a specific task
    const handleOnClick = () => {
        db.collection('tasks').doc(props.id).delete()
    }

    // Open the modal
    const handleOpen = () => {
        setOpen(true);
    }

    // Close the modal
    const handleClose = () => {
        setOpen(false);
    }

    // Update the task and close the modal
    const updateTask = () => {

        db.collection('tasks').doc(props.id).update({
            name: input,
            updated_at: firebase.firestore.FieldValue.serverTimestamp(),
        })
        handleClose();
    }

    // update the status of a task
    const handleTaskStatus = () => {
        setIsDone(!isDone);
        db.collection('tasks').doc(props.id).update({
            isDone: !props.task.isDone,
            updated_at: firebase.firestore.FieldValue.serverTimestamp()
        })
    }

    return (
        <>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <div className={classes.paper}>
                    <h1>Modifier une tâche</h1>
                    <Input placeholder={props.task.name} value={input} onChange={event => setInput(event.target.value)} />
                    <Button onClick={updateTask} color="primary">Appliquer modification</Button>
                </div>
            </Modal>
            <List className="todo__list">
                <ListItem className={props.task.isDone ? classes.isDone : classes.isNotDone}>
                    <ListItemAvatar>
                    </ListItemAvatar>
                    <ListItemText primary={props.task.name}
                        secondary={status} />
                    {!props.task.isDone ? <DoneIcon style={{ color: 'green' }} onClick={handleTaskStatus} /> : <CloseIcon style={{ color: 'red' }} onClick={handleTaskStatus} />}
                </ListItem>
                <div className="button__container">
                    <button className="todo__button" type="button" onClick={handleOpen}>
                        Modifier<CreateIcon />
                    </button>
                    <button className="todo__button" type="button" onClick={handleOnClick}>
                        Supprimer<DeleteIcon />
                    </button>
                </div>
            </List>
        </>

    )
}

export default Todo;