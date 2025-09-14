import React, { useState } from 'react';

const SellBookForm: React.FC = () => {
  const [book, setBook] = useState({
    title: '',
    author: '',
    price: '',
    condition: 'Good',
    description: '',
    isbn: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Here you would connect to your backend API
      console.log('Submitting book:', book);
      alert('Book listed successfully! (This would save to database)');
      setBook({ title: '', author: '', price: '', condition: 'Good', description: '', isbn: '' });
    } catch (error) {
      console.error('Error listing book:', error);
      alert('Error listing book. Please try again.');
    }
  };

  return (
    <div className="card">
      <div className="card-header bg-success text-white">
        <h3>Sell Your Book</h3>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Book Title *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={book.title}
                  onChange={(e) => setBook({...book, title: e.target.value})}
                  required 
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Author *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={book.author}
                  onChange={(e) => setBook({...book, author: e.target.value})}
                  required 
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Price (R) *</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={book.price}
                  onChange={(e) => setBook({...book, price: e.target.value})}
                  min="1"
                  required 
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Condition *</label>
                <select 
                  className="form-select"
                  value={book.condition}
                  onChange={(e) => setBook({...book, condition: e.target.value})}
                  required
                >
                  <option value="New">New</option>
        
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                </select>
              </div>
            </div>
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">ISBN (Optional)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={book.isbn}
                  onChange={(e) => setBook({...book, isbn: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea 
              className="form-control" 
              rows={4}
              value={book.description}
              onChange={(e) => setBook({...book, description: e.target.value})}
              placeholder="Describe the book's condition, edition, etc."
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary">List Book for Sale</button>
        </form>
      </div>
    </div>
  );
};

export default SellBookForm;