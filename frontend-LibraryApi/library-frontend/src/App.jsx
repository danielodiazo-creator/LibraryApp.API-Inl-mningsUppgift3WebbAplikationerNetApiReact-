import { useEffect, useState } from "react";
import "./App.css";

const API = "https://localhost:7061/api";

function App() {
  const [books, setBooks] = useState([]);
  const [myLoans, setMyLoans] = useState([]);

  const [user, setUser] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showLogin, setShowLogin] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");

  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAuthor, setEditAuthor] = useState("");

  // ---------------- AUTH HEADER ----------------
  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("token")}`
  });

  // ---------------- LOAD USER ----------------
  useEffect(() => {
    const saved = localStorage.getItem("user");

    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        setUser({ email: saved, role: "User" });
      }
    }
  }, []);

  // ---------------- LOAD BOOKS ----------------
  const fetchBooks = async () => {
    try {
      const res = await fetch(`${API}/books`);
      const data = await res.json();
      setBooks(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- LOAD MY LOANS ----------------
  const fetchMyLoans = async () => {
    try {
      const res = await fetch(`${API}/loans/my`, {
        headers: getAuthHeaders()
      });

      if (!res.ok) return;

      const data = await res.json();
      setMyLoans(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    if (user) fetchMyLoans();
  }, [user]);

  // ---------------- LOGIN ----------------
  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      alert("Login failed");
      return;
    }

    const data = await res.json();

    const userObj = {
      email: data.email,
      role: data.role
    };

    localStorage.setItem("user", JSON.stringify(userObj));
    localStorage.setItem("token", data.token);

    setUser(userObj);
    setShowLogin(false);
  };

  // ---------------- LOGOUT ----------------
  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setMyLoans([]);
  };

  // ---------------- BORROW ----------------
  const borrowBook = async (bookId) => {
    await fetch(`${API}/loans`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ bookId })
    });

    fetchMyLoans();
    alert("Book borrowed 📚");
  };

  // ---------------- RETURN ----------------
  const returnBook = async (loanId) => {
    await fetch(`${API}/loans/return/${loanId}`, {
      method: "POST",
      headers: getAuthHeaders()
    });

    fetchMyLoans();
  };

  // ---------------- ADD BOOK ----------------
  const addBook = async () => {
    if (!newTitle || !newAuthor) {
      alert("Title and Author required");
      return;
    }

    await fetch(`${API}/books`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        title: newTitle,
        author: newAuthor
      })
    });

    setNewTitle("");
    setNewAuthor("");
    fetchBooks();
  };

  // ---------------- DELETE ----------------
  const deleteBook = async (id) => {
    await fetch(`${API}/books/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });

    fetchBooks();
  };

  // ---------------- EDIT ----------------
  const startEdit = (book) => {
    setEditId(book.id);
    setEditTitle(book.title);
    setEditAuthor(book.author);
  };

  const updateBook = async () => {
    await fetch(`${API}/books/${editId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        title: editTitle,
        author: editAuthor,
        isAvailable: true
      })
    });

    setEditId(null);
    setEditTitle("");
    setEditAuthor("");
    fetchBooks();
  };

  // ---------------- UI ----------------
  return (
    <div>

      {/* NAVBAR */}
      <nav className="navbar">
        <h2>📚 Library App</h2>

        <div>
          {user ? (
            <>
              <span>👋 {user.email} ({user.role})</span>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <button onClick={() => setShowLogin(true)}>Login</button>
          )}
        </div>
      </nav>

      {/* LOGIN */}
      {showLogin && (
        <div className="login-box">
          <form onSubmit={handleLogin}>
            <h3>Login</h3>

            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit">Login</button>
          </form>
        </div>
      )}

      {/* CONTENT */}
      <div className="container">

        <h1>Books</h1>

        {/* ADMIN ADD */}
        {user?.role === "Admin" && (
          <div>
            <input
              placeholder="Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <input
              placeholder="Author"
              value={newAuthor}
              onChange={(e) => setNewAuthor(e.target.value)}
            />
            <button onClick={addBook}>Add</button>
          </div>
        )}

        {/* ADMIN EDIT */}
        {user?.role === "Admin" && editId && (
          <div>
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <input
              value={editAuthor}
              onChange={(e) => setEditAuthor(e.target.value)}
            />
            <button onClick={updateBook}>Update</button>
          </div>
        )}

        {/* BOOK LIST */}
        <ul>
          {books.map((b) => (
            <li key={b.id}>
              📖 {b.title} - {b.author}

              {/* USER BORROW */}
              {user && user.role !== "Admin" && (
                <button onClick={() => borrowBook(b.id)}>
                  Borrow
                </button>
              )}

              {/* ADMIN ACTIONS */}
              {user?.role === "Admin" && (
                <>
                  <button onClick={() => startEdit(b)}>Edit</button>
                  <button onClick={() => deleteBook(b.id)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>

        {/* MY LOANS (USER ONLY) */}
        {user && user.role !== "Admin" && (
          <div>
            <h2>My Loans</h2>

            {myLoans.length === 0 && <p>No loans yet</p>}

            {myLoans.map(l => (
              <div key={l.id}>
                📚 {l.bookTitle}
                <button onClick={() => returnBook(l.id)}>
                  Return
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default App;