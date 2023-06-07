// Retrieve notes from local storage or initialize an empty array
let notes = JSON.parse(localStorage.getItem('notes')) || [];
let archivedNotes = JSON.parse(localStorage.getItem('archivedNotes')) || [];
let deletedNotes = JSON.parse(localStorage.getItem('deletedNotes')) || [];

// Function to add a new note
function addNote() {
  const noteInput = document.getElementById('note-input');
  const noteText = noteInput.value.trim();

  if (noteText !== '') {
    const note = {
      id: Date.now(),
      text: noteText,
      archived: false,
      deleted: false,
      reminder: null
    };

    notes.push(note);
    saveNotes();
    showNotes();
    noteInput.value = '';
  }
}

// Function to save notes to local storage
function saveNotes() {
  localStorage.setItem('notes', JSON.stringify(notes));
  localStorage.setItem('archivedNotes', JSON.stringify(archivedNotes));
  localStorage.setItem('deletedNotes', JSON.stringify(deletedNotes));
}

// Function to display notes on the website
function showNotes() {
  const noteList = document.getElementById('note-list');
  noteList.innerHTML = '';

  for (const note of notes) {
    if (!note.archived && !note.deleted) {
      const noteItem = document.createElement('div');
      noteItem.classList.add('note-item');
      noteItem.innerHTML = `
        <p>${note.text}</p>
        <button onclick="deleteNote(${note.id})">Delete</button>
        <button onclick="archiveNote(${note.id})">Archive</button>
        <button onclick="editNote(${note.id})">Edit</button>
        <button onclick="setReminder(${note.id})">Set Reminder</button>
      `;
      noteList.appendChild(noteItem);
    }
  }
}

// Function to display archived notes on the website
function showArchivedNotes() {
    const archivedList = document.getElementById('archived-list');
    archivedList.innerHTML = '';
  
    for (const note of archivedNotes) {
      const noteItem = document.createElement('div');
      noteItem.classList.add('note-item');
      noteItem.innerHTML = `
        <p>${note.text}</p>
        <button onclick="deleteNote(${note.id}, true)">Delete</button>
        <button onclick="unarchiveNote(${note.id})">Unarchive</button>
        <button onclick="editNote(${note.id})">Edit</button>
        <button onclick="setReminder(${note.id})">Set Reminder</button>
      `;
      archivedList.appendChild(noteItem);
    }
  }
  
  // Function to display deleted notes on the website
  function showDeletedNotes() {
    const deletedList = document.getElementById('deleted-list');
    deletedList.innerHTML = '';
  
    for (const note of deletedNotes) {
      const noteItem = document.createElement('div');
      noteItem.classList.add('note-item');
      noteItem.innerHTML = `
        <p>${note.text}</p>
        <button onclick="deleteNotePermanently(${note.id})">Delete Permanently</button>
        <button onclick="restoreNote(${note.id})">Restore</button>
      `;
      deletedList.appendChild(noteItem);
    }
  }
  
  // Function to delete a note
  function deleteNote(noteId, fromArchived = false) {
    if (fromArchived) {
      archivedNotes = archivedNotes.filter(note => note.id !== noteId);
    } else {
      notes = notes.filter(note => note.id !== noteId);
    }
  
    const deletedNote = getNoteById(noteId);
    deletedNote.deleted = true;
    deletedNotes.push(deletedNote);
  
    saveNotes();
    showNotes();
    showArchivedNotes();
    showDeletedNotes();
  }
  
  // Function to delete a note permanently
  function deleteNotePermanently(noteId) {
    deletedNotes = deletedNotes.filter(note => note.id !== noteId);
    saveNotes();
    showDeletedNotes();
  }
  
  // Function to restore a deleted note
  function restoreNote(noteId) {
    const restoredNote = getNoteById(noteId, deletedNotes);
    restoredNote.deleted = false;
  
    if (restoredNote.archived) {
      archivedNotes.push(restoredNote);
    } else {
      notes.push(restoredNote);
    }
  
    deletedNotes = deletedNotes.filter(note => note.id !== noteId);
    saveNotes();
    showNotes();
    showArchivedNotes();
    showDeletedNotes();
  }
  
  // Function to archive a note
  function archiveNote(noteId) {
    const note = getNoteById(noteId);
    note.archived = true;
    archivedNotes.push(note);
  
    notes = notes.filter(note => note.id !== noteId);
    saveNotes();
    showNotes();
    showArchivedNotes();
  }
  
  // Function to unarchive a note
  function unarchiveNote(noteId) {
    const note = getNoteById(noteId, archivedNotes);
    note.archived = false;
    notes.push(note);
  
    archivedNotes = archivedNotes.filter(note => note.id !== noteId);
    saveNotes();
    showNotes();
    showArchivedNotes();
  }
  

// Function to edit a note
function editNote(noteId) {
    const note = getNoteById(noteId);
    const newText = prompt('Enter new text', note.text);
  
    if (newText !== null && newText.trim() !== '') {
      note.text = newText.trim();
      saveNotes();
      showNotes();
      showArchivedNotes();
      showDeletedNotes();
    }
  }
  
  // Function to set a reminder for a note
  function setReminder(noteId) {
    const note = getNoteById(noteId);
    const reminderDate = prompt('Enter reminder date (YYYY-MM-DD)');
    const reminderTime = prompt('Enter reminder time (HH:MM)');
  
    if (reminderDate !== null && reminderTime !== null) {
      const reminderDateTime = new Date(`${reminderDate} ${reminderTime}`);
      note.reminder = reminderDateTime.getTime();
      saveNotes();
      showNotes();
      showArchivedNotes();
      showDeletedNotes();
    }
  }
  
  // Function to check if a note's reminder is due
  function checkReminder() {
    const currentTime = Date.now();
  
    for (const note of notes) {
      if (note.reminder && note.reminder <= currentTime) {
        alert(`Reminder: ${note.text}`);
        note.reminder = null;
        saveNotes();
        showNotes();
        showArchivedNotes();
        showDeletedNotes();
      }
    }
  }
  
  // Function to get a note by its ID from a specific array
  function getNoteById(noteId, noteArray = notes) {
    return noteArray.find(note => note.id === noteId);
  }
  
  // Initial execution
  showNotes();
  showArchivedNotes();
  showDeletedNotes();
  setInterval(checkReminder, 60000); // Check reminder every minute
  
