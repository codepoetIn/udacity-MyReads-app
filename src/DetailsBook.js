import React, { useEffect } from "react";
import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useParams } from "react-router-dom";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import * as BooksAPI from './BooksAPI';

const DetailsBook = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);

    useEffect(() => {
        const fetchBookDetails = async () => {
            const data = await BooksAPI.get(id);
            setBook(data);
        };
        fetchBookDetails();
    }, [id]);

    if (!book) {
        return <div>Loading...</div>;
    }
 
    return (
  <div>
         <div className="details-book">
          <div className="details-book-title">
                    <h1>MyReads</h1>
                    
          </div>
                <div className="details-book-content">
                    <Container>
                    <div style={{ marginBottom: '20px' }}>  <Link to="/">Home</Link></div>

                        <Row className="justify-content-md-center">
                            <Col md="4">
                            <Card>
                                    <Card.Img variant="top" src={book?.imageLinks?.thumbnail} />
                                    </Card>
                </Col>
                <Col md="8">
                    <Card>
                        <Card.Body>
                            <Card.Title>{book.title}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">{book?.subtitle}</Card.Subtitle>
                            <Card.Text>
                                <strong>Authors:</strong> {book?.authors?.join(', ')}<br />
                                <strong>Publisher:</strong> {book?.publisher}<br />
                                <strong>Published Date:</strong> {book?.publishedDate}<br />
                                <strong>Description:</strong> {book?.description}<br />
                                <strong>ISBN-13:</strong> {book?.industryIdentifiers?.find(id => id.type === 'ISBN_13')?.identifier}<br />
                                <strong>ISBN-10:</strong> {book?.industryIdentifiers?.find(id => id.type === 'ISBN_10')?.identifier}<br />
                                <strong>Page Count:</strong> {book?.pageCount}<br />
                                <strong>Categories:</strong> {book?.categories?.join(', ')}<br />
                                <strong>Language:</strong> {book?.language}<br />
                            </Card.Text>
                            <Button variant="primary" href={book?.previewLink} target="_blank" rel="noopener noreferrer">Preview Link</Button> {" "} {" "}
                            <Button variant="secondary" href={book?.infoLink} target="_blank" rel="noopener noreferrer" className="ml-2">More Info</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>

                </div>
            </div>
</div>
    );
    
}

export default DetailsBook;