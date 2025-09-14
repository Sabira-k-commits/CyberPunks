import React, { useState } from 'react';

const MyListings: React.FC = () => {
  const [myBooks, setMyBooks] = useState([
    { id: 1, title: 'Calculus Textbook', author: 'James Stewart', price: 40, condition: 'Good', status: 'Active' },
    { id: 2, title: 'Physics for Scientists', author: 'Paul Tipler', price: 35, condition: 'Like New', status: 'Sold' },
  ]);

  const deleteBook = (id: number) => {
    if (window.confirm('Are you sure you want to remove this listing?')) {
      setMyBooks(myBooks.filter(book => book.id !== id));
      alert('Listing removed!');
    }
  };

  return (
    <div className="card">
      <div className="card-header bg-info text-white">
        <h3>My Book Listings</h3>
      </div>
      <div className="card-body">
        {myBooks.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted">You haven't listed any books yet.</p>
            <button 
              className="btn btn-success"
              onClick={() => {
                window.location.hash = 'sell';
                window.location.reload();
              }}
            >
              List Your First Book
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Price</th>
                  <th>Condition</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {myBooks.map(book => (
                  <tr key={book.id}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>${book.price}</td>
                    <td>
                      <span className={`badge ${
                        book.condition === 'New' ? 'bg-success' :
                        book.condition === 'Like New' ? 'bg-primary' :
                        book.condition === 'Good' ? 'bg-info' : 'bg-warning'
                      }`}>
                        {book.condition}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${
                        book.status === 'Active' ? 'bg-success' : 'bg-secondary'
                      }`}>
                        {book.status}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group">
                        <button className="btn btn-sm btn-outline-primary">Edit</button>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => deleteBook(book.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyListings;