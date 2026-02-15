import { useAuth } from '../context/AuthContext';

export default function WelcomeCard() {
  const { username, role } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getRoleName = () => {
    const roleMap = {
      'STUDENT': 'Student',
      'EMPLOYEE': 'Teacher',
      'ADMIN': 'Admin'
    };
    return roleMap[role] || 'User';
  };

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white rounded-xl shadow-lg p-8 mb-8">
      <h1 className="text-4xl font-bold mb-2">
        {getGreeting()}, {username || 'User'}!
      </h1>
      <p className="text-indigo-100 text-lg">
        Welcome back to your {getRoleName()} Dashboard
      </p>
    </div>
  );
}
