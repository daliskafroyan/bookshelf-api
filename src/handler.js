const { nanoid } = require('nanoid');
const books = require('./books');

//#region  //*=========== addBookHandler ===========
const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // Client didn't send name prop in req body
  if (!name) {
    const response = h
      .response({
        status: 'fail',
        message: "Failed to add book. Please input book's name",
      })
      .code(400);
    return response;
  }

  // If readPage prop higher than pageCount prop
  if (readPage > pageCount) {
    const response = h
      .response({
        status: 'fail',
        message:
          'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      })
      .code(400);
    return response;
  }

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    id,
    finished,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((note) => note.id === id).length > 0;

  // If book successfully added
  if (isSuccess) {
    const response = h
      .response({
        status: 'success',
        message: 'Book successfully added into bookself',
        data: {
          bookId: id,
        },
      })
      .code(201);
    return response;
  }

  // Generic error
  const response = h
    .response({
      status: 'fail',
      message: 'Failed adding book',
    })
    .code(500);
  return response;
};
//#endregion  //*======== addBookHandler ===========

//#region  //*=========== getAllBooksHandler ===========
const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  // Empty query
  if (!name && !reading && !finished) {
    const response = h
      .response({
        status: 'success',
        data: {
          books: books.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      })
      .code(200);

    return response;
  }

  // If name query present
  if (name) {
    const filteredBooksName = books.filter((book) => {
      const regex = new RegExp(name, 'gi');
      return regex.test(book.name);
    });

    const response = h
      .response({
        status: 'success',
        data: {
          books: filteredBooksName.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      })
      .code(200);

    return response;
  }

  // If reading query present
  if (reading) {
    const filteredBooksReading = books.filter(
      (book) => Number(book.reading) === Number(reading)
    );

    const response = h
      .response({
        status: 'success',
        data: {
          books: filteredBooksReading.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      })
      .code(200);

    return response;
  }

  // If finished query present
  if (finished) {
    const filteredBooksFinished = books.filter(
      (book) => Number(book.finished) === Number(finished)
    );

    const response = h
      .response({
        status: 'success',
        data: {
          books: filteredBooksFinished.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      })
      .code(200);

    return response;
  }

  // Generic error
  const response = h
    .response({
      status: 'fail',
      message: 'Failed retreiving book',
    })
    .code(500);
  return response;
};
//#endregion  //*======== getAllBooksHandler ===========

//#region  //*=========== getBookByIdHandler ===========
const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((n) => n.id === bookId)[0];

  // If specified book has been found
  if (book) {
    const response = h
      .response({
        status: 'success',
        data: {
          book,
        },
      })
      .code(200);
    return response;
  }

  // If specified book couldn't be found
  const response = h
    .response({
      status: 'fail',
      message: 'Could not find the specified book',
    })
    .code(404);
  return response;
};
//#endregion  //*======== getBookByIdHandler ===========

//#region  //*=========== editBookByIdHandler ===========
const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // Client didn't send name prop in req body
  if (!name) {
    const response = h
      .response({
        status: 'fail',
        message: "Failed updating book. Missing book's name",
      })
      .code(400);
    return response;
  }

  // If readPage prop higher than pageCount prop
  if (readPage > pageCount) {
    const response = h
      .response({
        status: 'fail',
        message:
          'Failed updating book. readPage tidak boleh lebih besar dari pageCount',
      })
      .code(400);
    return response;
  }

  const finished = pageCount === readPage;
  const updatedAt = new Date().toISOString();

  const index = books.findIndex((note) => note.id === bookId);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      updatedAt,
    };

    const response = h
      .response({
        status: 'success',
        message: 'Success updating book',
      })
      .code(200);
    return response;
  }

  // Specified Id couldn't be found
  const response = h
    .response({
      status: 'fail',
      message: 'Failed updating book. Could not found the specified ID',
    })
    .code(404);
  return response;
};
//#endregion  //*======== editBookByIdHandler ===========

//#region  //*=========== deleteBookByIdHandler ===========
const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((note) => note.id === bookId);

  // If specified book's ID present
  if (index !== -1) {
    books.splice(index, 1);

    const response = h
      .response({
        status: 'success',
        message: 'Successfully deleting book',
      })
      .code(200);
    return response;
  }

  // If server couldn't find the specified book's ID
  const response = h
    .response({
      status: 'fail',
      message: "Failed deleting book. Could not find the specified book's ID",
    })
    .code(404);
  return response;
};
//#endregion  //*======== deleteBookByIdHandler ===========

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
