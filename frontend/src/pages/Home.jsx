import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Note from "../componets/Note"
import "../styles/Home.css"

function Home() {
    const [notes, setNotes] = useState([]);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [editId, setEditId] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false); // State to manage form visibility
    const navigate = useNavigate();

    useEffect(() => {
        getNotes();
    }, []);

    const getNotes = () => {
        api
            .get("/api/notes/")
            .then((res) => res.data)
            .then((data) => {
                setNotes(data);
            })
            .catch((err) => alert(err));
    };

    const deleteNote = (id) => {
        api
            .delete(`/api/notes/delete/${id}/`)
            .then((res) => {
                if (res.status === 204) alert("Note deleted!");
                else alert("Failed to delete note.");
                getNotes();
            })
            .catch((error) => alert(error));
    };

    const createNote = (e) => {
        e.preventDefault();
        api
            .post("/api/notes/", { content, title })
            .then((res) => {
                if (res.status === 201) alert("Note created!");
                else alert("Failed to create note.");
                getNotes();
                setContent("");
                setTitle("");
                setShowCreateForm(false); // Hide form after submission
            })
            .catch((err) => alert(err));
    };

    const startEditNote = (note) => {
        setEditId(note.id);
        setTitle(note.title);
        setContent(note.content);
        setShowCreateForm(true); // Show the form for editing
    };

    const updateNote = (e) => {
        e.preventDefault();
        api
            .put(`/api/notes/update/${editId}/`, { content, title })
            .then((res) => {
                if (res.status === 200) alert("Note updated!");
                else alert("Failed to update note.");
                getNotes();
                setContent("");
                setTitle("");
                setEditId(null);
                setShowCreateForm(false); // Hide form after update
            })
            .catch((err) => alert(err));
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <div>
            <div className="header">
                <h2>Notes</h2>
                <div>
                    <button className="create-button" onClick={() => setShowCreateForm(true)}>
                        Create Note
                    </button>
                    <button className="logout-button" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
            <div className="notes-section">
                {notes.map((note) => (
                    <Note
                        key={note.id}
                        note={note}
                        onDelete={() => deleteNote(note.id)}
                        onEdit={() => startEditNote(note)}
                    />
                ))}
            </div>
            {showCreateForm && (
                <div className="overlay">
                    <div className="form-section">
                        <h2>{editId ? "Edit Note" : "Create a Note"}</h2>
                        <form onSubmit={editId ? updateNote : createNote}>
                            <label htmlFor="title">Title:</label>
                            <br />
                            <input
                                type="text"
                                id="title"
                                name="title"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <br />
                            <label htmlFor="content">Content:</label>
                            <br />
                            <textarea
                                id="content"
                                name="content"
                                required
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            ></textarea>
                            <br />
                            <div className="button-group">
                                <button type="button" className="cancel-button" onClick={() => setShowCreateForm(false)}>
                                    Cancel
                                </button>
                                <input type="submit" value={editId ? "Update" : "Create"} className="create-button" />
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;
