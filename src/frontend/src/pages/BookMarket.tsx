// components/BookMarketplace.tsx
import React, { useState } from 'react';

const BookMarket: React.FC = () => {
  const [books, setBooks] = useState([
    { id: 1, title: 'Introduction to React', author: 'John Doe', price: 4500, condition: 'New' },
    { id: 2, title: 'Advanced JavaScript', author: 'Jane Smith', price: 3000, condition: 'Good' },
    { id: 3, title: 'Computer Science Basics', author: 'Dr. Brown', price: 745, condition: 'Excellent' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="row mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search books or authors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="row">
        {filteredBooks.map(book => (
          <div key={book.id} className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{book.title}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{book.author}</h6>
                <p className="card-text">Condition: {book.condition}</p>
                <p className="card-text"><strong>R{book.price}</strong></p>
                <button className="btn btn-primary btn-sm">View Details</button>
                <button className="btn btn-success btn-sm ms-2">Contact Seller</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookMarket;