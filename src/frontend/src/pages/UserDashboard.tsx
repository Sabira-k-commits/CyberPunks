import React, { useEffect, useState } from "react";
import api from "../services/api";
import Leaderboard from "../components/LeaderBoard";

interface UserProfile {
  fullName: string;
  email: string;
  points: number;
  mfaEnabled: boolean;
  badges?: string[];
}

interface PasswordOption {
  password: string;
  choice: "strong" | "weak" | null;
}

interface PhishingEmail {
  id: string;
  question: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

// Mock data for Daily Quiz only
const mockQuizData: QuizQuestion[] = [
  {
    question: "What is the strongest way to create a password?",
    options: ["Use only letters", "Use only numbers", "Mix letters, numbers & symbols", "Use your birthday"],
    correctAnswer: "Mix letters, numbers & symbols"
  },
  {
    question: "Which of these is a sign of phishing?",
    options: ["Official domain emails", "Unexpected attachments", "Properly addressed emails", "Verified sender"],
    correctAnswer: "Unexpected attachments"
  },
  {
    question: "What does MFA stand for?",
    options: ["Multiple File Access", "Multi-Factor Authentication", "Mainframe Access", "Managed Firewall Access"],
    correctAnswer: "Multi-Factor Authentication"
  }
];

const StudentDashboard: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [passwords, setPasswords] = useState<PasswordOption[]>([]);
  const [passwordSubmitted, setPasswordSubmitted] = useState(false);
  const [phishingEmail, setPhishingEmail] = useState<PhishingEmail | null>(null);
  const [quiz, setQuiz] = useState<QuizQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  // For mock password change modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Fetch user profile from API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/api/users/dashboard");
        setUser(data.data);
      } catch (err: any) {
        setMessage("❌ Failed to load profile. Please log in again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // --- Password Challenge (API) ---
  const fetchPasswords = async () => {
    try {
      const { data } = await api.get("/api/games/password-challenge");
      const options = data.passwords.map((pwd: string) => ({ password: pwd, choice: null }));
      setPasswords(options);
      setPasswordSubmitted(false);
    } catch (err: any) {
      setMessage(err.response?.data?.message || err.message);
    }
  };

  const handleSelectPassword = (index: number, choice: "strong" | "weak") => {
    setPasswords(prev => prev.map((p, i) => (i === index ? { ...p, choice } : p)));
  };

  const handleSubmitPasswords = async () => {
    try {
      const selections = passwords.map(p => ({ password: p.password, choice: p.choice }));
      const { data } = await api.post("/api/games/password-challenge", { selections });
      setUser(prev => prev ? { ...prev, points: data.points, badges: data.badges } : prev);
      setMessage(`✅ ${data.message}`);
      setPasswordSubmitted(true);
    } catch (err: any) {
      setMessage(err.response?.data?.message || err.message);
    }
  };

  // --- Phishing Challenge (API) ---
  const fetchPhishingEmail = async () => {
    try {
      const { data } = await api.get("/api/games/phishing");
      setPhishingEmail({ id: data.emailId, question: data.question });
    } catch (err: any) {
      setMessage(err.response?.data?.message || err.message);
    }
  };

  const handlePhishingAnswer = async (answer: boolean) => {
    if (!phishingEmail) return;
    try {
      const { data } = await api.post("/api/games/phishing", {
        emailId: phishingEmail.id,
        answer,
      });
      setUser(prev => prev ? { ...prev, points: data.points, badges: data.badges } : prev);
      setMessage(data.message);
      fetchPhishingEmail(); // Load next phishing email
    } catch (err: any) {
      setMessage(err.response?.data?.message || err.message);
    }
  };

  // --- Daily Quiz (Mock Only) ---
  const handleDailyQuiz = () => {
    const randomIndex = Math.floor(Math.random() * mockQuizData.length);
    setQuiz(mockQuizData[randomIndex]);
    setSelectedAnswer(null);
  };

  const submitQuizAnswer = () => {
    if (!quiz || !selectedAnswer) return;
    if (selectedAnswer === quiz.correctAnswer) {
      setUser(prev => prev ? { ...prev, points: prev.points + 10 } : prev);
      setMessage("✅ Correct! You earned 10 points.");
    } else {
      setMessage("❌ Incorrect. Try again tomorrow!");
    }
    setQuiz(null);
  };

  // --- MFA Toggle ---
  const handleToggleMfa = async () => {
    if (!user) return;
    try {
      const { data } = await api.patch("/api/settings/mfa", { enable: !user.mfaEnabled });
      setUser(prev => prev ? { ...prev, mfaEnabled: data.mfaEnabled, points: data.points } : prev);
      setMessage(data.mfaEnabled ? "✅ MFA enabled! You earned bonus points." : "⚠️ MFA disabled.");
    } catch (err: any) {
      setMessage(`❌ ${err.response?.data?.message || err.message}`);
    }
  };

  // --- Mock Password Change for Logged-In User ---
  const handlePasswordChangeSubmit = () => {
    if (!currentPassword || !newPassword) {
      setMessage("⚠️ Please fill in both fields.");
      return;
    }

    // Add mock logic: any input is accepted
    setUser(prev => prev ? { ...prev, points: prev.points + 10 } : prev);
    setMessage("✅ Password changed! You earned 10 points.");
    setShowPasswordModal(false);
    setCurrentPassword("");
    setNewPassword("");
  };

  if (loading) return <div className="d-flex vh-100 align-items-center justify-content-center">Loading...</div>;
  if (!user) return <div className="d-flex vh-100 align-items-center justify-content-center text-danger">{message || "User not found"}</div>;

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 bg-dark text-white p-3 d-flex flex-column">
          <h4 className="mb-4">📚 Dashboard</h4>
          <button className="btn btn-link text-white text-start">My Books</button>
          <button className="btn btn-link text-white text-start">Settings</button>
          <button className="btn btn-outline-light mt-auto" onClick={() => { localStorage.removeItem("authToken"); localStorage.removeItem("role"); window.location.href = "/login"; }}>Logout</button>
        </div>

        {/* Main content */}
        <div className="col-md-7 col-lg-8 p-4">
          <h2>Welcome, {user.fullName}</h2>
          <p className="text-muted">{user.email}</p>

          <div className="mt-4">
            <h5>Your Points: <span className="badge bg-success">{user.points}</span></h5>
            <h5>MFA Status: {user.mfaEnabled ? "✅ Enabled" : "❌ Disabled"}</h5>
            <button className={`btn mt-3 ${user.mfaEnabled ? "btn-danger" : "btn-primary"}`} onClick={handleToggleMfa}>
              {user.mfaEnabled ? "Disable MFA" : "Enable MFA & Earn Points"}
            </button>
          </div>

          {/* Gamification Section */}
          <div className="mt-5">
            <h4>🎮 Gamification</h4>

            {/* Phishing Challenge */}
            <div className="mt-2">
              <h5>Phishing Challenge</h5>
              {!phishingEmail ? (
                <button className="btn btn-info" onClick={fetchPhishingEmail}>Start Phishing Challenge</button>
              ) : (
                <div>
                  <p>{phishingEmail.question}</p>
                  <button className="btn btn-success me-2" onClick={() => handlePhishingAnswer(true)}>Phishing</button>
                  <button className="btn btn-danger" onClick={() => handlePhishingAnswer(false)}>Safe</button>
                </div>
              )}
            </div>

            {/* Password Challenge */}
            <div className="mt-3">
              <h5>Password Strength Challenge</h5>
              {!passwords.length && !passwordSubmitted && <button className="btn btn-info" onClick={fetchPasswords}>Start Password Challenge</button>}
              {passwords.length > 0 && (
                <div>
                  {passwords.map((p, idx) => (
                    <div key={idx} className="d-flex align-items-center mt-2">
                      <span className="me-2">{p.password}</span>
                      <button className="btn btn-sm btn-success me-2" onClick={() => handleSelectPassword(idx, "strong")}>Strong</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleSelectPassword(idx, "weak")}>Weak</button>
                      {p.choice && <span className="ms-2">Selected: {p.choice}</span>}
                    </div>
                  ))}
                  <button className="btn btn-primary mt-2" onClick={handleSubmitPasswords}>Submit Selections</button>
                </div>
              )}
            </div>

            {/* Daily Quiz (Mock) */}
            <div className="mt-3">
              <h5>Daily Security Quiz</h5>
              {!quiz ? (
                <button className="btn btn-warning" onClick={handleDailyQuiz}>Start Quiz</button>
              ) : (
                <div>
                  <p>{quiz.question}</p>
                  {quiz.options.map(opt => (
                    <button key={opt} className="btn btn-outline-primary me-2 mb-2" onClick={() => setSelectedAnswer(opt)}>
                      {opt}
                    </button>
                  ))}
                  <div>
                    <button className="btn btn-success mt-2" onClick={submitQuizAnswer} disabled={!selectedAnswer}>Submit Answer</button>
                  </div>
                </div>
              )}
            </div>

            {/* Mock Password Change */}
            <div className="mt-3">
              <h5>Change Password (Earn Points)</h5>
              <button className="btn btn-primary" onClick={() => setShowPasswordModal(true)}>Change My Password</button>
            </div>

            {/* Password Change Modal */}
            {showPasswordModal && (
              <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
                <div className="modal-dialog">
                  <div className="modal-content p-3">
                    <h5>Change Password</h5>
                    <input className="form-control mb-2" type="password" placeholder="Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                    <input className="form-control mb-2" type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    <button className="btn btn-success me-2" onClick={handlePasswordChangeSubmit}>Submit</button>
                    <button className="btn btn-secondary" onClick={() => setShowPasswordModal(false)}>Cancel</button>
                  </div>
                </div>
              </div>
            )}

          </div>

          {message && <div className={`alert mt-3 ${message.includes("✅") ? "alert-success" : "alert-warning"}`}>{message}</div>}
        </div>

        {/* Leaderboard */}
        <div className="col-md-2 col-lg-2 p-4 bg-light border-start">
          <Leaderboard />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
