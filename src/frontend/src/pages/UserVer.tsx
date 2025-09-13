
////UserVer

import React, { useState } from 'react';

interface Student {
  id: number;
  name: string;
  email: string;
  studentId: string;
  status: 'pending' | 'verified' | 'rejected';
  submittedAt: string;
}

const UserVer: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: 'Alice Johnson', email: 'alice@school.edu', studentId: 'S12345', status: 'pending', submittedAt: '2023-10-15' },
    { id: 2, name: 'Bob Smith', email: 'bob@school.edu', studentId: 'S12346', status: 'pending', submittedAt: '2023-10-16' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@school.edu', studentId: 'S12347', status: 'pending', submittedAt: '2023-10-16' },
  ]);

  const [verificationNote, setVerificationNote] = useState<string>('');

  const verifyStudent = (id: number, status: 'verified' | 'rejected') => {
    setStudents(students.map(student => 
      student.id === id ? { ...student, status } : student
    ));
  };

  const pendingStudents = students.filter(student => student.status === 'pending');

  return (
    <div className="card">
      <div className="card-header bg-primary text-white">
        <h2>Student Verification</h2>
        <p className="mb-0">Pending Verifications: {pendingStudents.length}</p>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <label htmlFor="verificationNote" className="form-label">Verification Note (Optional)</label>
          <textarea 
            id="verificationNote"
            className="form-control" 
            rows={2}
            value={verificationNote}
            onChange={(e) => setVerificationNote(e.target.value)}
            placeholder="Add notes about verification process..."
          ></textarea>
        </div>

        {pendingStudents.length === 0 ? (
          <div className="alert alert-success">
            <i className="bi bi-check-circle-fill me-2"></i>
            All students have been verified! Great job.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Student ID</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingStudents.map(student => (
                  <tr key={student.id}>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>
                      <code>{student.studentId}</code>
                    </td>
                    <td>{student.submittedAt}</td>
                    <td>
                      <div className="btn-group">
                        <button 
                          className="btn btn-success btn-sm"
                          onClick={() => verifyStudent(student.id, 'verified')}
                        >
                          <i className="bi bi-check-lg me-1"></i> Approve
                        </button>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => verifyStudent(student.id, 'rejected')}
                        >
                          <i className="bi bi-x-lg me-1"></i> Reject
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
          <h4>Verification Guidelines</h4>
          <ul className="list-group">
            <li className="list-group-item">1. Check that the student ID matches the university format</li>
            <li className="list-group-item">2. Verify email address ends with university domain</li>
            <li className="list-group-item">3. Reject applications with obviously fake information</li>
            <li className="list-group-item">4. When in doubt, contact the student for additional verification</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserVer;