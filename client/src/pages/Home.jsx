import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { borderRadius } from '@mui/system';

function Home() {

    let navigate = useNavigate();
    const [todoList, setTodoList] = useState([]);
    const [inputText, setInputText] = useState('');
    const [editId, setEditId] = useState(null); // Track the ID of the item being edited
    const [editedText, setEditedText] = useState(''); // Store the edited text

    const onSubmit = () => {
        const data = {
            todo: inputText,
        };

        axios.post("http://localhost:3000/todolist", data)
            .then((response) => {
                navigate("/");
            });
    };

    const onDelete = (todoId) => {
        axios.delete(`http://localhost:3000/todolist/byId/${todoId}`)
            .then(() => {
                // After deleting the todo, fetch the updated todo list
                axios.get("http://localhost:3000/todolist")
                    .then((response) => {
                        setTodoList(response.data);
                    });
            });
    };

    const onEdit = (todoId, todoText) => {
        // Set the ID of the item being edited and the initial edited text
        setEditId(todoId);
        setEditedText(todoText);
    };

    const onSaveEdit = () => {
        // Update the edited text for the todo item in the database
        const data = {
            todo: editedText,
        };

        axios.put(`http://localhost:3000/todolist/update/${editId}`, data)
            .then(() => {
                // After editing the todo, fetch the updated todo list
                axios.get("http://localhost:3000/todolist")
                    .then((response) => {
                        setTodoList(response.data);
                        // Clear the edit mode
                        setEditId(null);
                        setEditedText('');
                    });
            });
    };

    useEffect(() => {
        axios.get("http://localhost:3000/todolist")
            .then((response) => {
                setTodoList(response.data);
            });
    }, []);

    return (
        <Box component="form" sx={{
            boxShadow: "0 0 19.5px 3.5px #dddddd",
            padding: 5,
            width: 1000,
            borderRadius: 5,
        }} onSubmit={onSubmit}>
            <h1>REACT TODOLIST</h1>
            <h4 style={{color: 'red'}}>Note: The data will be stored in the API database.</h4>
            <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                alignContent: "center",
                width: "100%"
            }}>
                <TextField 
                required 
                fullWidth 
                type="text" 
                label="Input TODO" 
                id="fullWidth" 
                value={inputText} 
                onChange={(e) => setInputText(e.target.value)}
                />
                <Button type="submit">Add TODO</Button>
            </Box>
            <Divider>LIST</Divider>
            {todoList.map((value, key) => {
                return (
                    <List sx={{ width: "100%" }} key={key}>
                        <ListItem alignItems="center"
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: 5
                        }}>
                            {editId === value.id ? (
                                // Render an input field for editing
                                <TextField
                                    fullWidth
                                    type="text"
                                    value={editedText}
                                    onChange={(e) => setEditedText(e.target.value)}
                                />
                            ) : (
                                // Render the todo text
                                value.todo
                            )}
                            <Box>
                                {editId === value.id ? (
                                    // Render Save button when in edit mode
                                    <Button sx={{height: 50}} onClick={onSaveEdit}>Save</Button>
                                ) : (
                                    // Render Edit and Delete buttons when not in edit mode
                                    <>
                                        <Button sx={{color: 'blue'}} onClick={() => onEdit(value.id, value.todo)}><EditIcon/></Button>
                                        <Button sx={{color: 'red'}} onClick={() => onDelete(value.id)}><DeleteIcon/></Button>
                                    </>
                                )}
                            </Box>
                        </ListItem>
                        <Divider />
                    </List>
                );
            })}
            <p style={{color: 'green'}}>Made by: John Charles Frederick S. Mamanao</p>
        </Box>
    );
}

export default Home;
