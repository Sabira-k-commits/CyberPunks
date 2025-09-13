/////BOOKMod

import React, { useState } from 'react';

interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  seller: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

const BookMod: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([
    { id: 1, title: 'Introduction to React', author: 'John Doe', price: 25, seller: 'Alice Johnson', status: 'pending', submittedAt: '2023-10-15' },
    { id: 2, title: 'Advanced JavaScript', author: 'Jane Smith', price: 30, seller: 'Bob Smith', status: 'pending', submittedAt: '2023-10-16' },
    { id: 3, title: 'Computer Science Basics', author: 'Dr. Brown', price: 45, seller: 'Charlie Brown', status: 'pending', submittedAt: '2023-10-16' },
  ]);

  const [rejectionReason, setRejectionReason] = useState<string>('');

  const moderateBook = (id: number, status: 'approved' | 'rejected') => {
    setBooks(books.map(book => 
      book.id === id ? { ...book, status } : book
    ));
  };

  const pendingBooks = books.filter(book => book.status === 'pending');

  return (
    <div className="card">
      <div className="card-header bg-warning text-dark">
        <h2>Book Moderation</h2>
        <p className="mb-0">Pending Reviews: {pendingBooks.length}</p>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <label htmlFor="rejectionReason" className="form-label">Rejection Reason (if applicable)</label>
          <textarea 
            id="rejectionReason"
            className="form-control" 
            rows={2}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Specify reason for rejection..."
          ></textarea>
        </div>

        {pendingBooks.length === 0 ? (
          <div className="alert alert-success">
            <i className="bi bi-check-circle-fill me-2"></i>
            All books have been moderated! Great job.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Price</th>
                  <th>Seller</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingBooks.map(book => (
                  <tr key={book.id}>
                    <td>
                      <strong>{book.title}</strong>
                    </td>
                    <td>{book.author}</td>
                    <td>${book.price}</td>
                    <td>{book.seller}</td>
                    <td>{book.submittedAt}</td>
                    <td>
                      <div className="btn-group">
                        <button 
                          className="btn btn-success btn-sm"
                          onClick={() => moderateBook(book.id, 'approved')}
                        >
                          <i className="bi bi-check-lg me-1"></i> Approve
                        </button>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => moderateBook(book.id, 'rejected')}
                        >
                          <i className="bi bi-x-lg me-1"></i> Reject
                        </button>
                        <button className="btn btn-info btn-sm">
                          <i className="bi bi-eye me-1"></i> Preview
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4">
          <h4>Moderation Guidelines</h4>
          <ul className="list-group">
            <li className="list-group-item">1. Reject books with inappropriate content or titles</li>
            <li className="list-group-item">2. Flag overpriced items (check against market value)</li>
            <li className="list-group-item">3. Verify that book details match the cover image</li>
            <li className="list-group-item">4. Ensure contact information isn't visible in images</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BookMod;