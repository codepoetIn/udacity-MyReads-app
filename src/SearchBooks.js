import React, { useState, useEffect, useCallback } from 'react';
import { Button, Container, Row, Col, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { debounce } from 'lodash';
import * as BooksAPI from "./BooksAPI";

const SearchBooks = () => {
  const [query, setQuery] = useState("");
  const [show, setShow] = useState(false);
  const [books, setBooks] = useState([]);
  const [noBooksFlag, setNoBooksFlag] = useState(false);
  const [shelfBooksList, setShelfBooksList] = useState([]);

  const handleClose = () => setShow(false);

  // API call to add book to shelf
  const addBook = async (book, shelf) => {
    await BooksAPI.update(book, shelf);
  };

  // API call to get the books from the shelf
  useEffect(() => {
    const fetchShelfBooks = async () => {
      const data = await BooksAPI.getAll();
      setShelfBooksList(data);
    };
    fetchShelfBooks();
  }, []);

  // API call to get the search books
  const debouncedSearch = useCallback(
    debounce(async (val) => {
      if (!val.trim()) {
        setBooks([]);
        setNoBooksFlag(false);
        return;
      }
      try {
        const result = await BooksAPI.search(val.trim(), 10);
        if (result && !result.error) {
          const updatedBooks = result.map(searchBook => {
            const bookFound = shelfBooksList.find(shelfBook => shelfBook.id === searchBook.id);
            searchBook.shelf = bookFound ? bookFound.shelf : 'none';
            return searchBook;
          });
          setBooks(updatedBooks);
          setNoBooksFlag(false);
        } else {
          setBooks([]);
          setNoBooksFlag(true);
        }
      } catch (error) {
        console.log(error);
      }
    }, 500),
    [shelfBooksList] 
  );

  const updateQuery = (val) => {
    setQuery(val);
    debouncedSearch(val);
  };

  const handleSubmit = (book, shelf) => {
    addBook(book, shelf);
    setShow(true);
  };

  const shelfList = [
    { id: 'currentlyReading', name: 'Currently Reading' },
    { id: 'wantToRead', name: 'Want to Read' },
    { id: 'read', name: 'Read' },
    { id: 'none', name: 'None' }
  ];

  return (
    <Container>
      <Row className="justify-content-md-center">
        <div className="search-books">
          <div className="search-books-bar">
            <Link className="close-search" to="/">Close</Link>
            <div className="search-books-input-wrapper">
              <input
                type="text"
                value={query}
                onChange={(event) => updateQuery(event.target.value)}
                placeholder="Search by title, author, or ISBN"
              />
            </div>
          </div>
          <div className="search-books-results">
            <ol className="books-grid"></ol>
          </div>
        </div>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Notification</Modal.Title>
          </Modal.Header>
          <Modal.Body>Book added to the shelf successfully!<br />
            Go back <Link to="/">Home</Link>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        <Col md="auto">
          <h1>Search Books</h1>
        </Col>
        
        {noBooksFlag && (
          <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
            <div className="text-center">
              <div>No Result found. Please try again...</div>
            </div>
          </div>
        )}
        
        {books.length === 0 && !noBooksFlag ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
            <div className="text-center">
              <div>Discover Your Next Favorite Book! Search and add to your personal shelf on MyReads.</div>             
            </div>
          </div>
        ) : (
          <div className="bookshelf-books">
            <ol className="books-grid">
              {books.map((book) => (
                <li key={book.id}>
                  <div className="book">
                    <div className="book-top">
                      <Link to={`/book/${book.id}`}>
                        <div
                          className="book-cover"
                          style={{
                            width: 128,
                            height: 193,
                            backgroundImage: `url(${book?.imageLinks?.thumbnail})`,
                          }}
                        ></div>
                      </Link>
                      <div className="book-shelf-changer">
                        <select
                          value={book?.shelf}
                          onChange={(e) => handleSubmit(book, e.target.value)}>
                          <option value="" disabled>Move to...</option>
                          {shelfList.map((shelf) => (
                            <option key={shelf.id} value={shelf.id}>
                              {shelf.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <Link to={`/book/${book.id}`}>
                      <div className="book-title">{book.title}</div>
                    </Link>
                    <div className="book-authors">{book.authors?.join(', ')}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </Row>
    </Container>
  );
};

export default SearchBooks;