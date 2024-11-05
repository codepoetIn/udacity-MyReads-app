import React, { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Shelf = ({ books, shelfType, onHandleShelfChange }) => {

    const [shelfBooks, setShelfBooks] = useState([]);
    useEffect(() => {
        setShelfBooks(books);
    }, [books]);

    const shelfList = [
        { id: 'currentlyReading', name: 'Currently Reading' },
        { id: 'wantToRead', name: 'Want to Read' },
        { id: 'read', name: 'Read' },
        { id: 'none', name: 'None' }
      ];
    
    return (
        <div className="bookshelf-books">
              <ol className="books-grid">
              {shelfBooks.map((book) => (
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
                          onChange={(e) => onHandleShelfChange(book, e.target.value)} value={book?.shelf}>
                    <option value="null" disabled>
                       Move to...
                          </option>
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
                      <div className="book-authors">{book?.authors?.join(', ')}</div>
                    </div>
                </li>
                  ))}
                 </ol>
              </div>
    
        );
}

export default Shelf;