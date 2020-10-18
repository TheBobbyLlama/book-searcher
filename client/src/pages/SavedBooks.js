import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';
import { useMutation, useQuery } from '@apollo/react-hooks';

import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

import { QUERY_ME } from '../utils/queries';
import { DELETE_BOOK } from '../utils/mutations';

const SavedBooks = () => {
  const { data: userData } = useQuery(QUERY_ME);
  const [ removeBook, { error } ] = useMutation(DELETE_BOOK, {
    // Update the me object's cache with the updated list of saved books.
    update(cache, { data: { deleteBook } }) {
		  const { me } = cache.readQuery({ query: QUERY_ME });
		  cache.writeQuery({
			query: QUERY_ME,
			data: { me: { ...me, savedBooks: deleteBook.savedBooks} }
		  });
		}
	});

  const userDataLength = userData ? Object.keys(userData).length : 0;

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    try {
      const updatedUser = await removeBook({
        variables: { bookId }
      });

      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (!userDataLength) {
    return <h2>LOADING...</h2>;
  }

  const savedList = userData?.me.savedBooks || [];

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {savedList.length
            ? `Viewing ${savedList.length} saved ${savedList.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <CardColumns>
          {savedList.map((book) => {
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;
