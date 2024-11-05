import React, { useEffect } from "react";
import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import Shelf from "./Shelf";
import * as BooksAPI from './BooksAPI';

const groupBooksByShelf = (books) => {
    return books.reduce((acc, book) => {
      if (!acc[book.shelf]) {
        acc[book.shelf] = [];
      }
      acc[book.shelf].push(book);
      return acc;
    }, {});
  };
  
const ListBooks = () => {
    
  const [allgroupedBooks, setAllGroupedBooks] = useState({});
  const [loadingFlag, setLoadingFlag] = useState(true);

  useEffect(() => {

    const getBooks = async () => {
      try {
        const data = await BooksAPI.getAll();
        setAllGroupedBooks(groupBooksByShelf(data));
        setLoadingFlag(false);
      } catch (err) {
        console.log(err);
      }
      
    }
    getBooks();

  }, []);

  
  const addBooks = (book, shelf) => {
    const _addBooks = async () => {
      const data = await BooksAPI.update(book, shelf);
    };

    _addBooks();
  };    
    const handleShelfChange = (book, newShelf) => {
      addBooks(book, newShelf);
      setAllGroupedBooks((prevGroupedBooks) => {
        const updatedBooks = { ...prevGroupedBooks };
        let bookToUpdate;
    
        for (const shelfType in updatedBooks) {
          const bookIndex = updatedBooks[shelfType].findIndex((data) => data.id === book.id);
          if (bookIndex !== -1) {
            bookToUpdate = updatedBooks[shelfType][bookIndex];
            updatedBooks[shelfType] = [
              ...updatedBooks[shelfType].slice(0, bookIndex),
              ...updatedBooks[shelfType].slice(bookIndex + 1),
            ];
            break;
          }
        }
    
        if (bookToUpdate) {
          bookToUpdate.shelf = newShelf;
          if (!updatedBooks[newShelf]) {
            updatedBooks[newShelf] = [];
          }
          updatedBooks[newShelf] = [...updatedBooks[newShelf], bookToUpdate];
        }
    
        return updatedBooks;
      });
    };
  
    return (
      <div>
         <div className="list-books">
          <div className="list-books-title">
            <h1>MyReads</h1>
          </div>
          {loadingFlag ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
              <div className="text-center">
                <div>Loading your shelf... Your books are on their way!</div>
              </div>
            </div>
          ) : (
            <div className="list-books-content">
              {Object.keys(allgroupedBooks).filter((shelfType) => shelfType !== "none").map((shelfType) => (
                <div className="bookshelf" key={shelfType}>
                  <h2 key={shelfType} className="bookshelf-title">{shelfType}</h2>
                  <Shelf books={allgroupedBooks[shelfType]} shelfType={shelfType} onHandleShelfChange={(b, s) => {
                    handleShelfChange(b, s);
                  }} />
                </div>
              ))}
            </div>
          )}
          <div className="open-search">
            <Link to="/search">Add a book</Link>
          </div>
          </div>
        </div>
    );
  };

export default ListBooks;